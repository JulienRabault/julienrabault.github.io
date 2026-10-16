import type { CareerContent, Span } from "@/content/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const START = 2016.5;
const EASE = [0.22, 1, 0.36, 1] as const;

function nowYear(): number {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
}

interface CareerStripProps {
  career: CareerContent;
  onJump: (target: string) => void;
}

/**
 * Dix ans sur une ligne : deux couloirs (études, postes) qui se dessinent dans l'ordre chronologique.
 * Chaque segment fait défiler jusqu'au chapitre correspondant.
 */
export function CareerStrip({ career, onJump }: CareerStripProps) {
  const end = nowYear();
  const pct = (year: number) => ((year - START) / (end - START)) * 100;
  const years = Array.from({ length: Math.floor(end) - Math.ceil(START) + 1 }, (_, i) => Math.ceil(START) + i);
  const ordered = [...career.spans].sort((a, b) => a.from - b.from);
  const delayOf = (span: Span) => 0.2 + ordered.indexOf(span) * 0.18;

  const lane = (id: Span["lane"]) => (
    <div className="relative h-12">
      {career.spans
        .filter((s) => s.lane === id)
        .map((span) => {
          const current = span.to === undefined;
          const left = pct(span.from);
          const width = pct(span.to ?? end) - left;
          return (
            <button
              className="group absolute top-0 flex h-full flex-col items-stretch justify-start text-left"
              key={span.id}
              onClick={() => onJump(span.target)}
              style={{ left: `${left}%`, width: `${width}%` }}
              type="button"
            >
              <motion.span
                animate={{ scaleX: 1 }}
                className={cn(
                  "block h-2 origin-left rounded-full transition-colors",
                  current ? "bg-ochre" : id === "work" ? "bg-foreground/80 group-hover:bg-foreground" : "bg-muted-foreground/45 group-hover:bg-muted-foreground/70",
                )}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: delayOf(span) }}
              />
              <motion.span
                animate={{ opacity: 1 }}
                className={cn(
                  "absolute top-4 whitespace-nowrap text-[12.5px] transition-colors group-hover:text-foreground",
                  current ? "right-0 text-foreground" : "left-0 text-muted-foreground",
                )}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: delayOf(span) + 0.35 }}
              >
                {span.label}
              </motion.span>
            </button>
          );
        })}
    </div>
  );

  return (
    <div className="grid grid-cols-[1fr] gap-x-4 sm:grid-cols-[4.5rem_1fr]">
      <span className="hidden text-muted-foreground text-xs leading-none sm:block">{career.lanes.school}</span>
      {lane("school")}
      <span className="hidden text-muted-foreground text-xs leading-none sm:block">{career.lanes.work}</span>
      {lane("work")}

      <span className="hidden sm:block" />
      <div className="relative h-5 border-t">
        {years.map((y) => (
          <span
            className={cn(
              "absolute top-1.5 -translate-x-1/2 text-[11px] text-muted-foreground tabular-nums",
              y % 2 === 0 && "hidden sm:block",
            )}
            key={y}
            style={{ left: `${pct(y)}%` }}
          >
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}
