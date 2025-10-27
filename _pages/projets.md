---
layout: single
title: "Portfolio"
permalink: /projets/
classes: wide
---

## Vue d’ensemble

Une sélection de projets professionnels et personnels couvrant la vision, les modèles génératifs, les pipelines MLOps et les applications cloud.

## Projets professionnels

{% assign pro_projects = site.projects | where_exp: "item", "item.tags contains 'professionnel'" | sort: 'date' | reverse %}
<div class="archive__grid">
  {% for project in pro_projects %}
    {% include archive-single.html type="grid" post=project %}
  {% endfor %}
</div>

## Projets personnels

{% assign personal_projects = site.projects | where_exp: "item", "item.tags contains 'personnel'" | sort: 'date' | reverse %}
<div class="archive__grid">
  {% for project in personal_projects %}
    {% include archive-single.html type="grid" post=project %}
  {% endfor %}
</div>

<p class="text-center">
  <a class="btn btn--primary" href="/contact/">Travaillons ensemble</a>
</p>
