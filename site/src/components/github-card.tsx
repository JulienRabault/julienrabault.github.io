import { GithubIcon } from "@/components/brand-icons";
import { REPOS, repoUrl } from "@/content/repos";
import type { RepoId } from "@/content/agent-contract";
import type { Locale } from "@/content/types";
import { useGitHub } from "@/lib/use-github";
import { cn } from "@/lib/utils";
import { GitMergeIcon, GitForkIcon, PackageIcon, StarIcon } from "lucide-react";

const STRINGS = {
  fr: { merged: "Fusionnée", updated: "mis à jour", mergedOn: "fusionnée" },
  en: { merged: "Merged", updated: "updated", mergedOn: "merged" },
} as const;

/** « il y a 3 mois » : la date relative dit mieux qu'une date si le dépôt est vivant. */
function relative(iso: string, locale: Locale): string {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(days) < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

interface GitHubCardProps {
  id: RepoId;
  description: string;
  locale: Locale;
  className?: string;
}

/** Carte de dépôt ou de pull request, façon GitHub mais aux couleurs du site. Toute la carte est le lien. */
export function GitHubCard({ id, description, locale, className }: GitHubCardProps) {
  const repo = REPOS[id];
  const stats = useGitHub(repo);
  const t = STRINGS[locale];
  const format = (n: number) => n.toLocaleString(locale === "fr" ? "fr-FR" : "en-GB");

  return (
    <a
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-card/50 p-4 transition-colors hover:border-ochre/50 hover:bg-card",
        className,
      )}
      href={repoUrl(repo)}
      rel="noopener"
      target="_blank"
    >
      <div className="flex items-center gap-2 text-sm">
        <GithubIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        <span className="min-w-0 truncate">
          <span className="text-muted-foreground">{repo.owner} / </span>
          <span className="font-semibold">{repo.name}</span>
          {repo.pull && <span className="text-muted-foreground"> #{repo.pull}</span>}
        </span>
        {repo.pull && (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-ochre-soft px-2 py-0.5 font-medium text-[11px] text-ochre">
            <GitMergeIcon className="size-3" />
            {t.merged}
          </span>
        )}
      </div>

      <p className="mt-2 flex-1 text-muted-foreground text-sm leading-relaxed">
        {repo.pull && stats?.title ? `${stats.title}. ` : ""}
        {description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs tabular-nums">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-[#3572A5]" />
          {repo.language}
        </span>
        {stats?.stars ? (
          <span className="inline-flex items-center gap-1">
            <StarIcon className="size-3.5" />
            {format(stats.stars)}
          </span>
        ) : null}
        {stats?.forks ? (
          <span className="inline-flex items-center gap-1">
            <GitForkIcon className="size-3.5" />
            {format(stats.forks)}
          </span>
        ) : null}
        {stats?.additions !== undefined && stats.deletions !== undefined && (
          <span>
            <span className="text-emerald-600 dark:text-emerald-400">+{format(stats.additions)}</span>{" "}
            <span className="text-rose-600 dark:text-rose-400">−{format(stats.deletions)}</span>
          </span>
        )}
        {repo.pypi && (
          <span className="inline-flex items-center gap-1">
            <PackageIcon className="size-3.5" />
            PyPI
          </span>
        )}
        {stats?.updatedAt && (
          <span className="ml-auto">
            {repo.pull ? t.mergedOn : t.updated} {relative(stats.updatedAt, locale)}
          </span>
        )}
      </div>
    </a>
  );
}
