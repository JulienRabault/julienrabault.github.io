"""Generate Julien Rabault's CV as a clean 1-page ATS-friendly PDF. v7
Uses icons extracted from original CV."""
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
    output = os.path.join(BASE, "CV_JULIEN_RABAULT.pdf")
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
    # Contact info with icons - stacked on the right
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
         Paragraph("AI Engineer&nbsp;&nbsp;|&nbsp;&nbsp;ML Engineer", s["role"])],
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
        "4 ans au CNRS a entrainer des modeles deep learning en production (PyTorch, multi-GPU, Jean Zay), "
        "2 publications peer-reviewed. Aujourd'hui chez Berger-Levrault : conception d'Athena, "
        "plateforme agentique multi-agents (LangGraph, RAG, MCP).",
        s["body"]
    ))
    story.append(Spacer(1, 0.5 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── COMPETENCES ───
    story.append(Paragraph("COMPETENCES TECHNIQUES", s["section"]))
    skills = [
        ("Agentique & RAG",
         "RAG / GraphRAG, Multi-agents, MCP Protocol, LangChain / LangGraph, Prompt Engineering, "
         "Structured Outputs, Embeddings, LLM Routing, Fine-tuning"),
        ("Deep Learning",
         "PyTorch, Transformers, Computer Vision, Diffusion Models (DDPM), NLP, "
         "CNNs / U-Net / YOLOv5, Modeles generatifs (GAN, VAE)"),
        ("MLOps & Infra",
         "Docker, AWS, CI/CD, MLFlow, Airflow, Kubernetes, Celery, Langfuse, HPC / Slurm, Linux"),
        ("Developpement",
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

    # ─── EXPERIENCE ───
    story.append(Paragraph("EXPERIENCES PROFESSIONNELLES", s["section"]))

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
    story.append(job_header("AI ENGINEER", "Janv. 2026 - present"))
    story.append(Paragraph(
        "Berger-Levrault  |  Toulouse  |  Equipe R&amp;D IA, 12 personnes", s["company"]))
    story.append(Paragraph(
        "Conception et developpement d'<b>Athena</b>, plateforme agentique de Berger-Levrault : "
        "multi-agents, routage intelligent, connexion aux documents et APIs metier pour tous les clients "
        "(collectivites, industrie, maintenance). Deploiement en cours, ~30 utilisateurs pilotes.",
        s["body"]
    ))
    proofs_bl = [
        ("Architecture multi-agents",
         "Conception de l'architecture multi-agents (LangGraph), routage par type de question, "
         "orchestration d'agents RAG et d'agents sur APIs MCP, integration du sourcing des reponses. "
         "<b>Plateforme en production</b>, reponses sourcees et actionnables sur plusieurs domaines metier."),
        ("Content-extractor - OCR/PDF/DOCX",
         "Refonte complete du service d'extraction : OCR, images, PDF, DOCX. Batch async (Celery + API batch "
         "Mistral), architecture factory/registry pour ajouter facilement de nouveaux formats. "
         "<b>-50% sur les couts d'extraction.</b>"),
        ("Pipelines Airflow",
         "Reprise et evolution en equipe des pipelines d'ingestion documentaire "
         "(PDF, notices, work orders, docs machine). <b>5 DAGs operationnels</b> (1 par client)."),
        ("MCP Builder",
         "Un LLM analyse les specs OpenAPI pour pre-traiter les endpoints (regroupement, masquage, "
         "generation de descriptions), puis revue human-in-the-loop pour valider routes, doc et "
         "connaissance metier. <b>120+ APIs internes cartographiees</b>, integration progressive au runtime."),
    ]
    for title, desc in proofs_bl:
        story.append(Paragraph(title, s["bullet"]))
        story.append(Paragraph(desc, s["bullet_body"]))

    story.append(Spacer(1, 3.5 * mm))

    # --- CNRS ---
    story.append(job_header("MACHINE LEARNING ENGINEER", "Dec. 2021 - Janv. 2026"))
    story.append(Paragraph(
        "CNRS - Programme National de Recherche en IA (PNRIA)  |  Toulouse", s["company"]))
    story.append(Paragraph(
        "Accompagnement d'equipes de recherche en France. "
        "2 projets en parallele (6-12 mois), livres a Meteo France, CNES, CEA, INEE. "
        "Entrainement et fine-tuning sur Jean Zay (multi-GPU DDP, 8 GPUs, Slurm). Profilage PyTorch.",
        s["body"]
    ))
    story.append(Paragraph("GENS / MetScore - Meteo France", s["bullet"]))
    story.append(Paragraph(
        "Evaluation de modeles meteo en production, optimisation multi-GPU et fine-tuning d'un modele de "
        "diffusion (DDPM) en PyTorch sur Jean Zay. Conception de MetScore (configuration YAML, librairie Python). "
        "<b>Librairie toujours en prod</b> + POC diffusion a <b>-20% de calcul</b> a qualite equivalente. "
        "Co-auteur du papier AMS 2025.",
        s["bullet_body"]
    ))
    story.append(Paragraph("DeepFaune - CNRS/INEE", s["bullet"]))
    story.append(Paragraph(
        "Fine-tuning YOLOv5 sur dataset custom (1,5M images, 24 classes), entrainement multi-GPU, "
        "gestion du desequilibre de classes, optimisation precision/vitesse CPU. "
        "<b>93% sur 24 especes, 3x plus rapide.</b> Publication peer-reviewed.",
        s["bullet_body"]
    ))
    story.append(Paragraph("Autres contributions", s["bullet"]))
    story.append(Paragraph(
        "AUTOFILL (CEA, PairVAE, generation de donnees nanomateriaux, MAE 0,98), "
        "BIGSF (CNES, tech lead et refacto d'architecture, librairie d'analyse d'images de filaments galactiques), "
        "MORPHOGAN (Univ. Lorraine, refonte code StyleGAN2, pipeline automatisee).<br/>"
        "Formation dispensee : <i>Introduction aux LLMs</i> (3h, ~25 doctorants/chercheurs CNRS).",
        s["bullet_body"]
    ))

    story.append(Spacer(1, 3.5 * mm))

    # --- Agileo ---
    story.append(job_header("INGENIEUR LOGICIEL (alternance)", "Aout 2020 - Sept. 2021"))
    story.append(Paragraph("Agileo Automation  |  Montauban", s["company"]))
    story.append(Paragraph(
        "Framework de supervision de machines robotisees (semi-conducteurs). C#, architecture OO, IHM, CI/CD. "
        "Equipe de 5 ingenieurs, Agile/Scrum.",
        s["body"]
    ))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── FORMATION ───
    sm = S("sm_formation", fontSize=7.5, leading=9.5, textColor=GRAY)
    sm_date = S("sm_date", fontSize=7.5, leading=9.5, textColor=GRAY, alignment=TA_RIGHT)
    story.append(Paragraph("FORMATIONS", s["section"]))
    row_m = [[Paragraph("<b>MASTER - IA ET RECONNAISSANCE DES FORMES (IARF)</b>  |  "
              "Universite Paul Sabatier Toulouse III - IRIT  |  Deep Learning, Vision, NLP", sm),
              Paragraph("2019 - 2021", sm_date)]]
    t_m = Table(row_m, colWidths=[W * 0.8, W * 0.2])
    t_m.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                              ("TOPPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
    story.append(t_m)
    row_l = [[Paragraph("<b>LICENCE INFORMATIQUE</b>  |  Universite Paul Sabatier Toulouse III", sm),
              Paragraph("2016 - 2019", sm_date)]]
    t_l = Table(row_l, colWidths=[W * 0.8, W * 0.2])
    t_l.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"),
                              ("TOPPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
    story.append(t_l)
    story.append(Paragraph(
        "<b>Langues :</b> Francais (natif)  |  Anglais professionnel (redaction scientifique, documentation technique)", sm))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── PUBLICATIONS ───
    ps = S("pub", fontSize=7.8, leading=10, textColor=GRAY)
    story.append(Paragraph("PUBLICATIONS", s["section"]))
    story.append(Paragraph(
        '<a href="https://journals.ametsoc.org/view/journals/aies/4/1/AIES-D-24-0058.1.xml" '
        'color="#1155CC">'
        '"Enriching Operational High-Resolution Ensemble Forecasts with StyleGAN-2"</a>'
        " - AIES, 2025. <b>3e auteur</b>, peer-reviewed.",
        ps
    ))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://scholar.google.fr/citations?view_op=view_citation&amp;hl=fr&amp;'
        'user=iUFJqVMAAAAJ&amp;citation_for_view=iUFJqVMAAAAJ:u5HHmVD_uO8C" color="#1155CC">'
        '"The DeepFaune initiative: automatic identification of European fauna"</a>'
        " - <b>Julien Rabault</b> et al. <b>Co-auteur</b>, peer-reviewed.",
        ps
    ))

    story.append(Spacer(1, 0.3 * mm))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BORDER))

    # ─── PROJETS OPEN SOURCE ───
    story.append(Paragraph("PROJETS OPEN SOURCE", s["section"]))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/LLMock" color="#1155CC"><b>LLMock</b></a> (PyPI) - '
        "Mock server LLM, retries/fallbacks, 10+ providers, OpenAI-compatible. Python, FastAPI.", ps))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/DDPM-weather" color="#1155CC"><b>DDPM-weather</b></a> - '
        "Modele de diffusion pour debruitage d'images meteo, -20% ressources. PyTorch, Meteo France.", ps))
    story.append(Spacer(1, 0.3 * mm))
    story.append(Paragraph(
        '<a href="https://github.com/JulienRabault/DaysToBananaDeath" color="#1155CC"><b>BananaML</b></a> - '
        "Pipeline ML end-to-end sur AWS. Computer Vision + API REST. FastAPI, Docker, CI/CD.", ps))

    doc.build(story)
    print(f"CV generated: {output}")


if __name__ == "__main__":
    build_cv()
