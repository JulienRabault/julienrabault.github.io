import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { AssistantMessage } from "@/components/chat/assistant-message";
import { Composer } from "@/components/chat/composer";
import type { SiteContent } from "@/content/types";
import type { AgentChat } from "@/lib/use-agent-chat";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const appear = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } as const;

interface ChatThreadProps {
  content: SiteContent;
  chat: AgentChat;
  onOpenCareer: (target?: string) => void;
  /** Dans la bulle du parcours : marges réduites, pas de morph de la zone de saisie. */
  docked?: boolean;
}

/** La conversation et sa zone de saisie, partagées par la vue chat et la bulle du parcours. */
export function ChatThread({ content, chat, onOpenCareer, docked = false }: ChatThreadProps) {
  const last = chat.messages.at(-1)?.id;
  const composer = <Composer autoFocus={docked} content={content} onSend={chat.send} onStop={chat.stop} remaining={chat.remaining} status={chat.status} />;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation>
        <ConversationContent className={cn("mx-auto w-full", docked ? "gap-8 px-4 py-5" : "max-w-3xl gap-10 px-4 py-10 sm:px-6")}>
          {chat.messages.map((m) => (
            <motion.div key={m.id} {...appear}>
              {m.role === "user" ? (
                <Message from="user">
                  <MessageContent className="rounded-2xl rounded-br-md border bg-card! px-4 py-2.5 text-[15.5px] text-foreground!">
                    {m.text}
                  </MessageContent>
                </Message>
              ) : (
                <AssistantMessage content={content} live={m.id === last} message={m} onOpenCareer={onOpenCareer} />
              )}
            </motion.div>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className={cn("mx-auto w-full", docked ? "px-3 pb-3" : "max-w-3xl px-4 pb-4 sm:px-6")}>
        {docked ? (
          composer
        ) : (
          <motion.div layoutId="composer" transition={{ type: "spring", stiffness: 260, damping: 32 }}>
            {composer}
          </motion.div>
        )}
        <p className={cn("text-center text-muted-foreground", docked ? "mt-1.5 text-[11px]" : "mt-2 text-xs")}>{content.ui.footnote}</p>
      </div>
    </div>
  );
}
