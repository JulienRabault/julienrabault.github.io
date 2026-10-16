import { StatusPill } from "@/components/career/chapter";
import { Results } from "@/components/career/metric";
import { PixelMark } from "@/components/pixels";
import type { ProjectId } from "@/content/agent-contract";
import type { CareerItem, Chapter, ChatLink, SiteContent } from "@/content/types";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

export function findProject(content: SiteContent, id: ProjectId): { item: CareerItem; chapter: Chapter } | null {
  for (const chapter of content.career.chapters) {
    for (const group of chapter.groups) {
      const item = group.items.find((i) => i.id === id);
      if (item) return { item, chapter };
    }
  }
  return null;
}

interface ProjectCardProps {
  id: ProjectId;
  content: SiteContent;
  onOpenCareer: (target?: string) => void;
  renderLink: (link: ChatLink, key: string) => ReactNode;
}

/**
 * La même grammaire que les cartes GitHub : qui et quoi en tête, le statut à droite, le problème en une phrase,
 * les résultats chiffrés, puis la stack en pied. Le titre ouvre le chapitre du parcours.
 */
export function ProjectCard({ id, content, onOpenCareer, renderLink }: ProjectCardProps) {
  const found = findProject(content, id);
  if (!found) return null;
  const { item, chapter } = found;

  return (
    <div className="rounded-2xl border bg-card/50 p-4">
      <div className="flex items-center gap-2 text-sm">
        <PixelMark />
        <button
          className="group min-w-0 truncate text-left decoration-ochre/60 underline-offset-4 hover:underline"
          onClick={() => onOpenCareer(chapter.id)}
          type="button"
        >
          <span className="text-muted-foreground">{chapter.org} / </span>
          <span className="font-semibold">{item.name}</span>
          <ArrowUpRightIcon className="ml-1 inline size-3.5 text-muted-foreground transition-colors group-hover:text-ochre" />
        </button>
        {item.status && (
          <span className="ml-auto">
            <StatusPill status={item.status} />
          </span>
        )}
      </div>

      <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{item.problem ?? item.text}</p>

      {item.metrics && item.metrics.length > 0 && (
        <Results className="mt-3" estimateLabel={content.career.estimate} metrics={item.metrics} />
      )}

      {(item.stack || item.links) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-muted-foreground text-xs">
          {item.stack && <span>{item.stack.join(", ")}</span>}
          {item.links && (
            <span className="ml-auto flex gap-3 text-sm">{item.links.map((l) => renderLink(content.links[l], l))}</span>
          )}
        </div>
      )}
    </div>
  );
}
