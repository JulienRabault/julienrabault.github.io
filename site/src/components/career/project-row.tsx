import { HarnessBlock } from "@/components/career/harness-block";
import { Results } from "@/components/career/metric";
import { StatusPill } from "@/components/career/status-pill";
import { PixelToggle } from "@/components/pixels";
import type { CareerContent, CareerItem, HarnessLayer, SiteContent } from "@/content/types";
import { ArrowUpRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

interface ProjectProps {
  item: CareerItem;
  career: CareerContent;
  harness: HarnessLayer[];
  links: SiteContent["links"];
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Le détail d'un projet : le problème posé, ce que Julien a fait point par point, le schéma du harnais, la stack et les liens. */
export function ProjectBody({ item, career, harness, links }: ProjectProps) {
  return (
    <>
      <div className="space-y-4">
        {item.problem && <p className="text-[15.5px] leading-relaxed">{item.problem}</p>}
        {item.details && (
          <ul className="space-y-2.5">
            {item.details.map((detail) => (
              <li className="flex gap-3 text-[15px] leading-relaxed" key={detail}>
                {/* Une puce carrée : la trame de la sphère, réduite à un pixel. */}
                <span aria-hidden className="mt-[0.62em] size-[5px] shrink-0 bg-ochre/80" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {item.widget === "harness" && (
        <div className="@container mt-6">
          <HarnessBlock hint={career.harnessHint} layers={harness} />
        </div>
      )}
      {(item.stack || item.links) && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
          {item.stack && <span>{item.stack.join(", ")}</span>}
          {item.links?.map((id) => (
            <a
              className="group inline-flex items-center gap-1 text-foreground decoration-ochre/60 underline-offset-4 hover:underline"
              href={links[id].href}
              key={id}
              rel="noopener"
              target="_blank"
            >
              {capitalize(links[id].label)}
              <ArrowUpRightIcon className="size-3.5 text-muted-foreground transition-colors group-hover:text-ochre" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}

/** Nom, statut, une phrase et les résultats : ce qu'on lit d'un projet sans rien ouvrir. */
export function ProjectSummary({ item, career, large = false }: { item: CareerItem; career: CareerContent; large?: boolean }) {
  return (
    <>
      <h4
        className={
          large
            ? "flex flex-wrap items-center gap-x-3 gap-y-1 font-display font-semibold text-[23px] leading-tight tracking-[-0.025em]"
            : "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-medium text-[17px] leading-snug"
        }
      >
        {item.name}
        {item.status && <StatusPill status={item.status} />}
      </h4>
      <p className={large ? "mt-2 text-[17px] leading-relaxed" : "mt-1.5 text-[15.5px] text-muted-foreground leading-relaxed"}>
        {item.text}
      </p>
      {item.metrics && <Results className="mt-3" estimateLabel={career.estimate} metrics={item.metrics} />}
    </>
  );
}

interface ProjectRowProps extends ProjectProps {
  /** Compteur des demandes venues d'ailleurs (chat, en-tête) qui visent ce projet ; 0 si aucune. */
  focus?: number;
}

/** Un projet en accordéon, pour les écrans étroits : replié, il se lit comme une ligne de CV. */
export function ProjectRow({ item, career, harness, links, focus = 0 }: ProjectRowProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rowRef = useRef<HTMLLIElement>(null);

  // Un lien du chat vers ce projet l'ouvre et l'amène à l'écran.
  useEffect(() => {
    if (focus === 0) return;
    setOpen(true);
    // On attend que le poste ait fini d'entrer. Sur grand écran la liste est cachée : c'est le volet de droite qui défile.
    const timer = window.setTimeout(() => {
      const row = rowRef.current;
      if (!row?.offsetParent) return;
      window.scrollTo({ top: row.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 240);
    return () => window.clearTimeout(timer);
  }, [focus]);
  const expandable = Boolean(item.problem || item.details?.length || item.widget || item.stack || item.links);

  return (
    <li className="scroll-mt-24 border-t py-6 first:border-t-0 first:pt-0" ref={rowRef}>
      <ProjectSummary career={career} item={item} />
      {expandable && (
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="-mx-2 mt-2.5 inline-flex items-center gap-2 rounded-md px-2 py-1 text-[13.5px] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          <PixelToggle className="text-ochre" open={open} />
          {open ? career.project.less : career.project.more}
        </button>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pt-4">
              <ProjectBody career={career} harness={harness} item={item} links={links} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
