"""Generate Julien Rabault's CV as a clean, ATS-friendly one-page PDF (FR). v8

Design goals: single column, generous whitespace, restrained typography,
sparing use of bold, correct French accents. No decorative graphics.
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
    "Ingénieur IA appliquée. 4 ans au CNRS à entraîner et industrialiser des modèles deep "
    "learning en production (PyTorch, multi-GPU, supercalculateur Jean Zay), 2 publications "
    "peer-reviewed. Aujourd'hui chez Berger-Levrault : conception d'Athena, plateforme agentique "
    "multi-agents (LangGraph, RAG, MCP) déployée chez des clients."
)

SKILLS = [
    ("Agentique &amp; RAG",
     "RAG / GraphRAG, agents tool-first, multi-agents, sous-agents, MCP, LangChain / LangGraph, "
     "prompt engineering, structured outputs, embeddings, fine-tuning"),
    ("Deep Learning",
     "PyTorch, Transformers, computer vision, modèles de diffusion (DDPM / DDIM), NLP, "
     "CNN / U-Net / YOLOv8, modèles génératifs (GAN, VAE)"),
    ("MLOps &amp; Infra",
     "Docker, AWS, CI/CD, MLflow, Airflow, Kubernetes, Celery, Langfuse, HPC / Slurm, Linux"),
    ("Développement",
     "Python, FastAPI, Hugging Face, Weaviate, API Mistral / OpenAI, Git, "
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
        "contact": S("contact", fontSize=8.2, leading=11.3, textColor=MUTED, alignment=TA_RIGHT),
        "summary": S("summary", fontSize=8.5, leading=11.3, textColor=BODY),
        "section": S("section", fontName=FONT_BOLD, fontSize=9.5, leading=11,
                     textColor=INK, spaceBefore=0, spaceAfter=0),
        "job": S("job", fontName=FONT_BOLD, fontSize=10, leading=12, textColor=INK),
        "dates": S("dates", fontSize=8.5, leading=12, textColor=MUTED, alignment=TA_RIGHT),
        "org": S("org", fontSize=8.5, leading=11, textColor=MUTED, spaceAfter=2),
        "intro": S("intro", fontSize=8.5, leading=11.3, textColor=BODY, spaceAfter=2),
        "bullet": S("bullet", fontSize=8.5, leading=11.3, textColor=BODY,
                    leftIndent=10, bulletIndent=0, spaceAfter=1.5),
        "edu": S("edu", fontSize=8.5, leading=11.3, textColor=BODY, spaceAfter=1.5),
        "edu_date": S("edu_date", fontSize=8.5, leading=11.3, textColor=MUTED, alignment=TA_RIGHT),
        "small": S("small", fontSize=8.5, leading=11.3, textColor=BODY, spaceAfter=2),
    }


def build_cv():
    output = os.path.join(BASE, "CV_JULIEN_RABAULT.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=9 * mm, rightMargin=9 * mm,
        topMargin=5 * mm, bottomMargin=6 * mm,
        title="CV - Julien Rabault", author="Julien Rabault",
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

    # ─── COMPETENCES ───
    section("COMPÉTENCES TECHNIQUES")
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
    section("EXPÉRIENCE PROFESSIONNELLE")

    job_header("AI Engineer", "Janv. 2026 - présent")
    story.append(Paragraph("Berger-Levrault &middot; Toulouse &middot; Équipe R&amp;D IA", s["org"]))
    story.append(Paragraph(
        "Conception et développement d'Athena, la plateforme agentique de Berger-Levrault : agents "
        "connectés aux documents et aux APIs métier pour les clients du groupe (collectivités, "
        "santé, industrie, maintenance). ~70 utilisateurs pilotes, observabilité Langfuse.", s["intro"]))
    bullet("Refonte de l'architecture agentique d'Athena (plateforme multi-agents en production, "
           "LangGraph), en équipe : passage d'un routeur (un agent par tâche : RAG, APIs MCP, rapports) "
           "à un agent unique tool-first, avec gestion du contexte, skills et création automatique de "
           "skills, et orchestration de sous-agents.")
    bullet("Content-extractor (OCR / PDF / DOCX) : refonte complète, traitement batch asynchrone "
           "(Celery + API batch Mistral), architecture factory/registry extensible. Déployé, "
           "-50 % sur les coûts d'extraction.")
    bullet("MCP Builder : transforme les APIs des BU en serveurs MCP. Un LLM sélectionne les "
           "endpoints utiles, audite leurs lacunes et génère des tools sur mesure (workflows ou code "
           "Python via FastMCP), en human-in-the-loop. Déployé.")
    bullet("Chaîne d'ingestion RAG (Airflow). Complétion et ajout d'étapes d'enrichissement : data "
           "augmentation, chunking, embeddings, génération de questions/mots-clés indexés, "
           "filtres temporels.")
    bullet("Évaluation et fiabilité des agents : jeux de référence (golden sets), scoring "
           "LLM-as-judge et suivi des régressions via Langfuse.")

    story.append(Spacer(1, 2.2 * mm))
    job_header("Machine Learning Engineer", "Déc. 2021 - Janv. 2026 &middot; 4 ans")
    story.append(Paragraph("CNRS &middot; Programme National de Recherche en IA (PNRIA) &middot; Toulouse", s["org"]))
    story.append(Paragraph(
        "Réseau d'ingénieurs IA en appui aux équipes de recherche (météo, astrophysique, matériaux, "
        "éthologie, biologie). Plus de 10 projets accompagnés, jusqu'à 2 en parallèle (6-12 mois), pour "
        "Météo France, CNES, CEA, INEE. Entraînement et fine-tuning sur Jean "
        "Zay (multi-GPU DDP, 8 GPU, Slurm).", s["intro"]))
    bullet("<b>GENS / MetScore, Météo France :</b> optimisation multi-GPU et fine-tuning d'un "
           "modèle de diffusion (DDPM) en PyTorch ; conception de MetScore (librairie de métriques), "
           "toujours en production. POC diffusion à -20 % de calcul à qualité équivalente. "
           "Co-auteur du papier AMS 2025.")
    bullet("<b>DeepFaune, CNRS / INEE :</b> fine-tuning YOLOv8 sur 1,5 M d'images (24 classes), "
           "gestion du déséquilibre de classes. 93 % de précision, inférence 3× plus rapide. "
           "Publication peer-reviewed.")
    bullet("<b>BIGSF, CNES :</b> tech lead sur la refonte d'une librairie d'analyse d'images de "
           "filaments galactiques (U-Net) : architecture modulaire, tests, documentation. "
           "Toolbox publique.")
    bullet("<b>Autres :</b> AUTOFILL (CEA, PairVAE, MAE 0,98), MORPHOGAN (StyleGAN2, Univ. Lorraine). "
           "Formation &laquo; Introduction aux LLMs &raquo; (3 h, ~25 doctorants / chercheurs).")

    story.append(Spacer(1, 2.2 * mm))
    job_header("Ingénieur logiciel (alternance)", "Août 2020 - Sept. 2021 &middot; 1 an")
    story.append(Paragraph("Agileo Automation &middot; Montauban", s["org"]))
    story.append(Paragraph(
        "Framework de supervision de machines robotisées (semi-conducteurs) : C#, architecture "
        "orientée objets, IHM, CI/CD. Équipe de 5, Agile / Scrum.", s["intro"]))

    # ─── FORMATION ───
    section("FORMATION")

    def edu_row(left, date):
        t = Table([[Paragraph(left, s["edu"]), Paragraph(date, s["edu_date"])]],
                  colWidths=[W * 0.82, W * 0.18])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(t)

    edu_row("<b>Master IA et Reconnaissance des Formes (IARF)</b>, "
            "Université Paul Sabatier Toulouse III / IRIT", "2019 - 2021")
    edu_row("<b>Licence Informatique</b>, Université Paul Sabatier Toulouse III", "2016 - 2019")
    story.append(Paragraph(
        "<b>Langues :</b> Français (natif) &middot; Anglais professionnel (rédaction scientifique, "
        "documentation technique)", s["small"]))

    # ─── PUBLICATIONS ───
    section("PUBLICATIONS")
    story.append(Paragraph(
        f'<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        f'color="{LINK}">Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2</a>. '
        "AIES, 2025. 3e auteur, peer-reviewed.", s["small"]))
    story.append(Paragraph(
        f'<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        f'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="{LINK}">'
        "The DeepFaune initiative: automatic identification of European fauna</a>. "
        "N. Rigoudy et al. Co-auteur, peer-reviewed.", s["small"]))

    # ─── PROJETS OPEN SOURCE ───
    section("PROJETS OPEN SOURCE")
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/LLMock" color="{LINK}"><b>LLMock</b></a> (PyPI). '
        "Mock server LLM : retries / fallbacks, 10+ providers, compatible OpenAI. Python, FastAPI.",
        s["small"]))
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}"><b>DDPM-weather</b></a>. '
        "Modèle de diffusion pour le débruitage d'images météo, -20 % de ressources. PyTorch.",
        s["small"]))
    story.append(Paragraph(
        f'<a href="https://github.com/JulienRabault/DaysToBananaDeath" color="{LINK}"><b>BananaML</b></a>. '
        "Pipeline ML end-to-end sur AWS : computer vision + API REST. FastAPI, Docker, CI/CD.",
        s["small"]))

    doc.build(story)
    print(f"CV generated: {output}")


if __name__ == "__main__":
    build_cv()
