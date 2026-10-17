import { AgentOrb } from "@/components/agent-orb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Stats } from "@/lib/admin-api";
import { countryName, fillDays, referrerHost, sourceLabel, timeAgo } from "@/lib/admin-format";
import { useAdminStats } from "@/lib/use-admin-stats";
import { cn } from "@/lib/utils";
import { LogOutIcon, RefreshCwIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ActionList } from "./action-list";
import { AdminLogin, AdminRetry } from "./admin-login";
import { LinkBuilder } from "./link-builder";
import { RankedList } from "./ranked-list";
import { QuestionList } from "./question-list";
import { SourceTable } from "./source-table";
import { StatStrip } from "./stat-strip";
import { TrendChart } from "./trend-chart";

const PERIODS = [7, 30, 90];
const DEVICES: Record<string, string> = { desktop: "Ordinateur", mobile: "Mobile", tablet: "Tablette" };

function Block({ title, aside, className, children }: { title: string; aside?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("min-w-0", className)}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display font-semibold text-[20px] leading-tight tracking-[-0.02em]">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Legend() {
  return (
    <p className="flex gap-4 text-[13px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded-full bg-ochre" />
        Visiteurs
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-4 border-muted-foreground border-t-[1.5px] border-dashed" />
        Questions
      </span>
    </p>
  );
}

function Audience({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <RankedList
        items={stats.topCountries.map((row) => ({ label: countryName(row.country), value: row.unique_visitors }))}
        title="Pays"
        unit="visiteurs"
      />
      <RankedList
        items={stats.topOrganizations.map((row) => ({
          label: row.organization === "unknown" ? "Inconnu" : row.organization,
          value: row.unique_visitors,
        }))}
        title="Réseau"
        unit="visiteurs"
      />
      <RankedList
        items={stats.topReferrers.map((row) => ({ label: referrerHost(row.referrer), value: row.unique_visitors }))}
        title="Page précédente"
        unit="visiteurs"
      />
      <RankedList
        items={stats.devices.map((row) => ({ label: DEVICES[row.device] ?? row.device, value: row.unique_visitors }))}
        title="Appareils"
        unit="visiteurs"
      />
    </div>
  );
}

/**
 * Le tableau de bord de Julien, dans le site (#admin) : qui vient, par quel lien, ce qu'ils demandent et ce qu'ils
 * font. Les données restent dans le worker ; la page ne fait que les lire avec le jeton.
 */
export function AdminPage() {
  const admin = useAdminStats();
  const { stats } = admin;

  if (admin.token && !stats && admin.error && !admin.loading) {
    return <AdminRetry error={admin.error} onRetry={admin.refresh} onSignOut={admin.signOut} pending={admin.loading} />;
  }

  if (!admin.token || !stats) {
    return <AdminLogin error={admin.error} onSubmit={admin.signIn} pending={Boolean(admin.token) && admin.loading} />;
  }

  const campaigns = stats.topCampaigns.filter((row) => row.campaign !== "-");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[72rem] px-4 pb-20 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 py-6">
          <a className="flex items-center gap-2.5" href="./">
            <AgentOrb dot={1} size={28} />
            <span className="font-display font-semibold text-[18px] tracking-[-0.02em]">Suivi des visites</span>
          </a>
          <div className="flex items-center gap-1.5">
            <Tabs onValueChange={(value) => admin.setDays(Number(value))} value={String(admin.days)}>
              <TabsList aria-label="Période">
                {PERIODS.map((days) => (
                  <TabsTrigger className="px-3" key={days} value={String(days)}>
                    {days}&nbsp;jours
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button aria-label="Actualiser" onClick={admin.refresh} size="icon" title="Actualiser" variant="ghost">
              <RefreshCwIcon className={cn(admin.loading && "animate-spin")} />
            </Button>
            <Button aria-label="Se déconnecter" onClick={admin.signOut} size="icon" title="Se déconnecter" variant="ghost">
              <LogOutIcon />
            </Button>
          </div>
        </header>

        <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span>Mis à jour {timeAgo(stats.generatedAt)}</span>
          {admin.source && (
            <span className="inline-flex items-center gap-1 text-foreground">
              Filtré sur {sourceLabel(admin.source)}
              <Button
                aria-label="Retirer le filtre"
                className="text-muted-foreground"
                onClick={() => admin.setSource(undefined)}
                size="icon-xs"
                variant="ghost"
              >
                <XIcon />
              </Button>
            </span>
          )}
          {admin.error && (
            <span className="text-destructive" role="alert">
              {admin.error === "throttled" ? "Trop de requêtes, réessayez plus tard." : "Le worker ne répond pas."} Les
              chiffres affichés portent sur {stats.periodDays}&nbsp;jours, au dernier chargement.
            </span>
          )}
        </div>

        <div className={cn("space-y-14 pt-8 transition-opacity", admin.loading && "opacity-60")}>
          <StatStrip days={stats.periodDays} previous={stats.previousSummary} summary={stats.summary} />

          <Block aside={<Legend />} className="border-t pt-10" title="Par jour">
            <TrendChart points={fillDays(stats.daily, stats.periodDays)} />
          </Block>

          <div className="grid gap-x-14 gap-y-14 border-t pt-10 lg:grid-cols-2">
            <Block title="Créer un lien suivi">
              <LinkBuilder />
            </Block>
            <Block
              aside={<span className="text-[13px] text-muted-foreground">Un clic filtre le tableau</span>}
              title="Sources"
            >
              <SourceTable active={admin.source} onSelect={admin.setSource} rows={stats.availableSources} />
              {campaigns.length > 0 && (
                <RankedList
                  className="mt-8"
                  items={campaigns.map((row) => ({ label: `${row.campaign}, via ${sourceLabel(row.source)}`, value: row.unique_visitors }))}
                  title="Entreprises ou offres"
                  unit="visiteurs"
                />
              )}
            </Block>
          </div>

          <div className="grid gap-x-14 gap-y-14 border-t pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Block
              aside={<span className="text-[13px] text-muted-foreground">Envoyées au modèle</span>}
              title="Questions"
            >
              <QuestionList onDelete={admin.remove} rows={stats.recentQuestions} />
            </Block>
            <div className="space-y-12">
              <Block
                aside={<span className="text-[13px] text-muted-foreground">Servies sans le modèle</span>}
                title="Suggestions"
              >
                <RankedList
                  empty="Aucune suggestion cliquée."
                  items={stats.topSuggestions.map((row) => ({ label: row.question, value: row.events }))}
                  unit="clics"
                />
              </Block>
              <Block title="Actions">
                <ActionList rows={stats.recentActions} />
              </Block>
            </div>
          </div>

          <Block className="border-t pt-10" title="Audience">
            <Audience stats={stats} />
          </Block>
        </div>
      </div>
    </main>
  );
}
