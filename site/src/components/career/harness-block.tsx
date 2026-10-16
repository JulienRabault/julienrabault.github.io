import { HarnessDiagram, LayerList } from "@/components/career/harness-diagram";
import type { HarnessLayer } from "@/content/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const TOUR_MS = 3500;

interface CompactLayersProps {
  layers: HarnessLayer[];
  active: string;
  onSelect: (id: string) => void;
}

/** Noms en grille, description dans une zone de hauteur fixe : le bloc ne change pas de taille pendant le tour. */
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
  /** Dans le chat : schéma de taille fixe, qui ne grandit pas avec la fenêtre. */
  compact?: boolean;
  className?: string;
}

/**
 * Le schéma et sa liste, synchronisés. Tant qu'on n'y a pas touché, le bloc fait lui-même le tour des couches :
 * le schéma s'explique au lieu d'attendre un clic.
 */
export function HarnessBlock({ layers, hint, live = true, compact = false, className }: HarnessBlockProps) {
  const [active, setActive] = useState(layers[0].id);
  const [touring, setTouring] = useState(true);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!touring || hovered || reduced) return;
    const timer = setInterval(() => {
      setActive((current) => layers[(layers.findIndex((l) => l.id === current) + 1) % layers.length].id);
    }, TOUR_MS);
    return () => clearInterval(timer);
  }, [touring, hovered, reduced, layers]);

  const select = (id: string) => {
    setTouring(false);
    setActive(id);
  };

  return (
    <div
      className={cn(
        "grid items-center gap-6 rounded-2xl border bg-card/50 p-5",
        compact ? "@lg:grid-cols-[240px_1fr]" : "sm:p-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-8",
        className,
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className={compact ? "mx-auto w-[240px]" : "mx-auto w-full max-w-[400px]"}>
        <HarnessDiagram active={active} layers={layers} live={live} onSelect={select} />
      </div>
      <div>
        <p className="mb-3 text-muted-foreground text-sm">{hint}</p>
        {compact ? (
          <CompactLayers active={active} layers={layers} onSelect={select} />
        ) : (
          <LayerList active={active} layers={layers} onSelect={select} />
        )}
      </div>
    </div>
  );
}
