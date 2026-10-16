import { AgentOrb } from "@/components/agent-orb";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Composer } from "@/components/chat/composer";
import type { SiteContent } from "@/content/types";
import type { ChatStatus } from "@/lib/use-agent-chat";
import { useMediaQuery } from "@/lib/use-media-query";
import { motion, type Variants } from "motion/react";

interface WelcomeProps {
  content: SiteContent;
  status: ChatStatus;
  remaining: number;
  onSend: (text: string) => void;
  onStop: () => void;
  onOpenCareer: () => void;
}

const LINK = "font-medium text-foreground underline decoration-ochre/60 underline-offset-4 hover:decoration-ochre";

// Une seule séquence d'entrée : la sphère s'allume, puis le texte arrive.
const sequence: Variants = { show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Welcome({ content, status, remaining, onSend, onStop, onOpenCareer }: WelcomeProps) {
  const { profile, ui, suggestions } = content;
  const small = useMediaQuery("(max-width: 640px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <main className="relative flex flex-1 overflow-y-auto">
      {/* La lumière de la sphère, posée sur le fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(closest-side,var(--glow),transparent)] [background-position:50%_0%] [background-repeat:no-repeat] [background-size:min(900px,140%)_100%]"
      />

      <motion.div
        animate="show"
        className="relative m-auto flex w-full max-w-2xl flex-col items-center px-4 pt-6 pb-14 text-center sm:px-6"
        initial={reduced ? false : "hidden"}
        variants={sequence}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <AgentOrb active={status !== "ready"} dot={small ? 2 : 3} size={small ? 168 : 232} />
        </motion.div>

        <motion.h1
          className="-mt-2 font-display font-semibold text-[44px] leading-[0.95] tracking-[-0.04em] sm:text-[72px]"
          variants={rise}
        >
          {profile.name}
        </motion.h1>
        <motion.p className="mt-4 max-w-[52ch] text-balance text-[17px] text-muted-foreground leading-relaxed" variants={rise}>
          {profile.intro} {profile.availability}
        </motion.p>

        <motion.div className="mt-12 w-full text-left" variants={rise}>
          <motion.div layoutId="composer">
            <Composer autoFocus content={content} onSend={onSend} onStop={onStop} remaining={remaining} rotate status={status} />
          </motion.div>
        </motion.div>

        <motion.div className="mt-4 flex flex-wrap justify-center gap-2" variants={rise}>
          {suggestions.map((s) => (
            <button
              className="rounded-full border bg-card/60 px-3.5 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:border-ochre/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              disabled={remaining === 0}
              key={s}
              onClick={() => onSend(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </motion.div>

        <motion.p className="mt-12 text-muted-foreground text-sm" variants={rise}>
          {ui.noTime}{" "}
          <button className={LINK} onClick={onOpenCareer} type="button">
            {ui.careerInline}
          </button>
          ,{" "}
          <a className={LINK} download href={profile.cvUrl}>
            {ui.cvInline}
          </a>{" "}
          {ui.or}{" "}
          <a className={LINK} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <span className="ml-2 inline-flex translate-y-0.5 gap-1 align-baseline">
            <a aria-label="LinkedIn" className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground" href={profile.linkedin} rel="noopener" target="_blank">
              <LinkedinIcon className="size-4" />
            </a>
            <a aria-label="GitHub" className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground" href={profile.github} rel="noopener" target="_blank">
              <GithubIcon className="size-4" />
            </a>
          </span>
        </motion.p>
      </motion.div>
    </main>
  );
}
