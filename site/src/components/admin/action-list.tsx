import type { ActionRow } from "@/lib/admin-api";
import { ACTION_LABELS, actionDetail, countryName, sourceLabel, timeAgo } from "@/lib/admin-format";

/** Ce que les visiteurs ont fait de concret, du plus récent au plus ancien. */
export function ActionList({ rows }: { rows: ActionRow[] }) {
  if (rows.length === 0) {
    return <p className="text-[14px] text-muted-foreground">Aucune action sur la période.</p>;
  }
  return (
    <ul className="divide-y">
      {rows.map((row) => {
        const detail = actionDetail(row.metadata);
        return (
          <li className="flex items-baseline gap-3 py-2.5 text-[14px]" key={row.id}>
            <span className="min-w-0 flex-1">
              <span className="font-medium">{ACTION_LABELS[row.event_type] ?? row.event_type}</span>
              {detail && <span className="text-muted-foreground"> {detail}</span>}
              <span className="block text-[12.5px] text-muted-foreground">
                {[countryName(row.country), sourceLabel(row.source)].join(", ")}
              </span>
            </span>
            <time className="shrink-0 text-[12.5px] text-muted-foreground" dateTime={row.created_at}>
              {timeAgo(row.created_at)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
