---
title: "AUTOFILL — PairVAE pour les nanomatériaux"
date: 2022-10-01
categories: projects
tags: [vae, génératif, matériaux, professionnel]
header:
  teaser: /assets/images/autofill.jpg
  teaser_full_width: true
excerpt: "PairVAE pour générer et compléter des données de nanomatériaux avec une MAE de 0,98."
author: "Julien Rabault"
layout: single
---

## TL;DR
Génération et complétion de données de nanomatériaux avec **PairVAE** atteignant une **MAE de 0,98**, pour accélérer les travaux du CEA.

## Contexte
Le CEA souhaitait enrichir ses jeux de données de nanomatériaux pour améliorer les modèles prédictifs tout en réduisant le coût des expériences en laboratoire. Les équipes avaient besoin d’une solution extensible à d’autres matériaux.

## Mon rôle
- Conception d’une librairie flexible permettant de configurer PairVAE sur différentes familles de matériaux.
- Entraînement et optimisation des modèles (multi-GPU) avec suivi MLflow.
- Packaging Docker et documentation pour faciliter le déploiement par les ingénieurs du CEA.

## Méthode
- Pipeline d’entraînement modulaire avec configuration YAML et callbacks personnalisés PyTorch Lightning.
- Validation croisée, métriques de reconstruction (MAE, RMSE) et évaluation par domaine pour garantir la généralisabilité.
- Scripts d’inférence pour la complétion automatisée des expériences manquantes et export des résultats au format recherché par les scientifiques.

## Résultats
- **MAE 0,98** sur la reconstruction des signaux, surpassant les approches précédentes utilisées au CEA.
- Librairie évolutive permettant d’ajouter de nouveaux matériaux sans modifier le cœur du code.
- Adoption par l’équipe recherche et transfert vers d’autres laboratoires intéressés par la complétion de données scientifiques.

**Ressources**
- Code : dépôt GitLab CEA (privé).
- Documentation : guide PairVAE AUTOFILL (2022).
- Démo : notebooks livrés aux chercheurs pour la complétion de nouveaux jeux de données.
