import type { LinkId, ProjectId, RepoId } from "./agent-contract";

export interface Profile {
  name: string;
  initials: string;
  role: string;
  intro: string;
  availability: string;
  email: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  otherLocaleUrl: string;
  otherLocaleLabel: string;
}

export interface UiStrings {
  askLead: string;
  placeholder: string;
  downloadCv: string;
  downloadCvShort: string;
  contact: string;
  chatTab: string;
  careerTab: string;
  careerInline: string;
  cvInline: string;
  reading: string;
  readDone: (count: number) => string;
  quotaReached: string;
  copy: string;
  copied: string;
  sourcesCount: (count: number) => string;
  dockTitle: string;
  dockSubtitle: string;
  dockTeaser: string;
  expand: string;
  close: string;
  noTime: string;
  or: string;
  newChat: string;
  themeToggle: string;
  errorUnavailable: string;
  errorBudget: string;
  errorChallenge: string;
  timelineHint: string;
  footnote: string;
}

export interface Source {
  org: string;
  period: string;
  title: string;
  text: string;
}

/** Lien que l'agent peut proposer : une page du site, un fichier ou un profil, jamais une URL qu'il écrit lui-même. */
export interface ChatLink {
  label: string;
  href: string;
  download?: boolean;
  /** Lien vers la page Parcours, avec le chapitre où défiler. */
  career?: string;
}

/** Réponse préparée pour le prototype ; le texte cite ses sources avec [[id]]. */
export interface CannedAnswer {
  match: string[];
  read: string[];
  text: string;
}

export interface HarnessLayer {
  id: string;
  name: string;
  text: string;
}

/** Un résultat chiffré du CV. */
export interface Metric {
  id: string;
  value: string;
  label: string;
  /** Le chiffre est une estimation : il est marqué comme tel partout où il apparaît. */
  estimate?: boolean;
}

export interface CareerItem {
  /** Présent quand l'agent peut montrer ce projet en fiche ({{project:id}}). */
  id?: ProjectId;
  name: string;
  text: string;
  /** Où en est le projet : déployé, publié, démonstrateur. */
  status?: string;
  metrics?: Metric[];
  /** Fiche projet : le problème posé, la stack, les liens utiles. */
  problem?: string;
  stack?: string[];
  links?: LinkId[];
  /** Ce qu'il a fait, point par point : affiché quand la ligne est dépliée. */
  details?: string[];
  /** Le harnais se montre avec le schéma interactif. */
  widget?: "harness";
}

export interface CareerGroup {
  title?: string;
  items: CareerItem[];
}

export interface Chapter {
  id: string;
  org: string;
  title: string;
  place: string;
  dates: string;
  context?: string;
  /** Un second paragraphe, plus discret : l'équipe, ou ce que le poste demandait. */
  note?: string;
  groups: CareerGroup[];
  /** Les projets cités sans être détaillés. */
  footnote?: string;
}

/** Une ligne du parcours. */
export interface TimelineEntry {
  id: string;
  kind: "work" | "school";
  /** Le poste en cours : ses dates sont en ocre. */
  current?: boolean;
  org: string;
  role: string;
  dates: string;
  /** Chapitre ou section vers lequel la ligne fait défiler. */
  target: string;
}

export interface Diploma {
  title: string;
  school: string;
  dates: string;
}

export interface LinkItem {
  name: string;
  text: string;
  url: string;
  /** Affiché en carte GitHub, enrichie par l'API. */
  repo?: RepoId;
}

export interface ProjectLabels {
  more: string;
  less: string;
  next: string;
}

export interface CareerContent {
  title: string;
  summary: string;
  askAgent: string;
  timeline: TimelineEntry[];
  labels: { experience: string; education: string; publications: string; openSource: string; skills: string; nav: string };
  chapters: Chapter[];
  harnessHint: string;
  project: ProjectLabels;
  estimate: string;
  education: Diploma[];
  publications: LinkItem[];
  openSource: LinkItem[];
  skills: { label: string; text: string }[];
  closing: string;
}

/** Mentions légales et confidentialité : ce que le site collecte, dit en clair. */
export interface LegalContent {
  link: string;
  title: string;
  updated: string;
  sections: { title: string; paragraphs: string[] }[];
}

export interface SiteContent {
  locale: Locale;
  profile: Profile;
  ui: UiStrings;
  suggestions: string[];
  /** Questions qui défilent dans la zone de saisie de l'accueil, en plus des suggestions. */
  examples: string[];
  legal: LegalContent;
  sources: Record<string, Source>;
  links: Record<LinkId, ChatLink>;
  answers: CannedAnswer[];
  fallback: Omit<CannedAnswer, "match">;
  career: CareerContent;
  /** Le harnais d'Athena : le premier calque est le centre, le dernier entoure tout. */
  harness: HarnessLayer[];
}

export type Locale = "fr" | "en";
