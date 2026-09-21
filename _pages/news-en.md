---
layout: archive
permalink: /news/
title: "News"
lang: en
alternate_url: /zh/news/
author_profile: true
---

{% include base_path %}

{% assign english_news = site.news | where: 'lang', 'en' %}
{% assign news_by_year = english_news | sort: 'date' | reverse | group_by_exp: 'item', 'item.date | date: "%Y"' %}
{% for year_group in news_by_year %}

## {{ year_group.name }}

{% include news-list.html items=year_group.items show_details=true %}

{% endfor %}
