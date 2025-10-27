---
title: "DeepFaune — Vision & optimisation CPU"
excerpt: "Détection et classification d’animaux sur pièges photo, 93 % sur 24 espèces."
tags: ["vision", "YOLO", "HPC", "MLflow"]
header:
  teaser: /assets/images/deepfaune.jpg
---


**Objectif.** Détection et classification d’animaux sur images de pièges photo avec fortes contraintes CPU.  
**Rôle.** Conception du pipeline et entraînement à l’échelle (≈1.5M images).  
**Résultats.** 93 % de précision sur 24 espèces, **×3 plus rapide** sur CPU.  
**Stack.** Python, PyTorch, MLflow, YOLOv10, HPC (Jean Zay).

• **Code & logiciel** : [Site du projet](https://www.deepfaune.cnrs.fr/) – [Publication](https://link.springer.com/article/10.1007/s10344-023-01742-7) – [Git](/)  
• **Note technique** : architecture, choix de modèles, optimisation CPU, traçabilité (MLflow).
