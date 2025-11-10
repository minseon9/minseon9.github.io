---
layout: archive
title: Wiki
permalink: /wiki/
author_profile: false
classes: wide
---
<ul class="taxonomy__index">
  {% assign postsInCategory = site.posts | where_exp: "item", "item.hidden != true" | group_by: 'category' %}
  {% for category in postsInCategory %}
    <li>
      <a href="/wiki/#{{ category.name }}">
        <strong>{{ category.name }}</strong> <span class="taxonomy__count">{{ category.items | size }}</span>
      </a>
    </li>
  {% endfor %}
</ul>


{% assign entries_layout = page.entries_layout | default: 'list' %}
{% assign postsInCategory = site.posts | where_exp: "item", "item.hidden != true" | group_by: 'category' %}
{% for category in postsInCategory %}
  <section id="{{ category.name }}" class="taxonomy__section">
           <h2 class="archive__subtitle">
             <a href="/wiki/{{ category.name | downcase | slugify }}">{{ category.name }}</a>
           </h2>
    <div class="entries-{{ entries_layout }}">
      {% for post in category.items %}
        {% include archive-single.html type=entries_layout %}
      {% endfor %}
    </div>
    <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
  </section>
{% endfor %}
