import type { CannedAnswer } from "./types";

// Sans autre import : le worker lit ce fichier tel quel pour reprendre une réponse servie par le site.
export const suggestionsEn: string[] = [
  "What is Julien working on right now?",
  "Sum up his background",
  "How is this chat built?",
  "Can he work from Paris or Canada?",
];

// Order matters: the first answer with a keyword found in the question wins.
export const answersEn: CannedAnswer[] = [
  {
    match: ["paris", "canada", "remote", "relocate", "location", "montreal"],
    read: ["mobility"],
    text: "Yes. He is based in Toulouse and open to Paris, remote and Canada [[mobility]]. The simplest way to discuss it is to email him.\n\n{{contact}}",
  },
  {
    match: ["contact", "reach", "email", "get in touch"],
    read: ["mobility"],
    text: "Email is the most direct, he answers himself. The CV and his profiles are here too [[mobility]].\n\n{{contact}}",
  },
  {
    match: ["chat", "site", "built", "how does this"],
    read: ["site", "bl-harness"],
    text: "Simply, on purpose: a Cloudflare Worker, a single call to a Claude model, the whole background in context and cached. No RAG and no tools: the background fits in a few thousand tokens, and a vector index would cost more than it brings [[site]].\n\nSecurity happens around the model. Every fact must cite a passage, and before anything reaches your browser the worker strips invented citations, raw links and unknown widgets. The history is signed, so nobody can put words in its mouth [[site]].\n\nThe agents Julien builds at work are heavier: an agent loop wrapped in middleware, each one adding a behaviour without touching the loop [[bl-harness]]. Click a layer to see what it does.\n\n{{harness}}",
  },
  {
    match: ["background", "career", "sum up", "summary", "resume"],
    read: ["education", "agileo", "cnrs", "publications", "bl", "cnrs-pnria"],
    text: "Ten years between computer science and AI, in three stages [[education]].\n\n- **Studies and a first job.** A BSc in computer science, then an MSc in AI and pattern recognition at Université Paul Sabatier. During the MSc, a year of work-study at Agileo Automation, on a supervision framework for robotic machines, in C# and Scrum [[agileo]].\n- **Four years of deep learning at CNRS.** As an engineer in the PNRIA network, he led 10+ projects of 6 to 12 months with research teams, for Météo France, CNES, CEA and INEE, with multi-GPU training on the Jean Zay supercomputer [[cnrs]]. Two peer-reviewed papers came out of it, one in AIES in 2025 [[publications]].\n- **LLM agents in production since January 2026.** At Berger-Levrault, he designs the harness of Athena, the group's agent platform: 100k documents, a six-month pilot with 70 users, a production rollout under way [[bl]].\n\n{{timeline}}\n\nThe common thread: landing in a field he does not know, understanding it with the people who work in it, and covering the whole cycle, from data to deployment [[cnrs-pnria]].\n\nThe long version, with the numbers, is on {{link:career}}. The PDF: {{link:cv}}.",
  },
  {
    match: ["open source", "github", "repo", "code", "llmock", "langchain"],
    read: ["open-source"],
    text: "His most useful public code is LLMock, published on PyPI: a server that mimics 10+ LLM providers behind an OpenAI-compatible API, so an application can be tested without paying for calls [[open-source]].\n\n{{repo:llmock}}\n\nHe also has a merged contribution to LangChain, the Mistral integration [[open-source]].\n\n{{repo:langchain-pr}}",
  },
  {
    match: ["mcp", "api", "tool"],
    read: ["bl-mcp", "bl-tools"],
    text: "At Berger-Levrault the business APIs already exist, but an agent cannot use them as they are. MCP Builder turns them into MCP servers: an LLM picks the useful endpoints, flags what they lack and generates the tools, then someone from the business unit validates them [[bl-mcp]].\n\n{{project:mcp-builder}}\n\nThese servers run on the same loop as agentic RAG and web search: adding a tool no longer means building a graph [[bl-tools]].",
  },
  {
    match: ["evaluate", "evaluation", "evals", "quality"],
    read: ["bl-eval", "cnrs-gens"],
    text: "With golden sets and automated LLM-as-judge scoring, on Langfuse v4. Every change of model, prompt or architecture runs on the same bench, with regression and cost tracking [[bl-eval]].\n\nHe also sandboxes the content the agent retrieves, so that a document cannot give it instructions (indirect prompt injection) [[bl-eval]].\n\nThe habit comes from CNRS: for Météo France, he designed MetScore, a metrics library still in production [[cnrs-gens]].",
  },
  {
    match: ["jean zay", "train", "gpu", "supercomputer"],
    read: ["cnrs", "cnrs-gens", "cnrs-deepfaune"],
    text: "At CNRS, he ran 10+ projects with research teams, with multi-GPU training on Jean Zay (DDP, Slurm) [[cnrs]].\n\nFor Météo France, a diffusion model (DDPM) in PyTorch. The proof of concept cut compute by 20% at equivalent quality, and the work led to a paper at AIES 2025 [[cnrs-gens]].\n\n{{project:gens}}\n\nFor DeepFaune, a YOLOv8 fine-tuned on 1.5 million camera-trap images: 93% accuracy over 24 classes, and inference three times faster [[cnrs-deepfaune]].\n\n{{project:deepfaune}}",
  },
  {
    match: ["right now", "working on", "current", "currently"],
    read: ["bl", "bl-harness", "bl-eval"],
    text: "On Athena, Berger-Levrault's agentic platform, wired into 100k documents and its clients' business APIs. A six-month pilot ran with 70 users and the production rollout is under way [[bl]].\n\nHe designed its harness: a single agent loop, configured per profile and extended through middleware. Prompt caching shared across conversations, tenants and clients cuts inference costs by an estimated 40-50%. He is now migrating it to Deep Agents [[bl-harness]].\n\n{{harness}}\n\nHe also rebuilt monitoring on Langfuse v4, to compare models, prompts and architectures on the same golden sets [[bl-eval]]. The details are in {{link:career-bl}}.",
  },
];
