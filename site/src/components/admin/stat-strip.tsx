import type { Summary } from "@/lib/admin-api";
import { delta, questions } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

interface Metric {
  label: string;
  value: (summary: Summary) => number;
}

// Ce qui dit si le site sert : des gens viennent, posent des questions, prennent le CV, écrivent.
const METRICS: Metric[] = [
  { label: "Visiteurs", value: (s) => s.unique_visitors },
  { label: "Questions au chat", value: questions },
  { label: "CV téléchargés", value: (s) => s.cv_downloads },
  { label: "Prises de contact", value: (s) => s.contact_clicks },
  { label: "Projets ouverts", value: (s) => s.project_opens },
];

function Delta({ value, days }: { value: number | null; days: number }) {
  if (value === null) return <span className="text-muted-foreground">Rien à comparer</span>;
  const Icon = value >= 0 ? ArrowUpRightIcon : ArrowDownRightIcon;
  return (
    <span className={cn("inline-flex items-center gap-0.5", value > 0 ? "text-ochre" : "text-muted-foreground")}>
      <Icon className="size-3.5" />
      <span className="tabular-nums">
        {value > 0 ? "+" : ""}
        {value}&nbsp;%
      </span>
      <span className="ml-1 text-muted-foreground">sur {days}&nbsp;j</span>
    </span>
  );
}

/** Cinq chiffres côte à côte, chacun avec son écart à la période précédente de même durée. */
export function StatStrip({ summary, previous, days }: { summary: Summary; previous: Summary; days: number }) {
  return (
    <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
      {METRICS.map((metric) => {
        const value = metric.value(summary);
        return (
          <div className="lg:px-6 lg:first:pl-0" key={metric.label}>
            <dt className="text-[13.5px] text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 font-display font-semibold text-[34px] leading-none tracking-[-0.03em] tabular-nums">
              {value.toLocaleString("fr-FR")}
            </dd>
            <dd className="mt-2 text-[12.5px]">
              <Delta days={days} value={delta(value, metric.value(previous))} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
