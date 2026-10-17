import { Emphasis } from "@/components/emphasis";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { QuestionRow } from "@/lib/admin-api";
import { countryName, sourceLabel, timeAgo } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

// Une réponse normale n'a pas besoin d'étiquette ; le reste se signale, sans le jargon du worker.
function statusLabel(status: string | null): string | undefined {
  if (!status || status === "ok") return undefined;
  if (status === "client_abort") return "interrompue par le visiteur";
  if (status === "quota_error") return "quota indisponible";
  return "erreur";
}

interface QuestionItemProps {
  row: QuestionRow;
  onDelete: (id: number) => Promise<void>;
}

function QuestionItem({ row, onDelete }: QuestionItemProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const status = statusLabel(row.status);
  const meta = [timeAgo(row.created_at), countryName(row.country), sourceLabel(row.source), row.campaign, row.language?.toUpperCase()]
    .filter(Boolean)
    .join(", ");

  const remove = async () => {
    setDeleting(true);
    try {
      await onDelete(row.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <li className="py-3.5">
      <Collapsible onOpenChange={setOpen} open={open}>
        <div className="flex items-start gap-3">
          <CollapsibleTrigger className="group/q min-w-0 flex-1 text-left">
            <span className="flex items-start gap-2">
              <ChevronDownIcon
                className={cn("mt-1 size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
              />
              <span className="min-w-0">
                <span className="block text-[14.5px] group-hover/q:underline group-hover/q:decoration-ochre/60 group-hover/q:underline-offset-4">
                  {row.question || "Question vide"}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                  {meta}
                  {status && <span className="ml-1.5 text-destructive">{status}</span>}
                </span>
              </span>
            </span>
          </CollapsibleTrigger>
          {confirming ? (
            <span className="flex shrink-0 gap-1">
              <Button disabled={deleting} onClick={remove} size="xs" type="button" variant="destructive">
                Effacer
              </Button>
              <Button onClick={() => setConfirming(false)} size="xs" type="button" variant="ghost">
                Garder
              </Button>
            </span>
          ) : (
            <Button
              aria-label="Effacer cette question"
              className="shrink-0 text-muted-foreground"
              onClick={() => setConfirming(true)}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <Trash2Icon />
            </Button>
          )}
        </div>
        <CollapsibleContent>
          <div className="mt-2.5 ml-5.5 space-y-2 border-l-2 border-ochre/40 pl-3.5 text-[14px] text-muted-foreground leading-relaxed">
            {(row.answer || "Pas de réponse enregistrée.").split(/\n{2,}/).map((paragraph, index) => (
              // Les paragraphes d'une réponse enregistrée ne bougent pas : leur rang suffit comme clé.
              <p className="whitespace-pre-line" key={index}>
                <Emphasis text={paragraph} />
              </p>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

/** Les dernières questions posées au modèle, la réponse dépliable. Effacer demande une confirmation. */
export function QuestionList({ rows, onDelete }: { rows: QuestionRow[]; onDelete: (id: number) => Promise<void> }) {
  if (rows.length === 0) {
    return <p className="text-[14px] text-muted-foreground">Personne n'a encore écrit au chat sur la période.</p>;
  }
  return (
    <ul className="divide-y">
      {rows.map((row) => (
        <QuestionItem key={row.id} onDelete={onDelete} row={row} />
      ))}
    </ul>
  );
}
