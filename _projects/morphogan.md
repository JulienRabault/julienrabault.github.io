---
title: "MORPHOGAN — StyleGAN2 pour la morphologie"
date: 2023-06-01
categories: projects
tags: [génératif, stylegan2, vision, professionnel]
header:
  teaser: /assets/images/morphogan.jpg
  teaser_full_width: true
excerpt: "Refonte complète de StyleGAN2 pour analyser la variabilité morphologique des ailes de papillons."
author: "Julien Rabault"
layout: single
---

## TL;DR
Réduction drastique de la dette technique en **refondant StyleGAN2** pour des expérimentations reproductibles sur la morphologie des ailes de papillons.

## Contexte
L’Université de Lorraine menait des recherches sur la variabilité morphologique des motifs d’ailes de papillons en utilisant StyleGAN2. Le code historique, multi-plateforme, comportait une forte dette technique et rendait les analyses difficiles à reproduire.

## Mon rôle
- Reprise complète du dépôt : modularisation, nettoyage et documentation.
- Création d’une pipeline automatisée de préparation de données, entraînement et analyse.
- Mise en place des tests unitaires, de la conteneurisation et de la compatibilité multi-OS.
- Support aux chercheurs pour interpréter l’espace latent et générer des visualisations.

## Méthode
- Refactoring du cœur StyleGAN2 pour clarifier les composants (data loaders, modules de pertes, scripts d’inférence).
- Ajout d’outils d’exploration de l’espace latent (interpolations, visualisations interactives) et export de métriques.
- Conteneurisation Docker + scripts Slurm pour exécuter les expériences sur Jean Zay.

## Résultats
- Pipeline automatisé de bout en bout, compatible Linux/Windows/Mac et supervisé par tests unitaires.
- Réduction du temps d’onboarding des nouveaux chercheurs, grâce à une documentation claire et une CLI unique.
- Base solide pour publier des analyses morphologiques reproductibles et comparables entre espèces.

**Ressources**
- Code : dépôt GitLab Université de Lorraine (privé).
- Article : manuscrit scientifique MORPHOGAN (en préparation, 2024).
- Démo : notebooks d’exploration fournis aux équipes partenaires.
