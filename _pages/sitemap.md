---
layout: archive
title: "Sitemap"
permalink: /sitemap/
author_profile: true
---

{% include base_path %}

A list of main pages and content found on the site. For you robots out there, there is an [XML version]({{ base_path }}/sitemap.xml) available for digesting as well.

<h2>Main Pages</h2>
{% assign sorted_pages = site.pages | where_exp: "post", "post.sitemap != false" | sort: "title" %}
{% for post in sorted_pages %}
  {% include archive-single.html %}
{% endfor %}

<!-- <hr>

<h2>News</h2>
{% for post in site.news %}
  {% include archive-single.html %}
{% endfor %} -->

<hr>

<h2>Publications</h2>
{% assign sorted_publications = site.publications | sort: "date" | reverse %}
{% for post in sorted_publications %}
  {% include archive-single.html %}
{% endfor %}

<hr>

<h2>Blog Posts</h2>
{% assign sorted_posts = site.posts | sort: "date" | reverse %}
{% for post in sorted_posts %}
  {% include archive-single.html %}
{% endfor %}