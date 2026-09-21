require 'minitest/autorun'
require 'jekyll'
require 'nokogiri'
require 'tmpdir'
require 'fileutils'
require 'json'
require 'uri'
require 'yaml'

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

  def test_page_indexes_exclude_resources_redirects_and_hidden_pages
    with_site do |source|
      FileUtils.mkdir_p(File.join(source, '_pages'))
      File.write(File.join(source, '_layouts/archive.html'), '{{ content }}')
      %w[sitemap-en.md page-archive-en.html archive-layout-with-content-en.md category-archive-en.html collection-archive-en.html].each do |name|
        FileUtils.cp(File.join(ROOT, '_pages', name), File.join(source, '_pages', name))
      end
      File.write(File.join(source, 'index.html'), "---\ntitle: Home\nlang: en\n---\nHome")
      File.write(File.join(source, 'public.html'), "---\ntitle: Public page\nlang: en\n---\nPublic content")
      File.write(File.join(source, 'chinese.html'), "---\ntitle: 中文页面\nlang: zh\n---\n正文")
      File.write(File.join(source, 'hidden.html'), "---\ntitle: Hidden\nsitemap: false\n---\nHidden content")
      File.write(File.join(source, 'untitled.html'), "---\ntitle: '   '\n---\nUntitled content")
      File.write(File.join(source, 'data.json'), "---\ntitle: Named JSON resource\n---\n{}")
      File.write(File.join(source, 'style.css'), "---\ntitle: Named stylesheet\n---\nbody {}")
      File.write(File.join(source, 'redirect.html'), "---\ntitle: Named redirect\nredirect_to: /public.html\n---\n")
      FileUtils.mkdir_p(File.join(source, 'talkmap'))
      File.write(File.join(source, 'talkmap/map.html'), '<html><body>Tool map</body></html>')
      File.write(File.join(source, 'baidu_verify_fixture.html'), 'Verification token')
      File.write(File.join(source, 'paper.pdf'), '%PDF-1.4 fixture')
      plugins = %w[jekyll-sitemap jekyll-redirect-from]
      config = YAML.safe_load(File.read(File.join(ROOT, '_config.yml')), aliases: true)
      resource_defaults = config.fetch('defaults').select { |entry| %w[talkmap baidu_verify_*.html].include?(entry.dig('scope', 'path')) }
      render(source, 'include'=>['_pages'], 'plugins'=>plugins, 'whitelist'=>plugins, 'defaults'=>resource_defaults)
      %w[sitemap page-archive].each do |route|
        doc = Nokogiri::HTML(File.read(File.join(source, '_site', route, 'index.html')))
        links = doc.css('.page-index .archive__item-title a')
        paths = links.map { |link| URI(link['href']).path }
        assert_includes paths, '/public.html'
        assert links.all? { |link| !link.text.strip.empty? }
        %w[/hidden.html /untitled.html /data.json /style.css /redirect.html /archive-layout-with-content/ /categories/ /collection-archive/ /page-archive/].each do |path|
          refute_includes paths, path
        end
        if route == 'sitemap'
          refute_includes paths, '/chinese.html'
        else
          assert_includes paths, '/chinese.html'
        end
      end
      xml = Nokogiri::XML(File.read(File.join(source, '_site/sitemap.xml')))
      paths = xml.xpath('//*[local-name()="loc"]').map { |node| URI(node.text).path }
      assert_includes paths, '/public.html'
      assert_includes paths, '/paper.pdf'
      %w[/hidden.html /redirect.html /archive-layout-with-content/ /categories/ /collection-archive/ /page-archive/ /talkmap/map.html /baidu_verify_fixture.html].each do |path|
        refute_includes paths, path
      end
      assert File.file?(File.join(source, '_site/archive-layout-with-content/index.html')), 'Index cleanup preserves direct URLs'
    end
  end

  def test_news_rows_preserve_links_and_only_show_requested_details
    with_site do |source|
      File.write(File.join(source, '_data/updates.json'), JSON.generate([
        {'date'=>'2026-09-21', 'excerpt'=>'Read the [paper](/publication/paper).',
         'excerpt_zh'=>'阅读[论文](/publication/paper)。', 'has_detail'=>true, 'url'=>'/news/fixture/'},
        {'date'=>'2026-09-20', 'excerpt'=>'A short update.', 'has_detail'=>false, 'url'=>'/news/short/'}
      ]))
      %w[en zh].each do |lang|
        File.write(File.join(source, 'index.html'), "---\nlang: #{lang}\n---\n{% include news-list.html items=site.data.updates show_details=true %}")
        doc = render(source)
        assert_equal 2, doc.css('.news-list__item').size
        assert_equal '2026-09-21', doc.at_css('time')['datetime']
        assert_equal '/publication/paper', doc.at_css('.news-list__body a')['href']
        detail = lang == 'zh' ? '/zh/news/fixture/' : '/news/fixture/'
        assert doc.css('.news-list__body a').any? { |link| link['href'] == detail }
        refute doc.css('.news-list__body a').any? { |link| link['href'].include?('/news/short/') }
        assert_includes doc.at_css('.news-list__body').text, lang == 'zh' ? '阅读论文' : 'Read the paper'
      end
      File.write(File.join(source, 'index.html'), "---\nlang: en\n---\n{% include news-list.html items=site.data.updates %}")
      doc = render(source)
      assert_equal ['/publication/paper'], doc.css('.news-list__body a').map { |link| link['href'] }
    end
  end
end
