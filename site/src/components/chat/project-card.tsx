import type { ProjectId } from "@/content/agent-contract";
import type { CareerItem, Chapter, ChatLink, SiteContent } from "@/content/types";
import { motion } from "motion/react";
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

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-muted-foreground text-xs">{children}</p>;
}

interface ProjectCardProps {
  id: ProjectId;
  content: SiteContent;
  renderLink: (link: ChatLink, key: string) => ReactNode;
}

/**
 * Ce qu'un recruteur veut savoir d'un projet, dans l'ordre où il le lit : le problème, ce qui a été fait
 * (une vraie séquence, d'où la ligne), ce que ça a donné, avec quoi.
 */
export function ProjectCard({ id, content, renderLink }: ProjectCardProps) {
  const found = findProject(content, id);
  if (!found) return null;
  const { item, chapter } = found;
  const labels = content.career.project;

  return (
    <div className="rounded-2xl border bg-card/50 p-5">
      <p className="text-muted-foreground text-xs">
        {chapter.org}, {chapter.dates}
      </p>
      <p className="mt-1 font-display font-semibold text-[19px] leading-tight tracking-[-0.02em]">{item.name}</p>

      {item.problem && (
        <div className="mt-4">
          <Label>{labels.problem}</Label>
          <p className="text-[15px] leading-relaxed">{item.problem}</p>
        </div>
      )}

      {item.steps && (
        <div className="mt-5">
          <Label>{labels.steps}</Label>
          <ol className="relative space-y-3 before:absolute before:top-2 before:bottom-2 before:left-[9px] before:w-px before:bg-border">
            {item.steps.map((step, i) => (
              <motion.li
                animate={{ opacity: 1, x: 0 }}
                className="relative flex gap-3 text-[14.5px] leading-snug"
                initial={{ opacity: 0, x: -4 }}
                key={step}
                transition={{ delay: 0.08 * i, duration: 0.3 }}
              >
                <span className="relative z-10 mt-px flex size-[19px] shrink-0 items-center justify-center rounded-full border bg-background font-medium text-[10.5px] text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span>{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      )}

      {item.metrics && item.metrics.length > 0 && (
        <div className="mt-5">
          <Label>{labels.results}</Label>
          <div className="grid gap-4 @sm:grid-cols-2">
            {item.metrics.map((m) => (
              <div key={m.id}>
                <p className="flex items-baseline gap-2">
                  <span className="font-display font-semibold text-[24px] text-ochre tabular-nums leading-none tracking-[-0.03em]">
                    {m.value}
                  </span>
                  {Array.isArray(m.remaining) && <span className="text-muted-foreground text-xs">{content.career.estimate}</span>}
                </p>
                <p className="mt-1 text-muted-foreground text-sm leading-snug">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(item.stack || item.links) && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t pt-4">
          {item.stack?.map((s) => (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[12px] text-secondary-foreground" key={s}>
              {s}
            </span>
          ))}
          {item.links && (
            <span className="ml-auto flex gap-3 text-sm">
              {item.links.map((l) => renderLink(content.links[l], l))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
