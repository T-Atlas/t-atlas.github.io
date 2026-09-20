# 网站功能与维护

本次按功能适配 Academic Pages `3d28cd27`，保留现有网址、双语文章、图片放大和独立图表模块。默认主题继续为 default。

## 主题与图标

在 `_config.yml` 设置 `site_theme`：`default`、`air`、`contrast`、`dirt`、`mint`、`sunrise`。每套均有明暗模式，修改后重建。

`assets/js/site-theme.js` 是唯一主题状态入口，在 CSS 前设置页面主题。它兼容原来的 localStorage `theme` 值、系统主题变化以及存储不可用的浏览器。`SiteTheme.subscribe` 供图表、导航图标、Giscus 使用；需要恢复系统跟随时调用 `SiteTheme.set('system')`。

Font Awesome 6.7.2 的字体和 SCSS 成套同步；样式编译到 `assets/css/fontawesome.css`，与本地 Academicons 分别预加载并异步应用，提供 noscript 回退。图片放大和 FitVids 继续保留。

自定义 SCSS 已拆到 `_sass/custom/`。专题文章正文和强调色跟随主题变量；不要再用系统暗色媒体查询覆盖手动选择的主题。

## 双语与导航

页面使用 `lang: en` / `lang: zh`，成对页面优先填写互相对应的 `alternate_url`。`language-context.html` 集中识别存在的译文，语言按钮与 `hreflang` 共用同一结果。没有译文时不会生成虚假的对应网址。

栏目高亮匹配实际页面、所属 collection 和中英文菜单，保持链接可点击。导航按钮提供名称、展开状态和 Escape 收起行为。修改网址应同时检查原 permalink、译文链接与已有 Giscus pathname 映射。

## 文章目录

在长文章 front matter 设置 `toc: true`。目录从正文 h2/h3 标题生成，手机默认折叠，桌面默认展开。FinD 中英文章和 AI4AIR 中文文章已启用。短新闻默认不变。

## 简历：一份教育数据，多种呈现

- `_data/cv.json`：中英教育经历的唯一结构化来源，沿用现有真实资料。
- `_publications/`：论文的唯一来源，标准 CV、JSON CV 和导出均使用同一集合。
- 标准简历继续使用 `/cv/`、`/zh/cv/`。
- 新样式简历使用 `/cv-json/`、`/zh/cv-json/`；`/cv.json` 导出完整 JSON。
- 使用浏览器打印保存 PDF。已去除不存在的 `/files/cv.pdf` 按钮。

旧脚本名称保留兼容入口，但现在从 Jekyll 产物导出，不再反向猜测 Markdown 排版：

```sh
python3 scripts/cv_markdown_to_json.py --output local/cv.json
# 或
bash scripts/update_cv_json.sh --output local/cv.json
```

导出不会覆盖 `_data/cv.json`。

## 论文引用与元数据

论文 front matter 增加 `authors`、`publication_date`、`publication_year`、`doi`、`citation_venue`、`pages`、`publisher`、`bibtex_type`、`bibtex_key`。`date` 保持原有录入日期和排序，不用它冒充出版日期。

`publication-resources.html` 统一渲染论文/海报/幻灯片/DOI/arXiv/代码/项目资源，以及 BibTeX 复制和下载。`files/bibtex/*.bib` 是带 front matter 的模板，构建后生成纯 BibTeX；引用不在多个地方手工维护。

新增论文时，按现有 `files/bibtex/` 文件创建一个包装页并填写对应 key。作者用字符串列表，必须保留正式作者顺序。未核实的 DOI、卷期等字段留空。

已核对的出版元数据来源（2026-09-20）：

| 论文 | DOI / 日期 | 核对来源 |
|---|---|---|
| Fact-Preserved | 10.1109/ICDM58522.2023.00197；2023-12-01 | [出版社登记元数据](https://api.crossref.org/works/10.1109/ICDM58522.2023.00197)、[作者 arXiv](https://arxiv.org/abs/2501.11828) |
| Panoramic Interests | 10.1145/3701716.3715539；2025-05-08（出版登记日期） | [出版社登记元数据](https://api.crossref.org/works/10.1145/3701716.3715539)、[作者 arXiv](https://arxiv.org/abs/2501.11900) |
| PHG-DIF | 10.1145/3746252.3761210；2025-11-10 | [出版社登记元数据](https://api.crossref.org/works/10.1145/3746252.3761210)、[作者 arXiv](https://arxiv.org/abs/2508.07178) |
| GDCNet | 10.1109/ICASSP55912.2026.11461651；2026-05-03 | [出版社登记元数据](https://api.crossref.org/works/10.1109/ICASSP55912.2026.11461651)、[作者 arXiv](https://arxiv.org/abs/2601.20618) |
| AI4AIR | 2026；Preprint, under review，无 DOI | [项目页引用信息](https://ict-find-lab.github.io/Awesome-LLMs-for-AI-Research/) |

学术页面输出 citation_title、每位 citation_author、实际 citation_publication_date 和已确认的出版信息。当前下载文件位于 `/files/`，摘要位于 `/publication/`，预印本还使用外部 PDF；因此未机械输出要求摘要与 PDF 目录匹配的 citation_pdf_url。若以后提供满足目录关系的副本，可设置 `scholar_pdf_url`，校验脚本会检查关系。依据：[Google Scholar 规范](https://scholar.google.com/intl/en/scholar/inclusion.html)。

## CSV / TSV、Docker 与地图

生成器只依赖 Python 标准库，支持中英字段及海报等扩展，默认输出 `local/generated/`，需显式 `--overwrite` 才替换已有文件。见 [生成器说明](../markdown_generator/README.md)。

Dockerfile/Compose 已同步使用 `_config.yml,_config_docker.yml` 和 `JEKYLL_ENV=docker`。使用 `docker compose up --build`。本次环境没有 Docker CLI，进行了配置静态检查，未实际启动容器。

地图使用 Leaflet 1.9.4、HTTPS 图块；演讲 notebook/Python 更新数据时保留维护过的 map.html。抓取 workflow 监听 `_talks/**`，只提交地图相关文件。未启用原本隐藏的演讲/教学栏目，也未运行外部地理编码任务。

## 验证

```sh
npm run build:js
bundle exec jekyll build --strict_front_matter
bundle exec ruby scripts/validate_site.rb _site
python3 -S -m unittest discover -s tests -p 'test_*.py'
node tests/site-theme.test.cjs
```

站点检查覆盖重复 permalink、双语互链、论文资源、元数据、BibTeX 和真实简历数据。浏览器应另查手机导航、目录、明暗主题、评论 iframe、图表公式与图片放大。
