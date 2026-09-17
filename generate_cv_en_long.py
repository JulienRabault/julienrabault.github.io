"""[VERSION LONGUE, 2 pages] Generate Julien Rabault's resume as a clean, ATS-friendly PDF (EN). v9

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
ROLE = "AI Engineer &middot; LLM agents &amp; RAG in production"

CONTACT = (
    f'{_icon("location")}&nbsp;Toulouse, France&nbsp;&nbsp;&nbsp;'
    f'{_icon("phone")}&nbsp;+33 7 81 16 46 29<br/>'
    f'{_icon("email")}&nbsp;<a href="mailto:julienrabault@icloud.com" color="{LINK}">julienrabault@icloud.com</a><br/>'
    f'{_icon("linkedin")}&nbsp;<a href="https://linkedin.com/in/julienrabault" color="{LINK}">linkedin.com/in/julienrabault</a><br/>'
    f'{_icon("github")}&nbsp;<a href="https://github.com/JulienRabault" color="{LINK}">github.com/JulienRabault</a><br/>'
    f'{_icon("globe")}&nbsp;<a href="https://julienrabault.github.io/?src=cv" color="{LINK}">julienrabault.github.io</a>'
)

SUMMARY = (
    "I design and ship LLM agents and RAG systems that run in production at customer sites, after "
    "four years of applied research at CNRS training and fine-tuning deep learning models on a "
    "national supercomputer (PyTorch, multi-GPU). Two peer-reviewed publications."
)

SKILLS = [
    ("Agentic systems",
     "LLM agents in production, RAG, evals (golden sets, LLM-as-judge), observability, agent "
     "security, inference cost tracking, multimodal (OCR, vision, audio), MCP, "
     "LangChain / LangGraph, fine-tuning"),
    ("Languages &amp; data",
     "Python, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, Mistral and OpenAI APIs"),
    ("Infrastructure",
     "Docker, Kubernetes, Helm, GitLab CI, AWS, Celery, RabbitMQ, S3, Airflow, MLflow, Langfuse, "
     "Slurm, Linux"),
    ("Machine learning",
     "PyTorch, Transformers, multi-GPU training (DDP), diffusion models, computer vision, "
     "U-Net, YOLO, GAN, VAE"),
]

EXPERIENCE = [
    {
        "title": "AI Engineer",
        "org": "Berger-Levrault",
        "place": "Toulouse &middot; AI R&amp;D team",
        "dates": "Jan. 2026 &ndash; present",
        "context": (
            "Design and delivery of Athena, Berger-Levrault's agentic platform: agents wired into "
            "the document corpora and business APIs of the group's clients (local government, legal, "
            "industry, maintenance, public-sector HR). ~100k technical documents indexed, ~70 pilot "
            "users, Langfuse observability, monitoring and cost tracking, client workshops."
        ),
        "bullets": [
            "<b>Athena agentic architecture</b> (LangGraph), rebuilt with the team: moved from a "
            "router (one agent per task: RAG, MCP APIs, reports) to a reusable agent configured per "
            "profile, with context management, automatically generated skills, sub-agent "
            "orchestration and a unified event contract. Adding a tool no longer means building a "
            "new graph.",

            "<b>Agent evaluation and reliability</b>: golden sets, LLM-as-judge scoring, "
            "comparative benchmarks between architectures and regression tracking through "
            "Langfuse.",

            "<b>Agent security</b>: sandboxing of retrieved content against indirect prompt "
            "injection, execution bounds on tools (timeouts, per-profile restrictions).",

            "<b>MCP Builder</b>: turns business-unit APIs into MCP servers. An LLM selects the "
            "useful endpoints, audits their gaps and generates purpose-built tools (workflows or "
            "Python code via FastMCP), human-in-the-loop.",

            "<b>Content-extractor</b>, multimodal extraction (OCR / PDF / DOCX / audio): service "
            "built from scratch, 7 extraction pipelines, async batch processing (Celery + Mistral "
            "batch API), extensible factory/registry architecture. Deployed, -50% on extraction "
            "costs.",

            "<b>Document template agent</b>: tools that extract templates from Word documents, then "
            "a second agent and tools that fill those templates from natural language. From "
            "prototype to production.",

            "<b>LLM pipeline for business data structuring</b> (public-sector HR): turns interview "
            "write-ups into normalised, deduplicated and clustered training needs, then matches them "
            "against a catalogue.",

            "<b>RAG ingestion chain</b> (Airflow): added enrichment stages (data augmentation, chunking, "
            "embeddings, indexed questions and keywords, time filters). One DAG per client in "
            "production.",
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "org": "CNRS &middot; PNRIA",
        "place": "Toulouse",
        "dates": "Dec. 2021 &ndash; Jan. 2026 &middot; 4 yrs",
        "context": (
            "Network of AI engineers supporting research teams (weather, astrophysics, materials, "
            "ethology, biology). 10+ projects supported, up to two in parallel (6-12 months), for "
            "Météo France, CNES, CEA and INEE. Training and fine-tuning on the Jean Zay "
            "supercomputer (multi-GPU DDP, 8 GPUs, Slurm)."
        ),
        "bullets": [
            "<b>GENS / MetScore, Météo France:</b> multi-GPU optimisation and fine-tuning of a "
            "diffusion model (DDPM) in PyTorch; designed MetScore (metrics library), still in "
            "production. Diffusion POC at -20% compute for equivalent quality. Co-author, AIES 2025.",

            "<b>DeepFaune, CNRS / INEE:</b> fine-tuned YOLOv8 on 1.5M images (24 classes) with "
            "class-imbalance handling. 93% accuracy, 3× faster inference. Peer-reviewed publication.",

            "<b>BIGSF, CNES:</b> tech lead on the rebuild of a galactic-filament image analysis "
            "library (U-Net): modular architecture, tests, documentation. Public toolbox.",

            "<b>AUTOFILL, CEA:</b> implemented the PairVAE model for generating and completing "
            "nanomaterial data, 0.98 mean absolute error. Library parameterised for other materials.",

            "<b>MORPHOGAN, Univ. Lorraine:</b> full rebuild of a StyleGAN2 codebase to study the "
            "morphological variability of butterfly wings: automated pipeline, tests, containerisation.",

            "<b>Teaching:</b> created and delivered \"Introduction to LLMs\" to ~25 PhD students and "
            "researchers.",
        ],
    },
    {
        "title": "Software Engineer",
        "org": "Agileo Automation",
        "place": "Montauban",
        "dates": "Aug. 2020 &ndash; Sept. 2021 &middot; 1 yr",
        "context": "",
        "bullets": [
            "<b>Supervision framework for robotic manufacturing equipment</b> (semiconductors): C#, "
            "object-oriented architecture, HMI, CI/CD. Team of 5, Agile / Scrum.",
        ],
    },
]

EDUCATION = [
    ("MSc Artificial Intelligence &amp; Pattern Recognition",
     "Université Paul Sabatier / IRIT", "2019 &ndash; 2021"),
    ("BSc Computer Science", "Université Paul Sabatier Toulouse III", "2016 &ndash; 2019"),
]

BODY_SIZE = 9.8
BODY_LEAD = 12.9


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
        "bullet": S("bullet", leftIndent=11, bulletIndent=0, spaceAfter=2),
        "edu": S("edu",),
        "edu_date": S("edu_date", textColor=MUTED, alignment=TA_RIGHT),
        "small": S("small", spaceAfter=2.6),
    }


def build_cv():
    output = os.path.join(BASE, "CV_JULIEN_RABAULT_EN_LONG.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=14 * mm, rightMargin=14 * mm,
        topMargin=10 * mm, bottomMargin=10 * mm,
        title="Resume - Julien Rabault", author="Julien Rabault",
    )
    s = styles()
    W = 182 * mm
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
        story.append(Spacer(1, 2.6 * mm))
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
            story.append(Spacer(1, 5 * mm))
        two_col(f"<b>{job['title']}</b>, {job['org']} &mdash; {job['place']}",
                job["dates"], s["job"], s["dates"])
        if job["context"]:
            story.append(Paragraph(job["context"], s["context"]))
        else:
            story.append(Spacer(1, 2.2 * mm))
        for b in job["bullets"]:
            story.append(Paragraph(b, s["bullet"], bulletText="•"))

    # ─── FORMATION ───
    section("EDUCATION")
    for title, school, date in EDUCATION:
        two_col(f"<b>{title}</b>, {school}", date, s["edu"], s["edu_date"], ratio=0.85)

    # ─── PUBLICATIONS ───
    section("PUBLICATIONS")
    story.append(Paragraph(
        f'<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        f'color="{LINK}">Enriching Operational High-Resolution Ensemble Forecasts with '
        "StyleGAN-2</a>, AIES 2025, peer-reviewed.", s["small"]))
    story.append(Paragraph(
        f'<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        f'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="{LINK}">'
        "The DeepFaune initiative: automatic identification of European fauna</a>, peer-reviewed.",
        s["small"]))
    section("OPEN SOURCE")
    story.append(Paragraph(
        f'<b><a href="https://github.com/langchain-ai/langchain/pull/37008" color="{LINK}">'
        "LangChain</a></b>: merged contribution to the Mistral integration, surfacing citation "
        "metadata.", s["small"]))
    story.append(Paragraph(
        f'<b><a href="https://github.com/JulienRabault/LLMock" color="{LINK}">LLMock</a></b> '
        "(PyPI): LLM mock server for testing retries and fallbacks, 10+ providers.",
        s["small"]))
    story.append(Paragraph(
        f'<b><a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}">'
        "DDPM-weather</a></b>: diffusion model for weather image denoising.",
        s["small"]))

    doc.build(story)
    print(f"CV (EN) generated: {output}")


if __name__ == "__main__":
    build_cv()
