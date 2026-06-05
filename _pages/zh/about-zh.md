---
permalink: /zh/
title: "连俊宏 的 个人主页"
lang: zh
alternate_url: /
author_profile: true
redirect_from:
  - /zh/about/
  - /zh/about.html
---
## 关于我 {#about-me}

我目前是中国科学院计算技术研究所的三年级博士研究生，导师是[敖翔](https://aoxaustin.github.io/index.html)研究员。我的研究兴趣包括自然语言处理（NLP）、大语言模型的个性化生成，以及NLP在金融领域的应用。

在硕士阶段，我有幸得到[刘新宇](https://ict.cas.cn/sourcedb/cn/jssrck/200909/t20090917_2496680.html)副研究员的联合指导。

<span style="color:green">如果您对我的工作有任何疑问或感兴趣与我合作，请通过邮件联系我。</span>

## 🔥 最新动态 {#news}

{% assign chinese_news = site.news | where: 'lang', 'zh' %}
{% assign recent_news = chinese_news | sort: 'date' | reverse | slice: 0, site.recent_news_count %}
{% for news_item in recent_news %}

* **[{{ news_item.date | date: '%Y-%m' }}]** {% if news_item.excerpt_zh %}{{ news_item.excerpt_zh | strip_html | strip_newlines }}{% else %}{{ news_item.excerpt | strip_html | strip_newlines }}{% endif %}
{% endfor %}
