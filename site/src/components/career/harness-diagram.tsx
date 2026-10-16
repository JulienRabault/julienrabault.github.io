import { AgentOrb } from "@/components/agent-orb";
import type { HarnessLayer } from "@/content/types";
import { useElementWidth } from "@/lib/use-element-width";
import { useRef } from "react";

// Géométrie en unités du viewBox (600 × 600) : la boucle au centre, les middlewares en anneaux, l'évaluation autour.
const VIEW = 600;
const C = VIEW / 2;
const CORE_R = 64;
const BAND = 30;
const GAP = 3;
const LABEL_PX = 11;
const MIN_WIDTH_ALL_LABELS = 400;
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
  // Le schéma change de taille : les étiquettes restent autour de 11 px à l'écran, dans la limite de l'épaisseur d'un anneau.
  const labelSize = width > 0 ? Math.min(27, Math.max(13, (LABEL_PX * VIEW) / width)) : 13;
  // En petit, les sept étiquettes se chevauchent en haut du schéma : seule celle de la couche choisie reste, la liste donne les autres.
  const allLabels = width >= MIN_WIDTH_ALL_LABELS;

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
              {(allLabels || on) && (
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
              )}
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
