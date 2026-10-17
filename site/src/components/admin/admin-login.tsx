import { AgentOrb } from "@/components/agent-orb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminError } from "@/lib/admin-api";
import { type FormEvent, useState } from "react";

const ERRORS: Record<AdminError, string> = {
  unauthorized: "Ce jeton n'est pas le bon. Il se trouve dans le secret ADMIN_TOKEN du worker.",
  throttled: "Trop d'essais depuis ce réseau. Réessayez dans un quart d'heure.",
  unavailable: "Le worker ne répond pas. Vérifiez la connexion, puis réessayez.",
};

interface AdminLoginProps {
  error: AdminError | null;
  pending: boolean;
  onSubmit: (token: string) => void;
}

/** Le jeton est connu mais le worker ne répond pas : on propose de réessayer, pas de retaper le jeton. */
export function AdminRetry({ error, pending, onRetry, onSignOut }: {
  error: AdminError;
  pending: boolean;
  onRetry: () => void;
  onSignOut: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <AgentOrb dot={2} size={96} />
        <h1 className="mt-2 font-display font-semibold text-[28px] tracking-[-0.03em]">Suivi des visites</h1>
        <p className="mt-3 text-[14.5px] text-muted-foreground" role="alert">
          {ERRORS[error]}
        </p>
        <Button className="mt-6 h-10 w-full" disabled={pending} onClick={onRetry} type="button">
          {pending ? "Chargement…" : "Réessayer"}
        </Button>
        <Button className="mt-2 w-full" onClick={onSignOut} type="button" variant="ghost">
          Changer de jeton
        </Button>
      </div>
    </main>
  );
}

/** Le seul écran que voit un visiteur égaré sur #admin : un champ, rien sur ce qu'il y a derrière. */
export function AdminLogin({ error, pending, onSubmit }: AdminLoginProps) {
  const [token, setToken] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (token.trim()) onSubmit(token.trim());
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <form className="flex w-full max-w-sm flex-col items-center text-center" onSubmit={submit}>
        <AgentOrb dot={2} size={96} />
        <h1 className="mt-2 font-display font-semibold text-[28px] tracking-[-0.03em]">Suivi des visites</h1>
        <p className="mt-2 text-[14.5px] text-muted-foreground">Réservé au propriétaire du site.</p>
        <label className="mt-8 w-full text-left" htmlFor="admin-token">
          <span className="text-[13px] text-muted-foreground">Jeton d'accès</span>
          <Input
            aria-describedby={error ? "admin-error" : undefined}
            aria-invalid={error === "unauthorized" || undefined}
            autoComplete="current-password"
            autoFocus
            className="mt-1.5 h-10"
            id="admin-token"
            onChange={(event) => setToken(event.target.value)}
            type="password"
            value={token}
          />
        </label>
        {error && (
          <p className="mt-3 w-full text-left text-[13.5px] text-destructive" id="admin-error" role="alert">
            {ERRORS[error]}
          </p>
        )}
        <Button className="mt-5 h-10 w-full" disabled={pending || !token.trim()} type="submit">
          {pending ? "Vérification…" : "Ouvrir le tableau de bord"}
        </Button>
        <a className="mt-6 text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" href="./">
          Revenir au site
        </a>
      </form>
    </main>
  );
}
