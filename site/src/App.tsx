import { AgentDock } from "@/components/chat/agent-dock";
import { ChatThread } from "@/components/chat/chat-thread";
import { Welcome } from "@/components/chat/welcome";
import { CareerPage } from "@/components/career/career-page";
import { SiteHeader } from "@/components/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SiteContent } from "@/content/types";
import { requestCareerJump } from "@/lib/career-jump";
import { useAgentChat } from "@/lib/use-agent-chat";
import { useMediaQuery } from "@/lib/use-media-query";
import { ADMIN_HASH, useView } from "@/lib/use-view";
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from "motion/react";
import { lazy, Suspense, useCallback, useState } from "react";

// Le tableau de bord et ses graphiques ne sont chargés que par celui qui l'ouvre, pas par les visiteurs.
const AdminPage = lazy(() => import("@/components/admin/admin-page").then((module) => ({ default: module.AdminPage })));

// Changer de vue est un fondu court sur place : rien ne glisse, l'en-tête ne bouge pas.
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.16 } } as const;

export default function App({ content }: { content: SiteContent }) {
  const chat = useAgentChat(content);
  const [view, setView] = useView();
  const [dockOpen, setDockOpen] = useState(false);
  const wide = useMediaQuery("(min-width: 640px)");
  const empty = chat.messages.length === 0;

  // Ouvre le parcours ; la cible (chapitre, projet ou section) attend que la page soit montée pour s'afficher.
  const openCareer = (target?: string) => {
    if (target) requestCareerJump(target);
    setView("career");
  };

  // Depuis la bulle, on est déjà sur le parcours : on y va, et sur mobile on referme le panneau qui le cache.
  const openCareerFromDock = (target?: string) => {
    if (!wide) setDockOpen(false);
    if (target) requestCareerJump(target);
  };

  const expandDock = useCallback(() => {
    setDockOpen(false);
    setView("chat");
  }, [setView]);

  // Le tableau de bord de Julien : une page à part, sans l'en-tête ni l'agent du site.
  if (view === "admin") {
    return (
      <TooltipProvider>
        <div className="flex min-h-dvh flex-col">
          <Suspense fallback={null}>
            <AdminPage />
          </Suspense>
        </div>
      </TooltipProvider>
    );
  }

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

            <AnimatePresence initial={false} mode="wait">
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

            {/* Accès discret au tableau de bord, comme sur l'ancien site : un point, protégé par le jeton derrière. */}
            <a
              aria-hidden
              className="fixed bottom-1.5 left-1.5 z-10 size-1 rounded-full bg-muted-foreground/25"
              href={ADMIN_HASH}
              tabIndex={-1}
            />
          </div>
        </LayoutGroup>
      </TooltipProvider>
    </MotionConfig>
  );
}
