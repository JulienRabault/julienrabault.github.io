"""Generate Julien Rabault's resume as a clean, ATS-friendly PDF (EN). v9

Layout follows the r/EngineeringResumes reference template: centred name and a
single contact line, serif body text, bold reserved for job titles and skill
categories, and one sentence per bullet.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
import os

INK = HexColor("#1A1A1A")
BODY = HexColor("#2B2B2B")
MUTED = HexColor("#6B6B6B")
RULE = HexColor("#D7D7D7")
LINK = "#1F5673"

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_ITALIC = "Helvetica-Oblique"

BASE = os.path.dirname(__file__)
ICON_DIR = os.path.join(BASE, "assets", "cv_icons")


def _icon(name: str) -> str:
    path = os.path.join(ICON_DIR, f"{name}.png")
    return f'<img src="{path}" width="8" height="8" valign="middle"/>'


NAME = "JULIEN RABAULT"
ROLE = "AI Engineer, LLM agents and RAG in production"

CONTACT = (
    f'{_icon("location")}&nbsp;Toulouse, open to Paris, remote, Canada<br/>'
    f'{_icon("phone")}&nbsp;+33 7 81 16 46 29&nbsp;&nbsp;&nbsp;'
    f'{_icon("email")}&nbsp;<a href="mailto:julienrabault@icloud.com" color="{LINK}">julienrabault@icloud.com</a><br/>'
    f'{_icon("linkedin")}&nbsp;<a href="https://linkedin.com/in/julienrabault" color="{LINK}">linkedin.com/in/julienrabault</a><br/>'
    f'{_icon("github")}&nbsp;<a href="https://github.com/JulienRabault" color="{LINK}">github.com/JulienRabault</a><br/>'
    f'{_icon("globe")}&nbsp;<a href="https://julienrabault.github.io/?src=cv" color="{LINK}">julienrabault.github.io</a>'
)

SUMMARY = (
    "I design agent harnesses and ship LLM agents and RAG systems that run in production at "
    "customer sites, after "
    "four years of deep learning on a national supercomputer at CNRS (PyTorch, multi-GPU). "
    "Two peer-reviewed publications."
)

SKILLS = [
    ("Agentic systems",
     "Agent harnesses (agent loop, tool calling, middleware, memory, human-in-the-loop), "
     "LangChain / LangGraph / Deep Agents, RAG, MCP, evals (golden sets, LLM-as-judge, A/B "
     "testing), multimodal (OCR, vision, audio), fine-tuning"),
    ("Languages &amp; data",
     "Python, PyTorch, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, Mistral and OpenAI APIs"),
    ("Infrastructure",
     "Docker, GitLab CI, AWS, Celery, RabbitMQ, Airflow, Langfuse, Slurm, Linux"),
]

EXPERIENCE = [
    {
        "title": "AI Engineer",
        "org": "Berger-Levrault",
        "place": "Toulouse (AI R&amp;D team)",
        "dates": "Jan. 2026 - present",
        "context": (
            "Athena, agentic platform wired into its clients' documents and business APIs (local "
            "government, legal, industry, public-sector HR): 100k documents, 6-month pilot with 70 "
            "users, production rollout under way. Needs gathered from business units, client "
            "workshops."
        ),
        "groups": [
            ("Platform core", [
                "<b>Agent harness</b> (LangChain / LangGraph), architecture designed and owned. Moved "
                "from a router (one agent per task) to a single agent loop configured per profile "
                "and extended through middleware: persistent memory, human approval of sensitive "
                "actions, context management (summarisation, token budget), guardrails, skills, "
                "sub-agents. Prompt caching shared across conversations, tenants and clients: inference costs cut by an estimated 40-50%. Now migrating to Deep Agents.",

                "<b>Agent tools</b>: agentic RAG, web search, calculator and the matching MCP "
                "servers, all plugged into the same loop. Adding a tool no longer means building a "
                "new graph.",

                "<b>Evaluation and monitoring</b>: rebuilt monitoring on Langfuse v4 (traces, "
                "datasets, automated evaluations and scoring, LLM-as-judge), golden sets, "
                "model, prompt and architecture comparisons, regression and cost tracking; "
                "sandboxing of retrieved content against indirect prompt injection.",

                "<b>MCP Builder</b>: turns internal business APIs into MCP servers. An LLM selects the "
                "useful endpoints, audits their gaps and generates purpose-built tools (workflows "
                "or Python code via FastMCP), human-in-the-loop.",
            ]),
            ("LLM services and pipelines", [
                "<b>Content-extractor</b>, multimodal extraction (OCR / PDF / DOCX / audio): "
                "FastAPI service built from scratch, 7 pipelines, async batch processing (Celery + Mistral "
                "batch API), factory/registry architecture. Deployed, -50% on extraction costs.",

                "<b>Template agent</b>: extracts templates from Word documents that a second agent "
                "fills from natural language. In production.",

                "<b>Business data structuring</b> (public-sector HR): interview write-ups turned "
                "into normalised, deduplicated needs matched against a catalogue. Enriched RAG "
                "ingestion (Airflow): chunking, embeddings, indexed questions.",
            ]),
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "org": "CNRS (PNRIA)",
        "place": "Toulouse",
        "dates": "Dec. 2021 - Jan. 2026 (4 yrs)",
        "context": (
            "Engineer embedded in research teams (weather, astrophysics, materials, ethology, "
            "biology): 10+ projects of 6-12 months, two in parallel, from requirements to delivery, "
            "for "
            "Météo France, CNES, CEA and INEE. Training and fine-tuning on the Jean Zay "
            "supercomputer (multi-GPU DDP, Slurm). Created and taught \"Introduction to LLMs\" to "
            "25 PhD students."
        ),
        "groups": [
            ("Selected projects", [
                "<b>GENS / MetScore, Météo France:</b> multi-GPU training and fine-tuning of a "
                "diffusion model (DDPM) in PyTorch; designed MetScore (metrics library), still in "
                "production. POC: -20% compute, equivalent quality. Co-author, AIES 2025.",

                "<b>DeepFaune, CNRS / INEE:</b> fine-tuned YOLOv8 on 1.5M images (24 classes) with "
                "class-imbalance handling. 93% accuracy, 3x faster inference. Peer-reviewed "
                "publication.",

                "<b>BIGSF, CNES:</b> tech lead on the rebuild of a U-Net galactic image analysis "
                "library, public toolbox.",

                "<b>AUTOFILL, CEA:</b> PairVAE for nanomaterial data completion (0.98 MAE). "
                "<b>MORPHOGAN, Univ. Lorraine:</b> StyleGAN2 codebase rebuild, automated and "
                "containerised pipeline.",
            ]),
        ],
    },
    {
        "title": "Software Engineer",
        "org": "Agileo Automation",
        "place": "Montauban",
        "dates": "Aug. 2020 - Sept. 2021 (1 yr)",
        "context": "",
        "groups": [
            ("", [
                "<b>Supervision framework for manufacturing equipment</b> (semiconductors): C#, "
                "HMI, CI/CD, team of 5 in Scrum.",
            ]),
        ],
    },
]

EDUCATION = [
    ("MSc Artificial Intelligence &amp; Pattern Recognition",
     "Université Paul Sabatier / IRIT", "2019 - 2021"),
    ("BSc Computer Science", "Université Paul Sabatier Toulouse III", "2016 - 2019"),
]

BODY_SIZE = 9.0
BODY_LEAD = 11.4
BULLET_GAP = 2.5


def styles():
    def S(name, **kw):
        base = {"fontName": FONT, "fontSize": BODY_SIZE, "leading": BODY_LEAD, "textColor": BODY}
        base.update(kw)
        return ParagraphStyle(name, **base)

    return {
        "name": S("name", fontName=FONT_BOLD, fontSize=20, leading=22, textColor=INK),
        "role": S("role", fontSize=10.5, leading=13, textColor=MUTED),
        "contact": S("contact", fontSize=8.2, leading=11.3, textColor=MUTED, alignment=TA_RIGHT),
        "summary": S("summary",),
        "section": S("section", fontName=FONT_BOLD, fontSize=10.6, leading=12.2, textColor=INK),
        "job": S("job", fontSize=11.2, leading=14, textColor=INK),
        "dates": S("dates", fontSize=9, leading=14, textColor=MUTED, alignment=TA_RIGHT),
        "context": S("context", fontName=FONT_ITALIC, textColor=MUTED,
                     spaceBefore=2.5, spaceAfter=3.5),
        "group": S("group", fontName=FONT_BOLD, fontSize=8.4, leading=10.5, textColor=MUTED,
                   spaceBefore=3.0, spaceAfter=1.8),
        "bullet": S("bullet", leftIndent=11, bulletIndent=0, spaceAfter=BULLET_GAP),
        "edu": S("edu",),
        "edu_date": S("edu_date", textColor=MUTED, alignment=TA_RIGHT),
        "small": S("small", spaceAfter=2.6),
    }


def build_cv():
    output = os.path.join(BASE, "CV_JULIEN_RABAULT_EN.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=11 * mm, rightMargin=11 * mm,
        topMargin=7 * mm, bottomMargin=7 * mm,
        title="Resume - Julien Rabault", author="Julien Rabault",
    )
    s = styles()
    W = 188 * mm
    story = []

    def two_col(left_text, right_text, left_style, right_style, ratio=0.70):
        t = Table([[Paragraph(left_text, left_style), Paragraph(right_text, right_style)]],
                  colWidths=[W * ratio, W * (1 - ratio)])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(t)

    def section(label):
        story.append(Spacer(1, 1.5 * mm))
        story.append(Paragraph(label, s["section"]))
        story.append(Spacer(1, 1.1 * mm))
        story.append(HRFlowable(width="100%", thickness=0.6, color=RULE,
                                spaceBefore=0, spaceAfter=2.6))

    # ─── HEADER (name/role left, contact right) ───
    left = [Paragraph(NAME, s["name"]), Spacer(1, 1.2 * mm), Paragraph(ROLE, s["role"])]
    header = Table([[left, Paragraph(CONTACT, s["contact"])]],
                   colWidths=[W * 0.55, W * 0.45])
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(header)
    story.append(Spacer(1, 2.5 * mm))
    story.append(Paragraph(SUMMARY, s["summary"]))

    # ─── COMPETENCES ───
    section("SKILLS")
    for cat, items in SKILLS:
        story.append(Paragraph(f"<b>{cat}:</b> {items}", s["small"]))

    # ─── EXPERIENCE ───
    section("PROFESSIONAL EXPERIENCE")
    for i, job in enumerate(EXPERIENCE):
        if i:
            story.append(Spacer(1, 4.2 * mm))
        two_col(f"<b>{job['title']}</b>, {job['org']}, {job['place']}",
                job["dates"], s["job"], s["dates"])
        if job["context"]:
            story.append(Paragraph(job["context"], s["context"]))
        else:
            story.append(Spacer(1, 2.2 * mm))
        for label, bullets in job["groups"]:
            if label:
                story.append(Paragraph(label, s["group"]))
            for b in bullets:
                story.append(Paragraph(b, s["bullet"], bulletText="•"))

    # ─── FORMATION ───
    section("EDUCATION")
    story.append(Paragraph(
        "<b>MSc Artificial Intelligence &amp; Pattern Recognition</b>, Université Paul Sabatier / "
        "IRIT (2021); <b>BSc Computer Science</b>, Université Paul Sabatier "
        "(2019)", s["small"]))

    # ─── PUBLICATIONS ───
    section("PUBLICATIONS &amp; OPEN SOURCE")
    story.append(Paragraph(
        f'<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        f'color="{LINK}">Enriching Operational High-Resolution Ensemble Forecasts with '
        "StyleGAN-2</a>, AIES 2025, peer-reviewed.", s["small"]))
    story.append(Paragraph(
        f'<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        f'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="{LINK}">'
        "The DeepFaune initiative: automatic identification of European fauna</a>, peer-reviewed.",
        s["small"]))
    story.append(Paragraph(
        f'<b><a href="https://github.com/langchain-ai/langchain/pull/37008" color="{LINK}">LangChain'
        f"</a></b>: merged contribution (Mistral integration); "
        f'<b><a href="https://github.com/JulienRabault/LLMock" color="{LINK}">LLMock</a></b> (PyPI): '
        f"LLM mock server, 10+ providers; "
        f'<b><a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}">DDPM-weather</a>'
        "</b>: diffusion for weather images.", s["small"]))
    doc.build(story)
    print(f"CV (EN) generated: {output}")


if __name__ == "__main__":
    build_cv()
