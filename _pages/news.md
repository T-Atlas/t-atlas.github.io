---
layout: archive
permalink: /news/
title: "News"
author_profile: true
---

{% include base_path %}

{% assign english_news = site.news | where: 'lang', 'en' %}
{% assign news_by_year = english_news | sort: 'date' | reverse | group_by_exp: 'item', 'item.date | date: "%Y"' %}
{% for year_group in news_by_year %}

## {{ year_group.name }}

{% for news_item in year_group.items %}

* **[{{ news_item.date | date: '%Y-%m' }}]** {% assign excerpt = news_item.excerpt | default: news_item.excerpt %}{{ excerpt | strip_html | strip_newlines }}{% if news_item.has_detail %} [Read More]({{ news_item.url | relative_url }}){% endif %}
{% endfor %}

{% endfor %}
