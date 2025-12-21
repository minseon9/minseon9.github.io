---
layout: archive
title: Wiki
permalink: /wiki/
author_profile: false
classes: wide
---

{% assign all_posts = site.posts | where_exp: "item", "item.hidden != true" %}
{% assign entries_layout = page.entries_layout | default: 'list' %}

<!-- 모든 고유한 두 번째 레벨 카테고리 수집 (wiki 다음) -->
{% assign level2_categories = "" | split: "" %}
{% for post in all_posts %}
  {% if post.categories.size > 1 and post.categories[0] == "wiki" %}
    {% assign cat2 = post.categories[1] %}
    {% unless level2_categories contains cat2 %}
      {% assign level2_categories = level2_categories | push: cat2 %}
    {% endunless %}
  {% endif %}
{% endfor %}

<!-- 카테고리 인덱스 -->
<ul class="taxonomy__index">
  {% for cat in level2_categories %}
    {% assign cat_count = 0 %}
    {% for post in all_posts %}
      {% if post.categories[1] == cat %}
        {% assign cat_count = cat_count | plus: 1 %}
      {% endif %}
    {% endfor %}
    <li>
      <a href="#{{ cat | slugify }}">
        <strong>{{ cat }}</strong> <span class="taxonomy__count">{{ cat_count }}</span>
      </a>
    </li>
  {% endfor %}
</ul>

<!-- 각 카테고리별 섹션 -->
{% for cat2 in level2_categories %}
<section id="{{ cat2 | slugify }}" class="taxonomy__section">
  
  <!-- 이 카테고리가 최하위인 포스트들 (하위 카테고리 없음) -->
  {% assign direct_posts = "" | split: "" %}
  {% for post in all_posts %}
    {% if post.categories.size == 2 and post.categories[1] == cat2 %}
      {% assign direct_posts = direct_posts | push: post %}
    {% endif %}
  {% endfor %}
  
  <!-- 하위 카테고리 여부 확인 -->
  {% assign has_sub_categories = false %}
  {% for post in all_posts %}
    {% if post.categories.size > 2 and post.categories[1] == cat2 %}
      {% assign has_sub_categories = true %}
      {% break %}
    {% endif %}
  {% endfor %}
  
  {% if has_sub_categories %}
    <!-- 하위 카테고리가 있는 경우: 전체 문서 수와 링크 표시 -->
    {% assign total_count = 0 %}
    {% for post in all_posts %}
      {% if post.categories[1] == cat2 %}
        {% assign total_count = total_count | plus: 1 %}
      {% endif %}
    {% endfor %}
    <h2 class="archive__subtitle">
      <a href="/wiki/{{ cat2 | downcase | slugify }}/">{{ cat2 }}</a>
    </h2>
    <p class="taxonomy__count">하위 카테고리 문서 {{ total_count }}개</p>
  {% else %}
    <!-- 하위 카테고리 없음: 직접 글 목록 표시 -->
    <h2 class="archive__subtitle">
      <a href="/wiki/{{ cat2 | downcase | slugify }}/">{{ cat2 }}</a>
    </h2>
    {% if direct_posts.size > 0 %}
      <div class="entries-{{ entries_layout }}">
        {% for post in direct_posts %}
          {% include archive-single.html type=entries_layout %}
        {% endfor %}
      </div>
    {% endif %}
  {% endif %}
  
  <a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
</section>
{% endfor %}
