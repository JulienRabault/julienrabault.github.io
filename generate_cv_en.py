"""Generate Julien Rabault's CV in English — same layout as FR version."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
)
import os

BLACK = HexColor("#000000")
DARK = HexColor("#1a1a1a")
GRAY = HexColor("#3a3a3a")
LIGHT_GRAY = HexColor("#666666")
SECTION = HexColor("#014D56")
BORDER = HexColor("#999999")

FONT = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

BASE = os.path.dirname(__file__)
ICON_PHONE = os.path.join(BASE, "cv_icons", "icon_2.png")
ICON_EMAIL = os.path.join(BASE, "cv_icons", "icon_3.png")
ICON_WEB = os.path.join(BASE, "cv_icons", "icon_1.png")
ICON_LOC = os.path.join(BASE, "cv_icons", "icon_0.png")
ICON_GITHUB = os.path.join(BASE, "cv_icons", "icon_github.png")
ICON_LINKEDIN = os.path.join(BASE, "cv_icons", "icon_linkedin_dark.png")


def S(name, **kw):
    defaults = {"fontName": FONT, "fontSize": 8.8, "leading": 11.5, "textColor": GRAY}
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)


def icon(path, size=3 * mm):
    return Image(path, width=size, height=size)


def build_cv():
    output = os.path.join(BASE, "CV_JULIEN_RABAULT_EN.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=5 * mm, rightMargin=5 * mm,
        topMargin=2 * mm, bottomMargin=3 * mm
    )

    s = {
        "name": S("name", fontName=FONT_BOLD, fontSize=22, leading=26, textColor=BLACK),
        "role": S("role", fontName=FONT_BOLD, fontSize=13, leading=16, textColor=BLACK),
        "contact_text": S("ct", fontSize=8, leading=10, textColor=GRAY),
        "contact_link": S("cl", fontSize=8, leading=10, textColor=GRAY),
        "section": S("section", fontName=FONT_BOLD, fontSize=10.5, leading=13.5, textColor=SECTION,
                      spaceBefore=5, spaceAfter=3),
        "job": S("job", fontName=FONT_BOLD, fontSize=10, leading=12.5, textColor=BLACK),
        "company": S("company", fontName=FONT_BOLD, fontSize=8.8, leading=11.5, textColor=SECTION,
                      spaceAfter=1.5),
        "body": S("body", fontSize=8.8, leading=11.5, textColor=GRAY, spaceAfter=1.5),
        "bullet": S("bullet", fontName=FONT_BOLD, fontSize=8.2, leading=10.8, textColor=DARK,
                     leftIndent=8, spaceAfter=0.5),
        "bullet_body": S("bullet_body", fontSize=8.2, leading=10.8, textColor=GRAY,
                          leftIndent=8, spaceAfter=1.5),
        "small": S("small", fontSize=8.8, leading=11.5, textColor=GRAY),
        "date": S("date", fontSize=8.8, leading=11.5, textColor=GRAY, alignment=TA_RIGHT),
        "skill_cat": S("skill_cat", fontName=FONT_BOLD, fontSize=8.2, leading=10.8, textColor=DARK),
        "skill_val": S("skill_val", fontSize=8.2, leading=10.8, textColor=GRAY),
    }

    W = 200 * mm
    ICO = 2.8 * mm
    story = []

    # ─── HEADER ───
    contact_rows = [
        [icon(ICON_PHONE, ICO), Paragraph("+33 7 81 16 46 29", s["contact_text"])],
        [icon(ICON_EMAIL, ICO),
         Paragraph('<a href="mailto:julienrabault@icloud.com" color="#1155CC">'
                   "julienrabault@icloud.com</a>", s["contact_link"])],
        [icon(ICON_LINKEDIN, ICO),
         Paragraph('<a href="https://linkedin.com/in/julienrabault" color="#1155CC">'
                   "linkedin.com/in/julienrabault</a>", s["contact_link"])],
        [icon(ICON_GITHUB, ICO),
         Paragraph('<a href="https://github.com/JulienRabault" color="#1155CC">'
                   "github.com/JulienRabault</a>", s["contact_link"])],
        [icon(ICON_LOC, ICO), Paragraph("Toulouse, France", s["contact_text"])],
        [icon(ICON_WEB, ICO),
         Paragraph('<a href="https://julienrabault.github.io" color="#1155CC">'
                   "julienrabault.github.io</a>", s["contact_link"])],
    ]
    contact_table = Table(contact_rows, colWidths=[5 * mm, 55 * mm])
    contact_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 0.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0.5),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))

    header = [[
        [Paragraph("JULIEN RABAULT", s["name"]),
         Paragraph("Applied AI / ML Engineer", s["role"])],
        contact_table
    ]]
    ht = Table(header, colWidths=[W - 62 * mm, 62 * mm])
    ht.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(ht)
    story.append(Spacer(1, 2 * mm))

    # Summary
    story.append(Paragraph(
        "Four years at CNRS, training and fine-tuning deep learning models in production (PyTorch, multi-GPU, "
        "Jean Zay supercomputer), with two peer-reviewed publications. Currently at Berger-Levrault designing "
        "Athena, an agentic AI platform powered by LangGraph, RAG, and MCP.",
        s["body"]
    ))
    story.append(Spacer(1, 0.5 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── TECHNICAL SKILLS ───
    story.append(Paragraph("TECHNICAL SKILLS", s["section"]))
    skills = [
        ("Agentic &amp; RAG",
         "RAG / GraphRAG, Multi-agent systems, MCP Protocol, LangChain / LangGraph, Prompt Engineering, "
         "Structured Outputs, Embeddings, LLM Routing, Fine-tuning"),
        ("Deep Learning",
         "PyTorch, Transformers, Computer Vision, Diffusion Models (DDPM), NLP, "
         "CNNs / U-Net / YOLOv5, Generative models (GAN, VAE)"),
        ("MLOps &amp; Infra",
         "Docker, AWS, CI/CD, MLFlow, Airflow, Kubernetes, Celery, Langfuse, HPC / Slurm, Linux"),
        ("Development",
         "Python, FastAPI, HuggingFace, Qdrant / pgvector, Mistral / OpenAI API, Git, "
         "SOLID / Architecture, C#, SQL"),
    ]
    for cat, items in skills:
        row = [[Paragraph(cat + " :", s["skill_cat"]), Paragraph(items, s["skill_val"])]]
        t = Table(row, colWidths=[30 * mm, W - 30 * mm])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
        ]))
        story.append(t)

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── WORK EXPERIENCE ───
    story.append(Paragraph("WORK EXPERIENCE", s["section"]))

    def job_header(title, date_str):
        row = [[Paragraph(title, s["job"]), Paragraph(date_str, s["date"])]]
        t = Table(row, colWidths=[W * 0.7, W * 0.3])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        return t

    # --- BL ---
    story.append(job_header("AI ENGINEER", "Jan. 2026 - present"))
    story.append(Paragraph(
        "Berger-Levrault  |  Toulouse  |  AI R&amp;D team, 12 people", s["company"]))
    story.append(Paragraph(
        "Designing and building <b>Athena</b>, Berger-Levrault's agentic platform: "
        "multi-agent orchestration, intelligent routing, integrated with documents and business APIs "
        "across verticals including local government, industry, and maintenance. "
        "Currently in pilot with ~30 users. "
        "Cross-functional team (designer, frontend dev, DevOps), client workshops, Langfuse observability.",
        s["body"]
    ))
    proofs_bl = [
        ("Multi-agent architecture",
         "Designed the multi-agent architecture (LangGraph), built question-type routing, "
         "orchestrated RAG agents and MCP API agents, integrated source attribution into responses. "
         "<b>Platform in production</b>, delivering grounded and actionable answers across business domains."),
        ("Content extractor - OCR/PDF/DOCX",
         "Redesigned and rebuilt the extraction service: OCR, images, PDF, DOCX. Async batch processing "
         "(Celery + Mistral batch API), factory/registry patterns for extensibility. "
         "<b>Cut extraction costs by 50%.</b>"),
        ("Airflow pipelines",
         "Inherited and improved document ingestion pipelines "
         "(PDF, technical manuals, work orders, equipment documentation). <b>5 operational DAGs.</b>"),
        ("MCP Builder",
         "Developed an LLM-powered pipeline that pre-processes OpenAPI specs (endpoint grouping, masking, "
         "description generation), with human-in-the-loop review for route validation and domain knowledge. "
         "<b>120+ internal APIs mapped</b>, progressively integrated at runtime."),
    ]
    for title, desc in proofs_bl:
        story.append(Paragraph(title, s["bullet"]))
        story.append(Paragraph(desc, s["bullet_body"]))

    story.append(Spacer(1, 3.5 * mm))

    # --- CNRS ---
    story.append(job_header("MACHINE LEARNING ENGINEER", "Dec. 2021 - Jan. 2026"))
    story.append(Paragraph(
        "CNRS - National AI Research Programme (PNRIA)  |  Toulouse", s["company"]))
    story.append(Paragraph(
        "Collaborated with research teams across France on applied AI projects. "
        "Led two projects in parallel (6-12 months each), delivering to major French research institutions "
        "(Meteo France, CNES, CEA, INEE). Training and fine-tuning on Jean Zay (multi-GPU DDP, up to 8 GPUs, Slurm).",
        s["body"]
    ))
    story.append(Paragraph("GENS / MetScore - Meteo France", s["bullet"]))
    story.append(Paragraph(
        "Evaluated production weather models; performed multi-GPU optimization and fine-tuning of a diffusion "
        "model (DDPM) in PyTorch on Jean Zay. Built MetScore (YAML config, Python library). "
        "<b>Library still in production</b>; diffusion POC achieved <b>20% compute savings</b> with no loss in quality. "
        "Co-authored AMS 2025 paper.",
        s["bullet_body"]
    ))
    story.append(Paragraph("DeepFaune - CNRS/INEE", s["bullet"]))
    story.append(Paragraph(
        "Fine-tuned YOLOv5 on a custom dataset (1.5M images, 24 classes), multi-GPU training, "
        "addressed class imbalance, optimized for inference speed on CPU. "
        "<b>93% accuracy across 24 species, 3x faster.</b> Peer-reviewed publication.",
        s["bullet_body"]
    ))
    story.append(Paragraph("Other contributions", s["bullet"]))
    story.append(Paragraph(
        "AUTOFILL (CEA, PairVAE, nanomaterial data generation, MAE 0.98), "
        "BIGSF (CNES, tech lead and architecture refactor, galactic filament image analysis library), "
        "MORPHOGAN (Univ. Lorraine, StyleGAN2 code overhaul, automated pipeline).<br/>"
        "Taught: <i>Introduction to LLMs</i> (3-hour course, ~25 PhD students and CNRS researchers).",
        s["bullet_body"]
    ))

    story.append(Spacer(1, 3.5 * mm))

    # --- Agileo ---
    story.append(job_header("SOFTWARE ENGINEER (apprenticeship)", "Aug. 2020 - Sept. 2021"))
    story.append(Paragraph("Agileo Automation  |  Montauban", s["company"]))
    story.append(Paragraph(
        "Built a supervision and control framework for robotic machinery in semiconductor manufacturing. "
        "C#, object-oriented architecture, HMI, CI/CD. Team of 5 engineers, Agile/Scrum.",
        s["body"]
    ))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── EDUCATION ───
    sm = S("sm_formation", fontSize=7.5, leading=9.5, textColor=GRAY)
    sm_date = S("sm_date", fontSize=7.5, leading=9.5, textColor=GRAY, alignment=TA_RIGHT)
    story.append(Paragraph("EDUCATION", s["section"]))
    row_m = [[Paragraph("<b>MSc - ARTIFICIAL INTELLIGENCE &amp; PATTERN RECOGNITION (IARF)</b>  |  "
              "Universite Paul Sabatier Toulouse III - IRIT  |  Deep Learning, Computer Vision, NLP", sm),
              Paragraph("2019 - 2021", sm_date)]]
    t_m = Table(row_m, colWidths=[W * 0.8, W * 0.2])
    t_m.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                              ("TOPPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
    story.append(t_m)
    row_l = [[Paragraph("<b>BSc - COMPUTER SCIENCE</b>  |  Universite Paul Sabatier Toulouse III", sm),
              Paragraph("2016 - 2019", sm_date)]]
    t_l = Table(row_l, colWidths=[W * 0.8, W * 0.2])
    t_l.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                              ("TOPPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
    story.append(t_l)
    story.append(Paragraph(
        "<b>Languages:</b> French (native)  |  English (full professional proficiency, scientific writing)", sm))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── PUBLICATIONS ───
    ps = S("pub", fontSize=7.8, leading=10, textColor=GRAY)
    story.append(Paragraph("PUBLICATIONS", s["section"]))
    story.append(Paragraph(
        '<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        'color="#1155CC">'
        '"Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2"</a>'
        " - AIES, 2025. <b>3rd author</b>, peer-reviewed.",
        ps
    ))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="#1155CC">'
        '"The DeepFaune initiative: automatic identification of European fauna"</a>'
        " - <b>Julien Rabault</b> et al. <b>Co-author</b>, peer-reviewed.",
        ps
    ))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── OPEN SOURCE PROJECTS ───
    story.append(Paragraph("OPEN SOURCE PROJECTS", s["section"]))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/LLMock" color="#1155CC"><b>LLMock</b></a> (PyPI) - '
        "LLM mock server for testing retries, fallbacks and rate limiting. Python, FastAPI, "
        "10+ providers, OpenAI-compatible.", ps))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/DDPM-weather" color="#1155CC"><b>DDPM-weather</b></a> - '
        "Probabilistic diffusion model for weather image denoising, 20% compute cost savings. PyTorch, Meteo France.", ps))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/DaysToBananaDeath" color="#1155CC"><b>BananaML</b></a> - '
        "End-to-end ML pipeline deployed on AWS. Computer Vision + REST API. FastAPI, Docker, CI/CD.", ps))

    doc.build(story)
    print(f"CV (EN) generated: {output}")


if __name__ == "__main__":
    build_cv()
