---
layout: archive
title: "CV"
permalink: /cv/
lang: en
alternate_url: /zh/cv/
author_profile: true
redirect_from:
  - /resume
---

## Education

{% include cv-education.html %}

## Publications

<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>
