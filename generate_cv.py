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
ROLE = "Ingénieur IA &middot; agents LLM &amp; RAG en production"

CONTACT = (
    f'{_icon("location")}&nbsp;Toulouse, France&nbsp;&nbsp;&nbsp;'
    f'{_icon("phone")}&nbsp;+33 7 81 16 46 29<br/>'
    f'{_icon("email")}&nbsp;<a href="mailto:julienrabault@icloud.com" color="{LINK}">julienrabault@icloud.com</a><br/>'
    f'{_icon("linkedin")}&nbsp;<a href="https://linkedin.com/in/julienrabault" color="{LINK}">linkedin.com/in/julienrabault</a><br/>'
    f'{_icon("github")}&nbsp;<a href="https://github.com/JulienRabault" color="{LINK}">github.com/JulienRabault</a><br/>'
    f'{_icon("globe")}&nbsp;<a href="https://julienrabault.github.io/?src=cv" color="{LINK}">julienrabault.github.io</a>'
)

SUMMARY = (
    "Conception et mise en production d'agents LLM et de systèmes RAG chez des clients, "
    "après quatre ans de recherche appliquée au CNRS : entraînement et fine-tuning de modèles deep "
    "learning sur supercalculateur (PyTorch, multi-GPU). Deux publications peer-reviewed."
)

SKILLS = [
    ("Systèmes agentiques",
     "Agents LLM en production, RAG, evals (golden sets, LLM-as-judge), observabilité, sécurité "
     "des agents, suivi des coûts d'inférence, multimodal (OCR, vision, audio), MCP, "
     "LangChain / LangGraph, fine-tuning"),
    ("Langages &amp; données",
     "Python, FastAPI, SQL, Weaviate, PostgreSQL, MongoDB, Hugging Face, API Mistral et OpenAI"),
    ("Infrastructure",
     "Docker, Kubernetes, Helm, GitLab CI, AWS, Celery, RabbitMQ, S3, Airflow, MLflow, Langfuse, "
     "Slurm, Linux"),
    ("Machine learning",
     "PyTorch, Transformers, entraînement multi-GPU (DDP), modèles de diffusion, computer vision, "
     "U-Net, YOLO, GAN, VAE"),
]

EXPERIENCE = [
    {
        "title": "AI Engineer",
        "org": "Berger-Levrault",
        "place": "Toulouse &middot; Équipe R&amp;D IA",
        "dates": "Janv. 2026 &ndash; présent",
        "context": (
            "Conception et développement d'Athena, la plateforme agentique de Berger-Levrault : "
            "agents branchés sur les corpus documentaires et les APIs métier des clients du groupe "
            "(collectivités, juridique, industrie, maintenance, RH publique). Corpus de ~100k documents "
            "techniques, ~70 utilisateurs pilotes, observabilité, monitoring et suivi des coûts "
            "(Langfuse), ateliers clients."
        ),
        "bullets": [
            "<b>Architecture agentique d'Athena</b> (LangGraph), refonte en équipe : passage d'un "
            "routeur (un agent par tâche : RAG, APIs MCP, rapports) à un agent réutilisable "
            "configuré par profil, avec gestion du contexte, skills générés automatiquement, "
            "orchestration de sous-agents et contrat d'événements unifié. Ajouter un outil ne "
            "demande plus de construire un graphe.",

            "<b>Évaluation et fiabilité des agents</b> : jeux de référence (golden sets), scoring "
            "LLM-as-judge, bancs comparatifs entre architectures et suivi des régressions via "
            "Langfuse.",

            "<b>Sécurité des agents</b> : cloisonnement des contenus récupérés (injection de prompt "
            "indirecte), bornes d'exécution des tools (timeouts, restriction par profil d'agent).",

            "<b>MCP Builder</b> : transforme les APIs des BU en serveurs MCP. Un LLM sélectionne les "
            "endpoints utiles, audite leurs lacunes et génère des tools sur mesure (workflows ou "
            "code Python via FastMCP), en human-in-the-loop. Créé seul, déployé. Modèle retenu sur "
            "benchmark : 4,1× plus rapide et 3,2× moins cher.",

            "<b>Content-extractor</b>, extraction multimodale (OCR / PDF / DOCX / audio) : service "
            "créé de zéro, 7 pipelines d'extraction, traitement batch asynchrone (Celery + API batch "
            "Mistral), architecture factory/registry extensible. Déployé, -50 % sur les coûts "
            "d'extraction.",

            "<b>Agent de templates de documents</b> : tools de lecture de documents Word pour en "
            "extraire des templates, puis second agent et tools permettant de remplir ces templates "
            "en langage naturel. Du prototype à la production.",

            "<b>Pipeline LLM de structuration de données métier</b> (RH du secteur public) : "
            "transforme des comptes rendus d'entretiens en besoins de formation normalisés, "
            "dédoublonnés et regroupés, puis rapprochés d'un catalogue.",

            "<b>Chaîne d'ingestion RAG</b> (Airflow) : étapes d'enrichissement ajoutées (data "
            "augmentation, chunking, embeddings, questions et mots-clés indexés, filtres "
            "temporels). Un DAG par client en production.",
        ],
    },
    {
        "title": "Machine Learning Engineer",
        "org": "CNRS &middot; PNRIA",
        "place": "Toulouse",
        "dates": "Déc. 2021 &ndash; Janv. 2026 &middot; 4 ans",
        "context": (
            "Réseau d'ingénieurs IA en appui aux équipes de recherche (météo, astrophysique, "
            "matériaux, éthologie, biologie). Plus de 10 projets accompagnés, jusqu'à 2 en parallèle "
            "(6-12 mois), pour Météo France, CNES, CEA, INEE. Entraînement et fine-tuning sur Jean "
            "Zay (multi-GPU DDP, 8 GPU, Slurm)."
        ),
        "bullets": [
            "<b>GENS / MetScore, Météo France :</b> optimisation multi-GPU et fine-tuning d'un "
            "modèle de diffusion (DDPM) en PyTorch ; conception de MetScore (librairie de métriques), "
            "toujours en production. POC diffusion à -20 % de calcul à qualité équivalente. "
            "Co-auteur du papier AIES 2025.",

            "<b>DeepFaune, CNRS / INEE :</b> fine-tuning YOLOv8 sur 1,5 M d'images (24 classes), "
            "gestion du déséquilibre de classes. 93 % de précision, inférence 3× plus rapide. "
            "Publication peer-reviewed.",

            "<b>BIGSF, CNES :</b> tech lead sur la refonte d'une librairie d'analyse d'images de "
            "filaments galactiques (U-Net) : architecture modulaire, tests, documentation. "
            "Toolbox publique.",

            "<b>AUTOFILL, CEA :</b> implémentation du modèle PairVAE pour la génération et la "
            "complétion de données de nanomatériaux, erreur moyenne absolue de 0,98. Librairie "
            "paramétrable pour d'autres matériaux.",

            "<b>MORPHOGAN, Univ. Lorraine :</b> refonte complète d'un code StyleGAN2 pour l'étude de "
            "la variabilité morphologique d'ailes de papillons : pipeline automatisée, tests, "
            "conteneurisation.",

            "<b>Formation :</b> « Introduction aux LLMs » créée et dispensée à ~25 doctorants et "
            "chercheurs.",
        ],
    },
    {
        "title": "Ingénieur logiciel",
        "org": "Agileo Automation",
        "place": "Montauban",
        "dates": "Août 2020 &ndash; Sept. 2021 &middot; 1 an",
        "context": "",
        "bullets": [
            "<b>Framework de supervision de machines robotisées</b> (semi-conducteurs) : C#, "
            "architecture orientée objets, IHM, CI/CD. Équipe de 5, Agile / Scrum.",
        ],
    },
]

EDUCATION = [
    ("Master intelligence artificielle et reconnaissance des formes",
     "Université Paul Sabatier / IRIT", "2019 &ndash; 2021"),
    ("Licence informatique", "Université Paul Sabatier Toulouse III", "2016 &ndash; 2019"),
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
    output = os.path.join(BASE, "CV_JULIEN_RABAULT.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=14 * mm, rightMargin=14 * mm,
        topMargin=10 * mm, bottomMargin=10 * mm,
        title="CV - Julien Rabault", author="Julien Rabault",
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
    section("COMPÉTENCES")
    for cat, items in SKILLS:
        story.append(Paragraph(f"<b>{cat} :</b> {items}", s["small"]))

    # ─── EXPERIENCE ───
    section("EXPÉRIENCE PROFESSIONNELLE")
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
    section("FORMATION")
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
    section("PROJETS OPEN SOURCE")
    story.append(Paragraph(
        f'<b><a href="https://github.com/langchain-ai/langchain/pull/37008" color="{LINK}">'
        "LangChain</a></b> : contribution mergée sur l'intégration Mistral, remontée des "
        "métadonnées de citation.", s["small"]))
    story.append(Paragraph(
        f'<b><a href="https://github.com/JulienRabault/LLMock" color="{LINK}">LLMock</a></b> '
        "(PyPI) : serveur de mock LLM pour tester retries et fallbacks, plus de dix fournisseurs.",
        s["small"]))
    story.append(Paragraph(
        f'<b><a href="https://github.com/JulienRabault/DDPM-weather" color="{LINK}">'
        "DDPM-weather</a></b> : modèle de diffusion pour le débruitage d'images météorologiques.",
        s["small"]))

    doc.build(story)
    print(f"CV generated: {output}")


if __name__ == "__main__":
    build_cv()
