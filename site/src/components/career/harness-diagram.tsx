import { AgentOrb } from "@/components/agent-orb";
import type { HarnessLayer } from "@/content/types";
import { useElementWidth } from "@/lib/use-element-width";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";

// Géométrie en unités du viewBox (600 × 600) : la boucle au centre, les middlewares en anneaux, l'évaluation autour.
const VIEW = 600;
const C = VIEW / 2;
const CORE_R = 64;
const BAND = 30;
const GAP = 3;
const LABEL_PX = 11;
const ringRadius = (i: number) => CORE_R + GAP + BAND / 2 + i * (BAND + GAP);

/** Arc supérieur de rayon r, de gauche à droite, pour poser une étiquette dessus. */
const topArc = (r: number) => `M ${C - r} ${C} A ${r} ${r} 0 0 1 ${C + r} ${C}`;

interface HarnessDiagramProps {
  layers: HarnessLayer[];
  active: string;
  onSelect: (id: string) => void;
  /** Sans shader, la sphère est l'image tramée du favicon : un chat peut afficher plusieurs schémas sans épuiser les contextes WebGL. */
  live?: boolean;
}

export function HarnessDiagram({ layers, active, onSelect, live = true }: HarnessDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);
  const [core, ...rings] = layers;
  const orbSize = Math.round((width * (CORE_R * 2 - 8)) / VIEW);
  // Le schéma change de taille : les étiquettes sont calculées pour rester autour de 11 px à l'écran.
  const labelSize = width > 0 ? Math.min(22, Math.max(13, (LABEL_PX * VIEW) / width)) : 13;

  return (
    <div className="relative aspect-square w-full" ref={ref}>
      <svg aria-hidden className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${VIEW} ${VIEW}`}>
        {rings.map((layer, i) => {
          const r = ringRadius(i);
          const outer = i === rings.length - 1;
          const on = layer.id === active;
          return (
            <g className="cursor-pointer" key={layer.id} onClick={() => onSelect(layer.id)}>
              <circle
                className="transition-[stroke] duration-300"
                cx={C}
                cy={C}
                fill="none"
                r={r}
                stroke={on ? "color-mix(in oklab, var(--ochre) 30%, transparent)" : outer ? "transparent" : "var(--secondary)"}
                strokeWidth={BAND}
              />
              {outer && (
                <circle
                  cx={C}
                  cy={C}
                  fill="none"
                  r={r + BAND / 2}
                  stroke={on ? "var(--ochre)" : "var(--muted-foreground)"}
                  strokeDasharray="3 6"
                  strokeOpacity={on ? 1 : 0.5}
                  strokeWidth={1.25}
                />
              )}
              <path d={topArc(r)} fill="none" id={`arc-${layer.id}`} stroke="none" />
              <text
                className="select-none font-medium transition-[fill] duration-300"
                dy={labelSize / 3}
                fill={on ? "var(--ochre)" : "var(--muted-foreground)"}
                fontSize={labelSize}
                letterSpacing={0.4}
              >
                <textPath href={`#arc-${layer.id}`} startOffset="50%" textAnchor="middle">
                  {layer.name}
                </textPath>
              </text>
            </g>
          );
        })}
        <circle
          className="cursor-pointer"
          cx={C}
          cy={C}
          fill="transparent"
          onClick={() => onSelect(core.id)}
          r={CORE_R}
          stroke={core.id === active ? "var(--ochre)" : "transparent"}
          strokeOpacity={0.6}
        />
      </svg>

      {width > 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {live ? (
            <AgentOrb active={active === core.id} dot={width < 420 ? 1.5 : 2} size={orbSize} />
          ) : (
            <img alt="" className="[image-rendering:pixelated]" height={orbSize * 0.8} src="/favicon.svg" width={orbSize * 0.8} />
          )}
        </div>
      )}
    </div>
  );
}

interface LayerListProps {
  layers: HarnessLayer[];
  active: string;
  onSelect: (id: string) => void;
}

/** Liste accessible au clavier, synchronisée avec le schéma. */
export function LayerList({ layers, active, onSelect }: LayerListProps) {
  return (
    <ul className="divide-y border-y">
      {layers.map((layer) => {
        const on = layer.id === active;
        return (
          <li key={layer.id}>
            <button
              aria-expanded={on}
              className="flex w-full items-center gap-3 py-3 text-left"
              onClick={() => onSelect(layer.id)}
              type="button"
            >
              <span
                aria-hidden
                className={cn("size-2 rounded-full transition-colors", on ? "bg-ochre" : "bg-border")}
              />
              <span className={cn("font-medium transition-colors", on ? "text-foreground" : "text-muted-foreground")}>
                {layer.name}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.p
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden pl-5 text-[15px] text-muted-foreground leading-relaxed"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="block pb-4">{layer.text}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
