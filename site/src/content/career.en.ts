import type { CareerContent, HarnessLayer } from "./types";

// Facts taken from generate_cv_en.py. Do not add any figure that is not in the CV.
export const careerEn: CareerContent = {
  title: "AI engineer, LLM agents and RAG in production",
  summary:
    "I design agent harnesses and ship LLM agents and RAG systems that run in production at customer sites, after four years of deep learning on a national supercomputer at CNRS (PyTorch, multi-GPU). Two peer-reviewed publications.",
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
  },
  chapters: [
    {
      id: "bl",
      org: "Berger-Levrault",
      title: "AI Engineer",
      place: "Toulouse, AI R&D team",
      dates: "Jan. 2026 to present",
      context:
        "Athena is Berger-Levrault's agentic platform, wired into its clients' documents and business APIs: local government, healthcare, legal, industry, maintenance, public-sector HR. It went from POC to product: 100k documents, a six-month pilot with 70 users, a production rollout under way. Needs are gathered from business units and client workshops. I work across the whole chain, from agent architecture to deployment at the client, often in domains I did not know the day before.",
      groups: [
        {
          title: "Platform core",
          items: [
            {
              name: "Agent harness",
              text: "I designed and own the agent's architecture (LangChain, LangGraph). Before, a router sent each task to a dedicated agent. Now there is a single agent loop, configured per profile and extended through middleware. Now migrating to Deep Agents.",
              widget: "harness",
              metrics: [
                {
                  id: "inference-cost", value: "-40 to -50%",
                  label: "on inference costs, with prompt caching shared across conversations, tenants and clients",
                  estimate: true,
                },
              ],
            },
            {
              name: "Agent tools",
              text: "Agentic RAG, web search, calculator and the matching MCP servers, all plugged into the same loop. Adding a tool no longer means building a new graph.",
            },
            {
              id: "agent-evals",
              status: "In place",
              problem: "An agent platform in production has to be measurable and must not execute just anything.",
              stack: ["Langfuse", "LLM-as-judge", "Golden sets", "Prompt injection"],
              name: "Evaluation and monitoring",
              text: "Rebuilt monitoring on Langfuse v4: traces, datasets, automated evaluations and scoring with LLM-as-judge. Golden sets to compare models, prompts and architectures, with regression and cost tracking. Retrieved content is sandboxed against indirect prompt injection.",
            },
            {
              id: "mcp-builder",
              status: "Deployed",
              problem: "About a hundred internal APIs, spread over some twenty business units, to connect to the agents without exposing an unmanageable surface.",
              stack: ["OpenAPI", "FastMCP", "MCP", "Python", "Human-in-the-loop"],
              metrics: [
                { id: "mcp-apis", value: "~100", label: "internal APIs turned into MCP servers, deployed" },
                { id: "mcp-model", value: "4.1× and 3.2×", label: "faster and cheaper: the model chosen on the benchmark" },
              ],
              name: "MCP Builder",
              text: "Turns internal business APIs into MCP servers. An LLM selects the useful endpoints, audits their gaps and generates purpose-built tools (workflows or Python code via FastMCP), with a human in the loop.",
            },
          ],
        },
        {
          title: "LLM services and pipelines",
          items: [
            {
              id: "content-extractor",
              status: "Deployed",
              problem: "The original extraction service was simple, hard to extend, and every LLM call was expensive at document volume.",
              stack: ["FastAPI", "Celery", "Mistral batch API", "OCR", "Python"],
              name: "Content-extractor",
              text: "Multimodal extraction (OCR, PDF, DOCX, audio): a FastAPI service built from scratch, 7 pipelines, async batch processing (Celery and the Mistral batch API), factory/registry architecture. Deployed.",
              metrics: [{ id: "extraction-cost", value: "-50%", label: "on extraction costs" }],
            },
            {
              id: "templates-agent",
              status: "In production",
              problem: "Long business reports, written by hand on mandatory templates.",
              stack: ["Python", "FastAPI", "Angular", "TypeScript"],
              name: "Template agent",
              text: "Extracts templates from Word documents that a second agent fills field by field from natural language. Navigable PDF preview, per-client activation, Angular interface. From prototype to V2 in production.",
            },
            {
              id: "hr-data",
              status: "Demonstrator",
              problem: "Build public-sector training plans from annual reviews, a business domain Julien was new to.",
              stack: ["Python", "Structured outputs", "Matching", "Airflow"],
              name: "Training plans and RAG ingestion",
              text: "Automating public-sector training plans, a field I was new to: needs extracted from annual reviews, normalised, deduplicated, grouped across employees and matched against the training catalogue. Demonstrator shown to stakeholders, industrialisation under way. As a team, the RAG ingestion on Airflow: more than 5 DAGs, roughly one per client, enriched with chunking, embeddings and indexed questions.",
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
      dates: "Dec. 2021 to Jan. 2026, 4 years",
      context:
        "Engineer embedded in research teams (weather, astrophysics, materials, ethology, biology): 10+ projects of 6 to 12 months, two in parallel, from requirements to delivery, for Météo France, CNES, CEA and INEE. Training and fine-tuning on the Jean Zay supercomputer (multi-GPU DDP, Slurm). I also created and taught an introduction to LLMs for 25 PhD students.",
      groups: [
        {
          title: "Selected projects",
          items: [
            {
              id: "gens",
              status: "Published",
              problem: "Météo France represents uncertainty with several forecast members computed in parallel, and that is expensive.",
              stack: ["PyTorch", "DDPM", "DDIM", "Jean Zay", "DDP"],
              links: ["aies"],
              name: "GENS and MetScore, for Météo France",
              text: "Multi-GPU training and fine-tuning of a diffusion model (DDPM) in PyTorch. Designed MetScore, a metrics library still in production. Co-author of the paper, AIES 2025.",
              metrics: [{ id: "gens-compute", value: "-20%", label: "compute on the POC, for quality equal to or better than StyleGAN" }],
            },
            {
              id: "deepfaune",
              status: "Published",
              problem: "Recognise species automatically in camera trap images: 1.5M images, 24 classes.",
              stack: ["YOLOv8", "PyTorch", "Multi-GPU", "Slurm"],
              links: ["deepfaune-paper"],
              name: "DeepFaune, CNRS and INEE",
              text: "Fine-tuned YOLOv8 on 1.5 million images, 24 classes, with class-imbalance handling. Peer-reviewed publication.",
              metrics: [
                { id: "deepfaune-accuracy", value: "93%", label: "accuracy" },
                { id: "deepfaune-speed", value: "3x", label: "faster inference" },
              ],
            },
            {
              id: "bigsf",
              status: "Open source",
              problem: "Code for analysing images of galactic filaments, written by several PhD students and hard to evolve.",
              stack: ["U-Net", "PyTorch", "MLflow"],
              name: "BIGSF, for CNES",
              text: "Tech lead on the rebuild of a U-Net galactic image analysis library, now a public toolbox.",
            },
            {
              id: "autofill",
              problem: "Nanomaterial characterisation signals are expensive to measure and do not cover every material.",
              stack: ["PyTorch Lightning", "VAE", "HDF5", "MLflow"],
              metrics: [{ id: "autofill-mae", value: "0.98", label: "mean absolute error" }],
              name: "AUTOFILL, for CEA",
              text: "A PairVAE to complete nanomaterial data (0.98 MAE).",
            },
            {
              id: "morphogan",
              problem: "Study how butterfly wing patterns vary within a species.",
              stack: ["StyleGAN2", "PyTorch", "Slurm", "Docker"],
              name: "MORPHOGAN, Université de Lorraine",
              text: "Rebuilt a StyleGAN2 codebase, with an automated and containerised pipeline.",
            },
          ],
        },
      ],
    },
    {
      id: "agileo",
      org: "Agileo Automation",
      title: "Software Engineer",
      place: "Montauban",
      dates: "Aug. 2020 to Sept. 2021, 1 year",
      groups: [
        {
          items: [
            {
              id: "agileo-framework",
              problem: "Supervise and control robotic machines that manufacture semiconductors.",
              stack: ["C#", "UI", "Azure DevOps", "Scrum"],
              name: "Supervision framework for manufacturing equipment",
              text: "For the semiconductor industry: C#, HMI, CI/CD, in a team of 5 working in Scrum.",
            },
          ],
        },
      ],
    },
  ],
  harnessHint: "Click a layer to see what it does.",
  project: { problem: "The problem", results: "Results", stack: "Stack" },
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
  { id: "loop", name: "Agent loop", text: "The model picks a tool, reads the result and goes again until it can answer. One loop for every business line, instead of a router dispatching to fixed agents." },
  { id: "context", name: "Context", text: "The context is summarised and kept within a token budget at every turn. The shared prefix is cached across conversations, tenants and clients: inference costs cut by an estimated 40-50%." },
  { id: "tools", name: "Tools", text: "Agentic RAG, web search, calculator, skills, sub-agents and MCP servers, all plugged into the same loop: adding a tool no longer means building a new graph. The MCP servers for business APIs come out of MCP Builder, which generates them with a human in the loop." },
  { id: "memory", name: "Memory", text: "Persistent memory: what was established in one conversation stays available in the next ones." },
  { id: "guardrails", name: "Guardrails", text: "Retrieved content is sandboxed: a document read by the agent cannot give it orders. That is the defence against indirect prompt injection." },
  { id: "hitl", name: "Human approval", text: "Sensitive actions stop and wait for the user's approval before they go out." },
  { id: "profile", name: "Profile", text: "Local government, legal, industry, public-sector HR: each profile configures the same loop with its own tools, instructions and permissions." },
  { id: "eval", name: "Evaluation", text: "Around all of it, Langfuse v4: traces, golden sets, automated LLM-as-judge scoring. Every change of model, prompt or architecture runs on the same bench, with regression and cost tracking." },
];
