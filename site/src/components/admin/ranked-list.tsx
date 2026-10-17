export interface RankedItem {
  label: string;
  value: number;
}

interface RankedListProps {
  /** Sans titre, la liste se range sous celui du bloc qui la contient. */
  title?: string;
  items: RankedItem[];
  /** Ce que compte la colonne de droite, lu par les lecteurs d'écran. */
  unit: string;
  empty?: string;
  className?: string;
}

/** Une liste classée, chaque ligne avec une barre fine proportionnelle : la répartition se voit sans graphique. */
export function RankedList({ title, items, unit, empty = "Rien sur la période.", className }: RankedListProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(1, ...sorted.map((item) => item.value));
  return (
    <section className={className}>
      {title && <h3 className="border-b pb-2.5 font-medium text-[15px]">{title}</h3>}
      {sorted.length === 0 ? (
        <p className="py-3 text-[13.5px] text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-1">
          {sorted.map((item) => (
            <li className="relative isolate flex items-center gap-3 py-2 text-[14px]" key={item.label}>
              <span
                aria-hidden
                className="absolute inset-y-1 left-0 -z-10 rounded-md bg-ochre-soft/70"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
              <span className="min-w-0 flex-1 truncate pl-2">{item.label}</span>
              <span className="pr-1 text-muted-foreground tabular-nums">
                {item.value.toLocaleString("fr-FR")}
                <span className="sr-only"> {unit}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
