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
  quota: (remaining: number) => string;
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

/** Un résultat chiffré du CV. `remaining` dessine la barre avant / après (part qui reste, entre 0 et 1). */
export interface Metric {
  id: string;
  value: string;
  label: string;
  /** Une valeur, ou une fourchette [bas, haut] quand le chiffre est une estimation. */
  remaining?: number | [number, number];
}

export interface CareerItem {
  /** Présent quand l'agent peut montrer ce projet en fiche ({{project:id}}). */
  id?: ProjectId;
  name: string;
  text: string;
  metrics?: Metric[];
  /** Fiche projet : le problème posé, les étapes (dans l'ordre), la stack, les liens utiles. */
  problem?: string;
  steps?: string[];
  stack?: string[];
  links?: LinkId[];
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
  groups: CareerGroup[];
}

/** Segment de la frise : années décimales (2021.92 = déc. 2021). */
export interface Span {
  id: string;
  label: string;
  lane: "work" | "school";
  from: number;
  /** Absent : en cours. */
  to?: number;
  /** Chapitre ou section vers lequel le segment fait défiler. */
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
  problem: string;
  steps: string;
  results: string;
  stack: string;
}

export interface CareerContent {
  title: string;
  summary: string;
  askAgent: string;
  lanes: { work: string; school: string };
  today: string;
  spans: Span[];
  labels: { experience: string; education: string; publications: string; openSource: string; skills: string };
  chapters: Chapter[];
  harnessHint: string;
  project: ProjectLabels;
  estimate: string;
  before: string;
  after: string;
  education: Diploma[];
  publications: LinkItem[];
  openSource: LinkItem[];
  skills: { label: string; text: string }[];
  closing: string;
}

export interface SiteContent {
  locale: Locale;
  profile: Profile;
  ui: UiStrings;
  suggestions: string[];
  sources: Record<string, Source>;
  links: Record<LinkId, ChatLink>;
  answers: CannedAnswer[];
  fallback: Omit<CannedAnswer, "match">;
  career: CareerContent;
  /** Le harnais d'Athena : le premier calque est le centre, le dernier entoure tout. */
  harness: HarnessLayer[];
}

export type Locale = "fr" | "en";
