export interface Trace {
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  simulated: boolean;
}

export type AgentErrorCode = "quota" | "budget" | "challenge" | "unavailable";

/** Contrat d'événements entre le worker (ou l'agent simulé) et la page. */
export type AgentEvent =
  | { type: "read"; sourceId: string }
  | { type: "text"; delta: string }
  | { type: "quota"; remaining: number }
  | { type: "done"; trace: Trace; sig?: string }
  | { type: "error"; code: AgentErrorCode };

export interface HistoryTurn {
  role: "user" | "assistant";
  text: string;
  /** Signature du worker sur une réponse : sans elle, il ignore le tour. */
  sig?: string;
  /** Réponse préparée d'une suggestion : le worker en reprend le texte lui-même, rien n'est envoyé. */
  cached?: boolean;
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const ERROR_CODES: readonly string[] = ["quota", "budget", "challenge", "unavailable"];

/** Ne laisse passer qu'un événement bien formé : le flux vient du réseau. */
export function parseAgentEvent(value: unknown): AgentEvent | null {
  if (!isObject(value)) return null;
  switch (value.type) {
    case "read":
      return typeof value.sourceId === "string" ? { type: "read", sourceId: value.sourceId } : null;
    case "text":
      return typeof value.delta === "string" ? { type: "text", delta: value.delta } : null;
    case "quota":
      return typeof value.remaining === "number" ? { type: "quota", remaining: value.remaining } : null;
    case "error":
      return { type: "error", code: ERROR_CODES.includes(String(value.code)) ? (value.code as AgentErrorCode) : "unavailable" };
    case "done": {
      const t = value.trace;
      if (!isObject(t)) return null;
      const trace: Trace = {
        model: String(t.model ?? ""),
        inputTokens: Number(t.inputTokens) || 0,
        outputTokens: Number(t.outputTokens) || 0,
        durationMs: Number(t.durationMs) || 0,
        simulated: false,
      };
      return { type: "done", trace, sig: typeof value.sig === "string" ? value.sig : undefined };
    }
    default:
      return null;
  }
}
