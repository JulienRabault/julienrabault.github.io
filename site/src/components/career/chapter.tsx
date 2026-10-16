import { HarnessBlock } from "@/components/career/harness-block";
import { MetricFigure } from "@/components/career/metric";
import type { CareerContent, CareerItem, Chapter, HarnessLayer } from "@/content/types";

interface ItemProps {
  item: CareerItem;
  career: CareerContent;
  harness: HarnessLayer[];
}

function Item({ item, career, harness }: ItemProps) {
  return (
    <li>
      <h4 className="font-medium text-[16.5px]">{item.name}</h4>
      <p className="mt-1.5 max-w-[66ch] text-[15.5px] text-muted-foreground leading-relaxed">{item.text}</p>
      {item.metrics && (
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {item.metrics.map((m) => (
            <MetricFigure key={m.value} labels={career} metric={m} />
          ))}
        </div>
      )}
      {item.widget === "harness" && <HarnessBlock className="mt-6" hint={career.harnessHint} layers={harness} />}
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
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="font-display font-semibold text-[26px] tracking-[-0.03em] sm:text-[30px]">{chapter.org}</h3>
          <p className="text-muted-foreground text-sm tabular-nums">{chapter.dates}</p>
        </div>
        <p className="mt-1 text-[15.5px]">
          {chapter.title}
          <span className="text-muted-foreground">, {chapter.place}</span>
        </p>
      </header>

      {chapter.context && (
        <p className="mt-5 max-w-[66ch] text-[16px] leading-relaxed">{chapter.context}</p>
      )}

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
