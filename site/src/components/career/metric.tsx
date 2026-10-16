import type { Metric } from "@/content/types";
import { cn } from "@/lib/utils";

interface ResultsProps {
  metrics: Metric[];
  /** Le mot qui marque une estimation (« estimé »), pour ne pas faire passer une borne pour une mesure. */
  estimateLabel: string;
  className?: string;
}

/** Les résultats d'un projet, un par ligne et alignés sur le texte : le chiffre en ocre, ce qu'il mesure juste après. */
export function Results({ metrics, estimateLabel, className }: ResultsProps) {
  return (
    <ul className={cn("space-y-1", className)}>
      {metrics.map((m) => (
        <li className="max-w-[66ch] text-[14.5px] text-muted-foreground leading-snug" key={m.id}>
          <span className="mr-1.5 font-display font-semibold text-[17px] text-ochre tabular-nums tracking-[-0.02em]">
            {m.value}
          </span>
          {m.label}
          {m.estimate && <span className="ml-1 text-xs">({estimateLabel})</span>}
        </li>
      ))}
    </ul>
  );
}
