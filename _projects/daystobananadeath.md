---
title: "DaysToBananaDeath — Pipeline IA complet"
date: 2024-01-15
categories: projects
tags: [mlops, aws, personnel]
header:
  teaser: /assets/images/hero.jpg
  teaser_full_width: true
excerpt: "Projet personnel : pipeline ML de prédiction et API temps réel déployée sur AWS."
author: "Julien Rabault"
layout: single
---

## TL;DR
Pipeline personnel de bout en bout : **collecte automatisée, entraînement, API FastAPI sur AWS** et frontend léger pour suivre la durée de vie d’une banane.

## Contexte
Je voulais un terrain d’expérimentation concret pour mettre en pratique les bonnes pratiques MLOps (CI/CD, infrastructure as code, monitoring) en dehors des projets clients, avec la contrainte d’un budget cloud limité.

## Mon rôle
- Design de l’architecture cloud (ingestion, stockage S3, entraînement programmé, API inference).
- Implémentation du modèle de prédiction en Python (scikit-learn) et orchestration des jobs via GitHub Actions.
- Mise en place d’un petit frontend et d’un tableau de bord de suivi des métriques (latence, dérive) via Grafana.

## Méthode
- Collecte des données via web scraping et normalisation hebdomadaire.
- Pipeline d’entraînement conteneurisé, orchestré par GitHub Actions et déployé sur AWS (Lambda + API Gateway).
- Infrastructure décrite en Terraform et surveillée via CloudWatch + Grafana hébergé.

## Résultats
- Temps de réponse moyen de l’API **< 200 ms** sur AWS Lambda.
- Déploiement automatisé de l’entraînement et de l’inférence à chaque mise à jour du dataset.
- Base de code publique documentée servant de démonstrateur MLOps.

**Ressources**
- Site : <a href="https://www.daystobananadeath.com/">daystobananadeath.com</a>.
- Code : <a href="https://github.com/JulienRabault/daystobananadeath">GitHub</a>.
- Infra : Terraform & workflows CI/CD disponibles sur le dépôt.
