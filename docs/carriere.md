# Carrière de Julien Rabault : dossier de référence

Ce fichier rassemble tout ce qu'on sait de mon parcours, en détail. Il sert de source pour refaire un CV, une lettre, un profil ou mettre à jour le site (la page Parcours et la base de l'agent). On le met à jour à chaque nouveau projet.

Sources : le récit oral de Julien (ancien prompt de l'agent, commit `6adc6ff`, `cloudflare-worker/worker.js`), les générateurs de CV (`generate_cv*.py`), la base de l'agent (`site/src/content/knowledge.fr.ts`) et la page Parcours (`site/src/content/career.fr.ts`).

> Le dépôt est public. On n'écrit ici ni noms de clients, ni volumes de documents par client, ni téléphone, ni salaire.

## Où ce contenu est utilisé

| Usage | Fichier |
|---|---|
| Page Parcours (FR, EN) | `site/src/content/career.fr.ts`, `career.en.ts` |
| Base de connaissances de l'agent | `site/src/content/knowledge.fr.ts`, `knowledge.en.ts` |
| CV PDF court et long | `generate_cv.py`, `generate_cv_long.py`, `generate_cv_en.py`, `generate_cv_en_long.py` |

Quand un fait change ici, le reporter dans ces fichiers.

## Identité

- **Julien Rabault**, Applied AI / ML Engineer, basé à Toulouse.
- Mobilité : Toulouse, Paris, remote, Canada.
- Ce qu'il aime : construire des systèmes IA robustes et modulables, avec un vrai soin de l'architecture du code et de l'industrialisation.
- Contact : julienrabault@icloud.com, linkedin.com/in/julienrabault, github.com/JulienRabault, julienrabault.github.io.
- Langues : français natif ; anglais **niveau à confirmer** (A2 noté en mémoire, B2 sur l'ancien site ; ne pas l'afficher tant que ce n'est pas tranché).

Accroche actuelle : « Je conçois des harnais agentiques et je mets en production des agents LLM et des systèmes RAG chez des clients, après quatre ans de deep learning sur supercalculateur au CNRS (PyTorch, multi-GPU). Deux publications peer-reviewed. »

---

## Berger-Levrault : AI Engineer (janv. 2026 à aujourd'hui)

Toulouse, département R&D IA transverse.

### Contexte

- **Athena** est la plateforme agentique de Berger-Levrault, branchée sur les documents et les APIs métier de ses clients : collectivités, santé, juridique, industrie, maintenance, RH publique.
- Julien l'a rejointe au stade du POC. Elle est devenue un produit : 100k documents, un pilote de six mois avec 70 utilisateurs (environ 30 en début de pilote), une mise en production en cours. Objectif : servir tous les clients du groupe.
- Besoins recueillis auprès des business units et en ateliers clients, itérations sur les retours terrain. Il travaille sur toute la chaîne, de l'architecture agentique au déploiement chez le client, souvent sur des métiers qu'il découvre.
- **Équipe** (une douzaine de personnes). Côté applicatif : 3 ingénieurs IA dont Julien, 1 designer, 1 DevOps. Côté recherche : 1 manager, 1 chercheur, 3 doctorants (dont une sur la réduction des hallucinations ; sujets GraphRAG). Julien est côté applicatif, très connecté à la recherche. Suivi sur Jira, collaboration avec designer et dev front.
- Ce qu'il aime dans ce poste : la R&D, toucher à tout (données, plateforme, agents, MCP, voix) et voir ses services partir en production.

### Chronologie

1. **Mois 1 et 2 : pipeline de données et content-extractor.** Reprise du code existant, pipeline rendue modulable (chunkers configurables pour l'équipe de recherche), content-extractor refait avec du batch, lancement des DAGs Airflow, propositions pour tenir de gros volumes de documents.
2. **Ensuite : la plateforme Athena.** Citation des sources dans les réponses, refonte du design agentique (gestion des documents déposés par l'utilisateur), puis le harnais.
3. **En cours : MCP Builder.**
4. **Aussi :** intégration d'une API voix.

### Projets

#### Harnais agentique d'Athena (en production)

- **Problème :** un routeur aiguillait chaque question vers un agent dédié (RAG, APIs MCP, rapports). Chaque nouveau besoin demandait un nouveau graphe.
- **Ce qu'il a fait :** conçu et porté, en ateliers avec l'équipe, une boucle agentique unique sur LangChain et LangGraph, configurée par profil et étendue par des middlewares : mémoire persistante, validation humaine des actions sensibles, résumé du contexte sous budget de tokens, garde-fous, skills, sous-agents, contrat d'événements commun.
- Les deux architectures tournent en parallèle en production et passent sur le même banc d'évaluation. Migration en cours vers Deep Agents.
- Travail d'équipe pour les skills, les sous-agents, la citation des sources et les documents déposés.
- **Résultat :** -40 à -50 % de coûts d'inférence grâce à un prompt caching partagé entre conversations, tenants et clients. **Toujours écrire « estimé ».**
- Stack : LangChain, LangGraph, Deep Agents, Python.

#### Outils et réponses sourcées

- RAG agentique, recherche web, calcul et serveurs MCP sur la même boucle : ajouter un outil ne demande plus de construire un graphe.
- Citation des sources dans le texte des réponses (ajoutée par Julien).
- Prise en charge des documents déposés pendant la conversation.

#### Évaluation, monitoring et sécurité (en place)

- Refonte du monitoring sous Langfuse v4 : traces, datasets, évaluations et scoring automatiques en LLM-as-judge.
- Golden sets ; comparaison de modèles, de prompts et d'architectures ; suivi des régressions et des coûts. Les régressions sont détectées avant la mise en production.
- Sécurité : contenus récupérés cloisonnés contre l'injection de prompt indirecte ; exécution des outils bornée (timeouts, droits par profil d'agent).

#### MCP Builder (déployé)

- **Problème :** une vingtaine de business units, une centaine d'APIs internes à brancher sur les agents.
- **Ce qu'il a fait :** un agent LLM découvre la documentation, sélectionne les endpoints utiles, propose regroupements et masquages, gère l'authentification, audite les lacunes (descriptions manquantes, AI-readiness) et génère des tools sur mesure (workflows, ou code Python via FastMCP). Une personne de la business unit valide et complète (human-in-the-loop).
- Double effet : une business unit déploie vite son serveur MCP, et voit les défauts de ses propres APIs.
- **Chiffres :** ~100 APIs transformées ; plus de 120 cartographiées selon le récit oral ; environ 150 visées. Banc de modèles pour la génération : le modèle retenu est 4,1 fois plus rapide et 3,2 fois moins cher (**chiffres à reconfirmer avec Julien**).
- Stack : FastMCP, MCP, OpenAPI, Python.

#### Content-extractor (déployé)

- **Problème :** au départ, un extracteur d'images simple, peu modulable, et des appels LLM coûteux sur de gros volumes.
- **Ce qu'il a fait :** service FastAPI repensé de zéro, 7 pipelines (OCR, images, PDF, DOCX, puis transcription audio) derrière une architecture factory/registry ; traitement par lots asynchrone avec Celery et l'API batch de Mistral.
- **Résultat :** -50 % sur les coûts d'extraction.

#### Agent de templates (en production)

- **Problème :** des rapports métier longs, rédigés à la main sur des trames imposées.
- Outils de lecture de documents Word pour extraire les champs d'un template, puis un second agent qui les remplit en langage naturel. Prévisualisation PDF, activation par client, interface Angular. Du prototype à la V2 en production.

#### Plans de formation et ingestion RAG (démonstrateur)

- **Problème :** construire les plans de formation du secteur public à partir des comptes rendus d'entretiens annuels, un métier qu'il ne connaissait pas.
- Chaîne LLM conçue de zéro : extraction des besoins, normalisation, dédoublonnage, regroupement entre collaborateurs, rapprochement avec un catalogue de formations (structured outputs). Démonstrateur présenté aux parties prenantes, industrialisation en cours.
- En équipe, ingestion RAG sous Airflow : plus de 5 DAGs, à peu près un par client, sur une dizaine de clients (PDF, notices, ordres de travail, documentation machine), enrichie par data augmentation, chunking, embeddings, questions et mots-clés générés puis indexés, filtres temporels.

---

## CNRS (PNRIA) : Machine Learning Engineer (déc. 2021 à janv. 2026, 4 ans)

Toulouse.

### Contexte

- Membre du réseau d'une vingtaine d'ingénieurs du Programme national de recherche en IA, en appui gratuit aux équipes de recherche de toute la France. Les chercheurs étaient experts de leur domaine, rarement de l'IA : l'équipe apportait la conception du code, l'entraînement des modèles et l'usage des supercalculateurs.
- Plus de 10 projets de 6 à 12 mois, toujours deux en parallèle, pour Météo France, le CNES, le CEA, l'INEE, des universités et laboratoires.
- Supercalculateur Jean Zay : jusqu'à 8 GPUs en DDP, Slurm, profiling PyTorch.
- Ce que le poste demandait : changer de domaine tous les six mois (météo, écologie, génétique, nanomatériaux, spatial, papillons), vulgariser auprès de chercheurs non informaticiens, être force de proposition, tenir tout le cycle (données, entraînement, déploiement, monitoring, tests).

### Projets

#### GENS et MetScore, Météo France (12 mois, publié)

- **Problème :** pour représenter l'incertitude, Météo France calcule plusieurs membres de prévision en parallèle ; ce calcul coûte cher. Objectif : générer ces membres à moindre coût avec des modèles génératifs.
- **Phase 1 (6 mois) :** état de l'art jusqu'aux modèles de diffusion ; DDPM entraîné sans contexte sur les données AROME pour valider l'approche ; puis conditionnement par le contexte (bruit modifié à chaque étape, image de contexte concaténée, approche multimodale).
- **Phase 2 :** conception de MetScore, librairie modulaire de plus de 30 métriques météo pilotée par une configuration YAML (avant, chaque métrique vivait dans un script différent, écrit par plusieurs personnes). Déployée sur Jean Zay, toujours en production chez Météo France.
- **Résultat :** qualité égale ou meilleure que StyleGAN avec 20 % de calcul en moins (échantillonnage DDIM).
- Publication : troisième auteur, AIES 2025.
- Stack : PyTorch, DDPM, DDIM, StyleGAN, Docker, CI/CD, tests unitaires, Jean Zay (DDP, 8 GPUs).

#### DeepFaune, CNRS et INEE (publié)

- **Problème :** reconnaître les espèces sur les images de pièges photographiques : 1,5 million d'images, 24 classes.
- Fine-tuning de **YOLOv8** (confirmé par Julien ; l'ancien prompt disait YOLOv5, c'est une erreur). Dataset très déséquilibré : augmentation de données et oversampling.
- Comparaison de toute la famille YOLO pour le compromis vitesse sur CPU et qualité ; tracking testé (DeepSORT) et écarté, trop lent.
- Pipeline d'inférence optimisée (batching, GPU si possible, multi-CPU) ; accompagnement de l'équipe sur Jean Zay.
- **Résultat :** 93 % de précision sur 24 espèces, inférence 3 fois plus rapide, publication peer-reviewed (co-auteur).
- Stack : YOLOv8, PyTorch, multi-GPU, Slurm, DeepSORT.

#### BIGSF, CNES (open source)

- **Problème :** une librairie U-Net d'analyse d'images de filaments galactiques, écrite par plusieurs doctorants successifs, difficile à faire évoluer.
- Tech lead : architecture pilotée par configuration YAML, classes de base (BaseDataset, BaseModel), réimplémentation et évolution du code existant. Devenue une toolbox publique.
- Stack : U-Net, PyTorch, MLflow, configurable-cl.

#### AUTOFILL, CEA

- **Problème :** les mesures de nanomatériaux par lumière et rayons X produisent des signaux 1D coûteux, qui ne couvrent pas tous les matériaux, tailles et formes.
- Autoencodeurs (ResVAE) pour reconstruire les signaux, puis un PairVAE pour traduire d'une technique à l'autre (LES vers SAXS et inversement).
- Conseil à l'équipe non informaticienne sur ses formats de données (passage à HDF5). Librairie paramétrable.
- **Résultat :** MAE de 0,98.
- Stack : PyTorch Lightning, ResVAE, PairVAE, CNN, HDF5, MLflow.

#### MORPHOGAN, Université de Lorraine

- Étudier la variation des motifs des ailes de papillons avec StyleGAN2 : reprise et optimisation d'un code complexe, réduction de la dette technique, exploration de l'espace latent, pipeline automatisée et conteneurisée.
- Stack : StyleGAN2, PyTorch, Slurm, Docker.

#### DNADNA, LISN

- Librairie d'analyse génétique des populations par deep learning : tests unitaires, CI, corrections de bugs, reproductibilité, réponse aux issues des utilisateurs.
- Stack : Python, GitLab CI, Jean Zay.

#### Acousur

- Segmentation de parcelles forestières en Inde (forêt sèche, humide…) à partir de données Sentinel 1 et 2 : baseline U-Net, prise en main de GeoPandas et des données satellite.
- Encadrement d'un stagiaire sur la détection semi-supervisée avec YOLO et data augmentation.
- Stack : U-Net, PyTorch, MLflow, GeoPandas.

#### Autres projets

- DeepGrail : traduction de texte en grammaire pour détecter les fake news.
- MORE : apprentissage par renforcement sur des structures de protéines.
- ASTANA : reconnaissance de position humaine sur vidéo, avec des datasets 3D.

#### Formation « Introduction aux LLMs »

- 3 heures, créée et donnée à environ 25 doctorants et chercheurs du CNRS : mécanisme d'attention, encodeurs (BERT), décodeurs (GPT), modèles actuels (GPT, Llama), modèles multimodaux.

---

## Agileo Automation : ingénieur logiciel en alternance (août 2020 à sept. 2021)

- Montauban, en parallèle du master. Équipe de 5 ingénieurs en Agile/Scrum.
- Framework de supervision et de contrôle de machines robotisées pour la cuisson et la fabrication de semi-conducteurs : architecture orientée objet, C#, IHM, CI/CD sous Azure DevOps.
- Une formation à la dure en architecture logicielle : c'est là qu'il a pris l'habitude de raisonner par architecture et UML avant de coder.

## Formation

- **Master IA et reconnaissance des formes (IARF)**, Université Paul Sabatier Toulouse III et IRIT, 2019 à 2021 : deep learning, vision par ordinateur, NLP.
- **Licence informatique**, même université, 2016 à 2019. Elle lui a appris à raisonner en informaticien (algorithmique, structures de données, complexité) plutôt qu'à apprendre des langages ; c'est ce qui fonde sa façon de penser.
- En parallèle des études : responsable accueil chez Carrefour (job étudiant, 2017 à 2020).

## Publications

- « Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2 », *Artificial Intelligence for the Earth Systems* (AIES), vol. 4, n° 1, 2025. Troisième auteur, peer-reviewed. Issu du projet GENS avec Météo France.
- « The DeepFaune initiative: a collaborative effort towards the automatic identification of European fauna in camera trap images ». Co-auteur, peer-reviewed.

## Open source

- **LangChain** : contribution mergée (intégration Mistral, citations de sources), PR #37008.
- **LLMock** (PyPI) : serveur de mock LLM compatible OpenAI, plus de 10 fournisseurs, pour tester retries, fallbacks et rate limiting sans consommer de tokens. Python, FastAPI.
- **uniqpath** (PyPI) : chemins de fichiers uniques (suffixes incrémentaux, UUID, horodatage).
- **configurable-cl** (PyPI) : configuration de librairies, utilisée sur BIGSF.
- **DDPM-weather** : modèle de diffusion pour débruiter des images météo, -20 % de ressources. PyTorch.
- **BananaML** (DaysToBananaDeath) : pipeline ML de bout en bout sur AWS, vision et API REST. FastAPI, Docker, CI/CD.

## Compétences

- **Systèmes agentiques :** harnais d'agents (boucle agentique, tool calling, middlewares, mémoire, human-in-the-loop), LangChain, LangGraph, Deep Agents, RAG, GraphRAG, MCP (client et serveur, FastMCP), structured outputs, sécurité des agents (prompt injection), evals (golden sets, LLM-as-judge, A/B testing), multimodal (OCR, vision, audio), fine-tuning, prompt engineering, embeddings, routage de LLM.
- **Deep learning :** PyTorch, PyTorch Lightning, Transformers, vision par ordinateur, modèles de diffusion (DDPM, DDIM), NLP, CNN, U-Net, YOLO, GAN (StyleGAN2), VAE (ResVAE, PairVAE), apprentissage par renforcement.
- **Langages et données :** Python, FastAPI, SQL, C#, Weaviate, PostgreSQL, MongoDB, Qdrant, pgvector, Hugging Face, API Mistral et OpenAI, scikit-learn, Pandas, NumPy, GeoPandas, HDF5.
- **Infrastructure :** Docker, Singularity, Conda, GitLab CI, AWS, Celery, RabbitMQ, S3 et MinIO, Airflow, MLflow, Langfuse, HPC (Slurm, Jean Zay), Linux.
- **Pratiques :** architecture logicielle, SOLID, design patterns, UML, tests unitaires, Scrum.
- Ne pas mettre Kubernetes ni Helm.

## Règles de rédaction

- Pas de tirets cadratins ni de points médians ; pas de titres marketing.
- « Canada », pas « Montréal ».
- Pas de noms de clients, pas de volumes de documents par client, pas de téléphone, pas de salaire ni de projets personnels de carrière dans les réponses de l'agent.
- Garder « estimé » sur le -40 à -50 %.

## Divers

- Meilleur classement League of Legends : Émeraude 3.
