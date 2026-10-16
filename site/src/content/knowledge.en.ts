import type { Source } from "./types";

// What the agent knows, passage by passage, mirroring knowledge.fr.ts with the same ids.
// Facts from generate_cv_en.py, the old prompt and the old site (no client names, no career plans).
export const knowledgeEn: Record<string, Source> = {
  "bl": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "AI Engineer, Athena platform",
    text: "AI Engineer in Berger-Levrault's AI R&D team, in Toulouse. Athena is the group's agentic platform, wired into its clients' documents and business APIs (local government, healthcare, legal, industry, maintenance, public-sector HR): 100k documents, 6-month pilot with 70 users, production rollout under way. Athena went from POC to product and targets all of the group's clients. Needs gathered from business units and client workshops.",
  },
  "bl-harness": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Agent harness",
    text: "Architecture designed and owned by Julien (LangChain, LangGraph). Moved from a router (one agent per task) to a single agent loop configured per profile and extended through middleware: persistent memory, human approval of sensitive actions, context management (summarisation, token budget), guardrails, skills, sub-agents. Prompt caching shared across conversations, tenants and clients: inference costs cut by an estimated 40-50%. Julien led the redesign in workshops, but it was a team effort: skills, sub-agents, source citations, handling of documents uploaded by the user. Now migrating to Deep Agents.",
  },
  "bl-tools": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Agent tools",
    text: "Agentic RAG, web search, calculator and the matching MCP servers, all plugged into the same loop, with no graph per tool. Julien also added source citations to Athena's answers.",
  },
  "bl-eval": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Evaluation and monitoring",
    text: "Rebuilt monitoring on Langfuse v4 (traces, datasets, automated evaluations and scoring, LLM-as-judge), golden sets, model, prompt and architecture comparisons, regression and cost tracking. Sandboxing of retrieved content against indirect prompt injection. The goal: measure quality, catch hallucinations and avoid regressions as the architecture changes.",
  },
  "bl-mcp": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "MCP Builder",
    text: "Turns internal business APIs into MCP servers. An LLM selects the useful endpoints, audits their gaps (missing descriptions, AI-readiness) and generates purpose-built tools (workflows or Python code via FastMCP), human-in-the-loop: someone from the business unit reviews and completes them. Two goals: ship an MCP server quickly, and show teams the flaws in their APIs. Deployed: about twenty business units, around a hundred APIs, about 150 targeted. Model benchmark for generation: the chosen model is 4.1x faster and 3.2x cheaper.",
  },
  "bl-extract": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Content-extractor",
    text: "Multimodal extraction (OCR, PDF, DOCX, audio): FastAPI service built from scratch, 7 pipelines, async batch processing (Celery and the Mistral batch API), factory/registry architecture. Deployed, -50% on extraction costs. Julien also made the data pipeline more modular (configurable chunkers for the research team).",
  },
  "bl-templates": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Template agent",
    text: "Extracts templates from Word documents that a second agent fills from natural language. PDF preview, per-client activation, Angular interface. From prototype to V2, in production.",
  },
  "bl-hr-data": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "Business data structuring",
    text: "For public-sector HR: interview write-ups turned into normalised, deduplicated needs matched against a training catalogue. Demonstrator shown to stakeholders, industrialisation under way. Enriched RAG ingestion on Airflow: existing DAGs extended (chunking, embeddings, indexed questions), more than 5 DAGs, roughly one per client, across about ten clients.",
  },
  "bl-team": {
    org: "Berger-Levrault",
    period: "since Jan. 2026",
    title: "The team and the role",
    text: "On the applied side of the AI R&D team: 3 AI engineers including Julien, 1 designer, 1 DevOps. Working closely with the research team (1 manager, 1 researcher, 3 PhD students, one of them on hallucination reduction; GraphRAG). Tracked in Jira. Julien also worked on a voice API. What Julien likes about the role: R&D, touching everything (data, platform, agents, MCP) and seeing his services go to production.",
  },
  "cnrs": {
    org: "CNRS (PNRIA)",
    period: "Dec. 2021 to Jan. 2026",
    title: "Machine Learning Engineer",
    text: "Engineer embedded in research teams (weather, astrophysics, materials, ethology, biology): 10+ projects of 6 to 12 months, two in parallel, from requirements to delivery, for Météo France, CNES, CEA and INEE. Training and fine-tuning on the Jean Zay supercomputer (up to 8 GPUs with DDP, Slurm, PyTorch profiling).",
  },
  "cnrs-pnria": {
    org: "CNRS (PNRIA)",
    period: "Dec. 2021 to Jan. 2026",
    title: "The PNRIA network",
    text: "Julien was part of the network of about twenty engineers of France's national AI research programme, supporting research teams across the country, working with domain experts who were not necessarily computer scientists. What he took from it: a new field every six months, explaining to researchers, proposing solutions rather than just executing, and covering the whole cycle from data to deployment.",
  },
  "cnrs-gens": {
    org: "CNRS, for Météo France",
    period: "2021 to 2026",
    title: "GENS and MetScore",
    text: "A 12-month project in two phases. Goal: generate the members of an ensemble forecast, which are costly to compute, at lower cost. State of the art leading to diffusion models, a DDPM trained on AROME data then conditioned on context. Multi-GPU training and fine-tuning in PyTorch. Designed MetScore, a modular library of 30+ metrics driven by YAML configuration, deployed on Jean Zay and still in production. POC: quality equal to or better than StyleGAN with 20% less compute thanks to DDIM sampling. Third author, AIES 2025.",
  },
  "cnrs-deepfaune": {
    org: "CNRS, INEE",
    period: "2021 to 2026",
    title: "DeepFaune",
    text: "Species recognition on camera-trap images. Fine-tuned YOLOv8 on 1.5M images (24 classes) with class-imbalance handling (augmentation, oversampling), tracking tests (DeepSORT, too slow), YOLO model comparison for the CPU speed and quality trade-off, inference optimisation (batching, GPU, multi-CPU), support for the team on Jean Zay. 93% accuracy, 3x faster inference. Peer-reviewed publication.",
  },
  "cnrs-bigsf": {
    org: "CNRS, for CNES",
    period: "2021 to 2026",
    title: "BIGSF",
    text: "Tech lead on the rebuild of a U-Net library for galactic filament image analysis, originally written by several PhD students: YAML-driven architecture, base classes, reimplementation of the existing code. Public toolbox.",
  },
  "cnrs-autofill": {
    org: "CNRS, for CEA",
    period: "2021 to 2026",
    title: "AUTOFILL",
    text: "Completing nanomaterial characterisation signals that are costly to measure. Autoencoders (ResVAE) to reconstruct the signals, then a PairVAE to translate from one measurement technique to another (LES and SAXS). 0.98 MAE. Advised the team on data formats (HDF5).",
  },
  "cnrs-morphogan": {
    org: "CNRS, Université de Lorraine",
    period: "2021 to 2026",
    title: "MORPHOGAN",
    text: "Studying butterfly wing patterns with StyleGAN2: rebuilt a complex codebase, reduced technical debt, explored the latent space, automated and containerised pipeline.",
  },
  "cnrs-others": {
    org: "CNRS (PNRIA)",
    period: "2021 to 2026",
    title: "Other projects",
    text: "DNADNA (LISN): a deep learning library for population genetics, with tests, CI and reproducibility, handling user issues on GitLab. Acousur: forest plot segmentation in India from Sentinel 1 and 2 imagery, U-Net baseline, mentoring an intern on YOLO. Also DeepGrail (text to grammar translation for fake news detection), MORE (reinforcement learning on protein structures) and ASTANA (human pose on video).",
  },
  "cnrs-course": {
    org: "CNRS",
    period: "2021 to 2026",
    title: "LLM course",
    text: "Created and taught \"Introduction to LLMs\", a 3-hour course, to about 25 PhD students and researchers: attention, encoders (BERT), decoders (GPT), current models (GPT, Llama), multimodal models.",
  },
  "agileo": {
    org: "Agileo Automation",
    period: "Aug. 2020 to Sept. 2021",
    title: "Software Engineer",
    text: "Work-study in Montauban, alongside the master's degree. Supervision and control framework for robotic machines used in semiconductor baking and fabrication: C#, HMI, CI/CD (Azure DevOps), team of 5 in Scrum. That is where Julien got into the habit of laying out the architecture in UML before writing code.",
  },
  "education": {
    org: "Université Paul Sabatier",
    period: "2016 to 2021",
    title: "Education",
    text: "MSc Artificial Intelligence and Pattern Recognition, Université Paul Sabatier and IRIT (2019 to 2021): deep learning, vision, NLP. BSc Computer Science, same university (2016 to 2019), which taught him to reason as a computer scientist (algorithms, data structures, complexity) rather than to learn languages.",
  },
  "publications": {
    org: "Publications",
    period: "2025",
    title: "Two peer-reviewed papers",
    text: "\"Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2\", Artificial Intelligence for the Earth Systems (AIES), vol. 4 no. 1, 2025, third author. \"The DeepFaune initiative: automatic identification of European fauna\", co-author.",
  },
  "open-source": {
    org: "Open source",
    period: "",
    title: "LangChain, LLMock, uniqpath, BananaML, DDPM-weather",
    text: "Merged contribution to LangChain (Mistral integration). Four personal projects, three of them on PyPI. LLMock: LLM mock server, 10+ providers, OpenAI-compatible, to test retries, fallbacks and rate limiting without spending tokens. uniqpath: unique file paths (incremental suffixes, UUID, timestamps). BananaML: end-to-end ML pipeline on AWS, computer vision and REST API (FastAPI, Docker, CI/CD). DDPM-weather: diffusion to denoise weather images, -20% resources.",
  },
  "skills": {
    org: "Skills",
    period: "",
    title: "Stack",
    text: "Agentic systems: agent harnesses (agent loop, tool calling, middleware, memory, human-in-the-loop), LangChain, LangGraph, Deep Agents, RAG, GraphRAG, MCP, Structured Outputs, evals (golden sets, LLM-as-judge, A/B testing), multimodal (OCR, vision, audio), fine-tuning. Languages and data: Python, PyTorch, PyTorch Lightning, scikit-learn, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, GeoPandas, HDF5, Hugging Face, Mistral and OpenAI APIs, C#. Infrastructure: Docker, Singularity, Conda, GitLab CI, AWS, Celery, RabbitMQ, Airflow, MLFlow, Langfuse, Slurm, Linux.",
  },
  "mobility": {
    org: "Availability",
    period: "2026",
    title: "Location",
    text: "Based in Toulouse, open to Paris, remote and Canada. For a specific role, a start date or salary: email him directly.",
  },
  "site": {
    org: "This site",
    period: "2026",
    title: "How this chat works",
    text: "A Cloudflare Worker and a single call to a Claude model, with the whole background in context and cached: no RAG and no tools, the background fits in a few thousand tokens. Every fact must cite a passage; before anything reaches the browser, the worker strips invented citations, raw links and unknown widgets. Visitor quota and daily budget are checked before the call. The conversation history is signed by the worker, so nobody can put words in its mouth. Interface built with React, shadcn/ui, AI Elements, Motion and Paper Shaders.",
  },
  "hobby": {
    org: "Outside work",
    period: "",
    title: "League of Legends",
    text: "His best League of Legends rank: Emerald 3.",
  },
};
