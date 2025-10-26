---
title: Project
layout: collection
permalink: /projects/
collection: projects
entries_layout: grid
---
{% assign project_posts = site.posts | where_exp: "item", "item.category == 'project'" | where_exp: "item", "item.hidden != true" %}

<ul class="taxonomy__index">
  {% assign postsByTag = project_posts | group_by: 'tags' %}
  {% for tag_group in postsByTag %}
    {% if tag_group.name != blank %}
      <li>
        <a href="#{{ tag_group.name | first | slugify }}">
          <strong>{{ tag_group.name | first }}</strong> <span class="taxonomy__count">{{ tag_group.items | size }}</span>
        </a>
      </li>
    {% endif %}
  {% endfor %}
</ul>

{% assign entries_layout = page.entries_layout | default: 'grid' %}
{% assign postsByTag = project_posts | group_by: 'tags' %}
{% for tag_group in postsByTag %}
    {% if tag_group.name != blank %}
        <section id="{{ tag_group.name | first | slugify }}" class="taxonomy__section">
        <h2 class="archive__subtitle">{{ tag_group.name | first }}</h2>
        <div class="entries-{{ entries_layout }}">
            {% for post in tag_group.items %}
                {% include archive-single.html type=entries_layout %}
            {% endfor %}
        </div>
        <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
        </section>
    {% endif %}
{% endfor %}
