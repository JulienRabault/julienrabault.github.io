import type { Source } from "./types";

// Ce que l'agent sait, passage par passage. Le worker importe ce fichier : chaque [[id]] cité par le modèle
// doit exister ici, sinon il est retiré. Faits tirés de generate_cv.py, de l'ancien prompt et de l'ancien site
// (pas de nom de client, pas de plan de carrière).
export const knowledgeFr: Record<string, Source> = {
  "bl": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "AI Engineer, plateforme Athena",
    text: "AI Engineer dans l'équipe R&D IA de Berger-Levrault, à Toulouse. Athena est la plateforme agentique du groupe, branchée sur les documents et APIs métier de ses clients (collectivités, santé, juridique, industrie, maintenance, RH publique) : 100k documents, pilote de 6 mois avec 70 utilisateurs, mise en production en cours. Athena est passée du POC au produit et vise l'ensemble des clients du groupe. Besoins recueillis auprès des business units et en ateliers clients, itérations sur les retours terrain. Julien travaille sur toute la chaîne, de l'architecture agentique au déploiement chez le client, souvent sur des métiers qu'il ne connaissait pas la veille.",
  },
  "bl-harness": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Harnais agentique",
    text: "Architecture conçue et portée par Julien (LangChain, LangGraph). Passage d'un routeur d'agents (un agent par tâche) à une boucle agentique unique, configurée par profil et étendue par middlewares : mémoire persistante, validation humaine des actions sensibles, gestion du contexte (résumé, budget de tokens), garde-fous, skills, sous-agents. Prompt caching partagé entre conversations, tenants et clients : -40 à -50 % de coûts d'inférence (estimé). Contrat d'événements commun et gestion explicite du contexte. Les deux architectures tournent en parallèle en production, comparées sur le même banc d'évaluation. Refonte menée par Julien en ateliers, mais travail d'équipe : skills, sous-agents, citation des sources, prise en charge des documents déposés par l'utilisateur. Migration en cours vers Deep Agents.",
  },
  "bl-tools": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Outils de l'agent",
    text: "RAG agentique, recherche web, calcul et serveurs MCP, sur la même boucle, sans graphe par outil. Julien a aussi ajouté la citation des sources dans les réponses d'Athena.",
  },
  "bl-eval": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Évaluation et monitoring",
    text: "Refonte du monitoring sous Langfuse v4 (traces, datasets, évaluations et scoring automatiques, LLM-as-judge), golden sets, comparaison de modèles, de prompts et d'architectures, suivi des régressions et des coûts. Cloisonnement des contenus récupérés contre l'injection de prompt indirecte, bornes d'exécution des outils (timeouts, restriction par profil d'agent). Résultat : les régressions sont détectées avant la mise en production. L'objectif : mesurer la qualité, repérer les hallucinations et ne pas régresser quand l'architecture évolue.",
  },
  "bl-mcp": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "MCP Builder",
    text: "Transforme les APIs métier internes en serveurs MCP. Un LLM sélectionne les endpoints utiles, audite leurs lacunes (descriptions manquantes, AI-readiness) et génère des tools sur mesure (workflows ou code Python via FastMCP), en human-in-the-loop : une personne de la business unit valide et complète. Double objectif : déployer vite un serveur MCP et montrer aux équipes les défauts de leurs APIs. Déployé : une vingtaine de business units, une centaine d'APIs, environ 150 visées. Banc de modèles pour la génération : le modèle retenu est 4,1 fois plus rapide et 3,2 fois moins cher.",
  },
  "bl-extract": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Content-extractor",
    text: "Au départ, un service d'extraction d'images simple et peu modulable. Julien l'a refait entièrement pour l'OCR, les images, le PDF et le DOCX, puis a ajouté la transcription audio. Extraction multimodale : service FastAPI repensé de zéro, 7 pipelines, batch asynchrone (Celery et API batch de Mistral), architecture factory/registry. Déployé, -50 % sur les coûts d'extraction. Julien a aussi rendu la pipeline de données plus modulable (chunkers configurables pour l'équipe de recherche).",
  },
  "bl-templates": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Agent de templates",
    text: "Extrait des templates de documents Word, qu'un second agent remplit en langage naturel. Prévisualisation PDF, activation par client, interface Angular. Du prototype à la V2, en production.",
  },
  "bl-hr-data": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "Structuration de données métier",
    text: "Automatiser les plans de formation du secteur public, un métier que Julien ne connaissait pas : extraction des besoins depuis les entretiens annuels, normalisation, dédoublonnage, regroupement des besoins entre collaborateurs, rapprochement avec un catalogue de formations (structured outputs). Chaîne conçue de zéro ; démonstrateur présenté aux parties prenantes, industrialisation en cours. Ingestion RAG enrichie sous Airflow, en équipe : pipelines par client (PDF, notices, ordres de travail, documentation machine) complétés par de la data augmentation, du chunking, des embeddings et des questions et mots-clés générés puis indexés, plus de 5 DAGs, à peu près un par client, sur une dizaine de clients.",
  },
  "bl-team": {
    org: "Berger-Levrault",
    period: "depuis janv. 2026",
    title: "L'équipe et le poste",
    text: "Équipe R&D IA d'une douzaine de personnes. Côté applicatif : 3 AI engineers dont Julien, 1 designer, 1 DevOps. En lien étroit avec l'équipe de recherche (1 manager, 1 chercheur, 3 doctorants, dont un sur la réduction des hallucinations ; GraphRAG). Suivi sur Jira. Julien a aussi travaillé sur une API vocale. Ce que Julien aime dans ce poste : la R&D, toucher à tout (données, plateforme, agents, MCP) et voir ses services partir en production.",
  },
  "cnrs": {
    org: "CNRS (PNRIA)",
    period: "déc. 2021 à janv. 2026",
    title: "Machine Learning Engineer",
    text: "Ingénieur intégré aux équipes de recherche (météo, astrophysique, matériaux, éthologie, biologie) : plus de 10 projets de 6 à 12 mois, 2 en parallèle, du recueil du besoin à la livraison, pour Météo France, le CNES, le CEA et l'INEE. Entraînement et fine-tuning sur le supercalculateur Jean Zay (jusqu'à 8 GPUs en DDP, Slurm, profiling PyTorch).",
  },
  "cnrs-pnria": {
    org: "CNRS (PNRIA)",
    period: "déc. 2021 à janv. 2026",
    title: "Le réseau PNRIA",
    text: "Julien faisait partie du réseau d'une vingtaine d'ingénieurs du Programme national de recherche en IA, en appui aux équipes de recherche de toute la France, avec des experts de leur domaine pas forcément informaticiens. Ce qu'il en retient : changer de domaine tous les six mois, vulgariser auprès de chercheurs, proposer des solutions plutôt qu'exécuter, et couvrir tout le cycle, des données au déploiement.",
  },
  "cnrs-gens": {
    org: "CNRS, pour Météo France",
    period: "2021 à 2026",
    title: "GENS et MetScore",
    text: "Projet de 12 mois en deux phases. But : générer à moindre coût les membres d'une prévision d'ensemble, coûteux à calculer. État de l'art vers les modèles de diffusion, DDPM entraîné sur les données AROME puis conditionné par le contexte. Entraînement multi-GPU et fine-tuning en PyTorch. Conception de MetScore, librairie modulaire de plus de 30 métriques pilotée par configuration YAML, déployée sur Jean Zay et toujours en production. POC : qualité égale ou meilleure que StyleGAN avec 20 % de calcul en moins grâce à l'échantillonnage DDIM. Troisième auteur, AIES 2025.",
  },
  "cnrs-deepfaune": {
    org: "CNRS, INEE",
    period: "2021 à 2026",
    title: "DeepFaune",
    text: "Reconnaissance d'espèces sur des images de pièges photographiques. Fine-tuning YOLOv8 sur 1,5 M d'images (24 classes), gestion du déséquilibre de classes (augmentation, oversampling), tests de tracking (DeepSORT, trop lent), comparaison des modèles YOLO pour le compromis vitesse sur CPU et qualité, optimisation de l'inférence (batching, GPU, multi-CPU), accompagnement de l'équipe sur Jean Zay. 93 % de précision, inférence 3 fois plus rapide. Publication peer-reviewed.",
  },
  "cnrs-bigsf": {
    org: "CNRS, pour le CNES",
    period: "2021 à 2026",
    title: "BIGSF",
    text: "Tech lead sur la refonte d'une librairie U-Net d'analyse d'images de filaments galactiques, écrite à l'origine par plusieurs doctorants : architecture pilotée par configuration YAML, classes de base, réimplémentation du code existant. Toolbox publique.",
  },
  "cnrs-autofill": {
    org: "CNRS, pour le CEA",
    period: "2021 à 2026",
    title: "AUTOFILL",
    text: "Compléter des signaux de caractérisation de nanomatériaux, coûteux à mesurer. Autoencodeurs (ResVAE) pour reconstruire les signaux, puis un PairVAE pour passer d'une technique de mesure à l'autre (LES et SAXS). MAE 0,98. Conseil à l'équipe sur les formats de données (HDF5).",
  },
  "cnrs-morphogan": {
    org: "CNRS, Université de Lorraine",
    period: "2021 à 2026",
    title: "MORPHOGAN",
    text: "Étude des motifs des ailes de papillons avec StyleGAN2 : refonte d'un code complexe, réduction de la dette technique, exploration de l'espace latent, pipeline automatisée et conteneurisée.",
  },
  "cnrs-others": {
    org: "CNRS (PNRIA)",
    period: "2021 à 2026",
    title: "Autres projets",
    text: "DNADNA (LISN) : librairie d'analyse génétique des populations par deep learning, tests, CI et reproductibilité, suivi des issues des utilisateurs sur GitLab. Acousur : segmentation de parcelles forestières en Inde à partir d'images Sentinel 1 et 2, baseline U-Net, encadrement d'un stagiaire sur YOLO. Aussi DeepGrail (traduction de texte en grammaire pour détecter les fake news), MORE (apprentissage par renforcement sur des structures de protéines) et ASTANA (position humaine sur vidéo).",
  },
  "cnrs-course": {
    org: "CNRS",
    period: "2021 à 2026",
    title: "Formation aux LLMs",
    text: "Formation « Introduction aux LLMs » de 3 heures, créée et donnée à environ 25 doctorants et chercheurs : mécanisme d'attention, encodeurs (BERT), décodeurs (GPT), modèles actuels (GPT, Llama), modèles multimodaux.",
  },
  "agileo": {
    org: "Agileo Automation",
    period: "août 2020 à sept. 2021",
    title: "Ingénieur logiciel",
    text: "En alternance à Montauban, pendant le master. Framework de supervision et de contrôle de machines robotisées pour la cuisson et la fabrication de semi-conducteurs : C#, IHM, CI/CD (Azure DevOps), équipe de 5 en Scrum. C'est là que Julien a pris l'habitude de poser l'architecture avant de coder, en UML.",
  },
  "education": {
    org: "Université Paul Sabatier",
    period: "2016 à 2021",
    title: "Formation",
    text: "Master intelligence artificielle et reconnaissance des formes, Université Paul Sabatier et IRIT (2019 à 2021) : deep learning, vision, NLP. Licence informatique, même université (2016 à 2019), qui lui a appris à raisonner en informaticien (algorithmique, structures de données, complexité) plutôt qu'à apprendre des langages. En parallèle des études, job étudiant de responsable accueil chez Carrefour (2017 à 2020).",
  },
  "publications": {
    org: "Publications",
    period: "2025",
    title: "Deux articles peer-reviewed",
    text: "« Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2 », Artificial Intelligence for the Earth Systems (AIES), vol. 4 n° 1, 2025, troisième auteur. « The DeepFaune initiative: automatic identification of European fauna », co-auteur.",
  },
  "open-source": {
    org: "Open source",
    period: "",
    title: "LangChain, LLMock, uniqpath, BananaML, DDPM-weather",
    text: "Contribution mergée dans LangChain (intégration Mistral). Quatre projets personnels, dont trois publiés sur PyPI (LLMock, uniqpath, configurable-cl). LLMock : serveur de mock LLM, plus de 10 fournisseurs, compatible OpenAI, pour tester retries, fallbacks et rate limiting sans consommer de tokens. uniqpath : chemins de fichiers uniques (suffixes incrémentaux, UUID, horodatage). BananaML : pipeline ML de bout en bout sur AWS, vision et API REST (FastAPI, Docker, CI/CD). DDPM-weather : diffusion pour débruiter des images météo, -20 % de ressources.",
  },
  "skills": {
    org: "Compétences",
    period: "",
    title: "Stack",
    text: "Systèmes agentiques : harnais d'agents (boucle agentique, tool calling, middlewares, mémoire, human-in-the-loop), LangChain, LangGraph, Deep Agents, RAG, GraphRAG, MCP (client et serveur, FastMCP), Structured Outputs, sécurité des agents (prompt injection), evals (golden sets, LLM-as-judge, A/B testing), multimodal (OCR, vision, audio), fine-tuning. Langages et données : Python, PyTorch, PyTorch Lightning, scikit-learn, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, GeoPandas, HDF5, Hugging Face, API Mistral et OpenAI, C#. Infrastructure : Docker, Singularity, Conda, GitLab CI, AWS, Celery, RabbitMQ, S3 et MinIO, Airflow, MLFlow, Langfuse, Slurm, Linux.",
  },
  "mobility": {
    org: "Disponibilité",
    period: "2026",
    title: "Localisation",
    text: "Basé à Toulouse, ouvert à Paris, au remote et au Canada. Pour un poste précis, une date ou un salaire : le contacter directement par email.",
  },
  "site": {
    org: "Ce site",
    period: "2026",
    title: "Comment ce chat marche",
    text: "Un worker Cloudflare et un seul appel à un modèle Claude, avec tout le parcours en contexte, mis en cache : pas de RAG ni d'outils, le parcours tient en quelques milliers de tokens. Chaque fait doit citer un passage ; le worker retire avant le navigateur les citations inventées, les liens bruts et les widgets inconnus. Quota par visiteur et budget quotidien vérifiés avant l'appel. L'historique de la conversation est signé par le worker, pour qu'on ne puisse pas lui prêter des réponses qu'il n'a pas données. Interface en React, shadcn/ui, AI Elements, Motion et Paper Shaders.",
  },
  "hobby": {
    org: "Hors travail",
    period: "",
    title: "League of Legends",
    text: "Son meilleur classement sur League of Legends : Émeraude 3.",
  },
};
