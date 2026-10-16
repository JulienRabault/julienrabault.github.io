"""Generate Julien Rabault's CV as a clean, ATS-friendly one-page PDF (FR). v9

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
ROLE = "Ingénieur IA, agents LLM et RAG en production"

CONTACT = (
    f'{_icon("location")}&nbsp;Toulouse, ouvert à Paris, remote, Canada<br/>'
    f'{_icon("phone")}&nbsp;+33 7 81 16 46 29&nbsp;&nbsp;&nbsp;'
    f'{_icon("email")}&nbsp;<a href="mailto:julienrabault@icloud.com" color="{LINK}">julienrabault@icloud.com</a><br/>'
    f'{_icon("linkedin")}&nbsp;<a href="https://linkedin.com/in/julienrabault" color="{LINK}">linkedin.com/in/julienrabault</a><br/>'
    f'{_icon("github")}&nbsp;<a href="https://github.com/JulienRabault" color="{LINK}">github.com/JulienRabault</a><br/>'
    f'{_icon("globe")}&nbsp;<a href="https://julienrabault.github.io/?src=cv" color="{LINK}">julienrabault.github.io</a>'
)

SUMMARY = (
    "Conception de harnais agentiques et mise en production d'agents LLM et de systèmes RAG chez "
    "des clients, après "
    "quatre ans de deep learning sur supercalculateur au CNRS (PyTorch, multi-GPU). "
    "Deux publications peer-reviewed."
)

SKILLS = [
    ("Systèmes agentiques",
     "Harnais d'agents (boucle agentique, tool calling, middlewares, mémoire, human-in-the-loop), "
     "LangChain / LangGraph / Deep Agents, RAG, MCP, evals (golden sets, LLM-as-judge, A/B "
     "testing), multimodal (OCR, vision, audio), fine-tuning"),
    ("Langages &amp; données",
     "Python, PyTorch, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, API Mistral et OpenAI"),
    ("Infrastructure",
     "Docker, GitLab CI, AWS, Celery, RabbitMQ, Airflow, Langfuse, Slurm, Linux"),
]

EXPERIENCE = [
    {
        "title": "AI Engineer",
        "org": "Berger-Levrault",
        "place": "Toulouse (équipe R&amp;D IA)",
        "dates": "Janv. 2026 - présent",
        "context": (
            "Athena, plateforme agentique branchée sur les documents et APIs métier de "
            "ses clients (collectivités, juridique, industrie, RH publique) : 100k "
            "documents, pilote de 6 mois avec 70 utilisateurs, mise en production en cours. "
            "Besoins recueillis auprès des business units, ateliers clients."
        ),
        "groups": [
            ("Cœur de la plateforme", [
                "<b>Harnais agentique</b> (LangChain / LangGraph), architecture conçue et portée. "
                "Passage d'un routeur d'agents à une boucle agentique configurée par "
                "profil, étendue par middlewares : mémoire persistante, validation humaine des "
                "actions sensibles, gestion du contexte (résumé, budget de tokens), garde-fous, "
                "skills, sous-agents. Migration en cours vers Deep Agents.",

                "<b>Outils de l'agent</b> : RAG agentique, recherche web, calcul et serveurs MCP "
                "associés, branchés sur la même boucle. Ajouter un outil ne demande plus de "
                "construire un graphe.",

                "<b>Évaluation et monitoring</b> : refonte du monitoring sous Langfuse v4 (traces, "
                "datasets, évaluations et scoring automatiques, LLM-as-judge), golden sets, comparaison "
                "de modèles, de prompts et d'architectures, suivi des régressions et des coûts ; cloisonnement "
                "des contenus récupérés contre l'injection de prompt indirecte.",

                "<b>MCP Builder</b> : transforme les APIs métier internes en serveurs MCP. Un LLM sélectionne "
                "les endpoints utiles, audite leurs lacunes et génère des tools sur mesure (workflows "
                "ou code Python via FastMCP), en human-in-the-loop.",
            ]),
            ("Services et pipelines LLM", [
                "<b>Content-extractor</b>, extraction multimodale (OCR / PDF / DOCX / audio) : "
                "service FastAPI créé de zéro, 7 pipelines, batch asynchrone (Celery + API batch Mistral), "
                "architecture factory/registry. Déployé, -50 % sur les coûts d'extraction.",

                "<b>Agent de templates</b> : extrait des templates de documents Word, qu'un second "
                "agent remplit en langage naturel. En production.",

                "<b>Structuration de données métier</b> (RH publique) : comptes rendus "
                "d'entretiens transformés en besoins normalisés, dédoublonnés, rapprochés d'un "
                "catalogue. Ingestion RAG enrichie (Airflow) : chunking, embeddings, "
                "questions indexées.",
            ]),
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "org": "CNRS (PNRIA)",
        "place": "Toulouse",
        "dates": "Déc. 2021 - Janv. 2026 (4 ans)",
        "context": (
            "Ingénieur intégré aux équipes de recherche (météo, astrophysique, matériaux, "
            "éthologie, biologie) : plus de 10 projets de 6 à 12 mois, 2 en parallèle, du recueil "
            "du besoin à la livraison, pour Météo France, CNES, CEA, INEE. Entraînement et fine-tuning sur le supercalculateur "
            "Jean Zay (multi-GPU DDP, Slurm). Formation d'introduction aux LLMs pour 25 doctorants."
        ),
        "groups": [
            ("Sélection de projets", [
                "<b>GENS / MetScore, Météo France :</b> entraînement multi-GPU et fine-tuning d'un "
                "modèle de diffusion (DDPM) en PyTorch ; conception de MetScore (métriques), "
                "toujours en production. POC : -20 % de calcul, qualité équivalente. "
                "Co-auteur, AIES 2025.",

                "<b>DeepFaune, CNRS / INEE :</b> fine-tuning YOLOv8 sur 1,5 M d'images (24 classes), "
                "gestion du déséquilibre de classes. 93 % de précision, inférence 3 fois plus rapide. "
                "Publication peer-reviewed.",

                "<b>BIGSF, CNES :</b> tech lead sur la refonte d'une librairie U-Net d'analyse "
                "d'images galactiques, toolbox publique.",

                "<b>AUTOFILL, CEA :</b> PairVAE pour la complétion de données de nanomatériaux "
                "(MAE 0,98). <b>MORPHOGAN, Univ. Lorraine :</b> refonte d'un code StyleGAN2, "
                "pipeline automatisée et conteneurisée.",
            ]),
        ],
    },
    {
        "title": "Ingénieur logiciel",
        "org": "Agileo Automation",
        "place": "Montauban",
        "dates": "Août 2020 - Sept. 2021 (1 an)",
        "context": "",
        "groups": [
            ("", [
                "<b>Framework de supervision de machines de production</b> (semi-conducteurs) : "
                "C#, IHM, CI/CD, équipe de 5 en Scrum.",
            ]),
        ],
    },
]

EDUCATION = [
    ("Master intelligence artificielle et reconnaissance des formes",
     "Université Paul Sabatier / IRIT", "2019 - 2021"),
    ("Licence informatique", "Université Paul Sabatier Toulouse III", "2016 - 2019"),
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
    output = os.path.join(BASE, "CV_JULIEN_RABAULT.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=11 * mm, rightMargin=11 * mm,
        topMargin=6.5 * mm, bottomMargin=6.5 * mm,
        title="CV - Julien Rabault", author="Julien Rabault",
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
        story.append(Spacer(1, 1.4 * mm))
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
    section("COMPÉTENCES")
    for cat, items in SKILLS:
        story.append(Paragraph(f"<b>{cat} :</b> {items}", s["small"]))

    # ─── EXPERIENCE ───
    section("EXPÉRIENCE PROFESSIONNELLE")
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
    section("FORMATION")
    story.append(Paragraph(
        "<b>Master intelligence artificielle et reconnaissance des formes</b>, Université Paul "
        "Sabatier / IRIT (2021) ; <b>Licence informatique</b>, Université Paul "
        "Sabatier (2019)", s["small"]))

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
        f"</a></b> : contribution mergée (intégration Mistral) ; "
        f'<b><a href="https://github.com/JulienRabault/LLMock" color="{LINK}">LLMock</a></b> (PyPI) : '
        f"serveur de mock LLM, 10+ fournisseurs ; "
        f'<b><a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}">DDPM-weather</a>'
        "</b>&nbsp;: diffusion pour images météo.", s["small"]))
    doc.build(story)
    print(f"CV generated: {output}")


if __name__ == "__main__":
    build_cv()
