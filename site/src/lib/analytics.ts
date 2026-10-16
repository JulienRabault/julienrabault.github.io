// Suivi des visites, au format de l'ancien site : le tableau de bord du worker (/admin) le lit tel quel.
// Sans URL de worker (développement), rien ne part.

const API_URL: string | undefined = import.meta.env.VITE_CHAT_URL?.replace(/\/$/, "");
const TRACKING_VERSION = "v13";

export type AnalyticsEventType =
  | "page_view"
  | "chat_open"
  | "career_open"
  | "cv_download"
  | "contact_click"
  | "project_open"
  | "github_click";

type Metadata = Record<string, string | number | boolean>;

export interface Visit {
  visitorId: string;
  sessionId: string;
  pagePath: string;
  pageUrl: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  language: string;
}

interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

function createId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function storedId(storage: () => Storage, key: string, prefix: string): string {
  try {
    const existing = storage().getItem(key);
    if (existing) return existing;
    const next = createId(prefix);
    storage().setItem(key, next);
    return next;
  } catch {
    return createId(prefix);
  }
}

const clean = (value: string | null): string => (value ?? "").trim().slice(0, 160);

/** Source du lien suivi (?src= ou utm_*), gardée pour la session : elle survit au passage chat / parcours. */
function readAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    source: clean(params.get("src") || params.get("utm_source")),
    medium: clean(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign")),
    content: clean(params.get("utm_content")),
  };
  try {
    if (current.source || current.medium || current.campaign || current.content) {
      sessionStorage.setItem("jr-attribution", JSON.stringify(current));
      return current;
    }
    const saved = JSON.parse(sessionStorage.getItem("jr-attribution") ?? "null") as Attribution | null;
    if (saved) return saved;
  } catch {
    // Stockage indisponible : on garde ce que dit l'URL.
  }
  return current;
}

let cached: { visitorId: string; sessionId: string; attribution: Attribution } | null = null;

/** Contexte de la visite, joint aux événements et aux questions du chat. */
export function visitContext(): Visit {
  cached ??= {
    visitorId: storedId(() => localStorage, "jr-visitor-id", "v"),
    sessionId: storedId(() => sessionStorage, "jr-session-id", "s"),
    attribution: readAttribution(),
  };
  const { attribution } = cached;
  return {
    visitorId: cached.visitorId,
    sessionId: cached.sessionId,
    pagePath: window.location.pathname + window.location.search + window.location.hash,
    pageUrl: window.location.href.split("#")[0],
    referrer: document.referrer,
    source: attribution.source || "inconnu",
    medium: attribution.medium,
    campaign: attribution.campaign,
    content: attribution.content,
    language: document.documentElement.lang === "en" ? "en" : "fr",
  };
}

export function track(eventType: AnalyticsEventType, metadata: Metadata = {}): void {
  if (!API_URL) return;
  const body = JSON.stringify({ eventType, ...visitContext(), metadata: { trackingVersion: TRACKING_VERSION, ...metadata } });
  // text/plain : pas de requête préalable CORS, et sendBeacon survit à la navigation qui suit un clic.
  const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
  if (navigator.sendBeacon?.(`${API_URL}/events`, blob)) return;
  fetch(`${API_URL}/events`, { method: "POST", body: blob, keepalive: true, credentials: "omit" }).catch(() => {
    // Le suivi ne doit jamais gêner la visite.
  });
}

export interface LinkEvent {
  type: AnalyticsEventType;
  metadata: Metadata;
}

/** Ce qu'un clic sur ce lien dit de la visite : CV, contact, GitHub, projet ou publication. */
export function classifyLink(href: string, label: string, download: boolean, pageHost: string): LinkEvent[] {
  let url: URL;
  try {
    url = new URL(href, `https://${pageHost}/`);
  } catch {
    return [];
  }
  const name = label.trim().replace(/\s+/g, " ").slice(0, 120);

  if (/CV_JULIEN_RABAULT/i.test(url.pathname)) {
    return [{ type: "cv_download", metadata: { file: url.pathname.split("/").pop() ?? "", label: name || "CV", download } }];
  }
  if (url.protocol === "mailto:") return [{ type: "contact_click", metadata: { channel: "email", label: name } }];
  if (/(^|\.)linkedin\.com$/i.test(url.hostname)) {
    return [{ type: "contact_click", metadata: { channel: "linkedin", label: name || "LinkedIn", href: url.href } }];
  }
  if (/(^|\.)github\.com$/i.test(url.hostname)) {
    const events: LinkEvent[] = [{ type: "github_click", metadata: { label: name || "GitHub", href: url.href } }];
    // Un dépôt ou une pull request, pas le profil : c'est aussi un projet ouvert.
    if (url.pathname.split("/").filter(Boolean).length >= 2) {
      events.push({ type: "project_open", metadata: { project: name || url.pathname, href: url.href } });
    }
    return events;
  }
  if (/^https?:$/.test(url.protocol) && url.host !== pageHost) {
    return [{ type: "project_open", metadata: { project: name || url.hostname, href: url.href } }];
  }
  return [];
}

function onLinkClick(event: MouseEvent): void {
  if (event.type === "auxclick" && event.button !== 1) return;
  const link = (event.target as Element | null)?.closest?.("a");
  if (!link) return;
  const label = link.getAttribute("aria-label") || link.textContent || "";
  for (const item of classifyLink(link.href, label, link.hasAttribute("download"), window.location.host)) {
    track(item.type, item.metadata);
  }
}

/** Accès discret au tableau de bord : /#admin ouvre /admin du worker (protégé par son jeton). */
function openAdminFromHash(): void {
  if (window.location.hash === "#admin" && API_URL) window.location.replace(`${API_URL}/admin`);
}

/** Vue de page, clics sur les liens (y compris clic molette), accès admin. À appeler une fois au démarrage. */
export function startAnalytics(): void {
  openAdminFromHash();
  window.addEventListener("hashchange", openAdminFromHash);
  document.addEventListener("click", onLinkClick, true);
  document.addEventListener("auxclick", onLinkClick, true);
  track("page_view", { view: window.location.hash === "#parcours" ? "career" : "chat" });
}
