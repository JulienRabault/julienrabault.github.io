import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { CareerTimeline } from "@/components/career/career-timeline";
import { HarnessBlock } from "@/components/career/harness-block";
import { LinkChip } from "@/components/chat/link-chip";
import { ProjectCard } from "@/components/chat/project-card";
import { GitHubCard } from "@/components/github-card";
import { Button } from "@/components/ui/button";
import type { Directive } from "@/content/agent-contract";
import type { SiteContent } from "@/content/types";
import { DownloadIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export type WidgetRequest = Exclude<Directive, { kind: "link" }>;

interface AnswerWidgetProps {
  request: WidgetRequest;
  content: SiteContent;
  /** Seul le dernier message anime ses sphères : les plus anciens passent en image fixe. */
  live: boolean;
  onOpenCareer: (target?: string) => void;
}

// Tous les widgets partagent la même boîte : même bord, même rayon, même marge intérieure, pleine largeur.
function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border bg-card/50 p-5">{children}</div>;
}

function ContactCard({ content }: { content: SiteContent }) {
  const { profile, ui } = content;
  return (
    <Card>
      <p className="font-display font-semibold text-lg tracking-[-0.02em]">{profile.name}</p>
      <p className="mt-1 text-muted-foreground text-sm">{profile.availability}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button asChild size="sm">
          <a href={`mailto:${profile.email}`}>
            <MailIcon />
            {profile.email}
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a download href={profile.cvUrl}>
            <DownloadIcon />
            {ui.downloadCv}
          </a>
        </Button>
        <Button asChild size="icon-sm" variant="ghost">
          <a aria-label="LinkedIn" href={profile.linkedin} rel="noopener" target="_blank">
            <LinkedinIcon />
          </a>
        </Button>
        <Button asChild size="icon-sm" variant="ghost">
          <a aria-label="GitHub" href={profile.github} rel="noopener" target="_blank">
            <GithubIcon />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function WidgetBody({ request, content, live, onOpenCareer }: AnswerWidgetProps) {
  const { career, harness, ui, locale } = content;

  switch (request.kind) {
    case "project":
      return (
        <ProjectCard
          content={content}
          id={request.id}
          onOpenCareer={onOpenCareer}
          renderLink={(link, key) => <LinkChip key={key} link={link} onOpenCareer={onOpenCareer} />}
        />
      );
    case "repo": {
      const description = career.openSource.find((o) => o.repo === request.id)?.text ?? "";
      return <GitHubCard description={description} id={request.id} locale={locale} />;
    }
    case "widget":
      switch (request.id) {
        case "harness":
          return <HarnessBlock hint={career.harnessHint} layers={harness} live={live} />;
        case "timeline":
          return (
            <Card>
              <CareerTimeline career={career} onJump={onOpenCareer} />
              <p className="mt-2 text-muted-foreground text-xs">{ui.timelineHint}</p>
            </Card>
          );
        case "contact":
          return <ContactCard content={content} />;
      }
  }
}

export function AnswerWidget(props: AnswerWidgetProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      // Les widgets se règlent sur la largeur de la conversation, pas de la fenêtre : même rendu dans le chat et dans la bulle.
      className="@container"
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <WidgetBody {...props} />
    </motion.div>
  );
}
