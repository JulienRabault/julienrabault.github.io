import { AgentDock } from "@/components/chat/agent-dock";
import { ChatThread } from "@/components/chat/chat-thread";
import { Welcome } from "@/components/chat/welcome";
import { CareerPage } from "@/components/career/career-page";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SiteContent } from "@/content/types";
import { useAgentChat } from "@/lib/use-agent-chat";
import { useMediaQuery } from "@/lib/use-media-query";
import { useView } from "@/lib/use-view";
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from "motion/react";
import { useCallback, useRef, useState } from "react";

// Changer de vue est un fondu court sur place : rien ne glisse, l'en-tête ne bouge pas.
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.16 } } as const;

export default function App({ content }: { content: SiteContent }) {
  const chat = useAgentChat(content);
  const [view, setView] = useView();
  const [dockOpen, setDockOpen] = useState(false);
  const wide = useMediaQuery("(min-width: 640px)");
  const empty = chat.messages.length === 0;

  const scrollTo = (target: string) =>
    requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }));

  // Ouvre le parcours, puis fait défiler jusqu'au chapitre une fois la page montée (après le fondu de sortie du chat).
  const pendingTarget = useRef<string | null>(null);
  const openCareer = (target?: string) => {
    pendingTarget.current = target ?? null;
    setView("career");
  };
  const afterSwitch = () => {
    if (pendingTarget.current) scrollTo(pendingTarget.current);
    pendingTarget.current = null;
  };

  // Depuis la bulle, on est déjà sur le parcours : on y défile, et sur mobile on referme le panneau qui le cache.
  const openCareerFromDock = (target?: string) => {
    if (!wide) setDockOpen(false);
    if (target) scrollTo(target);
  };

  const expandDock = useCallback(() => {
    setDockOpen(false);
    setView("chat");
  }, [setView]);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <LayoutGroup>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader
              active={chat.status !== "ready"}
              compact={empty && view === "chat"}
              content={content}
              onHome={() => {
                setView("chat");
                chat.reset();
              }}
              onViewChange={(next) => {
                setDockOpen(false);
                setView(next);
              }}
              view={view}
            />

            <AnimatePresence initial={false} mode="wait" onExitComplete={afterSwitch}>
              {view === "career" ? (
                <motion.div className="flex flex-1 flex-col" key="career" {...fade}>
                  <CareerPage content={content} onAsk={() => setDockOpen(true)} />
                  <AgentDock
                    chat={chat}
                    content={content}
                    onExpand={expandDock}
                    onOpenCareer={openCareerFromDock}
                    onOpenChange={setDockOpen}
                    open={dockOpen}
                  />
                </motion.div>
              ) : (
                <motion.div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col" key="chat" {...fade}>
                  {empty ? (
                    <Welcome
                      content={content}
                      onOpenCareer={() => openCareer()}
                      onSend={chat.send}
                      onStop={chat.stop}
                      remaining={chat.remaining}
                      status={chat.status}
                    />
                  ) : (
                    <main className="flex min-h-0 flex-1 flex-col">
                      <ChatThread chat={chat} content={content} onOpenCareer={openCareer} />
                    </main>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </TooltipProvider>
    </MotionConfig>
  );
}
