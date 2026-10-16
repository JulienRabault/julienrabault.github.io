import { PromptInput, PromptInputBody, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import type { SiteContent } from "@/content/types";
import type { ChatStatus } from "@/lib/use-agent-chat";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MAX_LENGTH = 500;
const HINT_MS = 3400;

interface ComposerProps {
  content: SiteContent;
  status: ChatStatus;
  remaining: number;
  onSend: (text: string) => void;
  onStop: () => void;
  autoFocus?: boolean;
  /** Fait défiler des exemples de questions à la place du texte d'invite (accueil seulement). */
  rotate?: boolean;
  className?: string;
}

/** Une question d'exemple après l'autre, en fondu, tant que le champ est vide. */
function RotatingHint({ hints }: { hints: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % hints.length), HINT_MS);
    return () => window.clearInterval(timer);
  }, [hints.length]);

  return (
    // Frère suivant du champ : affiché seulement quand le texte d'invite natif le serait.
    <span
      aria-hidden
      className="pointer-events-none absolute top-4 right-14 left-5 hidden overflow-hidden text-[15.5px] text-muted-foreground leading-6 peer-placeholder-shown:block"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="block truncate"
          exit={{ opacity: 0, y: -8 }}
          initial={{ opacity: 0, y: 8 }}
          key={index}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {hints[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Composer({ content, status, remaining, onSend, onStop, autoFocus, rotate, className }: ComposerProps) {
  const { ui } = content;
  const exhausted = remaining === 0;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rotating = rotate && !exhausted && !reduced && content.examples.length > 0;
  const root = useRef<HTMLDivElement>(null);

  // Focus sans défilement : dans la bulle, un autoFocus natif ferait défiler la page sous le panneau.
  useEffect(() => {
    if (autoFocus) root.current?.querySelector("textarea")?.focus({ preventScroll: true });
  }, [autoFocus]);

  return (
    <div className={className} ref={root}>
      <PromptInput
        className="rounded-2xl bg-card shadow-[0_1px_2px_rgb(42_32_25/0.06),0_8px_24px_-12px_rgb(42_32_25/0.18)] dark:shadow-none [&_[data-slot=input-group]]:h-auto [&_[data-slot=input-group]]:rounded-2xl"
        onSubmit={(message) => onSend(message.text)}
      >
        <PromptInputBody>
          {/* Une seule rangée : le texte centré dans la hauteur, l'envoi à droite. Le champ grandit avec le texte. */}
          <PromptInputTextarea
            className={cn(
              "peer min-h-14 py-4 pr-14 pl-5 text-[15.5px] leading-6 md:text-[15.5px]",
              rotating && "placeholder:text-transparent",
            )}
            disabled={exhausted}
            maxLength={MAX_LENGTH}
            // Le texte d'invite reste pour les lecteurs d'écran, même quand les exemples défilent par-dessus.
            placeholder={exhausted ? ui.quotaReached : ui.placeholder}
          />
          {rotating && <RotatingHint hints={[ui.placeholder, ...content.examples]} key={content.locale} />}
          <div className="absolute right-3 bottom-3">
            <PromptInputSubmit
              className="rounded-xl"
              disabled={exhausted && status === "ready"}
              onStop={onStop}
              status={status === "ready" ? undefined : status}
            />
          </div>
        </PromptInputBody>
      </PromptInput>
    </div>
  );
}
