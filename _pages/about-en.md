---
permalink: /
title: "Junhong Lian's Homepage"
lang: en
alternate_url: /zh/
author_profile: true
redirect_from:
  - /about/
  - /about.html
---
## About Me {#about-me}

I am currently a third-year Ph.D. student at the Institute of Computing Technology, Chinese Academy of Sciences (ICT, CAS), under the supervision of Prof. [Xiang Ao](https://aoxaustin.github.io/index.html).
My research interests include natural language processing (NLP), personalized generation in large language models (LLMs), and applications of NLP in the financial domain.

During my master's stage, I was fortunate to be co-supervised with Dr. [Xinyu Liu](https://ict.cas.cn/sourcedb/cn/jssrck/200909/t20090917_2496680.html).

<span style="color:green">If you have any questions regarding my work or are interested in collaborating with me, please contact me via email. </span>

## 🔥 Recent News {#news}

{% assign english_news = site.news | where_exp: 'item', 'item.lang != "zh"' %}
{% assign recent_news = english_news | sort: 'date' | reverse | slice: 0, site.recent_news_count %}
{% for news_item in recent_news %}

* **[{{ news_item.date | date: '%Y-%m' }}]** {% if news_item.excerpt_zh and page.lang == 'zh' %}{{ news_item.excerpt_zh | strip_html | strip_newlines }}{% else %}{{ news_item.excerpt | strip_html | strip_newlines }}{% endif %}
{% endfor %}
