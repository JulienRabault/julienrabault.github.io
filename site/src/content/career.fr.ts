import type { CareerContent, HarnessLayer } from "./types";

// Faits repris de generate_cv.py. Ne pas ajouter de chiffre absent du CV.
export const careerFr: CareerContent = {
  title: "Ingénieur IA, agents LLM et RAG en production",
  summary:
    "Je conçois des harnais agentiques et je mets en production des agents LLM et des systèmes RAG chez des clients, après quatre ans de deep learning sur supercalculateur au CNRS (PyTorch, multi-GPU). Deux publications peer-reviewed.",
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
  },
  chapters: [
    {
      id: "bl",
      org: "Berger-Levrault",
      title: "AI Engineer",
      place: "Toulouse, équipe R&D IA",
      dates: "Janv. 2026 à aujourd'hui",
      context:
        "Athena est la plateforme agentique de Berger-Levrault, branchée sur les documents et les APIs métier de ses clients : collectivités, santé, juridique, industrie, maintenance, RH publique. Passée du POC au produit : 100k documents, un pilote de six mois avec 70 utilisateurs, une mise en production en cours. Les besoins viennent des business units et d'ateliers clients. Je travaille sur toute la chaîne, de l'architecture agentique au déploiement chez le client, souvent sur des métiers que je ne connaissais pas la veille.",
      groups: [
        {
          title: "Cœur de la plateforme",
          items: [
            {
              name: "Harnais agentique",
              text: "J'ai conçu et je porte l'architecture de l'agent (LangChain, LangGraph). Avant, un routeur envoyait chaque tâche vers un agent dédié. Maintenant, une seule boucle agentique, configurée par profil et étendue par des middlewares. Migration en cours vers Deep Agents.",
              widget: "harness",
              metrics: [
                {
                  id: "inference-cost", value: "-40 à -50 %",
                  label: "de coûts d'inférence, avec un prompt caching partagé entre conversations, tenants et clients",
                  estimate: true,
                },
              ],
            },
            {
              name: "Outils de l'agent",
              text: "RAG agentique, recherche web, calcul et serveurs MCP, tous sur la même boucle. Ajouter un outil ne demande plus de construire un graphe.",
            },
            {
              id: "agent-evals",
              status: "En place",
              problem: "Une plateforme agentique en production doit être mesurable et ne pas exécuter n'importe quoi.",
              stack: ["Langfuse", "LLM-as-judge", "Golden sets", "Injection de prompt"],
              name: "Évaluation et monitoring",
              text: "Refonte du monitoring sous Langfuse v4 : traces, datasets, évaluations et scoring automatiques en LLM-as-judge. Des golden sets pour comparer modèles, prompts et architectures, avec le suivi des régressions et des coûts. Les contenus récupérés sont cloisonnés contre l'injection de prompt indirecte.",
            },
            {
              id: "mcp-builder",
              status: "Déployé",
              problem: "Une centaine d'APIs internes, réparties entre une vingtaine de business units, à brancher sur les agents sans leur exposer une surface ingérable.",
              stack: ["OpenAPI", "FastMCP", "MCP", "Python", "Human-in-the-loop"],
              metrics: [
                { id: "mcp-apis", value: "~100", label: "APIs internes transformées en serveurs MCP, déployé" },
                { id: "mcp-model", value: "4,1× et 3,2×", label: "plus rapide et moins cher : le modèle retenu sur banc d'essai" },
              ],
              name: "MCP Builder",
              text: "Transforme les APIs métier internes en serveurs MCP. Un LLM choisit les endpoints utiles, audite leurs lacunes et génère des tools sur mesure (workflows ou code Python via FastMCP), avec un humain dans la boucle.",
            },
          ],
        },
        {
          title: "Services et pipelines LLM",
          items: [
            {
              id: "content-extractor",
              status: "Déployé",
              problem: "Le service d'extraction d'origine était simple, peu modulable, et chaque appel LLM coûtait cher sur de gros volumes de documents.",
              stack: ["FastAPI", "Celery", "API batch Mistral", "OCR", "Python"],
              name: "Content-extractor",
              text: "Extraction multimodale (OCR, PDF, DOCX, audio) : un service FastAPI créé de zéro, 7 pipelines, traitement par lots asynchrone (Celery et l'API batch de Mistral), architecture factory/registry. Déployé.",
              metrics: [{ id: "extraction-cost", value: "-50 %", label: "sur les coûts d'extraction" }],
            },
            {
              id: "templates-agent",
              status: "En production",
              problem: "Des rapports métier longs, rédigés à la main sur des trames imposées.",
              stack: ["Python", "FastAPI", "Angular", "TypeScript"],
              name: "Agent de templates",
              text: "Extrait des templates de documents Word, qu'un second agent remplit champ par champ en langage naturel. Aperçu PDF navigable, activation par client, interface Angular. Du prototype à la V2 en production.",
            },
            {
              id: "hr-data",
              status: "Démonstrateur",
              problem: "Construire les plans de formation du secteur public à partir des entretiens annuels, un métier que Julien découvrait.",
              stack: ["Python", "Structured outputs", "Matching", "Airflow"],
              name: "Plans de formation et ingestion RAG",
              text: "Automatiser les plans de formation du secteur public, un métier que je découvrais : besoins extraits des entretiens annuels, normalisés, dédoublonnés, regroupés entre collaborateurs et rapprochés du catalogue de formations. Démonstrateur présenté aux parties prenantes, industrialisation en cours. En équipe, l'ingestion RAG sous Airflow : plus de 5 DAGs, à peu près un par client, enrichis par chunking, embeddings et questions indexées.",
            },
          ],
        },
      ],
    },
    {
      id: "cnrs",
      org: "CNRS (PNRIA)",
      title: "Machine Learning Engineer",
      place: "Toulouse",
      dates: "Déc. 2021 à janv. 2026, 4 ans",
      context:
        "Ingénieur intégré aux équipes de recherche (météo, astrophysique, matériaux, éthologie, biologie) : plus de 10 projets de 6 à 12 mois, deux en parallèle, du recueil du besoin à la livraison, pour Météo France, le CNES, le CEA et l'INEE. Entraînement et fine-tuning sur le supercalculateur Jean Zay (multi-GPU DDP, Slurm). J'y ai aussi créé une formation d'introduction aux LLMs, donnée à 25 doctorants.",
      groups: [
        {
          title: "Sélection de projets",
          items: [
            {
              id: "gens",
              status: "Publié",
              problem: "Météo France représente l'incertitude par plusieurs membres de prévision calculés en parallèle, et ce calcul coûte cher.",
              stack: ["PyTorch", "DDPM", "DDIM", "Jean Zay", "DDP"],
              links: ["aies"],
              name: "GENS et MetScore, pour Météo France",
              text: "Entraînement multi-GPU et fine-tuning d'un modèle de diffusion (DDPM) en PyTorch. Conception de MetScore, une librairie de métriques toujours en production. Co-auteur de l'article, AIES 2025.",
              metrics: [{ id: "gens-compute", value: "-20 %", label: "de calcul sur le POC, pour une qualité égale ou meilleure que StyleGAN" }],
            },
            {
              id: "deepfaune",
              status: "Publié",
              problem: "Reconnaître automatiquement les espèces sur les images des pièges photographiques : 1,5 million d'images, 24 classes.",
              stack: ["YOLOv8", "PyTorch", "Multi-GPU", "Slurm"],
              links: ["deepfaune-paper"],
              name: "DeepFaune, CNRS et INEE",
              text: "Fine-tuning de YOLOv8 sur 1,5 million d'images, 24 classes, avec gestion du déséquilibre de classes. Publication peer-reviewed.",
              metrics: [
                { id: "deepfaune-accuracy", value: "93 %", label: "de précision" },
                { id: "deepfaune-speed", value: "3 fois", label: "plus rapide en inférence" },
              ],
            },
            {
              id: "bigsf",
              status: "Open source",
              problem: "Un code d'analyse d'images de filaments galactiques, écrit par plusieurs doctorants, difficile à faire évoluer.",
              stack: ["U-Net", "PyTorch", "MLflow"],
              name: "BIGSF, pour le CNES",
              text: "Tech lead sur la refonte d'une librairie U-Net d'analyse d'images galactiques, devenue une toolbox publique.",
            },
            {
              id: "autofill",
              problem: "Les signaux de caractérisation des nanomatériaux coûtent cher à mesurer et ne couvrent pas tous les matériaux.",
              stack: ["PyTorch Lightning", "VAE", "HDF5", "MLflow"],
              metrics: [{ id: "autofill-mae", value: "0,98", label: "d'erreur absolue moyenne" }],
              name: "AUTOFILL, pour le CEA",
              text: "Un PairVAE pour compléter des données de nanomatériaux (MAE 0,98).",
            },
            {
              id: "morphogan",
              problem: "Étudier comment les motifs des ailes de papillons varient au sein d'une espèce.",
              stack: ["StyleGAN2", "PyTorch", "Slurm", "Docker"],
              name: "MORPHOGAN, Université de Lorraine",
              text: "Refonte d'un code StyleGAN2, avec une pipeline automatisée et conteneurisée.",
            },
          ],
        },
      ],
    },
    {
      id: "agileo",
      org: "Agileo Automation",
      title: "Ingénieur logiciel",
      place: "Montauban",
      dates: "Août 2020 à sept. 2021, 1 an",
      groups: [
        {
          items: [
            {
              id: "agileo-framework",
              problem: "Superviser et piloter des machines robotisées de fabrication de semi-conducteurs.",
              stack: ["C#", "IHM", "Azure DevOps", "Scrum"],
              name: "Framework de supervision de machines de production",
              text: "Pour l'industrie des semi-conducteurs : C#, IHM, CI/CD, dans une équipe de 5 en Scrum.",
            },
          ],
        },
      ],
    },
  ],
  harnessHint: "Cliquez une couche pour voir ce qu'elle fait.",
  project: { problem: "Le problème", results: "Résultats", stack: "Stack" },
  estimate: "estimé",
  education: [
    { title: "Master intelligence artificielle et reconnaissance des formes", school: "Université Paul Sabatier, IRIT", dates: "2019 à 2021" },
    { title: "Licence informatique", school: "Université Paul Sabatier, Toulouse III", dates: "2016 à 2019" },
  ],
  publications: [
    {
      name: "Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2",
      text: "AIES 2025, peer-reviewed. Co-auteur, issu du projet GENS avec Météo France.",
      url: "https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml",
    },
    {
      name: "The DeepFaune initiative: automatic identification of European fauna",
      text: "Peer-reviewed. Le modèle de reconnaissance d'espèces du projet DeepFaune.",
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
      text: "Harnais d'agents (boucle agentique, tool calling, middlewares, mémoire, human-in-the-loop), LangChain, LangGraph, Deep Agents, RAG, MCP, evals (golden sets, LLM-as-judge, A/B testing), multimodal (OCR, vision, audio), fine-tuning",
    },
    {
      label: "Langages et données",
      text: "Python, PyTorch, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, API Mistral et OpenAI",
    },
    {
      label: "Infrastructure",
      text: "Docker, GitLab CI, AWS, Celery, RabbitMQ, Airflow, Langfuse, Slurm, Linux",
    },
  ],
  closing: "Une question plus précise ? L'agent du site répond à partir de ce parcours et cite ses sources.",
};

export const harnessFr: HarnessLayer[] = [
  { id: "loop", name: "Boucle agentique", text: "Le modèle choisit un outil, lit le résultat et recommence jusqu'à pouvoir répondre. Une seule boucle pour tous les métiers, au lieu d'un routeur qui aiguillait vers des agents figés." },
  { id: "context", name: "Contexte", text: "Le contexte est résumé et tenu dans un budget de tokens à chaque tour. Le préfixe commun est mis en cache et partagé entre conversations, tenants et clients : -40 à -50 % de coûts d'inférence, d'après mon estimation." },
  { id: "tools", name: "Outils", text: "RAG agentique, recherche web, calcul, skills, sous-agents et serveurs MCP, tous branchés sur la même boucle : ajouter un outil ne demande plus de construire un graphe. Les serveurs MCP des APIs métier sortent de MCP Builder, qui les génère avec un humain dans la boucle." },
  { id: "memory", name: "Mémoire", text: "Une mémoire persistante : ce qui a été établi dans une conversation reste disponible dans les suivantes." },
  { id: "guardrails", name: "Garde-fous", text: "Les contenus récupérés sont cloisonnés : un document lu par l'agent ne peut pas lui donner d'ordres. C'est la parade à l'injection de prompt indirecte." },
  { id: "hitl", name: "Validation humaine", text: "Les actions sensibles s'arrêtent et attendent l'accord de l'utilisateur avant de partir." },
  { id: "profile", name: "Profil", text: "Collectivités, juridique, industrie, RH publique : chaque profil configure la même boucle avec ses outils, ses consignes et ses droits." },
  { id: "eval", name: "Évaluation", text: "Autour de tout ça, Langfuse v4 : traces, golden sets, scoring automatique en LLM-as-judge. Chaque changement de modèle, de prompt ou d'architecture passe sur le même banc, avec le suivi des régressions et des coûts." },
];
