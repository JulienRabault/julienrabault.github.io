import type { CareerContent, HarnessLayer } from "./types";

// Facts taken from the CV (generate_cv_en.py) and Julien's own account (the agent's former prompt). Do not add any figure missing from these sources.
export const careerEn: CareerContent = {
  title: "AI engineer, LLM agents and RAG in production",
  summary:
    "I design **agent harnesses** and ship LLM agents and RAG systems that run in production at customer sites, after **four years of deep learning** on a national supercomputer at CNRS (PyTorch, multi-GPU). Two peer-reviewed publications.",
  askAgent: "Ask the agent",
  timeline: [
    { id: "bl", kind: "work", current: true, org: "Berger-Levrault", role: "AI Engineer, Athena agent platform", dates: "since Jan. 2026", target: "bl" },
    { id: "cnrs", kind: "work", org: "CNRS (PNRIA)", role: "Machine Learning Engineer, 10+ research projects", dates: "Dec. 2021 to Jan. 2026", target: "cnrs" },
    { id: "agileo", kind: "work", org: "Agileo Automation", role: "Software engineer, work-study", dates: "Aug. 2020 to Sept. 2021", target: "agileo" },
    { id: "master", kind: "school", org: "Université Paul Sabatier", role: "MSc in AI and pattern recognition", dates: "2019 to 2021", target: "formation" },
    { id: "licence", kind: "school", org: "Université Paul Sabatier", role: "BSc in computer science", dates: "2016 to 2019", target: "formation" },
  ],
  labels: {
    experience: "Experience",
    education: "Education",
    publications: "Publications",
    openSource: "Open source",
    skills: "Skills",
    nav: "Career contents",
  },
  chapters: [
    {
      id: "bl",
      org: "Berger-Levrault",
      title: "AI Engineer",
      place: "Toulouse, AI R&D team",
      dates: "Jan. 2026 to present",
      context:
        "Athena is Berger-Levrault's agent platform, connected to its customers' documents and business APIs: local government, healthcare, legal, industry, maintenance, public-sector HR. I joined at the proof-of-concept stage; it now holds **100k documents**, has run **a six-month pilot with 70 users**, and is moving to production. I work across the whole chain, from workshops with the business units to deployment at the customer, often in fields that are new to me.",
      note: "On the product side, three AI engineers, a designer and a DevOps engineer; on the research side, a manager, a researcher and three PhD students, with whom we share the GraphRAG and hallucination work.",
      groups: [
        {
          title: "The agent platform",
          items: [
            {
              name: "Athena's agent harness",
              status: "In production",
              text: "**A single agent loop**, configured per profile and extended through middlewares, in place of a router over fixed agents.",
              details: [
                "Before: a router sent each question to a dedicated agent (RAG, MCP APIs, reports). Every new need meant a new graph.",
                "After: one loop picks its own tools, skills and sub-agents. **I designed this architecture** and lead it, in workshops with the team, on LangChain and LangGraph.",
                "Middlewares add persistent memory, human approval of sensitive actions, context summarisation under a token budget, guardrails and a shared event contract.",
                "**Both architectures run side by side in production** and go through the same evaluation bench. Migration to Deep Agents under way.",
              ],
              widget: "harness",
              metrics: [
                {
                  id: "inference-cost", value: "-40 to -50%",
                  label: "inference cost, from prompt caching shared across conversations, tenants and customers",
                  estimate: true,
                },
              ],
              stack: ["LangChain", "LangGraph", "Deep Agents", "Python"],
            },
            {
              name: "Tools and sourced answers",
              text: "Agentic RAG, web search, calculation and MCP servers on the same loop, with **the source cited in every answer**.",
              details: [
                "Every tool plugs into the loop: adding one **no longer means building a graph**.",
                "Inline source citations, so users can check where each statement comes from.",
                "Support for documents users upload during the conversation.",
              ],
              stack: ["RAG", "MCP", "Weaviate"],
            },
            {
              id: "agent-evals",
              name: "Evaluation, monitoring and security",
              status: "In place",
              text: "An evaluation bench on Langfuse v4: **every change of model, prompt or architecture is measured** before it reaches production.",
              problem: "An agent platform in production has to be measurable, and must not execute just anything.",
              details: [
                "Rebuilt monitoring on Langfuse v4: usable traces, datasets, automatic evaluation and LLM-as-judge scoring.",
                "Golden sets of questions and expected answers, to compare models, prompts and architectures and track regressions and cost.",
                "Security: retrieved content is **isolated against indirect prompt injection**, and tool execution is bounded (timeouts, permissions per agent profile).",
              ],
              stack: ["Langfuse", "LLM-as-judge", "Golden sets"],
            },
            {
              id: "mcp-builder",
              name: "MCP Builder",
              status: "Deployed",
              text: "Turns **internal business APIs into agent-ready MCP servers**, with a **domain expert in the loop**.",
              problem: "**About a hundred internal APIs**, spread across some twenty business units, to connect to the agents.",
              details: [
                "An LLM selects the useful endpoints, audits their gaps (missing descriptions, AI-readiness) and **generates purpose-built tools**: workflows, or Python code through FastMCP.",
                "Someone from the business unit reviews and completes the result: domain knowledge stays with the people who have it.",
                "Two outcomes: a business unit **ships its MCP server quickly**, and **sees the flaws in its own APIs**. Mapping in progress, about 150 APIs targeted.",
              ],
              metrics: [
                { id: "mcp-apis", value: "~100", label: "internal APIs turned into MCP servers" },
                { id: "mcp-model", value: "4.1× and 3.2×", label: "faster and cheaper: the model chosen on the benchmark for generation" },
              ],
              stack: ["FastMCP", "MCP", "OpenAPI", "Python"],
            },
          ],
        },
        {
          title: "LLM services and pipelines",
          items: [
            {
              id: "content-extractor",
              name: "Content-extractor",
              status: "Deployed",
              text: "The platform's multimodal extraction service, **rebuilt from scratch**: OCR, images, PDF, DOCX and audio.",
              problem: "At the start, a simple image extractor that was hard to extend, and costly LLM calls over large document volumes.",
              details: [
                "FastAPI service redesigned from scratch: **7 extraction pipelines** behind a factory/registry architecture, so a new format is added without touching the rest.",
                "**Asynchronous batch processing** with Celery and Mistral's batch API, where each document used to make a synchronous call.",
                "Configurable chunkers in the data pipeline, so the research team can compare chunking approaches.",
              ],
              metrics: [{ id: "extraction-cost", value: "-50%", label: "extraction cost" }],
              stack: ["FastAPI", "Celery", "Mistral batch API", "OCR"],
            },
            {
              id: "templates-agent",
              name: "Templates agent",
              status: "In production",
              text: "One agent reads Word documents and extracts templates; a second fills them from natural language.",
              problem: "Long business reports, written by hand on mandatory layouts.",
              details: [
                "Word-reading tools to extract a template's fields, then a second agent and its tools to fill them from a natural-language request.",
                "PDF preview, per-customer activation, Angular interface.",
                "From prototype to V2, **now in production**.",
              ],
              stack: ["Python", "FastAPI", "Angular"],
            },
            {
              id: "hr-data",
              name: "Training plans and RAG ingestion",
              status: "Demonstrator",
              text: "From public-sector annual reviews to training plans, then each customer's RAG ingestion on Airflow.",
              problem: "Building public-sector training plans from annual review notes, a field I did not know.",
              details: [
                "**LLM chain designed from scratch**: needs extracted from the reviews, normalised, deduplicated, grouped across employees, then matched against a training catalogue (structured outputs). Demonstrator shown to stakeholders, industrialisation under way.",
                "As a team, RAG ingestion on Airflow: **one DAG per customer** (PDFs, manuals, work orders, machine documentation), enriched by data augmentation, chunking, embeddings, generated and indexed questions and keywords, and time filters.",
              ],
              stack: ["Structured outputs", "Airflow", "Embeddings"],
            },
          ],
        },
      ],
      footnote: "Also: integrating a voice API into the platform.",
    },
    {
      id: "cnrs",
      org: "CNRS (PNRIA)",
      title: "Machine Learning Engineer",
      place: "Toulouse",
      dates: "Dec. 2021 to Jan. 2026, 4 years",
      context:
        "I was one of the **twenty engineers** of France's national AI research programme, provided free of charge to research labs across the country. The researchers were experts in their field, rarely in AI: we brought the code design, model training and use of the **Jean Zay supercomputer** (up to 8 GPUs with DDP, Slurm, PyTorch profiling). **More than 10 projects** of 6 to 12 months, two at a time, for Météo France, CNES, CEA, INEE and universities.",
      note: "What the job required: switching fields every six months, explaining to researchers who are not computer scientists, proposing solutions rather than executing, and owning the whole cycle, from data to deployment.",
      groups: [
        {
          title: "Projects",
          items: [
            {
              id: "gens",
              name: "GENS and MetScore, Météo France",
              status: "Published",
              text: "A **diffusion model to generate** ensemble forecast members at lower cost, and the metrics library that evaluates it.",
              problem: "To represent uncertainty, Météo France computes several forecast members in parallel, and that computation is expensive.",
              details: [
                "Phase 1, six months: a literature review that led to diffusion models, an unconditional DDPM trained on AROME data to validate the approach, then conditioned on context (noise modified at each step, context image concatenated, multimodal approach).",
                "Phase 2: designed MetScore, a modular library of **30+ weather metrics** driven by a single YAML configuration, where each metric used to live in a separate script. Deployed on Jean Zay, **still in production**.",
                "Multi-GPU training and fine-tuning in PyTorch, DDIM sampling. **Third author of the paper, AIES 2025**.",
              ],
              metrics: [{ id: "gens-compute", value: "-20%", label: "compute on the proof of concept, with quality equal to or better than StyleGAN" }],
              links: ["aies"],
              stack: ["PyTorch", "DDPM", "DDIM", "Jean Zay", "DDP"],
            },
            {
              id: "deepfaune",
              name: "DeepFaune, CNRS and INEE",
              status: "Published",
              text: "Recognising species in camera-trap images: **1.5 million images, 24 classes**.",
              problem: "Ecologists sorting millions of camera-trap images by hand.",
              details: [
                "Fine-tuned YOLOv8 on a **heavily imbalanced dataset**: data augmentation and oversampling of rare classes.",
                "Compared the whole YOLO family for the best trade-off between quality and CPU speed; tested tracking (DeepSORT) and dropped it as too slow.",
                "Optimised inference pipeline (batching, GPU when available, multi-CPU), and supported the team on Jean Zay.",
              ],
              metrics: [
                { id: "deepfaune-accuracy", value: "93%", label: "accuracy over 24 species" },
                { id: "deepfaune-speed", value: "3x", label: "faster inference" },
              ],
              links: ["deepfaune-paper"],
              stack: ["YOLOv8", "PyTorch", "Multi-GPU", "Slurm"],
            },
            {
              id: "bigsf",
              name: "BIGSF, CNES",
              status: "Open source",
              text: "**Tech lead** on the redesign of a U-Net library for galactic filament images, now a **public toolbox**.",
              problem: "Code written by several successive PhD students, hard to evolve.",
              details: [
                "Architecture driven by YAML configuration, with base classes (BaseDataset, BaseModel) that each new experiment extends.",
                "Reimplemented and extended the existing code, with tests and documentation.",
              ],
              stack: ["U-Net", "PyTorch", "MLflow", "configurable-cl"],
            },
            {
              id: "autofill",
              name: "AUTOFILL, CEA",
              text: "Using AI to complete nanomaterial data that is expensive to measure, and to translate between measurement techniques.",
              problem: "Light and X-ray measurements produce costly 1D signals that do not cover every material, size and shape.",
              details: [
                "Autoencoders (ResVAE) to reconstruct the signals, then a PairVAE that **translates from one technique to the other** (LES to SAXS, and back).",
                "Advised the team, who were not computer scientists, on their data formats: moved them to HDF5.",
                "Configurable library, reusable for other materials.",
              ],
              metrics: [{ id: "autofill-mae", value: "0.98", label: "mean absolute error" }],
              stack: ["PyTorch Lightning", "VAE", "HDF5", "MLflow"],
            },
            {
              id: "morphogan",
              name: "MORPHOGAN, Université de Lorraine",
              text: "Studying how butterfly wing patterns vary in the latent space of a StyleGAN2.",
              details: [
                "Took over and optimised a complex codebase, **reducing technical debt**.",
                "Explored the latent space to follow how patterns change within species.",
                "Automated, containerised pipeline.",
              ],
              stack: ["StyleGAN2", "PyTorch", "Slurm", "Docker"],
            },
            {
              name: "DNADNA, LISN",
              text: "A deep learning library for population genetics, made dependable for its users.",
              details: [
                "Unit tests and CI, bug fixes, reproducibility features.",
                "Handled user issues and requests on GitLab.",
              ],
              stack: ["Python", "GitLab CI", "Jean Zay"],
            },
            {
              name: "Acousur",
              text: "Segmenting forest plots in India from Sentinel 1 and 2 satellite imagery.",
              details: [
                "A U-Net baseline, and getting to grips with satellite data through GeoPandas.",
                "**Mentored an intern** on semi-supervised detection with YOLO.",
              ],
              stack: ["U-Net", "PyTorch", "GeoPandas"],
            },
            {
              name: "Introduction to LLMs course",
              text: "Three hours, created and taught to **about 25 CNRS PhD students and researchers**.",
              details: [
                "Attention, encoders (BERT), decoders (GPT), current models (GPT, Llama) and multimodal models.",
              ],
            },
          ],
        },
      ],
      footnote:
        "Also: DeepGrail (translating text into grammar to detect fake news), MORE (reinforcement learning on protein structures) and ASTANA (human pose from video).",
    },
    {
      id: "agileo",
      org: "Agileo Automation",
      title: "Software engineer, work-study",
      place: "Montauban",
      dates: "Aug. 2020 to Sept. 2021, 1 year",
      context:
        "A year of work-study during my master's, in a team of five engineers running Scrum. This is where I got into the habit of **laying out the architecture before writing code**.",
      groups: [
        {
          items: [
            {
              id: "agileo-framework",
              name: "Supervision framework for production machines",
              text: "Monitoring and controlling robotic machines for baking and semiconductor manufacturing.",
              details: [
                "Object-oriented architecture designed in UML before the code, in C#.",
                "Operator interfaces (HMI), CI/CD on Azure DevOps.",
              ],
              stack: ["C#", "UML", "Azure DevOps", "Scrum"],
            },
          ],
        },
      ],
    },
  ],
  harnessHint: "Click a layer to see what it does.",
  project: { more: "Show details", less: "Collapse", next: "Next project:" },
  estimate: "estimated",
  education: [
    { title: "MSc Artificial Intelligence and Pattern Recognition", school: "Université Paul Sabatier, IRIT", dates: "2019 to 2021" },
    { title: "BSc Computer Science", school: "Université Paul Sabatier, Toulouse III", dates: "2016 to 2019" },
  ],
  publications: [
    {
      name: "Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2",
      text: "AIES 2025, peer-reviewed. Co-author, from the GENS project with Météo France.",
      url: "https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml",
    },
    {
      name: "The DeepFaune initiative: automatic identification of European fauna",
      text: "Peer-reviewed. The species recognition model of the DeepFaune project.",
      url: "https://scholar.google.fr/citations?view_op=view_citation&hl=fr&user=iUFJqVMAAAAJ&citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C",
    },
  ],
  openSource: [
    {
      name: "LangChain",
      text: "Merged contribution: the Mistral integration.",
      url: "https://github.com/langchain-ai/langchain/pull/37008",
      repo: "langchain-pr",
    },
    {
      name: "LLMock",
      text: "LLM mock server published on PyPI, 10+ providers.",
      url: "https://github.com/JulienRabault/LLMock",
      repo: "llmock",
    },
    {
      name: "DDPM-weather",
      text: "Diffusion model for weather images.",
      url: "https://github.com/JulienRabault/DDPM-weather",
      repo: "ddpm-weather",
    },
    {
      name: "uniqpath",
      text: "Python utility on PyPI: unique file paths by suffix, UUID or timestamp.",
      url: "https://github.com/JulienRabault/uniqpath",
      repo: "uniqpath",
    },
    {
      name: "BananaML",
      text: "End-to-end ML pipeline on AWS: computer vision and a REST API, FastAPI, Docker, CI/CD.",
      url: "https://github.com/JulienRabault/DaysToBananaDeath",
      repo: "bananaml",
    },
  ],
  skills: [
    {
      label: "Agentic systems",
      text: "Agent harnesses (agent loop, tool calling, middleware, memory, human-in-the-loop), LangChain, LangGraph, Deep Agents, RAG, MCP, evals (golden sets, LLM-as-judge, A/B testing), multimodal (OCR, vision, audio), fine-tuning",
    },
    {
      label: "Languages and data",
      text: "Python, PyTorch, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, Mistral and OpenAI APIs",
    },
    {
      label: "Infrastructure",
      text: "Docker, GitLab CI, AWS, Celery, RabbitMQ, Airflow, Langfuse, Slurm, Linux",
    },
  ],
  closing: "A more specific question? The site's agent answers from this background and cites its sources.",
};

export const harnessEn: HarnessLayer[] = [
  { id: "loop", name: "Agent loop", text: "The model picks a tool, reads the result and goes again until it can answer. **One loop for every business line**, instead of a router dispatching to fixed agents." },
  { id: "context", name: "Context", text: "The context is summarised and kept within a token budget at every turn. The shared prefix is cached across conversations, tenants and clients: **inference costs cut by an estimated 40-50%**." },
  { id: "tools", name: "Tools", text: "Agentic RAG, web search, calculator, skills, sub-agents and MCP servers, all plugged into the same loop: **adding a tool no longer means building a new graph**. The MCP servers for business APIs come out of MCP Builder, which generates them with a human in the loop." },
  { id: "memory", name: "Memory", text: "Persistent memory: what was established in one conversation stays available in the next ones." },
  { id: "guardrails", name: "Guardrails", text: "Retrieved content is sandboxed: **a document read by the agent cannot give it orders**. That is the defence against indirect prompt injection." },
  { id: "hitl", name: "Human approval", text: "Sensitive actions stop and wait for the user's approval before they go out." },
  { id: "profile", name: "Profile", text: "Local government, legal, industry, public-sector HR: each profile configures the same loop with its own tools, instructions and permissions." },
  { id: "eval", name: "Evaluation", text: "Around all of it, Langfuse v4: traces, golden sets, automated LLM-as-judge scoring. Every change of model, prompt or architecture runs on the same bench, with regression and cost tracking." },
];
