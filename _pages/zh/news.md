---
layout: archive
permalink: /zh/news/
title: "新闻动态"
lang: zh
author_profile: true
---

{% include base_path %}

{% assign chinese_news = site.news | where: 'lang', 'zh' %}
{% assign news_by_year = chinese_news | sort: 'date' | reverse | group_by_exp: 'item', 'item.date | date: "%Y"' %}
{% for year_group in news_by_year %}

## {{ year_group.name }}

{% for news_item in year_group.items %}

* **[{{ news_item.date | date: '%Y-%m' }}]** {% assign excerpt = news_item.excerpt_zh | default: news_item.excerpt %}{{ excerpt | strip_html | strip_newlines }}{% if news_item.has_detail %}{% assign zh_url = news_item.url %}{% unless news_item.url contains '/zh/' %}{% assign zh_url = news_item.url | replace: '/news/', '/zh/news/' %}{% endunless %} [查看详情]({{ zh_url | relative_url }}){% endif %}

{% endfor %}

{% endfor %}
