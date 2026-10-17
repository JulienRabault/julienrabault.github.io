import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type LinkLocale, type LinkPage, trackedLink } from "@/lib/admin-format";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

// Les sources habituelles, proposées à la saisie ; n'importe quelle autre reste possible.
const PRESETS = ["linkedin", "welcome-to-the-jungle", "indeed", "malt", "email", "candidature", "cv", "github"];

const SITE_BASE = `${window.location.origin}${import.meta.env.BASE_URL}`;

function Choice<T extends string>({ value, options, onChange, label }: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <Tabs onValueChange={(next) => onChange(next as T)} value={value}>
      <TabsList aria-label={label}>
        {options.map((option) => (
          <TabsTrigger className="px-3" key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

/**
 * Un lien par endroit où il est posé : LinkedIn, une candidature, un mail. La source revient dans le tableau,
 * l'entreprise visée aussi (utm_campaign), ce qui dit quelle candidature a fait venir quelqu'un.
 */
export function LinkBuilder() {
  const [source, setSource] = useState("linkedin");
  const [campaign, setCampaign] = useState("");
  const [page, setPage] = useState<LinkPage>("chat");
  const [locale, setLocale] = useState<LinkLocale>("fr");
  const [copied, setCopied] = useState(false);
  const link = trackedLink({ base: SITE_BASE, locale, page, source, campaign });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Presse-papiers refusé : le lien reste sélectionnable à la main.
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block" htmlFor="link-source">
          <span className="text-[13px] text-muted-foreground">Source</span>
          <Input
            className="mt-1.5"
            id="link-source"
            list="link-source-presets"
            onChange={(event) => setSource(event.target.value)}
            placeholder="linkedin"
            value={source}
          />
          <datalist id="link-source-presets">
            {PRESETS.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>
        </label>
        <label className="block" htmlFor="link-campaign">
          <span className="text-[13px] text-muted-foreground">Entreprise ou offre, facultatif</span>
          <Input
            className="mt-1.5"
            id="link-campaign"
            onChange={(event) => setCampaign(event.target.value)}
            placeholder="mistral"
            value={campaign}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Choice
          label="Page d'arrivée"
          onChange={setPage}
          options={[
            { value: "chat", label: "Accueil" },
            { value: "parcours", label: "Parcours" },
          ]}
          value={page}
        />
        <Choice
          label="Langue"
          onChange={setLocale}
          options={[
            { value: "fr", label: "Français" },
            { value: "en", label: "English" },
          ]}
          value={locale}
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-3">
        <output className="min-w-0 flex-1 truncate text-[13.5px]" htmlFor="link-source link-campaign">
          {link}
        </output>
        <Button onClick={copy} size="sm" type="button" variant={copied ? "secondary" : "default"}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
    </div>
  );
}
