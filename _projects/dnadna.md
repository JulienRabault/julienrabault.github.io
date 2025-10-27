---
title: "DNADNA — Analyse génétique reproductible"
date: 2024-03-01
categories: projects
tags: [génomique, mlops, reproductibilité, professionnel]
header:
  teaser: /assets/images/dnadna.jpg
  teaser_full_width: true
excerpt: "Industrialisation d’une librairie d’analyse génétique avec CI/CD, tests et support utilisateurs."
author: "Julien Rabault"
layout: single
---

## TL;DR
Mise en production d’une librairie d’analyse génétique avec **tests automatisés, CI/CD et documentation**, facilitant la recherche collaborative au sein du LISN.

## Contexte
Le laboratoire LISN souhaitait fiabiliser sa toolbox DNADNA pour l’analyse de populations génétiques via deep learning. Le code historique provenait de contributions multiples sans standardisation ni tests, rendant les résultats difficiles à reproduire.

## Mon rôle
- Audit du code existant et priorisation des chantiers qualité.
- Mise en place d’une stratégie de tests unitaires et d’intégration continue sur GitLab.
- Ajout de fonctionnalités demandées par les utilisateurs (prétraitement de nouvelles espèces, exports personnalisés).
- Animation du support : tri des issues, roadmaps et transfert méthodologique.

## Méthode
- Normalisation des modules Python (typage, Pydantic, validation des configurations).
- Ajout d’une CLI unifiée et d’un système de configuration inspiré de Configurable-cl.
- Intégration de MLflow pour tracer les expériences et partager les modèles entraînés.

## Résultats
- Pipeline CI/CD couvrant les tests, la génération de documentation et la création automatique des packages.
- Réduction significative de la dette technique : onboarding des nouveaux utilisateurs réduit de plusieurs jours à une demi-journée.
- Adoption par plusieurs équipes CNRS grâce aux tutoriels et aux exemples reproductibles fournis.

**Ressources**
- Code : dépôt GitLab CNRS (privé, maintenu par le LISN).
- Guide utilisateur : documentation DNADNA (2024).
- Support : canal interne Slack CNRS.
