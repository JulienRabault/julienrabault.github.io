import { AgentOrb } from "@/components/agent-orb";
import { ChatThread } from "@/components/chat/chat-thread";
import { Composer } from "@/components/chat/composer";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import type { AgentChat } from "@/lib/use-agent-chat";
import { useMediaQuery } from "@/lib/use-media-query";
import { Maximize2Icon, RotateCcwIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Toutes les 15 s, la sphère s'anime une seconde et demie : assez pour qu'on la remarque, trop rare pour agacer. */
const NUDGE_EVERY_MS = 15_000;
const NUDGE_MS = 1600;
const MAX_NUDGES = 4;
const TEASER_AFTER_MS = 5000;
const TEASER_FOR_MS = 10_000;
const TEASER_KEY = "jr-dock-teaser";

function teaserSeen(): boolean {
  try {
    return sessionStorage.getItem(TEASER_KEY) === "1";
  } catch {
    return true;
  }
}

function markTeaserSeen(): void {
  try {
    sessionStorage.setItem(TEASER_KEY, "1");
  } catch {
    // Stockage indisponible (navigation privée) : la bulle reviendra, sans gravité.
  }
}

/** Une animation brève de temps en temps, tant que le visiteur n'a pas ouvert le panneau. */
function useNudge(enabled: boolean): boolean {
  const [nudging, setNudging] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let count = 0;
    let stopTimer: number | undefined;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      count += 1;
      setNudging(true);
      stopTimer = window.setTimeout(() => setNudging(false), NUDGE_MS);
      if (count >= MAX_NUDGES) window.clearInterval(timer);
    }, NUDGE_EVERY_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stopTimer);
      setNudging(false);
    };
  }, [enabled]);
  return nudging;
}

function useTeaser(enabled: boolean): [boolean, () => void] {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!enabled || teaserSeen()) return;
    const show = window.setTimeout(() => setShown(true), TEASER_AFTER_MS);
    const hide = window.setTimeout(() => setShown(false), TEASER_AFTER_MS + TEASER_FOR_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [enabled]);
  useEffect(() => {
    if (shown) markTeaserSeen();
  }, [shown]);
  return [shown && enabled, () => setShown(false)];
}

interface AgentDockProps {
  content: SiteContent;
  chat: AgentChat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Passe la conversation en cours dans la vue chat, en plein écran. */
  onExpand: () => void;
  onOpenCareer: (target?: string) => void;
}

function Suggestions({ content, chat }: { content: SiteContent; chat: AgentChat }) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-2 overflow-y-auto px-4 pb-4">
      <p className="mb-2 text-[15px] text-muted-foreground leading-relaxed">{content.ui.askLead}</p>
      {content.suggestions.map((s) => (
        <button
          className="rounded-xl border bg-card/60 px-3.5 py-2.5 text-left text-[14px] transition-colors hover:border-ochre/50 disabled:pointer-events-none disabled:opacity-50"
          disabled={chat.remaining === 0}
          key={s}
          onClick={() => chat.send(s)}
          type="button"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function Panel({ content, chat, onOpenChange, onExpand, onOpenCareer }: Omit<AgentDockProps, "open">) {
  const { ui } = content;
  const empty = chat.messages.length === 0;

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      aria-label={ui.dockTitle}
      className="fixed inset-0 z-40 flex origin-bottom-right flex-col overflow-hidden bg-background sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(680px,calc(100dvh-6rem))] sm:w-[420px] sm:rounded-2xl sm:border sm:shadow-[0_24px_64px_-24px_rgb(20_14_10/0.45)]"
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      role="dialog"
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <AgentOrb active={chat.status !== "ready"} dot={1.5} size={30} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-display font-semibold tracking-[-0.02em]">{ui.dockTitle}</p>
          <p className="truncate text-muted-foreground text-xs">{ui.dockSubtitle}</p>
        </div>
        {!empty && (
          <Button aria-label={ui.newChat} onClick={chat.reset} size="icon-sm" title={ui.newChat} variant="ghost">
            <RotateCcwIcon />
          </Button>
        )}
        <Button aria-label={ui.expand} onClick={onExpand} size="icon-sm" title={ui.expand} variant="ghost">
          <Maximize2Icon />
        </Button>
        <Button aria-label={ui.close} onClick={() => onOpenChange(false)} size="icon-sm" title={ui.close} variant="ghost">
          <XIcon />
        </Button>
      </div>

      {empty ? (
        <>
          <Suggestions chat={chat} content={content} />
          <div className="px-3 pb-3">
            <Composer autoFocus content={content} onSend={chat.send} onStop={chat.stop} remaining={chat.remaining} status={chat.status} />
          </div>
        </>
      ) : (
        <ChatThread chat={chat} content={content} docked onOpenCareer={onOpenCareer} />
      )}
    </motion.div>
  );
}

/**
 * Sur la page Parcours, l'agent attend en bas à droite. Replié, c'est sa sphère, qui s'anime de temps en temps ;
 * ouvert, la même conversation que la vue chat, qu'on peut passer en plein écran.
 */
export function AgentDock(props: AgentDockProps) {
  const { content, chat, open, onOpenChange } = props;
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 640px)");
  const nudging = useNudge(!open && !reduced);
  const [teaser, hideTeaser] = useTeaser(!open);
  const busy = chat.status !== "ready";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <>
      <AnimatePresence>{open && <Panel {...props} />}</AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {teaser && (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="relative w-64 origin-bottom-right rounded-2xl rounded-br-md border bg-card px-4 py-3 pr-9 text-[14px] leading-snug shadow-[0_12px_32px_-16px_rgb(20_14_10/0.35)]"
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <button className="text-left" onClick={() => onOpenChange(true)} type="button">
                    {content.ui.dockTeaser}
                  </button>
                  <button
                    aria-label={content.ui.close}
                    className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    onClick={hideTeaser}
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              animate={nudging ? { y: [0, -6, 0, -3, 0] } : { y: 0 }}
              aria-label={content.career.askAgent}
              className="flex items-center gap-2.5 rounded-full border bg-card/95 p-1.5 font-medium text-[14px] shadow-[0_12px_32px_-14px_rgb(20_14_10/0.4)] backdrop-blur transition-colors hover:border-ochre/50 sm:pr-4"
              onClick={() => onOpenChange(true)}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              type="button"
            >
              <span className="relative flex size-10 items-center justify-center">
                {/* Le halo de la sphère quand elle s'anime */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] transition-opacity duration-500"
                  style={{ opacity: nudging || busy ? 1 : 0 }}
                />
                <AgentOrb active={nudging || busy} dot={1.5} size={40} />
              </span>
              {wide && <span>{content.career.askAgent}</span>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
