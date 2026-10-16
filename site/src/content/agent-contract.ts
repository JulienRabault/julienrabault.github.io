// Contrat entre l'agent et la page, partagé par le site et le worker (qui importe ce fichier).
// L'agent n'écrit jamais d'URL ni de HTML : il cite des passages par identifiant et demande des widgets
// par nom. Tout ce qui sort de cette liste est retiré, côté worker puis côté navigateur.

export const LINK_IDS = [
  "cv",
  "email",
  "linkedin",
  "github",
  "career",
  "career-bl",
  "career-cnrs",
  "career-agileo",
  "aies",
  "deepfaune-paper",
  "langchain-pr",
  "llmock",
  "ddpm-weather",
] as const;

export const BLOCK_WIDGETS = ["harness", "timeline", "contact"] as const;

/** Fiches projet : le problème, les étapes, les résultats et la stack, en un coup d'œil. */
export const PROJECT_IDS = [
  "mcp-builder",
  "content-extractor",
  "templates-agent",
  "hr-data",
  "agent-evals",
  "gens",
  "deepfaune",
  "bigsf",
  "autofill",
  "morphogan",
  "agileo-framework",
] as const;

/** Cartes GitHub, enrichies en direct par l'API GitHub (étoiles, dernière mise à jour). */
export const REPO_IDS = ["llmock", "ddpm-weather", "uniqpath", "bananaml", "langchain-pr"] as const;

export type LinkId = (typeof LINK_IDS)[number];
export type BlockWidget = (typeof BLOCK_WIDGETS)[number];
export type ProjectId = (typeof PROJECT_IDS)[number];
export type RepoId = (typeof REPO_IDS)[number];

export type Directive =
  | { kind: "link"; id: LinkId }
  | { kind: "widget"; id: BlockWidget }
  | { kind: "project"; id: ProjectId }
  | { kind: "repo"; id: RepoId };

/** Au plus deux widgets par réponse : au-delà, la réponse devient une page. */
export const MAX_WIDGETS_PER_ANSWER = 2;

export const CITATION = /\[\[([a-z0-9-]+)\]\]/g;
export const DIRECTIVE = /\{\{([a-z]+)(?::([a-z0-9-]+))?\}\}/g;

const includes = <T extends string>(list: readonly T[], value: string | undefined): value is T =>
  value !== undefined && (list as readonly string[]).includes(value);

export function parseDirective(kind: string, arg: string | undefined): Directive | null {
  if (kind === "link" && includes(LINK_IDS, arg)) return { kind: "link", id: arg };
  if (kind === "project" && includes(PROJECT_IDS, arg)) return { kind: "project", id: arg };
  if (kind === "repo" && includes(REPO_IDS, arg)) return { kind: "repo", id: arg };
  if (arg === undefined && includes(BLOCK_WIDGETS, kind)) return { kind: "widget", id: kind };
  return null;
}

const MARKDOWN_LINK = /\[([^\]\n]+)\]\([^)\n]*\)/g;
const RAW_URL = /\b(?:https?:\/\/|www\.)\S+/gi;
const HTML_TAG = /<\/?[a-z][^>\n]*>/gi;
// Après le tri, un « [[ » ou un « {{ » qui n'ouvre pas un marqueur valide est un reste (réponse tronquée, marqueur cassé).
const DANGLING_CITATION = /\[\[(?![a-z0-9-]+\]\])/g;
const DANGLING_DIRECTIVE = /\{\{(?![a-z]+(?::[a-z0-9-]+)?\}\})/g;

function sanitizeOnce(text: string, sourceIds: ReadonlySet<string>): string {
  let widgets = 0;
  return text
    .replace(HTML_TAG, "")
    .replace(/[<>]/g, "")
    .replace(MARKDOWN_LINK, "$1")
    .replace(RAW_URL, "")
    .replace(CITATION, (match, id: string) => (sourceIds.has(id) ? match : ""))
    .replace(DIRECTIVE, (match, kind: string, arg: string | undefined) => {
      const directive = parseDirective(kind, arg);
      if (!directive) return "";
      if (directive.kind === "link") return match;
      widgets += 1;
      return widgets <= MAX_WIDGETS_PER_ANSWER ? match : "";
    })
    .replace(DANGLING_CITATION, "")
    .replace(DANGLING_DIRECTIVE, "");
}

/**
 * Nettoie un texte complet : HTML et chevrons, liens bruts, citations inconnues, directives hors liste.
 * Retirer un morceau peut en recoller un autre (« ht<b>tp:// ») : on repasse jusqu'à ce que le texte ne bouge plus.
 */
export function sanitizeAnswer(text: string, sourceIds: ReadonlySet<string>): string {
  let current = text;
  for (let pass = 0; pass < 5; pass++) {
    const next = sanitizeOnce(current, sourceIds);
    if (next === current) return next;
    current = next;
  }
  return current;
}

const MAX_HOLD = 400;

/** Position à partir de laquelle la fin du flux est encore incertaine (marqueur ouvert, mot en cours). */
function holdFrom(text: string): number {
  let cut = Math.max(text.lastIndexOf(" "), text.lastIndexOf("\n")) + 1;
  const bracket = text.lastIndexOf("[");
  if (bracket !== -1 && text.indexOf("]]", bracket) === -1 && text.indexOf(")", bracket) === -1) cut = Math.min(cut, bracket);
  const brace = text.lastIndexOf("{");
  if (brace !== -1 && text.indexOf("}}", brace) === -1) cut = Math.min(cut, brace);
  const tag = text.lastIndexOf("<");
  if (tag !== -1 && text.indexOf(">", tag) === -1) cut = Math.min(cut, tag);
  return text.length - cut > MAX_HOLD ? text.length : cut;
}

/**
 * Filtre de flux : ne laisse passer que du texte dont la fin est sûre, nettoyé par sanitizeAnswer.
 * Le compteur de widgets porte sur toute la réponse, pas sur chaque morceau.
 */
export function createStreamSanitizer(sourceIds: ReadonlySet<string>) {
  let pending = "";
  let emitted = "";

  const release = (upTo: number): string => {
    // Le texte déjà émis est propre et se termine sur une frontière sûre : le nettoyer à nouveau ne le change pas.
    const clean = sanitizeAnswer(emitted + pending.slice(0, upTo), sourceIds);
    pending = pending.slice(upTo);
    const delta = clean.slice(emitted.length);
    emitted = clean;
    return delta;
  };

  return {
    push(delta: string): string {
      pending += delta;
      return release(holdFrom(pending));
    },
    flush(): string {
      return release(pending.length);
    },
    /** Texte complet déjà nettoyé, pour le journal et la signature. */
    text: (): string => emitted,
  };
}
