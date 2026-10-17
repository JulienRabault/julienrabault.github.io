import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { Message, MessageAction, MessageContent } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { citationNumbering } from "@/components/chat/cited-text";
import { RichText } from "@/components/chat/rich-text";
import { CITATION, DIRECTIVE, parseDirective } from "@/content/agent-contract";
import type { SiteContent } from "@/content/types";
import type { AssistantMessage as AssistantMessageData } from "@/lib/use-agent-chat";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SOURCE_TARGETS } from "@/content/source-targets";
import { ArrowUpRightIcon, CheckIcon, ChevronDownIcon, CircleAlertIcon, CopyIcon, FileTextIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface AnswerFooterProps {
  content: SiteContent;
  numbering: Map<string, number>;
  copied: boolean;
  onCopy: () => void;
  /** Dernière réponse : les actions restent visibles. Les plus anciennes ne les montrent qu'au survol. */
  pinned: boolean;
  onOpenCareer: (target?: string) => void;
}

/**
 * Sous la réponse, comme dans les assistants courants : une rangée d'icônes discrète, puis les sources repliées
 * derrière un seul bouton. Le détail d'une source s'ouvre au survol de son numéro dans le texte ; dans la liste,
 * une source mène à son endroit du parcours.
 */
function AnswerFooter({ content, numbering, copied, onCopy, pinned, onOpenCareer }: AnswerFooterProps) {
  const { ui, sources } = content;
  const [open, setOpen] = useState(false);
  const cited = [...numbering];

  return (
    <Collapsible onOpenChange={setOpen} open={open}>
      <div
        className={cn(
          "-ml-2 flex items-center gap-1 text-muted-foreground transition-opacity focus-within:opacity-100",
          !pinned && "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/answer:opacity-100",
        )}
      >
        <MessageAction label={copied ? ui.copied : ui.copy} onClick={onCopy} tooltip={copied ? ui.copied : ui.copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </MessageAction>
        {cited.length > 0 && (
          <CollapsibleTrigger className="inline-flex h-8 items-center gap-2 rounded-md px-2 text-[13px] transition-colors hover:bg-accent hover:text-foreground">
            <span aria-hidden className="flex -space-x-1">
              {cited.slice(0, 3).map(([id, n]) => (
                <span
                  className="flex size-[18px] items-center justify-center rounded-full bg-ochre-soft font-semibold text-[10px] text-ochre tabular-nums ring-2 ring-background"
                  key={id}
                >
                  {n}
                </span>
              ))}
            </span>
            {ui.sourcesCount(cited.length)}
            <ChevronDownIcon className={cn("size-3.5 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
        )}
      </div>
      <CollapsibleContent>
        <ol className="mt-2 divide-y overflow-hidden rounded-xl border">
          {cited.map(([id, n]) => {
            const target = SOURCE_TARGETS[id];
            const body = (
              <>
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-ochre-soft font-semibold text-[11px] text-ochre tabular-nums">
                  {n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px]">
                    <span className="font-medium">{sources[id].title}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {sources[id].org}
                      {sources[id].period && `, ${sources[id].period}`}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground leading-relaxed">
                    {sources[id].text}
                  </span>
                </span>
              </>
            );
            return (
              <li key={id}>
                {target ? (
                  <button
                    aria-label={`${ui.openSource} : ${sources[id].title}`}
                    className="group/source flex w-full gap-3 px-3.5 py-3 text-left transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none"
                    onClick={() => onOpenCareer(target)}
                    type="button"
                  >
                    {body}
                    <ArrowUpRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/source:text-ochre" />
                  </button>
                ) : (
                  <div className="flex gap-3 px-3.5 py-3">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface AssistantMessageProps {
  message: AssistantMessageData;
  content: SiteContent;
  /** Dernier message : ses widgets ont droit au shader. */
  live: boolean;
  onOpenCareer: (target?: string) => void;
}

/** Texte à copier : sans numéros de source, les liens remplacés par leur libellé, les widgets retirés. */
function plainText(text: string, content: SiteContent): string {
  return text
    .replace(new RegExp(`\\s*${CITATION.source}`, "g"), "")
    .replace(DIRECTIVE, (_, kind: string, arg: string | undefined) => {
      const directive = parseDirective(kind, arg);
      return directive?.kind === "link" ? content.links[directive.id].label : "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AssistantMessage({ message, content, live, onOpenCareer }: AssistantMessageProps) {
  const { ui, sources } = content;
  const [copied, setCopied] = useState(false);
  const numbering = useMemo(() => citationNumbering(message.text, sources), [message.text, sources]);
  const done = message.status === "done";
  const reading = message.status === "reading";

  const copy = async () => {
    await navigator.clipboard.writeText(plainText(message.text, content));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Message className="group/answer" from="assistant">
      <MessageContent className="w-full gap-4 overflow-visible">
        {/* Avant le premier mot, le worker n'a encore rien dit : on montre que l'agent lit. */}
        {reading && message.read.length === 0 && (
          <p aria-live="polite" className="flex h-9 items-center text-[14px] text-muted-foreground">
            <Shimmer as="span">{ui.reading}</Shimmer>
          </p>
        )}

        {message.read.length > 0 && (
          <ChainOfThought className="space-y-0">
            <ChainOfThoughtHeader className="w-fit">
              {reading ? <Shimmer as="span">{ui.reading}</Shimmer> : ui.readDone(message.read.length)}
            </ChainOfThoughtHeader>
            <ChainOfThoughtContent className="pt-1">
              {message.read.map((id) => (
                <ChainOfThoughtStep
                  description={`${sources[id]?.org}, ${sources[id]?.period}`}
                  icon={FileTextIcon}
                  key={id}
                  label={sources[id]?.title ?? id}
                />
              ))}
            </ChainOfThoughtContent>
          </ChainOfThought>
        )}

        {message.text && (
          <RichText content={content} live={live} numbering={numbering} onOpenCareer={onOpenCareer} text={message.text} />
        )}

        {message.status === "error" && (
          <p className="flex items-start gap-2 text-[15px] text-muted-foreground">
            <CircleAlertIcon className="mt-1 size-4 shrink-0" />
            {
              {
                budget: ui.errorBudget,
                quota: ui.quotaReached,
                challenge: ui.errorChallenge,
                unavailable: ui.errorUnavailable,
              }[message.error ?? "unavailable"]
            }
          </p>
        )}

        {done && (
          <AnswerFooter
            copied={copied}
            content={content}
            numbering={numbering}
            onCopy={copy}
            onOpenCareer={onOpenCareer}
            pinned={live}
          />
        )}
      </MessageContent>
    </Message>
  );
}
