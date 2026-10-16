import type { CareerContent } from "@/content/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CareerTimelineProps {
  career: CareerContent;
  onJump: (target: string) => void;
}

/**
 * Le parcours en cinq lignes, du plus récent au plus ancien, à la manière d'un CV de designer :
 * les dates dans une colonne fixe, l'employeur et le poste à côté, tout aligné à gauche.
 * Le poste en cours a ses dates en ocre. Chaque ligne mène à son chapitre.
 * En conteneur étroit (le chat), les dates passent sous le poste.
 */
export function CareerTimeline({ career, onJump }: CareerTimelineProps) {
  return (
    <ol className="@container -mx-3">
      {career.timeline.map((entry, i) => {
        const current = entry.current === true;
        return (
          <motion.li
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            key={entry.id}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
          >
            <button
              className="grid w-full gap-x-6 gap-y-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary/60 @lg:grid-cols-[11rem_1fr] @lg:items-baseline"
              onClick={() => onJump(entry.target)}
              type="button"
            >
              <span
                className={cn(
                  "order-last text-xs tabular-nums @lg:order-none @lg:text-sm",
                  current ? "text-ochre" : "text-muted-foreground",
                )}
              >
                {entry.dates}
              </span>
              <span className="min-w-0 text-[15px]">
                <span className={cn("font-medium", entry.kind === "school" && "text-muted-foreground")}>{entry.org}</span>
                <span className="text-muted-foreground">, {entry.role}</span>
              </span>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}
