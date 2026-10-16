import { AgentOrb } from "@/components/agent-orb";
import { CareerStrip } from "@/components/career/career-strip";
import { ChapterView } from "@/components/career/chapter";
import { GitHubCard } from "@/components/github-card";
import { ContactMenu } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import type { LinkItem, SiteContent } from "@/content/types";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface CareerPageProps {
  content: SiteContent;
  onAsk: () => void;
}

const sequence: Variants = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/** Une ligne de l'ancien site : l'intitulé à gauche, qui reste visible pendant qu'on lit la section. */
function Row({ id, label, children }: { id?: string; label: string; children: ReactNode }) {
  return (
    <section className="grid scroll-mt-20 gap-y-6 border-t py-12 sm:py-16 md:grid-cols-[10rem_1fr] md:gap-x-10" id={id}>
      <h2 className="self-start font-medium text-muted-foreground text-sm md:sticky md:top-24">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function LinkList({ items }: { items: LinkItem[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.url}>
          <a
            className="group inline-flex items-start gap-1.5 font-medium text-[16px] decoration-ochre/60 underline-offset-4 hover:underline"
            href={item.url}
            rel="noopener"
            target="_blank"
          >
            {item.name}
            <ArrowUpRightIcon className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-ochre" />
          </a>
          <p className="mt-1 max-w-[62ch] text-[15px] text-muted-foreground leading-relaxed">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function CareerPage({ content, onAsk }: CareerPageProps) {
  const { career, profile, ui, harness } = content;
  const jump = (target: string) => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.header animate="show" className="pt-12 pb-14 sm:pt-20 sm:pb-20" initial="hidden" variants={sequence}>
          <motion.h1
            className="max-w-[17ch] text-balance font-display font-semibold text-[38px] leading-[0.98] tracking-[-0.04em] sm:text-[60px]"
            variants={rise}
          >
            {career.title}
          </motion.h1>
          <motion.p className="mt-6 max-w-[60ch] text-[17px] text-muted-foreground leading-relaxed" variants={rise}>
            {career.summary}
          </motion.p>
          <motion.p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed" variants={rise}>
            {profile.availability}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap items-center gap-2" variants={rise}>
            <Button asChild>
              <a download href={profile.cvUrl}>
                <DownloadIcon />
                {ui.downloadCv}
              </a>
            </Button>
            <ContactMenu content={content} />
          </motion.div>

          <motion.div className="mt-16" variants={rise}>
            <CareerStrip career={career} onJump={jump} />
          </motion.div>
        </motion.header>

        <Row label={career.labels.experience}>
          <div className="space-y-20">
            {career.chapters.map((chapter) => (
              <ChapterView career={career} chapter={chapter} harness={harness} key={chapter.id} />
            ))}
          </div>
        </Row>

        <Row id="formation" label={career.labels.education}>
          <ul className="space-y-5">
            {career.education.map((d) => (
              <li className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between" key={d.title}>
                <div>
                  <p className="font-medium text-[16px]">{d.title}</p>
                  <p className="mt-0.5 text-[15px] text-muted-foreground">{d.school}</p>
                </div>
                <p className="shrink-0 text-muted-foreground text-sm tabular-nums">{d.dates}</p>
              </li>
            ))}
          </ul>
        </Row>

        <Row label={career.labels.publications}>
          <LinkList items={career.publications} />
        </Row>

        <Row label={career.labels.openSource}>
          <div className="grid gap-3 sm:grid-cols-2">
            {career.openSource.map((item) =>
              item.repo ? (
                <GitHubCard description={item.text} id={item.repo} key={item.url} locale={content.locale} />
              ) : null,
            )}
          </div>
          {career.openSource.some((item) => !item.repo) && (
            <div className="mt-8">
              <LinkList items={career.openSource.filter((item) => !item.repo)} />
            </div>
          )}
        </Row>

        <Row label={career.labels.skills}>
          <dl className="space-y-5">
            {career.skills.map((s) => (
              <div key={s.label}>
                <dt className="font-medium text-[16px]">{s.label}</dt>
                <dd className="mt-1 max-w-[66ch] text-[15px] text-muted-foreground leading-relaxed">{s.text}</dd>
              </div>
            ))}
          </dl>
        </Row>

        <section className="border-t py-16 sm:py-24">
          <p className="max-w-[34ch] text-balance font-display font-semibold text-[26px] leading-tight tracking-[-0.03em] sm:text-[32px]">
            {career.closing}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Button asChild>
              <a download href={profile.cvUrl}>
                <DownloadIcon />
                {ui.downloadCv}
              </a>
            </Button>
            <Button onClick={onAsk} variant="secondary">
              <AgentOrb dot={1} size={18} />
              {career.askAgent}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
