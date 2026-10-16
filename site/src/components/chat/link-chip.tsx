import type { ChatLink } from "@/content/types";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";

/** Lien demandé par l'agent ({{link:id}}) : le parcours s'ouvre sur place, le reste dans un nouvel onglet. */
export function LinkChip({ link, onOpenCareer }: { link: ChatLink; onOpenCareer: (target?: string) => void }) {
  const className =
    "font-medium text-foreground underline decoration-ochre/60 underline-offset-4 transition-colors hover:decoration-ochre";
  if (link.career !== undefined) {
    return (
      <button className={className} onClick={() => onOpenCareer(link.career || undefined)} type="button">
        {link.label}
      </button>
    );
  }
  const external = link.href.startsWith("http");
  return (
    <a
      className={className}
      download={link.download || undefined}
      href={link.href}
      rel={external ? "noopener" : undefined}
      target={external ? "_blank" : undefined}
    >
      {link.label}
      {link.download && <DownloadIcon className="ml-0.5 inline size-3.5 -translate-y-px text-muted-foreground" />}
      {external && <ArrowUpRightIcon className="ml-0.5 inline size-3.5 -translate-y-px text-muted-foreground" />}
    </a>
  );
}
