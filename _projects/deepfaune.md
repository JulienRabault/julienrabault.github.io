---
title: "DeepFaune — Vision embarquée pour la biodiversité"
date: 2023-11-01
categories: projects
tags: [vision, classification, wildlife, professionnel]
header:
  teaser: /assets/images/deepfaune.jpg
  teaser_full_width: true
excerpt: "Pipeline vision 93 % de précision sur 24 espèces et inférence 3× plus rapide sur CPU."
author: "Julien Rabault"
layout: single
---

## TL;DR
**93 % de précision** sur 24 espèces et une inférence **3× plus rapide sur CPU** pour équiper les associations naturalistes en reconnaissance animale.

## Contexte
Le programme DeepFaune vise à automatiser l’analyse de 1,5 million d’images issues de pièges photos pour aider les écologues à monitorer la biodiversité. Les utilisateurs finaux disposent majoritairement de machines CPU et d’une forte contrainte de temps de traitement.

## Mon rôle
- Sélection du backbone YOLOv10 et adaptation aux contraintes matérielles des partenaires.
- Construction du pipeline d’entraînement : ingestion des données, augmentation, suivi des expériences.
- Optimisation de l’inférence CPU et packaging de l’outil pour les ONG et laboratoires partenaires.
- Contribution à la publication scientifique et accompagnement des utilisateurs.

## Méthode
- Prétraitement massif via cluster Jean Zay et équilibrage du dataset multi-espèces.
- Fine-tuning YOLOv10 avec stratégies de mixup/cutmix, distillation et pruning léger pour accélérer l’inférence.
- Export ONNX et packaging Docker/CLI pour faciliter le déploiement sur postes distants.

## Résultats
- Modèle atteignant **93 % de précision** sur 24 espèces avec 1,5 M d’images annotées.
- Pipeline d’inférence CPU **3× plus rapide**, rendant l’outil exploitable par les associations sur leurs infrastructures.
- Documentation, tutoriels et support utilisateurs intégrés dans la démarche de transfert.

**Ressources**
- Publication : <a href="https://scholar.google.fr/citations?view_op=view_citation&hl=fr&user=iUFJqVMAAAAJ&citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C">DeepFaune (2023)</a>.
- Code : dépôt GitLab CNRS (privé, maintenance partagée avec l’INEE).
- Démo : disponible sur demande pour les partenaires du programme.
