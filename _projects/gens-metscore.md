---
title: "GENS — MetScore & diffusion météo"
date: 2024-05-01
categories: projects
tags: [météo, diffusion, mlops, professionnel]
header:
  teaser: /assets/images/metscore.jpg
  teaser_full_width: true
excerpt: "MetScore et un modèle de diffusion pour réduire de 20 % le coût des prévisions météo."
author: "Julien Rabault"
layout: single
---

## TL;DR
**–20 % de ressources de calcul** pour générer des prévisions météo grâce à une librairie d’évaluation dédiée et un modèle de diffusion entraîné sur les ensembles GENS.

## Contexte
Météo-France souhaitait uniformiser l’évaluation de ses modèles probabilistes et explorer les modèles génératifs pour améliorer l’interprétation des incertitudes météorologiques. Les équipes mêlaient profils scientifiques et opérationnels avec des besoins d’industrialisation.

## Mon rôle
- Cadrage technique et définition de l’API de la librairie MetScore.
- Développement, tests unitaires et intégration CI/CD de la librairie.
- Entraînement d’un modèle de diffusion pour la génération de prévisions météorologiques sur supercalculateur Jean Zay.
- Transfert de compétences auprès des équipes IA de Météo-France.

## Méthode
- Architecture modulaire avec configuration YAML pour exécuter n’importe quelle métrique météo.
- Pipelines d’évaluation orchestrés via MLflow et intégrés aux workflows existants.
- Expérimentations diffusion (U-Net conditionnel) optimisées multi-GPU, suivi des expériences et reproductibilité garantie.

## Résultats
- Librairie MetScore adoptée par les équipes IA, réduisant le temps d’intégration de nouvelles métriques de plusieurs jours à quelques heures.
- Modèle de diffusion permettant des prévisions **≈20 % moins coûteuses** en ressources de calcul avec une meilleure lisibilité des incertitudes.
- Documentation et tests automatisés facilitant le transfert vers des profils non-développeurs.

**Ressources**
- Code : dépôt GitLab CNRS (privé, maintenu par Météo-France).
- Note technique : documentation interne MetScore (2024).
- Contact : <a href="mailto:julienrabault@icloud.com">julienrabault@icloud.com</a>.
