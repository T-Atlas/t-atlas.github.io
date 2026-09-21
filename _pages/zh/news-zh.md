---
layout: archive
permalink: /zh/news/
title: "新闻动态"
lang: zh
alternate_url: /news/
author_profile: true
---

{% include base_path %}

{% assign chinese_news = site.news | where: 'lang', 'zh' %}
{% assign news_by_year = chinese_news | sort: 'date' | reverse | group_by_exp: 'item', 'item.date | date: "%Y"' %}
{% for year_group in news_by_year %}

## {{ year_group.name }}

{% include news-list.html items=year_group.items show_details=true %}

{% endfor %}
