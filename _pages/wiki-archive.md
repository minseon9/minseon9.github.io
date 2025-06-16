---
layout: archive
title: Wiki
collection: wiki
permalink: /wiki/
author_profile: true
---
<ul class="taxonomy__index">
  {% assign wikisInCategory = site.wiki | where_exp: "item", "item.public != false" | group_by_exp: 'wiki', 'wiki.category | category: "%Y"' %}
  {% for wiki in wikisInCategory %}
    <li>
      <a href="#{{ wiki.name }}">
        <strong>{{ wiki.name }}</strong> <span class="taxonomy__count">{{ wiki.items | size }}</span>
      </a>
    </li>
  {% endfor %}
</ul>


{% assign entries_layout = page.entries_layout | default: 'list' %}
{% assign wikisInCategory = site.wiki | where_exp: "item", "item.public != false" | group_by_exp: 'wiki', 'wiki.category | category: "%Y"' %}
{% for wiki in wikisInCategory %}
  <section id="{{ wiki.name }}" class="taxonomy__section">
    <h2 class="archive__subtitle">{{ wiki.name }}</h2>
    <div class="entries-{{ entries_layout }}">
      {% for post in wiki.items %}
        {% include archive-single.html type=entries_layout %}
      {% endfor %}
    </div>
    <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
  </section>
{% endfor %}
