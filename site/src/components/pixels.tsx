import { cn } from "@/lib/utils";

// La trame de la sphère, reprise en petit ailleurs dans le site : des carrés pleins, jamais de dégradé.

// Disque tramé 5 x 5, seuils de Bayer : la sphère réduite à 13 carrés, éclairée par le haut à gauche.
const MARK = ["01110", "12221", "12232", "22333", "02330"];
const MARK_OPACITY = ["0", "1", "0.7", "0.4"];

/** Petite marque tramée, l'équivalent pixel de la sphère, pour signer un widget sans relancer un shader. */
export function PixelMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={cn("size-3.5 shrink-0 text-ochre", className)} viewBox="0 0 5 5">
      {MARK.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "0" ? null : (
            <rect fill="currentColor" height="0.82" key={`${x}-${y}`} opacity={MARK_OPACITY[Number(cell)]} width="0.82" x={x} y={y} />
          ),
        ),
      )}
    </svg>
  );
}

/** Plus ou moins en carrés de trame : la barre verticale s'efface quand la ligne est dépliée. */
export function PixelToggle({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg aria-hidden className={cn("size-2.5 shrink-0", className)} viewBox="0 0 5 5">
      {[0, 1, 3, 4].map((x) => (
        <rect fill="currentColor" height="1" key={`h${x}`} width="1" x={x} y={2} />
      ))}
      <rect fill="currentColor" height="1" width="1" x={2} y={2} />
      {[0, 1, 3, 4].map((y) => (
        <rect
          className="transition-opacity duration-200"
          fill="currentColor"
          height="1"
          key={`v${y}`}
          opacity={open ? 0 : 1}
          width="1"
          x={2}
          y={y}
        />
      ))}
    </svg>
  );
}
