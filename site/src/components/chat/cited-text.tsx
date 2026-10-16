import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Source } from "@/content/types";
import { useEffect, useRef, useState } from "react";

const MARKER = /\[\[([a-z0-9-]+)\]\]/g;
/** Survol : ouverture presque immédiate, fermeture un peu retenue pour laisser le temps d'atteindre la carte. */
const OPEN_DELAY_MS = 60;
const CLOSE_DELAY_MS = 160;

/** Numéros dans l'ordre de première citation ; une source inconnue n'a pas de numéro. */
export function citationNumbering(text: string, sources: Record<string, Source>): Map<string, number> {
  const numbering = new Map<string, number>();
  for (const [, id] of text.matchAll(MARKER)) {
    if (sources[id] && !numbering.has(id)) numbering.set(id, numbering.size + 1);
  }
  return numbering;
}

/** Popover qui s'ouvre au survol de la souris, et au toucher ou au clavier comme un popover classique. */
function useHoverOpen() {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hover = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType !== "touch" && schedule(true, OPEN_DELAY_MS),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType !== "touch" && schedule(false, CLOSE_DELAY_MS),
  };
  const onOpenChange = (next: boolean) => {
    window.clearTimeout(timer.current);
    setOpen(next);
  };
  return { open, onOpenChange, hover };
}

export function SourceCard({ source }: { source: Source }) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs">
        {source.org}, {source.period}
      </p>
      <p className="font-semibold text-sm">{source.title}</p>
      <p className="text-muted-foreground text-sm leading-relaxed">{source.text}</p>
    </div>
  );
}

export function CitationBadge({ id, number, source }: { id: string; number: number; source: Source }) {
  const { open, onOpenChange, hover } = useHoverOpen();
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger
        aria-label={`Source ${number}, ${source.title}`}
        className="mr-px ml-1 inline-flex h-[1.35em] min-w-[1.5em] -translate-y-px items-center justify-center rounded-md bg-ochre-soft px-1 align-middle font-semibold text-[0.72em] text-ochre tabular-nums transition-colors hover:bg-ochre hover:text-background data-[state=open]:bg-ochre data-[state=open]:text-background"
        data-source={id}
        {...hover}
      >
        {number}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...hover}
      >
        <SourceCard source={source} />
      </PopoverContent>
    </Popover>
  );
}
