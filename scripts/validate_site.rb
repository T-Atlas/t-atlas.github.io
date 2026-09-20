#!/usr/bin/env ruby
# Inspect actual Jekyll output: reciprocal language links, bibliographies,
# local downloads, metadata, and the shared CV. No network requests.
require 'json'
require 'nokogiri'
require 'pathname'
require 'uri'
require 'yaml'
require 'date'
root = Pathname.new(ARGV.fetch(0, '_site')).expand_path
abort "Build output not found: #{root}" unless root.directory?
errors = []
assert = ->(condition, message) { errors << message unless condition }
resolve = lambda do |url|
  path = URI.parse(url).path
  candidate = root.join(URI::DEFAULT_PARSER.unescape(path).sub(%r{\A/}, ''))
  possibilities = [candidate, candidate.join('index.html'), Pathname.new(candidate.to_s + '.html')]
  possibilities.find(&:file?)
end
# Catch source URL collisions before a later page silently overwrites an output.
source_root = Pathname.new(__dir__).parent
permalinks = Hash.new { |hash, key| hash[key] = [] }
%w[_pages _posts _publications _news].each do |directory|
  Dir.glob(source_root.join(directory, '**/*').to_s).select { |path| File.file?(path) }.each do |path|
    text = File.read(path)
    match = text.match(/\A---\s*\n(.*?)\n---/m)
    next unless match
    data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
    permalinks[data['permalink']] << path if data['permalink'] && data['published'] != false
  end
end
permalinks.each { |url, paths| assert.call(paths.size == 1, "Duplicate permalink #{url}: #{paths.join(', ')}") }
html = {}
Dir.glob(root.join('**/*').to_s).each do |name|
  next unless File.file?(name)
  next unless name.end_with?('.html') || (File.extname(name).empty? && File.read(name, 100).to_s.include?('<!'))
  doc = Nokogiri::HTML(File.read(name))
  canonical = doc.at_css('link[rel=canonical]')&.[]('href')
  html[canonical] = doc if canonical && doc.at_css('meta[name=description]')
end
html.each do |url, doc|
  assert.call(doc.css('meta[name=description]').size == 1, "Repeated description: #{url}")
  alternates = doc.css('link[hreflang]')
  alternates.each do |link|
    destination = html[link['href']]
    assert.call(!destination.nil?, "Missing alternate page #{link['href']} on #{url}")
    assert.call(destination && destination.css('link[hreflang]').any? { |back| back['href'] == url }, "Non-reciprocal hreflang: #{url} -> #{link['href']}")
  end
  next unless doc.at_css('meta[name=citation_title]')
  assert.call(doc.css('meta[name=citation_author]').size.positive?, "No publication authors: #{url}")
  assert.call(doc.at_css('meta[name=citation_publication_date]'), "No publication date: #{url}")
  doc.css('.publication-resources a').each do |link|
    uri = URI.parse(link['href'])
    next if uri.host && uri.host != URI.parse(url).host
    assert.call(resolve.call(link['href']), "Missing publication resource: #{link['href']}")
  end
  if (pdf = doc.at_css('meta[name=citation_pdf_url]'))
    assert.call(URI.parse(pdf['content']).host == URI.parse(url).host && File.dirname(URI.parse(pdf['content']).path) == File.dirname(URI.parse(url).path), "Scholar PDF must share abstract directory: #{url}")
  end
end
bibliographies = Dir.glob(root.join('files/bibtex/*.bib'))
assert.call(bibliographies.size == 5, 'Expected five generated BibTeX files')
bibliographies.each do |file|
  text = File.read(file)
  assert.call(text.start_with?('@') && text.include?('author = {') && !text.include?('{%'), "Invalid generated BibTeX: #{file}")
end
cv = JSON.parse(root.join('cv.json').read)
assert.call(cv['education'].size == 3 && cv['publications'].size == 5, 'Incomplete shared CV data')
assert.call(cv['basics']['name'] == 'Junhong Lian', 'CV still contains template identity')
%w[cv/index.html zh/cv/index.html cv-json/index.html zh/cv-json/index.html].each do |page|
  text = root.join(page).read
  assert.call(!text.match?(/Your Sidebar Name|GitHub University|files\/cv\.pdf/), "Template/invalid PDF remains in #{page}")
end
puts "Checked #{html.size} HTML pages, #{bibliographies.size} bibliographies, paired translations, publication resources and shared CV."
abort errors.join("\n") unless errors.empty?
puts 'Site validation passed.'
