import type { SiteContent } from "@/content/types";
import { type AgentEvent, type HistoryTurn, parseAgentEvent } from "@/lib/agent-events";
import { track, visitContext } from "@/lib/analytics";
import { askMockAgent, cachedAnswer, replayAnswer } from "@/lib/mock-agent";
import { ChallengeError, challengeEnabled, challengeToken, readPass, savePass } from "@/lib/turnstile";

// Sans URL de worker (développement, prototype), l'agent simulé répond avec le même contrat d'événements.
const CHAT_URL: string | undefined = import.meta.env.VITE_CHAT_URL;

const isPass = (value: unknown): value is { type: "pass"; token: string } =>
  typeof value === "object" && value !== null && (value as { type?: unknown }).type === "pass" && typeof (value as { token?: unknown }).token === "string";

/** Code d'erreur d'une réponse refusée. Un laissez-passer peut l'accompagner (défi réussi, mais quota atteint). */
async function errorCode(response: Response): Promise<unknown> {
  const payload = (await response.json().catch(() => null)) as { code?: unknown; pass?: unknown } | null;
  if (typeof payload?.pass === "string") savePass(payload.pass);
  return payload?.code;
}

async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<AgentEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let end = buffer.indexOf("\n\n");
    while (end !== -1) {
      const frame = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      end = buffer.indexOf("\n\n");
      const data = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("");
      if (!data) continue;
      try {
        const raw: unknown = JSON.parse(data);
        // Le laissez-passer anti-robot est pour le client, pas pour la conversation.
        if (isPass(raw)) {
          savePass(raw.token);
          continue;
        }
        const event = parseAgentEvent(raw);
        if (event) yield event;
      } catch {
        // Trame illisible : ignorée, la suite du flux reste valable.
      }
    }
  }
}

export async function* askAgent(
  content: SiteContent,
  question: string,
  history: HistoryTurn[],
  signal: AbortSignal,
): AsyncGenerator<AgentEvent> {
  const cached = cachedAnswer(content, question);
  if (cached) {
    track("chat_suggestion", { question });
    yield* replayAnswer(cached, signal, { cached: true });
    return;
  }

  if (!CHAT_URL) {
    yield* askMockAgent(content, question, signal);
    return;
  }

  const post = (challenge: { pass?: string; turnstile?: string }) =>
    fetch(`${CHAT_URL.replace(/\/$/, "")}/v2/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // La visite (visiteur, source du lien) accompagne la question pour le tableau de bord.
      body: JSON.stringify({ question, history, locale: content.locale, ...visitContext(), ...challenge }),
      signal,
    });
  // Sans laissez-passer, le défi se passe avant la question ; un laissez-passer refusé (expiré, autre réseau) en déclenche un nouveau.
  const challenged = async () => ({ turnstile: await challengeToken(content.locale, signal) });

  let response: Response;
  try {
    const pass = challengeEnabled ? readPass() : undefined;
    response = await post(challengeEnabled && !pass ? await challenged() : { pass });
    if (challengeEnabled && response.status === 403 && (await errorCode(response.clone())) === "challenge") {
      savePass(undefined);
      response = await post(await challenged());
    }
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    yield { type: "error", code: error instanceof ChallengeError ? "challenge" : "unavailable" };
    return;
  }

  if (!response.ok || !response.body) {
    yield parseAgentEvent({ type: "error", code: await errorCode(response) }) ?? { type: "error", code: "unavailable" };
    return;
  }

  yield* readEvents(response.body);
}
