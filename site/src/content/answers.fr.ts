import type { CannedAnswer } from "./types";

// Sans autre import : le worker lit ce fichier tel quel pour reprendre une réponse servie par le site.
export const suggestionsFr: string[] = [
  "Sur quoi travaille Julien en ce moment ?",
  "Résume son parcours",
  "Comment ce chat est-il construit ?",
  "Peut-il travailler depuis Paris ou le Canada ?",
];

// L'ordre compte : la première réponse dont un mot apparaît dans la question gagne.
export const answersFr: CannedAnswer[] = [
  {
    match: ["paris", "canada", "remote", "mobilité", "mobilite", "déménager", "montréal"],
    read: ["mobility"],
    text: "Oui. Il est basé à Toulouse et ouvert à Paris, au remote et au Canada [[mobility]]. Le plus simple pour en parler est de lui écrire.\n\n{{contact}}",
  },
  {
    match: ["contact", "joindre", "email", "mail", "écrire"],
    read: ["mobility"],
    text: "Le plus direct est l'email, il répond lui-même. Le CV et ses profils sont là aussi [[mobility]].\n\n{{contact}}",
  },
  {
    match: ["chat", "site", "construit", "marche"],
    read: ["site", "bl-harness"],
    text: "Simplement, et c'est voulu : un worker Cloudflare, un seul appel à un modèle Claude, tout le parcours en contexte et mis en cache. Pas de RAG ni d'outils : le parcours tient en quelques milliers de tokens, un index vectoriel coûterait plus qu'il ne rapporterait [[site]].\n\nLa sécurité se joue autour du modèle. Chaque fait doit citer un passage, et le worker retire avant votre navigateur les citations inventées, les liens bruts et les widgets inconnus. L'historique est signé : on ne peut pas lui prêter des réponses qu'il n'a pas données [[site]].\n\nLes agents que Julien construit au travail sont plus lourds : une boucle agentique entourée de middlewares, chacun ajoutant un comportement sans toucher à la boucle [[bl-harness]]. Cliquez une couche pour voir ce qu'elle fait.\n\n{{harness}}",
  },
  {
    match: ["parcours", "résume", "resume", "carrière", "carriere"],
    read: ["education", "agileo", "cnrs", "publications", "bl", "cnrs-pnria"],
    text: "Dix ans entre l'informatique et l'IA, en trois temps [[education]].\n\n- **Formation et premier poste.** Une licence informatique puis un master IA et reconnaissance des formes à l'Université Paul Sabatier. Pendant le master, un an d'alternance chez Agileo Automation, sur un framework de supervision de machines robotisées, en C# et en Scrum [[agileo]].\n- **Quatre ans de deep learning au CNRS.** Ingénieur du réseau PNRIA, il a mené plus de 10 projets de 6 à 12 mois avec des équipes de recherche, pour Météo France, le CNES, le CEA et l'INEE, avec de l'entraînement multi-GPU sur le supercalculateur Jean Zay [[cnrs]]. Deux articles peer-reviewed en sont sortis, dont un dans AIES en 2025 [[publications]].\n- **Des agents LLM en production depuis janvier 2026.** Chez Berger-Levrault, il conçoit le harnais d'Athena, la plateforme agentique du groupe : 100k documents, un pilote de six mois avec 70 utilisateurs, une mise en production en cours [[bl]].\n\n{{timeline}}\n\nLe fil rouge : arriver sur un métier qu'il ne connaît pas, le comprendre avec les gens du terrain et couvrir tout le cycle, des données au déploiement [[cnrs-pnria]].\n\nLa version longue, avec les résultats chiffrés, est sur {{link:career}}. Le PDF : {{link:cv}}.",
  },
  {
    match: ["open source", "github", "dépôt", "depot", "code", "llmock", "langchain"],
    read: ["open-source"],
    text: "Son code public le plus utile est LLMock, publié sur PyPI : un serveur qui imite plus de 10 fournisseurs de LLM avec une API compatible OpenAI, pour tester une application sans payer d'appels [[open-source]].\n\n{{repo:llmock}}\n\nIl a aussi une contribution fusionnée dans LangChain, l'intégration Mistral [[open-source]].\n\n{{repo:langchain-pr}}",
  },
  {
    match: ["mcp", "api", "outil"],
    read: ["bl-mcp", "bl-tools"],
    text: "Chez Berger-Levrault, les APIs métier existent déjà, mais un agent ne sait pas s'en servir telles quelles. MCP Builder les transforme en serveurs MCP : un LLM choisit les endpoints utiles, relève ce qui leur manque et génère les tools, puis une personne de la business unit valide [[bl-mcp]].\n\n{{project:mcp-builder}}\n\nCes serveurs tournent sur la même boucle que le RAG agentique et la recherche web : ajouter un outil ne demande plus de construire un graphe [[bl-tools]].",
  },
  {
    match: ["évalue", "evalue", "évaluation", "qualité", "eval"],
    read: ["bl-eval", "cnrs-gens"],
    text: "Avec des golden sets et du scoring automatique en LLM-as-judge, sous Langfuse v4. Chaque changement de modèle, de prompt ou d'architecture passe sur le même banc, avec le suivi des régressions et des coûts [[bl-eval]].\n\nIl cloisonne aussi les contenus récupérés par l'agent, pour qu'un document ne puisse pas lui donner d'instructions (injection de prompt indirecte) [[bl-eval]].\n\nL'habitude vient du CNRS : pour Météo France, il avait conçu MetScore, une librairie de métriques toujours en production [[cnrs-gens]].",
  },
  {
    match: ["jean zay", "entraîné", "entraine", "gpu", "supercalculateur"],
    read: ["cnrs", "cnrs-gens", "cnrs-deepfaune"],
    text: "Au CNRS, il a mené plus de 10 projets avec des équipes de recherche, avec de l'entraînement multi-GPU sur Jean Zay (DDP, Slurm) [[cnrs]].\n\nPour Météo France, un modèle de diffusion (DDPM) en PyTorch. La preuve de concept réduisait le calcul de 20 % à qualité équivalente, et le travail a donné un article dans AIES en 2025 [[cnrs-gens]].\n\n{{project:gens}}\n\nPour DeepFaune, un YOLOv8 fine-tuné sur 1,5 million d'images de pièges photo : 93 % de précision sur 24 classes, et une inférence trois fois plus rapide [[cnrs-deepfaune]].\n\n{{project:deepfaune}}",
  },
  {
    match: ["moment", "actuel", "travaille"],
    read: ["bl", "bl-harness", "bl-eval"],
    text: "Sur Athena, la plateforme agentique de Berger-Levrault, branchée sur 100k documents et sur les APIs métier des clients. Un pilote de six mois a réuni 70 utilisateurs et la mise en production est en cours [[bl]].\n\nIl en a conçu le harnais : une seule boucle agentique, configurée par profil et étendue par middlewares. Le prompt caching partagé entre conversations, tenants et clients réduirait les coûts d'inférence de 40 à 50 %, d'après son estimation. Il migre en ce moment vers Deep Agents [[bl-harness]].\n\n{{harness}}\n\nIl a aussi refait le monitoring sous Langfuse v4, pour comparer modèles, prompts et architectures sur les mêmes golden sets [[bl-eval]]. Le détail est dans {{link:career-bl}}.",
  },
];
