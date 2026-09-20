---
layout: archive
title: "个人简历"
permalink: /zh/cv/
lang: zh
alternate_url: /cv/
author_profile: true
redirect_from:
  - /zh/resume
---

## 教育背景

{% include cv-education.html %}

## 学术发表

<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>
