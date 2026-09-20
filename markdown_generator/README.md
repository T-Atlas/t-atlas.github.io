# CSV / TSV 内容生成器

Python 3.9+，只使用标准库。支持 UTF-8、中文及含引号的字段。原有 TSV 输入和 notebook 保留。

```sh
python3 markdown_generator/publications.py markdown_generator/publications.tsv --dry-run
python3 markdown_generator/publications.py markdown_generator/publications.tsv
python3 markdown_generator/talks.py markdown_generator/talks.tsv --output-dir local/generated/talks
```

默认写入 `local/generated/publications` 或 `local/generated/talks`，不直接覆盖网站内容。检查结果后再复制到 collection。全部行先通过校验再写入；已有文件需显式 `--overwrite`。支持旧版第二位置参数指定输出目录。

- 论文必需列：`title, url_slug, pub_date`；演讲：`title, url_slug, date`。
- 日期使用 YYYY-MM-DD。网站录入日期与 `publication_date`（引用用真实出版日期）分开。
- 支持 CSV（逗号）和 TSV（制表符），不要求列顺序。
- 可选：`venue, excerpt, description, citation, category, lang, alternate_url, permalink`。
- 资源：`paper_url, slides_url, poster_url, bibtex_url, code_url, project_url`（也可用无下划线的站点字段名）。
- 学术信息：`authors`（分号分隔或 JSON 字符串数组）、`doi, publication_date, publication_year, citation_venue, pages, publisher, bibtex_key, bibtex_type, bibtex_note, arxivurl`。
- 演讲另支持 `type, location, talk_url`。
- `lang` 默认 en；中文文件写入输出目录的 `zh/` 子目录，可与同名英文稿共存；中文默认 permalink 带 `/zh`，但既有网址应通过 `permalink` 明确保持。

`bibtex_key` 需要配套生成式 `.bib` 页面，可参考 `files/bibtex/`。空白 DOI 不会自动猜测。现有 BibTeX/notebook 工具仍可使用，以上命令不要求 pandas。
