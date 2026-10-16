import { AgentOrb } from "@/components/agent-orb";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SiteContent } from "@/content/types";
import { useTheme } from "@/lib/use-theme";
import type { View } from "@/lib/use-view";
import { cn } from "@/lib/utils";
import { DownloadIcon, MailIcon, MoonIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";

interface SiteHeaderProps {
  content: SiteContent;
  view: View;
  onViewChange: (view: View) => void;
  onHome: () => void;
  /** L'agent lit ou écrit : la petite sphère s'anime. */
  active: boolean;
  /** Accueil : pas de filet sous l'en-tête, la page n'a pas encore défilé. */
  compact: boolean;
}

export function ContactMenu({ content, compact = false }: { content: SiteContent; compact?: boolean }) {
  const { profile, ui } = content;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={ui.contact} size={compact ? "icon" : "default"} variant="outline">
          <MailIcon />
          {!compact && ui.contact}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem asChild>
          <a href={`mailto:${profile.email}`}>
            <MailIcon />
            {profile.email}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={profile.linkedin} rel="noopener" target="_blank">
            <LinkedinIcon />
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={profile.github} rel="noopener" target="_blank">
            <GithubIcon />
            GitHub
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ViewTabs({ content, view, onViewChange }: { content: SiteContent; view: View; onViewChange: (view: View) => void }) {
  const tabs: [View, string][] = [
    ["chat", content.ui.chatTab],
    ["career", content.ui.careerTab],
  ];
  return (
    <div className="flex items-center rounded-full bg-secondary/70 p-0.5" role="tablist">
      {tabs.map(([id, label]) => {
        const on = view === id;
        return (
          <button
            aria-selected={on}
            className={cn(
              "relative rounded-full px-3 py-1.5 font-medium text-[13.5px] transition-colors sm:px-3.5",
              on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            key={id}
            onClick={() => onViewChange(id)}
            role="tab"
            type="button"
          >
            {on && (
              <motion.span
                className="absolute inset-0 rounded-full bg-background shadow-xs ring-1 ring-border"
                layoutId="view-tab"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SiteHeader({ content, view, onViewChange, onHome, active, compact }: SiteHeaderProps) {
  const { profile, ui } = content;
  const [theme, toggleTheme] = useTheme();

  return (
    <header className={cn("sticky top-0 z-20 border-b bg-background transition-colors duration-300", compact && "border-transparent")}>
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
        {/* Toujours visible, sur toutes les vues : l'en-tête est le même partout, rien ne se décale ni n'apparaît. */}
        <button className="flex items-center gap-2.5 rounded-lg text-left" onClick={onHome} type="button">
          <AgentOrb active={active} dot={1.5} size={30} />
          <span className="hidden leading-tight min-[480px]:block">
            <span className="block font-display font-semibold tracking-[-0.02em]">{profile.name}</span>
            <span className="hidden text-muted-foreground text-xs sm:block">{profile.role}</span>
          </span>
        </button>

        <div className="sm:ml-3">
          <ViewTabs content={content} onViewChange={onViewChange} view={view} />
        </div>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button asChild className="hidden sm:inline-flex" size="sm" variant="ghost">
            <a href={profile.otherLocaleUrl}>{profile.otherLocaleLabel}</a>
          </Button>
          <Button aria-label={ui.themeToggle} onClick={toggleTheme} size="icon" variant="ghost">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
          <span className="hidden sm:inline-flex">
            <ContactMenu content={content} />
          </span>
          <span className="sm:hidden">
            <ContactMenu compact content={content} />
          </span>
          <Button asChild>
            <a download href={profile.cvUrl}>
              <DownloadIcon />
              <span className="hidden sm:inline">{ui.downloadCv}</span>
              <span className="sm:hidden">{ui.downloadCvShort}</span>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
