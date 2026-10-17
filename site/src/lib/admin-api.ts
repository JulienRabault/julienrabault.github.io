/** Accès au tableau de bord du worker : réservé à Julien, protégé par le jeton ADMIN_TOKEN. */

const API_URL: string | undefined = import.meta.env.VITE_CHAT_URL?.replace(/\/$/, "");
const TOKEN_KEY = "jr-admin-token";

/** En dev, le jeton « demo » charge des données d'exemple : le panneau se vérifie sans toucher la vraie base. */
export const DEMO_TOKEN = "demo";

export interface Summary {
  page_views: number;
  unique_visitors: number;
  sessions: number;
  chat_opens: number;
  chat_messages: number;
  chat_suggestions: number;
  chat_users: number;
  cv_downloads: number;
  contact_clicks: number;
  project_opens: number;
  github_clicks: number;
  action_users: number;
}

export interface DailyRow {
  day: string;
  page_views: number;
  unique_visitors: number;
  chat_messages: number;
  chat_suggestions: number;
}

export interface SourceRow {
  source: string;
  page_views: number;
  unique_visitors: number;
  chat_messages: number;
}

export interface CampaignRow extends SourceRow {
  medium: string;
  campaign: string;
}

export interface QuestionRow {
  id: number;
  created_at: string;
  language: string | null;
  page_path: string | null;
  country: string | null;
  source: string;
  campaign: string | null;
  question: string | null;
  answer: string | null;
  status: string | null;
}

export interface ActionRow {
  id: number;
  created_at: string;
  event_type: string;
  page_path: string | null;
  source: string;
  country: string | null;
  metadata: string | null;
}

export interface CountRow {
  page_views: number;
  unique_visitors: number;
}

export interface Stats {
  generatedAt: string;
  periodDays: number;
  summary: Summary;
  previousSummary: Summary;
  daily: DailyRow[];
  topReferrers: (CountRow & { referrer: string })[];
  availableSources: SourceRow[];
  topSources: SourceRow[];
  topCampaigns: CampaignRow[];
  topCountries: (CountRow & { country: string })[];
  topOrganizations: (CountRow & { organization: string })[];
  devices: (CountRow & { device: string })[];
  recruiterActions: { event_type: string; events: number; unique_visitors: number }[];
  recentActions: ActionRow[];
  recentQuestions: QuestionRow[];
  topSuggestions: { question: string; events: number; unique_visitors: number }[];
}

export type AdminError = "unauthorized" | "throttled" | "unavailable";

export class AdminRequestError extends Error {
  readonly kind: AdminError;
  constructor(kind: AdminError) {
    super(kind);
    this.kind = kind;
  }
}

function errorKind(status: number): AdminError {
  if (status === 401) return "unauthorized";
  if (status === 429) return "throttled";
  return "unavailable";
}

async function request(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  if (!API_URL) throw new AdminRequestError("unavailable");
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}` },
      credentials: "omit",
      cache: "no-store",
    });
  } catch {
    throw new AdminRequestError("unavailable");
  }
  if (!response.ok) throw new AdminRequestError(errorKind(response.status));
  return response;
}

export interface StatsQuery {
  days: number;
  /** Une source précise, ou toutes. */
  source?: string;
}

export async function fetchStats(token: string, { days, source }: StatsQuery): Promise<Stats> {
  if (import.meta.env.DEV && token === DEMO_TOKEN) {
    const { demoStats } = await import("./admin-demo");
    return demoStats(days, source);
  }
  const params = new URLSearchParams({ days: String(days) });
  if (source) {
    params.set("sourceMode", "include");
    params.set("sources", source);
  }
  const response = await request(token, `/admin/stats?${params}`);
  return (await response.json()) as Stats;
}

/** Efface une question du journal (une question de test, ou une donnée qu'un visiteur demande de retirer). */
export async function deleteQuestion(token: string, id: number): Promise<void> {
  if (import.meta.env.DEV && token === DEMO_TOKEN) return;
  await request(token, `/admin/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function readToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveToken(token: string): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Stockage indisponible : le jeton vaut pour cet onglet seulement.
  }
}
