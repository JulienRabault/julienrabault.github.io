import type { SiteContent } from "@/content/types";
import { type AgentEvent, type HistoryTurn, parseAgentEvent } from "@/lib/agent-events";
import { visitContext } from "@/lib/analytics";
import { askMockAgent } from "@/lib/mock-agent";

// Sans URL de worker (développement, prototype), l'agent simulé répond avec le même contrat d'événements.
const CHAT_URL: string | undefined = import.meta.env.VITE_CHAT_URL;

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
        const event = parseAgentEvent(JSON.parse(data));
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
  if (!CHAT_URL) {
    yield* askMockAgent(content, question, signal);
    return;
  }

  let response: Response;
  try {
    response = await fetch(`${CHAT_URL.replace(/\/$/, "")}/v2/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // La visite (visiteur, source du lien) accompagne la question pour le tableau de bord.
      body: JSON.stringify({ question, history, locale: content.locale, ...visitContext() }),
      signal,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    yield { type: "error", code: "unavailable" };
    return;
  }

  if (!response.ok || !response.body) {
    const payload: unknown = await response.json().catch(() => null);
    yield parseAgentEvent({ type: "error", code: (payload as { code?: unknown } | null)?.code }) ?? {
      type: "error",
      code: "unavailable",
    };
    return;
  }

  yield* readEvents(response.body);
}
