import { HarnessBlock } from "@/components/career/harness-block";
import { Results } from "@/components/career/metric";
import type { CareerContent, CareerItem, Chapter, HarnessLayer } from "@/content/types";

/** Où en est le projet, dit en un mot à côté de son nom. */
export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-ochre-soft px-2 py-0.5 font-medium text-[11px] text-ochre">
      {status}
    </span>
  );
}

interface ItemProps {
  item: CareerItem;
  career: CareerContent;
  harness: HarnessLayer[];
}

function Item({ item, career, harness }: ItemProps) {
  return (
    <li>
      <h4 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-medium text-[16.5px]">
        {item.name}
        {item.status && <StatusPill status={item.status} />}
      </h4>
      <p className="mt-1.5 max-w-[66ch] text-[15.5px] text-muted-foreground leading-relaxed">{item.text}</p>
      {item.metrics && <Results className="mt-3" estimateLabel={career.estimate} metrics={item.metrics} />}
      {item.stack && <p className="mt-2 text-[13px] text-muted-foreground/80">{item.stack.join(", ")}</p>}
      {item.widget === "harness" && (
        <div className="@container mt-6 max-w-2xl">
          <HarnessBlock hint={career.harnessHint} layers={harness} />
        </div>
      )}
    </li>
  );
}

interface ChapterViewProps {
  chapter: Chapter;
  career: CareerContent;
  harness: HarnessLayer[];
}

export function ChapterView({ chapter, career, harness }: ChapterViewProps) {
  return (
    <article className="scroll-mt-24" id={chapter.id}>
      {/* Tout part du même bord gauche que le texte : rien n'est renvoyé au bord droit de la page. */}
      <header>
        <h3 className="font-display font-semibold text-[26px] tracking-[-0.03em] sm:text-[30px]">{chapter.org}</h3>
        <p className="mt-1 text-[15.5px]">
          {chapter.title}
          <span className="text-muted-foreground">, {chapter.place}</span>
        </p>
        <p className="mt-0.5 text-muted-foreground text-sm tabular-nums">{chapter.dates}</p>
      </header>

      {chapter.context && <p className="mt-5 max-w-[66ch] text-[16px] leading-relaxed">{chapter.context}</p>}

      {chapter.groups.map((group, i) => (
        <section className="mt-10" key={group.title ?? i}>
          {group.title && <p className="mb-5 text-muted-foreground text-sm">{group.title}</p>}
          <ul className="space-y-8">
            {group.items.map((item) => (
              <Item career={career} harness={harness} item={item} key={item.name} />
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
