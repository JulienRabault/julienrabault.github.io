import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import type { SiteContent } from "@/content/types";
import type { ChatStatus } from "@/lib/use-agent-chat";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const MAX_LENGTH = 500;
// Le quota ne s'affiche qu'en approchant de la limite : avant, il n'apporte rien au visiteur.
const SHOW_QUOTA_BELOW = 4;

interface ComposerProps {
  content: SiteContent;
  status: ChatStatus;
  remaining: number;
  onSend: (text: string) => void;
  onStop: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function Composer({ content, status, remaining, onSend, onStop, autoFocus, className }: ComposerProps) {
  const { ui } = content;
  const exhausted = remaining === 0;
  const showQuota = remaining < SHOW_QUOTA_BELOW;
  const root = useRef<HTMLDivElement>(null);

  // Focus sans défilement : dans la bulle, un autoFocus natif ferait défiler la page sous le panneau.
  useEffect(() => {
    if (autoFocus) root.current?.querySelector("textarea")?.focus({ preventScroll: true });
  }, [autoFocus]);

  return (
    <div className={cn("space-y-2", className)} ref={root}>
      <PromptInput
        className="rounded-2xl bg-card shadow-[0_1px_2px_rgb(42_32_25/0.06),0_8px_24px_-12px_rgb(42_32_25/0.18)] dark:shadow-none [&_[data-slot=input-group]]:rounded-2xl"
        onSubmit={(message) => onSend(message.text)}
      >
        <PromptInputBody>
          <PromptInputTextarea
            className="min-h-14 text-[15.5px]"
            disabled={exhausted}
            maxLength={MAX_LENGTH}
            placeholder={exhausted ? ui.quotaReached : ui.placeholder}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools className="pl-1 text-muted-foreground text-xs">
            {showQuota && (exhausted ? ui.quotaReached : ui.quota(remaining))}
          </PromptInputTools>
          <PromptInputSubmit
            className="rounded-xl"
            disabled={exhausted && status === "ready"}
            onStop={onStop}
            status={status === "ready" ? undefined : status}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
