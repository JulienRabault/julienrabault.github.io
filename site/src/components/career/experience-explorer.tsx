import { ProjectBody, ProjectRow, ProjectSummary } from "@/components/career/project-row";
import { PixelMark } from "@/components/pixels";
import type { CareerContent, CareerItem, Chapter, HarnessLayer, SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Emphasis } from "@/components/emphasis";

const itemKey = (item: CareerItem) => item.id ?? item.name;
const itemsOf = (chapter: Chapter) => chapter.groups.flatMap((g) => g.items);
const WIDE = "(min-width: 1024px)";
// Sous l'en-tête collant (64 px), avec un peu d'air ; et la durée du fondu d'entrée.
const PANEL_OFFSET = 96;
const ENTER_MS = 240;

/** La sélection garde des clés, pas des objets : elle survit à un contenu rechargé. */
interface Selection {
  chapterId: string;
  itemKey: string;
}

const firstOf = (chapter: Chapter): Selection => ({ chapterId: chapter.id, itemKey: itemKey(itemsOf(chapter)[0]) });

/** Trouve ce qu'une cible désigne : un chapitre (son premier projet) ou un projet précis. */
function resolve(chapters: Chapter[], target: string): Selection | null {
  for (const chapter of chapters) {
    if (chapter.id === target) return firstOf(chapter);
    const item = itemsOf(chapter).find((i) => itemKey(i) === target);
    if (item) return { chapterId: chapter.id, itemKey: itemKey(item) };
  }
  return null;
}

export interface ExplorerHandle {
  /** Affiche la cible si elle est dans l'expérience, et la fait défiler à l'écran ; renvoie faux sinon. */
  show: (target: string) => boolean;
}

interface ExplorerProps {
  career: CareerContent;
  harness: HarnessLayer[];
  links: SiteContent["links"];
  ref?: Ref<ExplorerHandle>;
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
} as const;

function ChapterHead({ chapter }: { chapter: Chapter }) {
  return (
    <header>
      <h3 className="font-display font-semibold text-[28px] leading-tight tracking-[-0.03em] sm:text-[32px]">{chapter.org}</h3>
      <p className="mt-1 text-[15.5px]">
        {chapter.title}
        <span className="text-muted-foreground">, {chapter.place}, </span>
        <span className="text-muted-foreground tabular-nums">{chapter.dates}</span>
      </p>
      {chapter.context && <p className="mt-4 text-[15.5px] leading-relaxed"><Emphasis text={chapter.context} /></p>}
      {chapter.note && <p className="mt-2.5 text-[14.5px] text-muted-foreground leading-relaxed"><Emphasis text={chapter.note} /></p>}
    </header>
  );
}

/**
 * L'expérience en deux volets, comme une boîte de réception : à gauche tous les postes et leurs projets,
 * lisibles d'un coup d'œil ; à droite le projet choisi, en entier. La marque tramée de la sphère suit la sélection.
 * Sur écran étroit, un sélecteur de poste et des projets en accordéon prennent le relais.
 */
export function ExperienceExplorer({ career, harness, links, ref }: ExplorerProps) {
  const chapters = career.chapters;
  const [selection, setSelection] = useState<Selection>(() => firstOf(chapters[0]));
  // Chaque demande venue d'ailleurs (chat, en-tête) incrémente ce compteur : le projet visé s'ouvre et défile à l'écran.
  const [focus, setFocus] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const chapter = chapters.find((c) => c.id === selection.chapterId) ?? chapters[0];
  const item = itemsOf(chapter).find((i) => itemKey(i) === selection.itemKey) ?? itemsOf(chapter)[0];

  const select = (next: Selection) => {
    setSelection(next);
    // Si l'on a défilé loin dans un long projet, on remonte au début du suivant.
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 64) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useImperativeHandle(
    ref,
    () => ({
      show: (target) => {
        const found = resolve(chapters, target);
        if (!found) return false;
        setSelection(found);
        setFocus((n) => n + 1);
        return true;
      },
    }),
    [chapters],
  );

  // Sur grand écran, le projet demandé s'affiche dans le volet : on amène le volet en haut de l'écran.
  // On attend la fin du fondu d'entrée : la hauteur de l'en-tête du poste a changé, la position du volet aussi.
  useEffect(() => {
    if (focus === 0 || !window.matchMedia(WIDE).matches) return;
    const timer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const top = panel.getBoundingClientRect().top + window.scrollY - PANEL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }, ENTER_MS);
    return () => window.clearTimeout(timer);
  }, [focus]);

  // Sur mobile, la pastille du poste choisi reste visible dans sa rangée défilante.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-chapter="${selection.chapterId}"]`);
    // Rangée cachée sur grand écran : on n'y touche pas, un défilement lancé ici couperait celui de la page.
    if (row?.offsetParent && chip) row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.clientWidth) / 2;
  }, [selection.chapterId]);

  const flat = chapters.flatMap((c) => itemsOf(c).map((i) => ({ chapter: c, item: i })));
  const next = flat[flat.findIndex((s) => s.item === item) + 1];

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-12">
      <nav aria-label={career.labels.nav} className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {chapters.map((c) => (
            <div key={c.id}>
              <button
                aria-current={c === chapter ? "true" : undefined}
                className="group block w-full py-1 pr-2 text-left"
                onClick={() => select(firstOf(c))}
                type="button"
              >
                <span
                  className={cn(
                    "block font-medium text-[14.5px] transition-colors group-hover:text-foreground",
                    c === chapter ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {c.org}
                </span>
                <span className="block text-muted-foreground/80 text-xs tabular-nums">
                  {career.timeline.find((t) => t.target === c.id)?.dates}
                </span>
              </button>
              {/* Les projets sont en retrait sous leur poste, le long d'un filet sur lequel glisse la marque tramée. */}
              <ul className="mt-1.5 ml-1 border-l">
                {itemsOf(c).map((i) => {
                  const on = i === item;
                  return (
                    <li key={itemKey(i)}>
                      <button
                        aria-current={on ? "true" : undefined}
                        className="relative block w-full py-[5px] pr-2 pl-4 text-left text-[13.5px] leading-snug transition-colors hover:text-foreground"
                        onClick={() => select({ chapterId: c.id, itemKey: itemKey(i) })}
                        type="button"
                      >
                        {on && (
                          <motion.span
                            className="absolute top-[0.6rem] -left-[5px] bg-background"
                            layoutId="career-explorer-marker"
                            transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          >
                            <PixelMark className="size-2.5" />
                          </motion.span>
                        )}
                        <span className={cn("transition-colors", on ? "font-medium text-foreground" : "text-muted-foreground")}>
                          {i.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="min-w-0">
        {/* Sur écran étroit : un poste à la fois, choisi ici. */}
        <div aria-label={career.labels.nav} className="-mx-1 mb-6 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden" ref={chipsRef}>
          {chapters.map((c) => (
            <button
              aria-pressed={c === chapter}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ochre",
                c === chapter ? "bg-foreground text-background" : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
              data-chapter={c.id}
              key={c.id}
              onClick={() => setSelection(firstOf(c))}
              type="button"
            >
              {c.org}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={chapter.id} {...fade}>
            <ChapterHead chapter={chapter} />

            <ul className="mt-8 lg:hidden">
              {itemsOf(chapter).map((i) => (
                <ProjectRow
                  career={career}
                  focus={itemKey(i) === selection.itemKey ? focus : 0}
                  harness={harness}
                  item={i}
                  key={itemKey(i)}
                  links={links}
                />
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 hidden scroll-mt-24 border-t pt-8 lg:block" ref={panelRef}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.article key={itemKey(item)} {...fade}>
              <ProjectSummary career={career} item={item} large />
              <div className="mt-6">
                <ProjectBody career={career} harness={harness} item={item} links={links} />
              </div>
            </motion.article>
          </AnimatePresence>

          {next && (
            <button
              className="group mt-10 inline-flex max-w-full items-center gap-1.5 text-left text-[14px] transition-colors"
              onClick={() => select({ chapterId: next.chapter.id, itemKey: itemKey(next.item) })}
              type="button"
            >
              <span className="shrink-0 text-muted-foreground">{career.project.next}</span>
              <span className="truncate font-medium decoration-ochre/60 underline-offset-4 group-hover:underline">
                {next.item.name}
                {next.chapter !== chapter && <span className="font-normal text-muted-foreground">, {next.chapter.org}</span>}
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-ochre" />
            </button>
          )}
        </div>

        {chapter.footnote && (
          <p className="mt-6 text-[14px] text-muted-foreground leading-relaxed lg:mt-8">{chapter.footnote}</p>
        )}
      </div>
    </div>
  );
}
