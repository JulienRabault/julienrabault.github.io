import { AnswerWidget, type WidgetRequest } from "@/components/chat/answer-widget";
import { CitationBadge } from "@/components/chat/cited-text";
import { parseDirective } from "@/content/agent-contract";
import { LinkChip } from "@/components/chat/link-chip";
import type { SiteContent } from "@/content/types";
import { Fragment, type ReactNode } from "react";

// Un seul découpage pour tout le texte en ligne : citation, directive, ou gras.
const INLINE = /\[\[([a-z0-9-]+)\]\]|\{\{([a-z]+)(?::([a-z0-9-]+))?\}\}|\*\*([^*\n]+)\*\*/g;
const BULLET = /^\s*[-•]\s+/;

type Block = { type: "p"; text: string } | { type: "list"; items: string[] } | { type: "widget"; request: WidgetRequest };

/** Coupe une fin de flux qui s'arrête au milieu d'un marqueur [[id]] ou {{widget}}. */
function hideOpenMarker(text: string): string {
  let out = text;
  for (const [open, close] of [["[[", "]]"], ["{{", "}}"]] as const) {
    const at = out.lastIndexOf(open);
    if (at !== -1 && out.indexOf(close, at) === -1) out = out.slice(0, at);
  }
  return out;
}

/**
 * Paragraphes, listes à puces et widgets. Un widget demandé au milieu d'une phrase est sorti du paragraphe
 * et posé juste après : l'agent ne peut pas casser la mise en page.
 */
export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of hideOpenMarker(text).split(/\n\s*\n/)) {
    const widgets: WidgetRequest[] = [];
    const prose = chunk
      .replace(/\{\{([a-z]+)(?::([a-z0-9-]+))?\}\}/g, (match, kind: string, arg: string | undefined) => {
        const directive = parseDirective(kind, arg);
        if (!directive) return "";
        if (directive.kind === "link") return match;
        widgets.push(directive);
        return "";
      })
      .trim();

    const lines = prose.split("\n").filter((l) => l.trim());
    if (lines.length > 0 && lines.every((l) => BULLET.test(l))) {
      blocks.push({ type: "list", items: lines.map((l) => l.replace(BULLET, "")) });
    } else if (prose) {
      blocks.push({ type: "p", text: lines.join(" ") });
    }
    for (const request of widgets) blocks.push({ type: "widget", request });
  }
  return blocks;
}

interface InlineProps {
  text: string;
  content: SiteContent;
  numbering: Map<string, number>;
  onOpenCareer: (target?: string) => void;
}

function Inline({ text, content, numbering, onOpenCareer }: InlineProps) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const [raw, citation, kind, arg, bold] = match;
    const index = match.index ?? 0;
    // L'espace avant une citation est retiré pour coller le numéro au mot.
    const before = text.slice(last, index);
    parts.push(citation ? before.trimEnd() : before);
    last = index + raw.length;

    if (citation) {
      const source = content.sources[citation];
      const number = numbering.get(citation);
      if (source && number) parts.push(<CitationBadge id={citation} key={index} number={number} source={source} />);
    } else if (bold) {
      parts.push(
        <strong className="font-semibold" key={index}>
          {bold}
        </strong>,
      );
    } else {
      const directive = parseDirective(kind, arg);
      if (directive?.kind === "link") {
        parts.push(<LinkChip key={index} link={content.links[directive.id]} onOpenCareer={onOpenCareer} />);
      }
    }
  }
  parts.push(text.slice(last));
  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

interface RichTextProps {
  text: string;
  content: SiteContent;
  numbering: Map<string, number>;
  live: boolean;
  onOpenCareer: (target?: string) => void;
}

export function RichText({ text, content, numbering, live, onOpenCareer }: RichTextProps) {
  const inline = (t: string) => <Inline content={content} numbering={numbering} onOpenCareer={onOpenCareer} text={t} />;
  return (
    <div className="space-y-4 text-[15.5px] leading-[1.7]">
      {toBlocks(text).map((block, i) => {
        if (block.type === "widget") {
          return (
            <div className="py-1" key={`${i}-${block.request.id}`}>
              <AnswerWidget content={content} live={live} onOpenCareer={onOpenCareer} request={block.request} />
            </div>
          );
        }
        if (block.type === "list") {
          return (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-muted-foreground" key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
