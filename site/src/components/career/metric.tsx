import type { Metric } from "@/content/types";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface MetricFigureProps {
  metric: Metric;
  labels: { before: string; after: string; estimate: string };
}

function Bar({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[3.25rem_1fr] items-center gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">{children}</div>
    </div>
  );
}

/**
 * Le chiffre, puis ce qu'il veut dire : la barre « après » part de la largeur « avant » et se rétracte
 * jusqu'à ce qui reste. Une estimation garde sa fourchette hachurée, pour ne pas faire passer une borne pour une mesure.
 */
export function MetricFigure({ metric, labels }: MetricFigureProps) {
  const { remaining } = metric;
  const range = Array.isArray(remaining);
  const low = range ? remaining[0] : remaining;
  const high = range ? remaining[1] : remaining;

  return (
    <figure>
      <p className="flex items-baseline gap-2">
        <span className="font-display font-semibold text-[28px] tabular-nums leading-none tracking-[-0.035em]">
          {metric.value}
        </span>
        {range && <span className="text-muted-foreground text-xs">{labels.estimate}</span>}
      </p>
      <figcaption className="mt-1.5 max-w-[40ch] text-muted-foreground text-sm leading-snug">{metric.label}</figcaption>

      {low !== undefined && high !== undefined && (
        <div className="mt-3 max-w-sm space-y-1.5">
          <Bar label={labels.before}>
            <span className="absolute inset-0 rounded-full bg-muted-foreground/45" />
          </Bar>
          <Bar label={labels.after}>
            {range && (
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-[repeating-linear-gradient(-45deg,var(--ochre)_0_2px,transparent_2px_5px)] opacity-70"
                initial={{ width: "100%" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
                viewport={{ once: true, amount: 0.8 }}
                whileInView={{ width: `${high * 100}%` }}
              />
            )}
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-ochre"
              initial={{ width: "100%" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
              viewport={{ once: true, amount: 0.8 }}
              whileInView={{ width: `${low * 100}%` }}
            />
          </Bar>
        </div>
      )}
    </figure>
  );
}
