/**
 * Cloudflare Worker — Chat proxy for Julien Rabault's portfolio.
 * Routes questions to Claude Haiku with CV context baked in.
 * Rate-limited, CORS-restricted, cost-controlled.
 */

const SYSTEM_PROMPT = `Tu es l'assistant IA du portfolio de Julien Rabault. Tu reponds aux questions des recruteurs sur son profil.

PROFIL:
- Julien Rabault, Applied AI / ML Engineer, base a Toulouse, mobile Paris / Montreal
- 4 ans au CNRS (PNRIA) : entrainement et fine-tuning de modeles deep learning (PyTorch, multi-GPU, Jean Zay)
- Aujourd'hui chez Berger-Levrault : conception d'Athena, plateforme agentique multi-agents (LangGraph, RAG, MCP)
- 2 publications peer-reviewed (AMS 2025, DeepFaune)
- Master IA et Reconnaissance des Formes (IARF), Universite Paul Sabatier Toulouse III

EXPERIENCE BERGER-LEVRAULT (depuis janv. 2026):
- AI Engineer, equipe R&D IA de 12 personnes
- Athena : plateforme agentique pour tous les clients BL (collectivites, industrie, maintenance)
- Architecture multi-agents LangGraph, routage, orchestration RAG + MCP, sourcing des reponses
- Content-extractor : refonte OCR/PDF/DOCX, -50% couts extraction
- Pipelines Airflow : 5 DAGs operationnels
- MCP Builder : 120+ APIs internes cartographiees
- Equipe cross-fonctionnelle (designer, dev front, DevOps), ateliers clients, observabilite Langfuse

EXPERIENCE CNRS (dec. 2021 - janv. 2026):
- ML Engineer au PNRIA, 2 projets en parallele, livres a Meteo France, CNES, CEA, INEE
- GENS/MetScore (Meteo France) : fine-tuning DDPM, librairie en prod, -20% calcul, co-auteur papier AMS 2025
- DeepFaune (CNRS/INEE) : fine-tuning YOLOv5 sur 1.5M images, 93% accuracy, 3x plus rapide, publication peer-reviewed
- Autres : AUTOFILL (CEA), BIGSF (CNES, tech lead), MORPHOGAN (Univ. Lorraine, StyleGAN2)
- Formation dispensee : Introduction aux LLMs (3h, ~25 doctorants/chercheurs)

COMPETENCES:
- Agentique & RAG : RAG/GraphRAG, Multi-agents, MCP Protocol, LangChain/LangGraph, Prompt Engineering, Fine-tuning
- Deep Learning : PyTorch, Transformers, Computer Vision, Diffusion Models (DDPM), NLP, YOLOv5, GAN, VAE
- MLOps : Docker, AWS, CI/CD, MLFlow, Airflow, Kubernetes, Celery, Langfuse, HPC/Slurm
- Dev : Python, FastAPI, HuggingFace, Qdrant/pgvector, Git, SOLID, C#

PROJETS OPEN SOURCE:
- LLMock (PyPI) : mock server LLM, 10+ providers, OpenAI-compatible
- DDPM-weather : modele de diffusion meteo, -20% ressources
- BananaML : pipeline ML end-to-end sur AWS

CONTACT: julienrabault@icloud.com | linkedin.com/in/julienrabault | github.com/JulienRabault

REGLES:
- Reponds UNIQUEMENT aux questions sur le profil, les competences, l'experience ou la disponibilite de Julien
- Si la question n'a rien a voir avec le profil, reponds poliment que tu ne peux repondre qu'aux questions sur Julien
- Sois concis (3-5 phrases max), professionnel mais chaleureux
- Ne invente RIEN qui n'est pas dans le profil ci-dessus
- Si on te demande le salaire, dis que c'est a discuter directement avec Julien
- Reponds dans la langue de la question (francais ou anglais)`;

// ─── Rate limiting (in-memory, resets per worker instance) ───
const rateLimitMap = new Map();

function isRateLimited(ip, maxPerMinute) {
  const now = Date.now();
  const windowMs = 60_000;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= maxPerMinute) {
    return true;
  }

  timestamps.push(now);
  return false;
}

// ─── Main handler ───
export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://julienrabault.github.io";
    const maxReqPerMin = parseInt(env.MAX_REQUESTS_PER_MINUTE || "10");
    const maxTokens = parseInt(env.MAX_TOKENS || "300");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Only POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // CORS check
    const origin = request.headers.get("Origin") || "";
    if (!origin.includes("julienrabault.github.io") && !origin.includes("localhost")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rate limit
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(clientIP, maxReqPerMin)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    }

    const userMessage = (body.message || "").trim();
    if (!userMessage || userMessage.length > 500) {
      return new Response(JSON.stringify({ error: "Message too long or empty" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    }

    // Call Anthropic API
    try {
      const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-20250414",
          max_tokens: maxTokens,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      if (!anthropicResponse.ok) {
        const errText = await anthropicResponse.text();
        console.error("Anthropic API error:", errText);
        return new Response(JSON.stringify({ error: "AI service unavailable" }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
          },
        });
      }

      const data = await anthropicResponse.json();
      const reply = data.content?.[0]?.text || "Desole, je n'ai pas pu generer de reponse.";

      return new Response(JSON.stringify({ reply }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    }
  },
};
