"""Generate Julien Rabault's CV as a clean, ATS-friendly one-page PDF (EN). v8

Same design as the FR version: single column, generous whitespace,
restrained typography, sparing bold. No decorative graphics.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
import os

# ─── Palette (near-monochrome, one restrained link accent) ───
INK = HexColor("#1A1A1A")
BODY = HexColor("#333333")
MUTED = HexColor("#6B6B6B")
RULE = HexColor("#D7D7D7")
LINK = "#1F5673"

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

BASE = os.path.dirname(__file__)

ICON_DIR = os.path.join(BASE, "assets", "cv_icons")


def _icon(name: str) -> str:
    path = os.path.join(ICON_DIR, f"{name}.png")
    return f'<img src="{path}" width="8" height="8" valign="middle"/>'


NAME = "JULIEN RABAULT"
ROLE = "Applied AI / ML Engineer"
CONTACT = (
    f'{_icon("location")}&nbsp;Toulouse, France&nbsp;&nbsp;&nbsp;{_icon("phone")}&nbsp;+33 7 81 16 46 29<br/>'
    f'{_icon("email")}&nbsp;<a href="mailto:julienrabault@icloud.com" color="{LINK}">julienrabault@icloud.com</a><br/>'
    f'{_icon("linkedin")}&nbsp;<a href="https://linkedin.com/in/julienrabault" color="{LINK}">linkedin.com/in/julienrabault</a><br/>'
    f'{_icon("github")}&nbsp;<a href="https://github.com/JulienRabault" color="{LINK}">github.com/JulienRabault</a><br/>'
    f'{_icon("globe")}&nbsp;<a href="https://julienrabault.github.io/?src=cv" color="{LINK}">julienrabault.github.io</a>'
)

SUMMARY = (
    "Applied AI / ML engineer. Four years at CNRS training and industrializing deep learning models "
    "in production (PyTorch, multi-GPU, Jean Zay supercomputer), with two peer-reviewed publications. "
    "Now at Berger-Levrault: building Athena, a multi-agent agentic platform (LangGraph, RAG, MCP) "
    "deployed to clients."
)

SKILLS = [
    ("Agentic &amp; RAG",
     "RAG / GraphRAG, tool-first agents, multi-agents, sub-agents, MCP, LangChain / LangGraph, "
     "prompt engineering, structured outputs, embeddings, fine-tuning"),
    ("Deep Learning",
     "PyTorch, Transformers, computer vision, diffusion models (DDPM / DDIM), NLP, "
     "CNN / U-Net / YOLOv8, generative models (GAN, VAE)"),
    ("MLOps &amp; Infra",
     "Docker, AWS, CI/CD, MLflow, Airflow, Kubernetes, Celery, Langfuse, HPC / Slurm, Linux"),
    ("Development",
     "Python, FastAPI, Hugging Face, Weaviate, Mistral / OpenAI API, Git, "
     "SOLID / architecture, C#, SQL"),
]


def styles():
    def S(name, **kw):
        base = {"fontName": FONT, "fontSize": 8.5, "leading": 11.3, "textColor": BODY}
        base.update(kw)
        return ParagraphStyle(name, **base)

    return {
        "name": S("name", fontName=FONT_BOLD, fontSize=20, leading=22, textColor=INK),
        "role": S("role", fontSize=10.5, leading=13, textColor=MUTED),
        "contact": S("contact", fontSize=8.2, leading=11.5, textColor=MUTED, alignment=TA_RIGHT),
        "summary": S("summary", fontSize=8.5, leading=11.5, textColor=BODY),
        "section": S("section", fontName=FONT_BOLD, fontSize=9.5, leading=11,
                     textColor=INK, spaceBefore=0, spaceAfter=0),
        "job": S("job", fontName=FONT_BOLD, fontSize=10, leading=12, textColor=INK),
        "dates": S("dates", fontSize=8.5, leading=12, textColor=MUTED, alignment=TA_RIGHT),
        "org": S("org", fontSize=8.5, leading=11, textColor=MUTED, spaceAfter=2),
        "intro": S("intro", fontSize=8.5, leading=11.5, textColor=BODY, spaceAfter=2),
        "bullet": S("bullet", fontSize=8.5, leading=11.5, textColor=BODY,
                    leftIndent=10, bulletIndent=0, spaceAfter=1.5),
        "edu": S("edu", fontSize=8.5, leading=11.5, textColor=BODY, spaceAfter=1.5),
        "edu_date": S("edu_date", fontSize=8.5, leading=11.5, textColor=MUTED, alignment=TA_RIGHT),
        "small": S("small", fontSize=8.5, leading=11.5, textColor=BODY, spaceAfter=2),
    }


def build_cv():
    output = os.path.join(BASE, "CV_JULIEN_RABAULT_EN.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=9 * mm, rightMargin=9 * mm,
        topMargin=5 * mm, bottomMargin=6 * mm,
        title="Resume - Julien Rabault", author="Julien Rabault",
    )
    s = styles()
    W = 192 * mm
    story = []

    def section(label):
        story.append(Spacer(1, 2.2 * mm))
        story.append(Paragraph(label, s["section"]))
        story.append(Spacer(1, 1.1 * mm))
        story.append(HRFlowable(width="100%", thickness=0.6, color=RULE,
                                spaceBefore=0, spaceAfter=2.2))

    def job_header(title, dates):
        t = Table([[Paragraph(title, s["job"]), Paragraph(dates, s["dates"])]],
                  colWidths=[W * 0.72, W * 0.28])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(t)

    def bullet(text):
        story.append(Paragraph(text, s["bullet"], bulletText="•"))

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
    story.append(Spacer(1, 2.2 * mm))
    story.append(Paragraph(SUMMARY, s["summary"]))

    # ─── SKILLS ───
    section("TECHNICAL SKILLS")
    for cat, items in SKILLS:
        row = [[Paragraph("<b>" + cat + "</b>", s["small"]), Paragraph(items, s["small"])]]
        t = Table(row, colWidths=[34 * mm, W - 34 * mm])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(t)

    # ─── EXPERIENCE ───
    section("PROFESSIONAL EXPERIENCE")

    job_header("AI Engineer", "Jan. 2026 - present")
    story.append(Paragraph("Berger-Levrault &middot; Toulouse &middot; AI R&amp;D team", s["org"]))
    story.append(Paragraph(
        "Designing and building Athena, Berger-Levrault's agentic platform: agents connected to "
        "documents and business APIs for the group's clients (local government, industry, "
        "healthcare, maintenance). ~70 pilot users, Langfuse observability.", s["intro"]))
    bullet("Refactor of Athena's agentic architecture (multi-agent platform in production, LangGraph), "
           "as a team: from a router (one agent per task: RAG, MCP APIs, reports) to a single "
           "tool-first agent, with context management, skills and automatic skill creation, and "
           "sub-agent orchestration.")
    bullet("Content extractor (OCR / PDF / DOCX): full rebuild, async batch processing (Celery + "
           "Mistral batch API), extensible factory/registry architecture. Deployed, -50% on extraction costs.")
    bullet("MCP Builder: turns business-unit APIs into MCP servers. An LLM selects the useful "
           "endpoints, audits their gaps and generates custom tools (workflows or Python code via "
           "FastMCP), human-in-the-loop. Deployed.")
    bullet("RAG ingestion chain (Airflow). Extended and added enrichment steps: data augmentation, "
           "chunking, embeddings, question/keyword generation for indexing, date filters.")
    bullet("Agent evaluation and reliability: golden-set test suites, LLM-as-judge scoring "
           "and regression tracking via Langfuse.")

    story.append(Spacer(1, 2.2 * mm))
    job_header("Machine Learning Engineer", "Dec. 2021 - Jan. 2026 &middot; 4 yrs")
    story.append(Paragraph("CNRS &middot; National AI Research Programme (PNRIA) &middot; Toulouse", s["org"]))
    story.append(Paragraph(
        "Network of AI engineers supporting research teams (weather, astrophysics, materials, "
        "ethology, biology). 10+ projects supported, up to two in parallel (6-12 months), for "
        "Météo France, CNES, CEA, INEE. Training and fine-tuning on Jean "
        "Zay (multi-GPU DDP, 8 GPUs, Slurm).", s["intro"]))
    bullet("<b>GENS / MetScore, Météo France:</b> multi-GPU optimization and fine-tuning of a "
           "diffusion model (DDPM) in PyTorch; built MetScore (metrics library), still in "
           "production. Diffusion POC at -20% compute for equivalent quality. Co-author of the AMS 2025 paper.")
    bullet("<b>DeepFaune, CNRS / INEE:</b> fine-tuned YOLOv8 on 1.5M images (24 classes), "
           "class-imbalance handling. 93% accuracy, 3× faster inference. "
           "Peer-reviewed publication.")
    bullet("<b>BIGSF, CNES:</b> tech lead on the rebuild of a galactic-filament image-analysis "
           "library (U-Net): modular architecture, tests, documentation. Public toolbox.")
    bullet("<b>Others:</b> AUTOFILL (CEA, PairVAE, MAE 0.98), MORPHOGAN (StyleGAN2, Univ. Lorraine). "
           "Taught &ldquo;Introduction to LLMs&rdquo; (3h, ~25 PhD students / researchers).")

    story.append(Spacer(1, 2.2 * mm))
    job_header("Software Engineer (apprenticeship)", "Aug. 2020 - Sept. 2021 &middot; 1 yr")
    story.append(Paragraph("Agileo Automation &middot; Montauban", s["org"]))
    story.append(Paragraph(
        "Supervision and control framework for robotic machinery (semiconductors): C#, object-oriented "
        "architecture, HMI, CI/CD. Team of 5, Agile / Scrum.", s["intro"]))

    # ─── EDUCATION ───
    section("EDUCATION")

    def edu_row(left_text, date):
        t = Table([[Paragraph(left_text, s["edu"]), Paragraph(date, s["edu_date"])]],
                  colWidths=[W * 0.82, W * 0.18])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(t)

    edu_row("<b>MSc Artificial Intelligence &amp; Pattern Recognition (IARF)</b>, "
            "Université Paul Sabatier Toulouse III / IRIT", "2019 - 2021")
    edu_row("<b>BSc Computer Science</b>, Université Paul Sabatier Toulouse III", "2016 - 2019")
    story.append(Paragraph(
        "<b>Languages:</b> French (native) &middot; English (full professional proficiency, "
        "scientific writing, technical documentation)", s["small"]))

    # ─── PUBLICATIONS ───
    section("PUBLICATIONS")
    story.append(Paragraph(
        f'<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        f'color="{LINK}">Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2</a>. '
        "AIES, 2025. 3rd author, peer-reviewed.", s["small"]))
    story.append(Paragraph(
        f'<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        f'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="{LINK}">'
        "The DeepFaune initiative: automatic identification of European fauna</a>. "
        "N. Rigoudy et al. Co-author, peer-reviewed.", s["small"]))

    # ─── OPEN SOURCE PROJECTS ───
    section("OPEN SOURCE PROJECTS")
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/LLMock" color="{LINK}"><b>LLMock</b></a> (PyPI). '
        "LLM mock server: retries / fallbacks, 10+ providers, OpenAI-compatible. Python, FastAPI.",
        s["small"]))
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}"><b>DDPM-weather</b></a>. '
        "Probabilistic diffusion model for weather image denoising, -20% resources. PyTorch.",
        s["small"]))
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/DaysToBananaDeath" color="{LINK}"><b>BananaML</b></a>. '
        "End-to-end ML pipeline on AWS: computer vision + REST API. FastAPI, Docker, CI/CD.",
        s["small"]))

    doc.build(story)
    print(f"CV (EN) generated: {output}")


if __name__ == "__main__":
    build_cv()
