import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SourceRow } from "@/lib/admin-api";
import { sourceLabel } from "@/lib/admin-format";
import { cn } from "@/lib/utils";

interface SourceTableProps {
  rows: SourceRow[];
  active?: string;
  onSelect: (source?: string) => void;
}

/** Les sources des liens suivis. Un clic filtre tout le tableau de bord sur cette source, un second l'enlève. */
export function SourceTable({ rows, active, onSelect }: SourceTableProps) {
  if (rows.length === 0) {
    return <p className="text-[14px] text-muted-foreground">Aucune visite sur la période.</p>;
  }
  return (
    <Table className="text-[14px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-0">Source</TableHead>
          <TableHead className="text-right">Visiteurs</TableHead>
          <TableHead className="text-right">Vues</TableHead>
          <TableHead className="pr-0 text-right">Questions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const selected = row.source === active;
          return (
            <TableRow
              className={cn("cursor-pointer", selected && "bg-ochre-soft/60 hover:bg-ochre-soft/80")}
              key={row.source}
              onClick={() => onSelect(selected ? undefined : row.source)}
            >
              <TableCell className="pl-0">
                {/* Le bouton porte l'état pour le clavier et les lecteurs d'écran ; la ligne reste cliquable à la souris. */}
                <button
                  aria-pressed={selected}
                  className="text-left underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(selected ? undefined : row.source);
                  }}
                  type="button"
                >
                  {sourceLabel(row.source)}
                </button>
              </TableCell>
              <TableCell className="text-right tabular-nums">{row.unique_visitors}</TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">{row.page_views}</TableCell>
              <TableCell className="pr-0 text-right tabular-nums">{row.chat_messages}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
