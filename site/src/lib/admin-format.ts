import type { DailyRow, Summary } from "@/lib/admin-api";

/** Écart avec la période précédente, en pourcentage arrondi. Rien à comparer : null. */
export function delta(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Questions posées : celles envoyées au modèle et les suggestions servies sans lui. */
export function questions(summary: Summary): number {
  return (summary.chat_messages || 0) + (summary.chat_suggestions || 0);
}

export interface TrendPoint {
  day: string;
  visitors: number;
  questions: number;
}

/** Un point par jour de la période, même sans visite : la courbe ne saute pas les jours creux. */
export function fillDays(rows: DailyRow[], days: number, now = new Date()): TrendPoint[] {
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    const row = byDay.get(day);
    points.push({
      day,
      visitors: row?.unique_visitors ?? 0,
      questions: (row?.chat_messages ?? 0) + (row?.chat_suggestions ?? 0),
    });
  }
  return points;
}

export type LinkPage = "chat" | "parcours";
export type LinkLocale = "fr" | "en";

export interface TrackedLink {
  base: string;
  locale: LinkLocale;
  page: LinkPage;
  source: string;
  campaign?: string;
}

/** Une source se lit dans l'URL et dans le tableau : minuscules, sans espaces ni caractères exotiques. */
export function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Lien suivi : ?src= pour la source, utm_campaign pour l'entreprise visée. Le site les lit dans analytics.ts. */
export function trackedLink({ base, locale, page, source, campaign }: TrackedLink): string {
  const url = new URL(locale === "en" ? "en/" : "", base.endsWith("/") ? base : `${base}/`);
  const src = slug(source);
  if (src) url.searchParams.set("src", src);
  const target = campaign ? slug(campaign) : "";
  if (target) url.searchParams.set("utm_campaign", target);
  if (page === "parcours") url.hash = "parcours";
  return url.toString();
}

const relative = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

/** « il y a 3 h », « hier » : plus parlant qu'une date pour ce qui vient d'arriver. */
export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "à l'instant";
}

const regions = new Intl.DisplayNames(["fr"], { type: "region" });

export function countryName(code: string | null | undefined): string {
  if (!code || code === "unknown" || code === "XX") return "Inconnu";
  try {
    return regions.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Le domaine d'où vient la visite, sans le chemin : « linkedin.com », ou « Accès direct ». */
export function referrerHost(referrer: string): string {
  if (!referrer || referrer === "direct") return "Accès direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

/** Sans ?src= dans le lien, le worker range la visite sous « inconnu ». */
export const sourceLabel = (source: string): string => (source === "inconnu" ? "Sans source" : source);

export const ACTION_LABELS: Record<string, string> = {
  cv_download: "CV téléchargé",
  contact_click: "Contact",
  project_open: "Projet ouvert",
  github_click: "GitHub",
  career_open: "Parcours ouvert",
};

/** Le détail utile d'une action : le canal du contact, le projet ouvert, le fichier. */
export function actionDetail(metadata: string | null): string {
  if (!metadata) return "";
  try {
    const data = JSON.parse(metadata) as Record<string, unknown>;
    const value = data.channel ?? data.project ?? data.label ?? data.file ?? "";
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}
