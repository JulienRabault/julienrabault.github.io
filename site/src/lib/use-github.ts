import type { RepoInfo } from "@/content/repos";
import { useEffect, useState } from "react";

export interface GitHubStats {
  stars?: number;
  forks?: number;
  /** Date ISO du dernier push (dépôt) ou de la fusion (pull request). */
  updatedAt?: string;
  merged?: boolean;
  title?: string;
  additions?: number;
  deletions?: number;
}

// Une requête par dépôt et par page : l'API GitHub sans jeton accepte 60 appels par heure et par IP.
const cache = new Map<string, Promise<GitHubStats | null>>();

const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

async function fetchStats(repo: RepoInfo): Promise<GitHubStats | null> {
  const path = `${repo.owner}/${repo.name}${repo.pull ? `/pulls/${repo.pull}` : ""}`;
  const response = await fetch(`https://api.github.com/repos/${path}`, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) return null;
  const data = (await response.json()) as Record<string, unknown>;
  if (repo.pull) {
    return {
      title: str(data.title),
      merged: data.merged === true || typeof data.merged_at === "string",
      updatedAt: str(data.merged_at) ?? str(data.updated_at),
      additions: num(data.additions),
      deletions: num(data.deletions),
    };
  }
  return { stars: num(data.stargazers_count), forks: num(data.forks_count), updatedAt: str(data.pushed_at) };
}

/** Chiffres en direct d'un dépôt ou d'une PR ; null tant qu'ils ne sont pas arrivés ou si GitHub ne répond pas. */
export function useGitHub(repo: RepoInfo): GitHubStats | null {
  const key = `${repo.owner}/${repo.name}#${repo.pull ?? ""}`;
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    let alive = true;
    if (!cache.has(key)) cache.set(key, fetchStats(repo).catch(() => null));
    cache.get(key)?.then((s) => alive && setStats(s));
    return () => {
      alive = false;
    };
  }, [key, repo]);

  return stats;
}
