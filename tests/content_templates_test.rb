require 'minitest/autorun'
require 'jekyll'
require 'nokogiri'
require 'tmpdir'
require 'fileutils'
require 'json'

class ContentTemplatesTest < Minitest::Test
  ROOT = File.expand_path('..', __dir__)

  def with_site
    Dir.mktmpdir('academic-template-test-') do |source|
      source = File.realpath(source)
      FileUtils.cp_r(File.join(ROOT, '_includes'), source)
      %w[_layouts _publications _data].each { |dir| FileUtils.mkdir_p(File.join(source, dir)) }
      yield source
    end
  end

  def render(source, extra = {})
    config = Jekyll.configuration({'source'=>source, 'destination'=>File.join(source, '_site'), 'safe'=>true, 'quiet'=>true,
      'url'=>'https://fixture.test', 'collections'=>{'publications'=>{'output'=>true}}}.merge(extra))
    Jekyll::Site.new(config).process
    Nokogiri::HTML(File.read(File.join(source, '_site/index.html')))
  end

  def test_toc_is_complete_without_javascript
    with_site do |source|
      File.write(File.join(source,'_layouts/test.html'), '{% include content-toc.html html=content %}<main>{{ content }}</main>')
      File.write(File.join(source,'index.md'), "---\nlayout: test\nlang: zh\n---\n## 标题 *强调*\n\n### Child\n\n```html\n<h2 id=\"fake\">Not a heading</h2>\n```\n\n<h3 class='extra' id='manual-id'>A &amp; B</h3>\n")
      doc = render(source)
      links = doc.css('[data-static-toc] a')
      assert_equal 3, links.size
      assert_equal ['标题 强调','Child','A & B'], links.map(&:text)
      ids = doc.css('main [id]').map { |node| node['id'] }
      assert links.all? { |link| ids.include?(link['href'].delete_prefix('#')) }
      refute links.any? { |link| link['href'] == '#fake' }
      assert doc.at_css('details[open]'), 'No-JS reader can follow the pre-rendered links'
    end
  end

  def test_empty_sections_and_disabled_featured_stay_hidden
    with_site do |source|
      File.write(File.join(source,'index.html'), "---\nlang: en\n---\n{% include featured-publications.html %}{% include academic-sections.html %}")
      File.write(File.join(source,'_data/academic.json'), JSON.generate({'services'=>[], 'awards'=>[], 'projects'=>[]}))
      File.write(File.join(source,'_publications/paper.md'), "---\ntitle: Fixture paper\ndate: 2020-01-01\nfeatured: true\n---\n")
      File.write(File.join(source,'_publications/newer.md'), "---\ntitle: Newer featured paper\ndate: 2021-01-01\nfeatured: true\n---\n")
      doc = render(source, 'homepage'=>{'show_featured_publications'=>false})
      assert_empty doc.css('.featured-publications, .academic-section')
      doc = render(source, 'homepage'=>{'show_featured_publications'=>true, 'featured_limit'=>1})
      assert_equal 1, doc.css('.featured-publications .archive__item').size
      assert_includes doc.text, 'Newer featured paper'
      refute_includes doc.text, 'Fixture paper'
    end
  end

  def test_only_nonempty_published_academic_entries_render
    with_site do |source|
      File.write(File.join(source,'index.html'), "---\nlang: zh\n---\n{% include academic-sections.html %}")
      File.write(File.join(source,'_data/academic.json'), JSON.generate({'services'=>[], 'awards'=>[{'title'=>'Hidden','published'=>false}],
        'projects'=>[{'title'=>'Fixture project','title_zh'=>'测试项目','date'=>'2026'}, {'title'=>''}]}))
      doc = render(source)
      assert_equal ['projects'], doc.css('.academic-section').map { |section| section['id'] }
      assert_equal 1, doc.css('.academic-entry').size
      assert_includes doc.text, '测试项目'
      refute_includes doc.text, 'Hidden'
    end
  end
end
