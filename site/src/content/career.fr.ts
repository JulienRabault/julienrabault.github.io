import type { CareerContent, HarnessLayer } from "./types";

// Faits repris du CV (generate_cv.py) et du récit de Julien (ancien prompt de l'agent). Ne pas ajouter de chiffre absent de ces sources.
export const careerFr: CareerContent = {
  title: "Ingénieur IA, agents LLM et RAG en production",
  summary:
    "Je conçois des **harnais agentiques** et je mets en production des agents LLM et des systèmes RAG chez des clients, après **quatre ans de deep learning** sur supercalculateur au CNRS (PyTorch, multi-GPU). Deux publications peer-reviewed.",
  askAgent: "Poser une question à l'agent",
  timeline: [
    { id: "bl", kind: "work", current: true, org: "Berger-Levrault", role: "AI Engineer, plateforme agentique Athena", dates: "depuis janv. 2026", target: "bl" },
    { id: "cnrs", kind: "work", org: "CNRS (PNRIA)", role: "Machine Learning Engineer, plus de 10 projets de recherche", dates: "déc. 2021 à janv. 2026", target: "cnrs" },
    { id: "agileo", kind: "work", org: "Agileo Automation", role: "Ingénieur logiciel, en alternance", dates: "août 2020 à sept. 2021", target: "agileo" },
    { id: "master", kind: "school", org: "Université Paul Sabatier", role: "Master IA et reconnaissance des formes", dates: "2019 à 2021", target: "formation" },
    { id: "licence", kind: "school", org: "Université Paul Sabatier", role: "Licence informatique", dates: "2016 à 2019", target: "formation" },
  ],
  labels: {
    experience: "Expérience",
    education: "Formation",
    publications: "Publications",
    openSource: "Open source",
    skills: "Compétences",
    nav: "Sommaire du parcours",
  },
  chapters: [
    {
      id: "bl",
      org: "Berger-Levrault",
      title: "AI Engineer",
      place: "Toulouse, équipe R&D IA",
      dates: "Janv. 2026 à aujourd'hui",
      context:
        "Athena est la plateforme agentique de Berger-Levrault, branchée sur les documents et les APIs métier de ses clients : collectivités, santé, juridique, industrie, maintenance, RH publique. Je l'ai rejointe au stade du POC ; elle compte aujourd'hui **100k documents**, **un pilote de six mois avec 70 utilisateurs** et une mise en production en cours. Je travaille sur toute la chaîne, des ateliers avec les business units jusqu'au déploiement chez le client, souvent sur des métiers que je découvre.",
      note: "Côté produit, trois ingénieurs IA, un designer et un DevOps ; côté recherche, un manager, un chercheur et trois doctorants, avec qui nous partageons les sujets de GraphRAG et d'hallucinations.",
      groups: [
        {
          title: "La plateforme agentique",
          items: [
            {
              name: "Harnais agentique d'Athena",
              status: "En production",
              text: "**Une seule boucle agentique**, configurée par profil et étendue par des middlewares, à la place d'un routeur d'agents figés.",
              details: [
                "Avant : un routeur aiguillait chaque question vers un agent dédié (RAG, APIs MCP, rapports). Chaque nouveau besoin demandait un nouveau graphe.",
                "Après : une boucle unique choisit ses outils, ses skills et ses sous-agents. **J'ai conçu cette architecture** et je la porte, en ateliers avec l'équipe, sur LangChain et LangGraph.",
                "Les middlewares ajoutent la mémoire persistante, la validation humaine des actions sensibles, le résumé du contexte sous budget de tokens, les garde-fous et un contrat d'événements commun.",
                "**Les deux architectures tournent en parallèle en production** et passent sur le même banc d'évaluation. Migration en cours vers Deep Agents.",
              ],
              widget: "harness",
              metrics: [
                {
                  id: "inference-cost", value: "-40 à -50 %",
                  label: "de coûts d'inférence, grâce à un prompt caching partagé entre conversations, tenants et clients",
                  estimate: true,
                },
              ],
              stack: ["LangChain", "LangGraph", "Deep Agents", "Python"],
            },
            {
              name: "Outils et réponses sourcées",
              text: "RAG agentique, recherche web, calcul et serveurs MCP sur la même boucle, avec **la source citée dans chaque réponse**.",
              details: [
                "Tous les outils se branchent sur la boucle : en ajouter un **ne demande plus de construire un graphe**.",
                "Citation des sources dans le texte des réponses, pour que l'utilisateur vérifie d'où vient chaque affirmation.",
                "Prise en charge des documents déposés par l'utilisateur pendant la conversation.",
              ],
              stack: ["RAG", "MCP", "Weaviate"],
            },
            {
              id: "agent-evals",
              name: "Évaluation, monitoring et sécurité",
              status: "En place",
              text: "Un banc d'évaluation sous Langfuse v4 : **chaque changement de modèle, de prompt ou d'architecture est mesuré** avant de partir en production.",
              problem: "Une plateforme agentique en production doit être mesurable, et ne pas exécuter n'importe quoi.",
              details: [
                "Refonte du monitoring sous Langfuse v4 : traces exploitables, datasets, évaluations et scoring automatiques en LLM-as-judge.",
                "Golden sets de questions et de réponses attendues, pour comparer modèles, prompts et architectures et suivre les régressions et les coûts.",
                "Sécurité : les contenus récupérés sont **cloisonnés contre l'injection de prompt indirecte**, et l'exécution des outils est bornée (timeouts, droits par profil d'agent).",
              ],
              stack: ["Langfuse", "LLM-as-judge", "Golden sets"],
            },
            {
              id: "mcp-builder",
              name: "MCP Builder",
              status: "Déployé",
              text: "Transforme les **APIs métier internes en serveurs MCP** prêts pour les agents, avec un **expert métier dans la boucle**.",
              problem: "**Une centaine d'APIs internes**, réparties entre une vingtaine de business units, à brancher sur les agents.",
              details: [
                "Un LLM sélectionne les endpoints utiles, audite leurs lacunes (descriptions manquantes, AI-readiness) et **génère des tools sur mesure** : des workflows, ou du code Python via FastMCP.",
                "Une personne de la business unit valide et complète : la connaissance métier reste chez ceux qui l'ont.",
                "Double effet : une business unit **déploie son serveur MCP en peu de temps**, et **voit les défauts de ses propres APIs**. Cartographie en cours, environ 150 APIs visées.",
              ],
              metrics: [
                { id: "mcp-apis", value: "~100", label: "APIs internes transformées en serveurs MCP" },
                { id: "mcp-model", value: "4,1× et 3,2×", label: "plus rapide et moins cher : le modèle retenu au banc d'essai pour la génération" },
              ],
              stack: ["FastMCP", "MCP", "OpenAPI", "Python"],
            },
          ],
        },
        {
          title: "Services et pipelines LLM",
          items: [
            {
              id: "content-extractor",
              name: "Content-extractor",
              status: "Déployé",
              text: "Le service d'extraction multimodale de la plateforme, **refait de zéro** : OCR, images, PDF, DOCX et audio.",
              problem: "Au départ, un extracteur d'images simple, peu modulable, et des appels LLM coûteux sur de gros volumes de documents.",
              details: [
                "Service FastAPI repensé de zéro : **7 pipelines d'extraction** derrière une architecture factory/registry, à laquelle on ajoute un format sans toucher au reste.",
                "**Traitement par lots asynchrone** avec Celery et l'API batch de Mistral, là où chaque document faisait un appel synchrone.",
                "Chunkers configurables dans la pipeline de données, pour que l'équipe de recherche compare ses approches de découpage.",
              ],
              metrics: [{ id: "extraction-cost", value: "-50 %", label: "sur les coûts d'extraction" }],
              stack: ["FastAPI", "Celery", "API batch Mistral", "OCR"],
            },
            {
              id: "templates-agent",
              name: "Agent de templates",
              status: "En production",
              text: "Un agent lit des documents Word et en tire des templates ; un second les remplit en langage naturel.",
              problem: "Des rapports métier longs, rédigés à la main sur des trames imposées.",
              details: [
                "Outils de lecture de documents Word pour extraire les champs d'un template, puis un second agent et ses outils pour les remplir à partir d'une demande en langage naturel.",
                "Prévisualisation PDF, activation client par client, interface Angular.",
                "Du prototype à la V2, **aujourd'hui en production**.",
              ],
              stack: ["Python", "FastAPI", "Angular"],
            },
            {
              id: "hr-data",
              name: "Plans de formation et ingestion RAG",
              status: "Démonstrateur",
              text: "Des entretiens annuels du secteur public aux plans de formation, puis l'ingestion RAG de chaque client sous Airflow.",
              problem: "Construire les plans de formation du secteur public à partir des comptes rendus d'entretiens, un métier que je ne connaissais pas.",
              details: [
                "**Chaîne LLM conçue de zéro** : besoins extraits des entretiens, normalisés, dédoublonnés, regroupés entre collaborateurs, puis rapprochés d'un catalogue de formations (structured outputs). Démonstrateur présenté aux parties prenantes, industrialisation en cours.",
                "En équipe, l'ingestion RAG sous Airflow : **un DAG par client** (PDF, notices, ordres de travail, documentation machine), enrichi par data augmentation, chunking, embeddings, questions et mots-clés générés puis indexés, et filtres temporels.",
              ],
              stack: ["Structured outputs", "Airflow", "Embeddings"],
            },
          ],
        },
      ],
      footnote: "Aussi : l'intégration d'une API voix dans la plateforme.",
    },
    {
      id: "cnrs",
      org: "CNRS (PNRIA)",
      title: "Machine Learning Engineer",
      place: "Toulouse",
      dates: "Déc. 2021 à janv. 2026, 4 ans",
      context:
        "J'étais l'un des **vingt ingénieurs** du Programme national de recherche en IA, mis gratuitement à disposition des laboratoires de toute la France. Les chercheurs étaient experts de leur domaine, rarement de l'IA : nous apportions la conception du code, l'entraînement des modèles et l'usage du **supercalculateur Jean Zay** (jusqu'à 8 GPUs en DDP, Slurm, profiling PyTorch). **Plus de 10 projets** de 6 à 12 mois, deux en parallèle, pour Météo France, le CNES, le CEA, l'INEE et des universités.",
      note: "Ce que ce poste demandait : changer de domaine tous les six mois, expliquer à des chercheurs qui ne sont pas informaticiens, proposer des solutions plutôt qu'exécuter, et tenir tout le cycle, des données au déploiement.",
      groups: [
        {
          title: "Projets",
          items: [
            {
              id: "gens",
              name: "GENS et MetScore, Météo France",
              status: "Publié",
              text: "Un **modèle de diffusion pour générer** à moindre coût les membres d'une prévision d'ensemble, et la librairie de métriques qui l'évalue.",
              problem: "Pour représenter l'incertitude, Météo France calcule plusieurs membres de prévision en parallèle, et ce calcul coûte cher.",
              details: [
                "Phase 1, six mois : état de l'art jusqu'aux modèles de diffusion, un DDPM entraîné sans contexte sur les données AROME pour valider l'approche, puis conditionné par le contexte (bruit modifié à chaque étape, image de contexte concaténée, approche multimodale).",
                "Phase 2 : conception de MetScore, une librairie modulaire de **plus de 30 métriques météo** pilotée par une simple configuration YAML, là où chaque métrique vivait dans un script différent. Déployée sur Jean Zay, **toujours en production**.",
                "Entraînement multi-GPU et fine-tuning en PyTorch, échantillonnage DDIM. **Troisième auteur de l'article, AIES 2025**.",
              ],
              metrics: [{ id: "gens-compute", value: "-20 %", label: "de calcul sur le POC, pour une qualité égale ou meilleure que StyleGAN" }],
              links: ["aies"],
              stack: ["PyTorch", "DDPM", "DDIM", "Jean Zay", "DDP"],
            },
            {
              id: "deepfaune",
              name: "DeepFaune, CNRS et INEE",
              status: "Publié",
              text: "Reconnaître les espèces sur les images de pièges photographiques : **1,5 million d'images, 24 classes**.",
              problem: "Des écologues qui trient à la main des millions d'images de pièges photographiques.",
              details: [
                "Fine-tuning de YOLOv8, avec un **dataset très déséquilibré** : augmentation de données et oversampling des classes rares.",
                "Comparaison de toute la famille YOLO pour le meilleur compromis entre qualité et vitesse sur CPU ; tracking testé (DeepSORT) et écarté, trop lent.",
                "Pipeline d'inférence optimisée (batching, GPU quand il y en a, multi-CPU), et accompagnement de l'équipe sur Jean Zay.",
              ],
              metrics: [
                { id: "deepfaune-accuracy", value: "93 %", label: "de précision sur 24 espèces" },
                { id: "deepfaune-speed", value: "3 fois", label: "plus rapide en inférence" },
              ],
              links: ["deepfaune-paper"],
              stack: ["YOLOv8", "PyTorch", "Multi-GPU", "Slurm"],
            },
            {
              id: "bigsf",
              name: "BIGSF, CNES",
              status: "Open source",
              text: "**Tech lead** sur la refonte d'une librairie U-Net d'analyse d'images de filaments galactiques, devenue une **toolbox publique**.",
              problem: "Un code écrit par plusieurs doctorants successifs, difficile à faire évoluer.",
              details: [
                "Architecture pilotée par configuration YAML, avec des classes de base (BaseDataset, BaseModel) que chaque nouvelle expérience étend.",
                "Réimplémentation et évolution du code existant, tests et documentation.",
              ],
              stack: ["U-Net", "PyTorch", "MLflow", "configurable-cl"],
            },
            {
              id: "autofill",
              name: "AUTOFILL, CEA",
              text: "Compléter par l'IA des données de nanomatériaux coûteuses à mesurer, et passer d'une technique de mesure à l'autre.",
              problem: "Les mesures par lumière et par rayons X produisent des signaux 1D coûteux, qui ne couvrent pas tous les matériaux, tailles et formes.",
              details: [
                "Autoencodeurs (ResVAE) pour reconstruire les signaux, puis un PairVAE qui **traduit d'une technique à l'autre** (LES vers SAXS, et l'inverse).",
                "Conseil à l'équipe, qui n'était pas informaticienne, sur ses formats de données : passage à HDF5.",
                "Librairie paramétrable, réutilisable pour d'autres matériaux.",
              ],
              metrics: [{ id: "autofill-mae", value: "0,98", label: "d'erreur absolue moyenne" }],
              stack: ["PyTorch Lightning", "VAE", "HDF5", "MLflow"],
            },
            {
              id: "morphogan",
              name: "MORPHOGAN, Université de Lorraine",
              text: "Étudier la variation des motifs d'ailes de papillons dans l'espace latent d'un StyleGAN2.",
              details: [
                "Reprise et optimisation d'un code complexe, **réduction de la dette technique**.",
                "Exploration de l'espace latent pour suivre l'évolution des motifs au sein des espèces.",
                "Pipeline automatisée et conteneurisée.",
              ],
              stack: ["StyleGAN2", "PyTorch", "Slurm", "Docker"],
            },
            {
              name: "DNADNA, LISN",
              text: "Une librairie d'analyse génétique des populations par deep learning, rendue robuste pour ses utilisateurs.",
              details: [
                "Tests unitaires et CI, correction de bugs, fonctionnalités de reproductibilité.",
                "Réponse aux issues et aux besoins des utilisateurs sur GitLab.",
              ],
              stack: ["Python", "GitLab CI", "Jean Zay"],
            },
            {
              name: "Acousur",
              text: "Segmenter des parcelles forestières en Inde à partir d'images satellite Sentinel 1 et 2.",
              details: [
                "Une baseline U-Net, et la prise en main des données satellite avec GeoPandas.",
                "**Encadrement d'un stagiaire** sur la détection semi-supervisée avec YOLO.",
              ],
              stack: ["U-Net", "PyTorch", "GeoPandas"],
            },
            {
              name: "Formation « Introduction aux LLMs »",
              text: "Trois heures, créées et données à **environ 25 doctorants et chercheurs** du CNRS.",
              details: [
                "Mécanisme d'attention, encodeurs (BERT), décodeurs (GPT), modèles actuels (GPT, Llama) et modèles multimodaux.",
              ],
            },
          ],
        },
      ],
      footnote:
        "Aussi : DeepGrail (traduire du texte en grammaire pour détecter les fake news), MORE (apprentissage par renforcement sur des structures de protéines) et ASTANA (position humaine sur vidéo).",
    },
    {
      id: "agileo",
      org: "Agileo Automation",
      title: "Ingénieur logiciel, en alternance",
      place: "Montauban",
      dates: "Août 2020 à sept. 2021, 1 an",
      context:
        "Un an d'alternance pendant le master, dans une équipe de cinq ingénieurs en Scrum. C'est là que j'ai pris l'habitude de **poser l'architecture avant de coder**.",
      groups: [
        {
          items: [
            {
              id: "agileo-framework",
              name: "Framework de supervision de machines de production",
              text: "Superviser et piloter des machines robotisées de cuisson et de fabrication de semi-conducteurs.",
              details: [
                "Architecture orientée objet conçue en UML avant le code, en C#.",
                "Interfaces opérateur (IHM), CI/CD sous Azure DevOps.",
              ],
              stack: ["C#", "UML", "Azure DevOps", "Scrum"],
            },
          ],
        },
      ],
    },
  ],
  harnessHint: "Cliquez une couche pour voir ce qu'elle fait.",
  project: { more: "Voir le détail", less: "Replier", next: "Projet suivant :" },
  estimate: "estimé",
  education: [
    { title: "Master intelligence artificielle et reconnaissance des formes", school: "Université Paul Sabatier, IRIT", dates: "2019 à 2021" },
    { title: "Licence informatique", school: "Université Paul Sabatier, Toulouse III", dates: "2016 à 2019" },
  ],
  publications: [
    {
      name: "Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2",
      authors: "C. Brochet, G. Moldovan, **J. Rabault**, C. Regan, L. Raynaud",
      venue: "Artificial Intelligence for the Earth Systems (AIES), vol. 4, n° 1, 2025",
      text: "Troisième auteur. Issu du projet GENS avec Météo France.",
      url: "https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml",
    },
    {
      name: "The DeepFaune initiative: a collaborative effort towards the automatic identification of European fauna in camera trap images",
      venue: "Article peer-reviewed",
      text: "Co-auteur. Le modèle de reconnaissance d'espèces du projet DeepFaune.",
      url: "https://scholar.google.fr/citations?view_op=view_citation&hl=fr&user=iUFJqVMAAAAJ&citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C",
    },
  ],
  openSource: [
    {
      name: "LangChain",
      text: "Contribution mergée : l'intégration Mistral.",
      url: "https://github.com/langchain-ai/langchain/pull/37008",
      repo: "langchain-pr",
    },
    {
      name: "LLMock",
      text: "Serveur de mock LLM publié sur PyPI, plus de 10 fournisseurs.",
      url: "https://github.com/JulienRabault/LLMock",
      repo: "llmock",
    },
    {
      name: "DDPM-weather",
      text: "Modèle de diffusion pour images météo.",
      url: "https://github.com/JulienRabault/DDPM-weather",
      repo: "ddpm-weather",
    },
    {
      name: "uniqpath",
      text: "Utilitaire Python publié sur PyPI : des chemins de fichiers uniques par suffixe, UUID ou horodatage.",
      url: "https://github.com/JulienRabault/uniqpath",
      repo: "uniqpath",
    },
    {
      name: "BananaML",
      text: "Pipeline ML de bout en bout sur AWS : computer vision et API REST, FastAPI, Docker, CI/CD.",
      url: "https://github.com/JulienRabault/DaysToBananaDeath",
      repo: "bananaml",
    },
  ],
  skills: [
    {
      label: "Systèmes agentiques",
      items: [
        { name: "Harnais d'agents", detail: "boucle agentique, tool calling, middlewares, mémoire, human-in-the-loop" },
        { name: "LangChain, LangGraph, Deep Agents" },
        { name: "RAG et MCP" },
        { name: "Évaluation", detail: "golden sets, LLM-as-judge, A/B testing" },
        { name: "Multimodal", detail: "OCR, vision, audio" },
        { name: "Fine-tuning" },
      ],
    },
    {
      label: "Langages et données",
      items: [
        { name: "Python, PyTorch, FastAPI" },
        { name: "SQL, PostgreSQL, MongoDB" },
        { name: "Weaviate" },
        { name: "Hugging Face" },
        { name: "API Mistral et OpenAI" },
      ],
    },
    {
      label: "Infrastructure",
      items: [
        { name: "Docker, GitLab CI, AWS" },
        { name: "Celery, RabbitMQ, Airflow" },
        { name: "Langfuse" },
        { name: "Slurm, Linux" },
      ],
    },
  ],
  closing: "Une question plus précise ? L'agent du site répond à partir de ce parcours et cite ses sources.",
};

export const harnessFr: HarnessLayer[] = [
  { id: "loop", name: "Boucle agentique", text: "Le modèle choisit un outil, lit le résultat et recommence jusqu'à pouvoir répondre. **Une seule boucle pour tous les métiers**, au lieu d'un routeur qui aiguillait vers des agents figés." },
  { id: "context", name: "Contexte", text: "Le contexte est résumé et tenu dans un budget de tokens à chaque tour. Le préfixe commun est mis en cache et partagé entre conversations, tenants et clients : **-40 à -50 % de coûts d'inférence**, d'après mon estimation." },
  { id: "tools", name: "Outils", text: "RAG agentique, recherche web, calcul, skills, sous-agents et serveurs MCP, tous branchés sur la même boucle : **ajouter un outil ne demande plus de construire un graphe**. Les serveurs MCP des APIs métier sortent de MCP Builder, qui les génère avec un humain dans la boucle." },
  { id: "memory", name: "Mémoire", text: "Une mémoire persistante : ce qui a été établi dans une conversation reste disponible dans les suivantes." },
  { id: "guardrails", name: "Garde-fous", text: "Les contenus récupérés sont cloisonnés : **un document lu par l'agent ne peut pas lui donner d'ordres**. C'est la parade à l'injection de prompt indirecte." },
  { id: "hitl", name: "Validation humaine", text: "Les actions sensibles s'arrêtent et attendent l'accord de l'utilisateur avant de partir." },
  { id: "profile", name: "Profil", text: "Collectivités, juridique, industrie, RH publique : chaque profil configure la même boucle avec ses outils, ses consignes et ses droits." },
  { id: "eval", name: "Évaluation", text: "Autour de tout ça, Langfuse v4 : traces, golden sets, scoring automatique en LLM-as-judge. Chaque changement de modèle, de prompt ou d'architecture passe sur le même banc, avec le suivi des régressions et des coûts." },
];
