import type { LegalContent } from "./types";

// Doit rester fidèle à ce que le code fait : analytics.ts (mesure), chat.js (chat, quota), retention.js (durées).
export const legalFr: LegalContent = {
  link: "Mentions légales et confidentialité",
  title: "Mentions légales et confidentialité",
  updated: "Mis à jour le 16 octobre 2026.",
  sections: [
    {
      title: "Éditeur",
      paragraphs: [
        "Ce site est le site personnel de Julien Rabault, ingénieur IA, publié à titre non professionnel. Directeur de la publication : Julien Rabault. Contact : julienrabault@icloud.com.",
      ],
    },
    {
      title: "Hébergement",
      paragraphs: [
        "Le site est hébergé par GitHub Pages : GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.",
        "L'agent du chat et la mesure d'audience tournent sur Cloudflare Workers : Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.",
      ],
    },
    {
      title: "Ce que le site mesure",
      paragraphs: [
        "Pour savoir comment le site est utilisé, il enregistre les pages vues et quelques clics (CV, contact, projets), avec la page d'origine, la langue, le navigateur, ainsi que le pays et le réseau que Cloudflare déduit de l'adresse IP. L'adresse IP elle-même n'est pas conservée.",
        "Ces données sont rattachées à un identifiant aléatoire gardé dans votre navigateur et renouvelé tous les 13 mois. Pas de cookie, pas d'outil de mesure tiers, pas de publicité.",
      ],
    },
    {
      title: "Le chat",
      paragraphs: [
        "Les questions posées à l'agent et ses réponses sont enregistrées, pour corriger l'agent et voir ce que les visiteurs cherchent. Pour produire la réponse, la question est transmise à Anthropic (modèle Claude), aux États-Unis. N'y écrivez pas d'informations personnelles.",
        "Pour éviter les abus, le nombre de questions par jour est compté à partir d'une empreinte de l'adresse IP, calculée avec une clé secrète : elle ne permet pas de retrouver l'adresse et elle est effacée au bout de deux jours.",
      ],
    },
    {
      title: "Autres services",
      paragraphs: [
        "La page Parcours et certaines réponses du chat interrogent l'API publique de GitHub pour afficher les étoiles des dépôts : GitHub reçoit alors votre adresse IP, comme pour toute page web. Les polices de caractères sont servies par le site lui-même.",
        "Si la vérification anti-robot du chat est activée, elle passe par Cloudflare Turnstile, qui analyse le navigateur pour distinguer un humain d'un robot, sans cookie publicitaire.",
      ],
    },
    {
      title: "Stockage dans le navigateur",
      paragraphs: [
        "Le site garde dans votre navigateur le thème choisi, l'identifiant de visite et sa date de création, le compteur de questions du jour et, le temps de la visite, un identifiant de session, la provenance de la visite, le laissez-passer anti-robot et l'état de la bulle du chat. Vous pouvez les effacer à tout moment depuis les réglages de votre navigateur.",
      ],
    },
    {
      title: "Durée de conservation et base légale",
      paragraphs: [
        "Les visites et les échanges du chat sont effacés automatiquement au bout de 13 mois. Ces traitements reposent sur l'intérêt légitime de Julien Rabault à comprendre l'usage de son site et à améliorer son agent.",
      ],
    },
    {
      title: "Vos droits",
      paragraphs: [
        "Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, ou vous opposer à leur traitement, en écrivant à julienrabault@icloud.com. Si la réponse ne vous convient pas, vous pouvez saisir la CNIL (cnil.fr).",
      ],
    },
    {
      title: "Propriété intellectuelle",
      paragraphs: [
        "Les textes et les visuels du site appartiennent à Julien Rabault, sauf mention contraire. Les projets open source cités suivent leur propre licence.",
      ],
    },
  ],
};
