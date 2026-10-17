import { AgentOrb } from "@/components/agent-orb";
import { ExperienceExplorer, type ExplorerHandle } from "@/components/career/experience-explorer";
import { GitHubCard } from "@/components/github-card";
import { ContactMenu } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import type { LinkItem, Publication, SiteContent, SkillGroup } from "@/content/types";
import { onCareerJump } from "@/lib/career-jump";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { Emphasis } from "@/components/emphasis";
import { LegalDialog } from "@/components/legal-dialog";

interface CareerPageProps {
  content: SiteContent;
  onAsk: () => void;
}

// Les sections après l'expérience. Les compétences ferment la marche.
const SECTION_IDS = { openSource: "open-source", publications: "publications", education: "formation", skills: "competences" } as const;

const sequence: Variants = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Section({ id, title, className, children }: { id: string; title: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("scroll-mt-24", className)} id={id}>
      <h2 className="mb-6 font-display font-semibold text-[22px] leading-tight tracking-[-0.025em] sm:text-[24px]">{title}</h2>
      {children}
    </section>
  );
}

function LinkList({ items }: { items: LinkItem[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.url}>
          <a
            className="group inline-flex items-start gap-1.5 font-medium text-[15.5px] decoration-ochre/60 underline-offset-4 hover:underline"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            {item.name}
            <ArrowUpRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-ochre" />
          </a>
          <p className="mt-1 text-[14.5px] text-muted-foreground leading-relaxed">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Comme une référence d'article : le titre en italique entre guillemets, puis les auteurs et la revue. */
function PublicationList({ items, quote }: { items: Publication[]; quote: [string, string] }) {
  return (
    <ul className="space-y-7">
      {items.map((item) => (
        <li key={item.url}>
          <a
            className="group inline-flex items-start gap-1.5 text-[15.5px] italic leading-snug decoration-ochre/60 underline-offset-4 hover:underline"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            <span className="text-pretty">
              {quote[0]}
              {item.name}
              {quote[1]}
            </span>
            <ArrowUpRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground not-italic transition-colors group-hover:text-ochre" />
          </a>
          {item.authors && (
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              <Emphasis text={item.authors} />
            </p>
          )}
          <p className="mt-0.5 text-[13.5px] text-muted-foreground">{item.venue}</p>
          <p className="mt-2 text-[14.5px] text-muted-foreground leading-relaxed">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Trois colonnes, une compétence par ligne : le nom se lit d'un coup d'œil, le détail reste en retrait. */
function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="border-b pb-2.5 font-medium text-[15.5px]">{group.label}</h3>
          <ul className="mt-1">
            {group.items.map((item) => (
              <li className="border-b border-dashed py-2.5 last:border-b-0" key={item.name}>
                <span className="block text-[14.5px]">{item.name}</span>
                {item.detail && (
                  <span className="mt-0.5 block text-[13px] text-muted-foreground leading-relaxed">{item.detail}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CvButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild>
      <a download href={href}>
        <DownloadIcon />
        {label}
      </a>
    </Button>
  );
}

/**
 * Le parcours complet, en trois temps. L'en-tête dit qui, quoi et où, avec les deux actions utiles.
 * L'expérience tient dans un explorateur à deux volets plutôt que dans une longue colonne. Le reste
 * (open source, publications, formation, compétences) se range en grille, les compétences en dernier.
 */
export function CareerPage({ content, onAsk }: CareerPageProps) {
  const { career, profile, ui, harness } = content;
  const explorer = useRef<ExplorerHandle>(null);

  // Une demande venue du chat, de la bulle ou de l'en-tête : un projet s'ouvre dans l'explorateur, une section défile.
  useEffect(
    () =>
      onCareerJump((target) => {
        // L'explorateur fait défiler lui-même jusqu'au projet ; sinon c'est une section de la page.
        if (explorer.current?.show(target)) return;
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    [],
  );

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[64rem] px-4 sm:px-6">
        <motion.header animate="show" className="pt-12 pb-14 sm:pt-16" initial="hidden" variants={sequence}>
          <motion.h1
            className="max-w-[18ch] text-balance font-display font-semibold text-[38px] leading-[0.98] tracking-[-0.04em] sm:text-[56px]"
            variants={rise}
          >
            {career.title}
          </motion.h1>
          <motion.p className="mt-6 max-w-[62ch] text-[17px] text-muted-foreground leading-relaxed" variants={rise}>
            <Emphasis text={career.summary} />
          </motion.p>
          <motion.p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed" variants={rise}>
            {profile.availability}
          </motion.p>
          <motion.div className="mt-7 flex flex-wrap items-center gap-2" variants={rise}>
            <CvButton href={profile.cvUrl} label={ui.downloadCv} />
            <ContactMenu content={content} />
          </motion.div>

        </motion.header>

        <section className="scroll-mt-20 border-t pt-12 sm:pt-14" id="experience">
          <h2 className="sr-only">{career.labels.experience}</h2>
          <ExperienceExplorer career={career} harness={harness} links={content.links} ref={explorer} />
        </section>

        <div className="mt-16 grid gap-x-14 gap-y-14 border-t pt-12 sm:pt-14 lg:grid-cols-2">
          <Section className="lg:col-span-2" id={SECTION_IDS.openSource} title={career.labels.openSource}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {career.openSource.map((item) =>
                item.repo ? <GitHubCard description={item.text} id={item.repo} key={item.url} locale={content.locale} /> : null,
              )}
            </div>
            {career.openSource.some((item) => !item.repo) && (
              <div className="mt-8">
                <LinkList items={career.openSource.filter((item) => !item.repo)} />
              </div>
            )}
          </Section>

          <Section id={SECTION_IDS.publications} title={career.labels.publications}>
            <PublicationList items={career.publications} quote={content.locale === "fr" ? ["« ", " »"] : ["“", "”"]} />
          </Section>

          <Section id={SECTION_IDS.education} title={career.labels.education}>
            <ul className="space-y-5">
              {career.education.map((d) => (
                <li key={d.title}>
                  <p className="font-medium text-[15.5px]">{d.title}</p>
                  <p className="mt-0.5 text-[14.5px] text-muted-foreground">
                    {d.school}, <span className="tabular-nums">{d.dates}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section className="lg:col-span-2" id={SECTION_IDS.skills} title={career.labels.skills}>
            <SkillGroups groups={career.skills} />
          </Section>
        </div>

        <section className="mt-16 flex flex-col gap-6 border-t py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[30ch] text-balance font-display font-semibold text-[24px] leading-tight tracking-[-0.03em] sm:text-[28px]">
            {career.closing}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CvButton href={profile.cvUrl} label={ui.downloadCv} />
            <Button onClick={onAsk} variant="secondary">
              <AgentOrb dot={1} size={18} />
              {career.askAgent}
            </Button>
          </div>
        </section>

        <footer className="border-t py-6">
          <LegalDialog legal={content.legal} />
        </footer>
      </div>
    </main>
  );
}
