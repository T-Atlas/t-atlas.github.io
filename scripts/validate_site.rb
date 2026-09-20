#!/usr/bin/env ruby
# Validate rendered output against its source, without network access or fixed counts.
# Usage: bundle exec ruby scripts/validate_site.rb [output-directory] [source-directory]
require 'json'
require 'nokogiri'
require 'pathname'
require 'uri'
require 'yaml'
require 'date'

root = Pathname.new(ARGV.fetch(0, '_site')).expand_path
source = Pathname.new(ARGV.fetch(1, File.expand_path('..', __dir__))).expand_path
abort "Build output not found: #{root}" unless root.directory?
load_yaml = ->(text) { YAML.safe_load(text, permitted_classes: [Date, Time], aliases: true) || {} }
config = load_yaml.call(source.join('_config.yml').read)
errors = []
check = ->(condition, message) { errors << message unless condition }
parse_url = ->(url) { URI.parse(URI::DEFAULT_PARSER.escape(url.to_s, /[^\x21-\x7E]/)) }
url_path = ->(url) { URI::DEFAULT_PARSER.unescape(parse_url.call(url).path) }
key = ->(url) { path = url_path.call(url).sub(%r{/index\.html\z}, '/').sub(/\.html\z/, '').sub(%r{/\z}, ''); path.empty? ? '/' : path }
resolve = lambda do |url|
  candidate = root.join(url_path.call(url).sub(%r{\A/}, '')).cleanpath
  next nil unless candidate.to_s.start_with?(root.to_s + '/') || candidate == root
  [candidate, candidate.join('index.html'), Pathname.new(candidate.to_s + '.html')].find(&:file?)
end

collections = config.fetch('collections', {}).keys.map { |name| "_#{name}" }
records = (['_pages', '_posts'] + collections).uniq.flat_map do |directory|
  Dir.glob(source.join(directory, '**/*').to_s).filter_map do |path|
    next unless File.file?(path) && %w[.md .markdown .html .json].include?(File.extname(path))
    match = File.read(path).match(/\A---\s*\n(.*?)\n---/m)
    next unless match
    data = load_yaml.call(match[1])
    next if data['published'] == false
    data.merge('_collection' => directory.delete_prefix('_'), '_source' => path)
  end
end
records.select { |record| record['permalink'] }.group_by { |record| key.call(record['permalink']) }.each do |url, group|
  check.call(group.size == 1, "Duplicate permalink #{url}: #{group.map { |r| r['_source'] }.join(', ')}")
end

html = {}
canonical_pages = {}
Dir.glob(root.join('**/*.html').to_s).each do |path|
  doc = Nokogiri::HTML(File.read(path))
  canonical = doc.at_css('link[rel=canonical]')&.[]('href')
  next unless canonical && doc.at_css('meta[name=description]') # Exclude redirects and standalone maps.
  route = key.call(canonical)
  check.call(!html.key?(route), "Duplicate rendered canonical: #{route}")
  html[route] = doc
  canonical_pages[canonical] = doc
end
html.each do |route, doc|
  check.call(doc.css('meta[name=description]').size == 1, "Repeated description: #{route}")
  doc.css('link[hreflang]').each do |link|
    target = canonical_pages[link['href']]
    canonical = doc.at_css('link[rel=canonical]')['href']
    check.call(target && target.css('link[hreflang]').any? { |back| back['href'] == canonical }, "Missing/non-reciprocal hreflang: #{route} -> #{link['href']}")
  end
  ids = doc.css('[id]').map { |node| node['id'] }
  doc.css('[data-static-toc] a').each do |link|
    check.call(ids.include?(URI::DEFAULT_PARSER.unescape(link['href'].delete_prefix('#'))), "Broken TOC anchor: #{route} #{link['href']}")
  end
  if config.dig('homepage', 'show_featured_publications') != true
    check.call(doc.css('.featured-publications').empty?, "Featured papers rendered while disabled: #{route}")
  end
end

publications = records.select { |record| record['_collection'] == 'publications' }
publications.each do |publication|
  route = key.call(publication.fetch('permalink'))
  doc = html[route]
  check.call(doc, "Missing publication page: #{route}")
  next unless doc
  {'citation_title' => publication['title'], 'citation_publication_date' => publication['publication_date']}.each do |name, expected|
    check.call(expected && doc.at_css("meta[name=#{name}]")&.[]('content') == expected.to_s, "Missing/mismatched #{name}: #{route}")
  end
  authors = publication['authors']
  check.call(authors.is_a?(Array) && !authors.empty? && doc.css('meta[name=citation_author]').map { |node| node['content'] } == authors, "Missing/mismatched authors: #{route}")
  host = parse_url.call(doc.at_css('link[rel=canonical]')['href']).host
  doc.css('.publication-resources a').each do |link|
    next if parse_url.call(link['href']).host && parse_url.call(link['href']).host != host
    check.call(resolve.call(link['href']), "Missing publication resource: #{link['href']}")
  end
  if (pdf = doc.at_css('meta[name=citation_pdf_url]'))
    pdf_uri = parse_url.call(pdf['content'])
    check.call(pdf_uri.host == host && File.dirname(pdf_uri.path) == File.dirname(parse_url.call(doc.at_css('link[rel=canonical]')['href']).path), "Scholar PDF must share abstract directory: #{route}")
  end
  next unless publication['bibtex_key']
  bibtex_url = publication['bibtexurl'].to_s
  next if parse_url.call(bibtex_url).host && parse_url.call(bibtex_url).host != host
  file = resolve.call(bibtex_url)
  text = file&.read.to_s
  check.call(text.start_with?("@#{publication.fetch('bibtex_type', 'misc')}{#{publication['bibtex_key']},") && text.include?('author = {') && !text.include?('{%'), "Missing/invalid BibTeX for #{route}")
end

cv = JSON.parse(root.join('cv.json').read)
cv_source = JSON.parse(source.join('_data/cv.json').read)
check.call(cv['basics']['name'] == config.dig('author', 'name'), 'CV identity differs from site configuration')
check.call(cv['education'] == cv_source['education'], 'CV education differs from source data')
expected = publications.map { |p| [p['title'], p['publication_date'].to_s.tr('/', '-'), p['authors']] }.sort_by(&:first)
actual = cv.fetch('publications').map { |p| [p['name'], p['releaseDate'], p['authors']] }.sort_by(&:first)
check.call(actual == expected, 'CV publications differ from source data')
abort errors.join("\n") unless errors.empty?
puts "Site validation passed: #{html.size} pages, #{publications.size} publications, #{cv['education'].size} education entries; translations, resources and TOC links checked."
