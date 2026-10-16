// Défi anti-robot Cloudflare Turnstile, chargé seulement si une clé de site est configurée.
// Invisible pour la plupart des visiteurs : la case n'apparaît que si Cloudflare a un doute.

const SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TIMEOUT_MS = 60_000;

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const challengeEnabled = Boolean(SITE_KEY);

/** Le défi n'a pas abouti (script bloqué, échec, délai) : la question ne part pas. */
export class ChallengeError extends Error {}

let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new ChallengeError("turnstile missing")));
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new ChallengeError("turnstile unreachable"));
    };
    document.head.append(script);
  });
  return loading;
}

/** Passe le défi et rend un jeton à usage unique, que le worker vérifie auprès de Cloudflare. */
export async function challengeToken(locale: string, signal?: AbortSignal): Promise<string> {
  if (!SITE_KEY) throw new ChallengeError("turnstile disabled");
  const api = await loadTurnstile();
  const host = document.createElement("div");
  host.className = "turnstile-host";
  document.body.append(host);

  return new Promise<string>((resolve, reject) => {
    let widgetId = "";
    let settled = false;
    const finish = (settle: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      // Le widget se retire après son propre rappel, pas pendant.
      window.setTimeout(() => {
        if (widgetId) api.remove(widgetId);
        host.remove();
      });
      settle();
    };
    const timer = window.setTimeout(() => finish(() => reject(new ChallengeError("turnstile timeout"))), TIMEOUT_MS);
    // Le visiteur a arrêté la question : le widget disparaît tout de suite.
    signal?.addEventListener("abort", () => finish(() => reject(new DOMException("Aborted", "AbortError"))), { once: true });
    widgetId = api.render(host, {
      sitekey: SITE_KEY,
      action: "chat",
      appearance: "interaction-only",
      language: locale,
      callback: (token: string) => finish(() => resolve(token)),
      "error-callback": () => finish(() => reject(new ChallengeError("turnstile error"))),
      "expired-callback": () => finish(() => reject(new ChallengeError("turnstile expired"))),
    });
  });
}

// Le laissez-passer du worker évite de repasser le défi à chaque question. Il ne survit pas à l'onglet.
const PASS_KEY = "jr-chat-pass";

export function readPass(): string | undefined {
  try {
    return sessionStorage.getItem(PASS_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function savePass(pass: string | undefined): void {
  try {
    if (pass) sessionStorage.setItem(PASS_KEY, pass);
    else sessionStorage.removeItem(PASS_KEY);
  } catch {
    // Stockage refusé (navigation privée stricte) : le défi sera repassé.
  }
}
