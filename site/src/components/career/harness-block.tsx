import { HarnessDiagram } from "@/components/career/harness-diagram";
import type { HarnessLayer } from "@/content/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface CompactLayersProps {
  layers: HarnessLayer[];
  active: string;
  onSelect: (id: string) => void;
}

/** Noms en grille, description dans une zone de hauteur fixe : le bloc ne change pas de taille d'une couche à l'autre. */
function CompactLayers({ layers, active, onSelect }: CompactLayersProps) {
  const layer = layers.find((l) => l.id === active) ?? layers[0];
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {layers.map((l) => {
          const on = l.id === active;
          return (
            <button
              aria-pressed={on}
              className="flex items-center gap-2 rounded-md py-1 text-left text-sm"
              key={l.id}
              onClick={() => onSelect(l.id)}
              type="button"
            >
              <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full transition-colors", on ? "bg-ochre" : "bg-border")} />
              <span className={cn("truncate transition-colors", on ? "font-medium text-foreground" : "text-muted-foreground")}>
                {l.name}
              </span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-3 min-h-[9rem] border-t pt-3">
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            animate={{ opacity: 1 }}
            className="text-[14.5px] text-muted-foreground leading-relaxed"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={layer.id}
            transition={{ duration: 0.2 }}
          >
            {layer.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

interface HarnessBlockProps {
  layers: HarnessLayer[];
  hint: string;
  live?: boolean;
  className?: string;
}

/**
 * Le schéma et sa liste, synchronisés. Même taille partout (page, chat, bulle) : le schéma fait 240 px,
 * la description a une hauteur réservée, et rien ne bouge tant qu'on ne clique pas.
 */
export function HarnessBlock({ layers, hint, live = true, className }: HarnessBlockProps) {
  const [active, setActive] = useState(layers[0].id);

  return (
    <div className={cn("grid items-center gap-6 rounded-2xl border bg-card/50 p-5 @lg:grid-cols-[240px_1fr]", className)}>
      <div className="mx-auto w-[240px]">
        <HarnessDiagram active={active} layers={layers} live={live} onSelect={setActive} />
      </div>
      <div>
        <p className="mb-3 text-muted-foreground text-sm">{hint}</p>
        <CompactLayers active={active} layers={layers} onSelect={setActive} />
      </div>
    </div>
  );
}
