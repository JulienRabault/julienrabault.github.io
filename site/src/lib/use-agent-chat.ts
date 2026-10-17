import type { SiteContent } from "@/content/types";
import { askAgent } from "@/lib/agent-client";
import type { AgentErrorCode, HistoryTurn, Trace } from "@/lib/agent-events";
import { track } from "@/lib/analytics";
import { cachedAnswer } from "@/lib/mock-agent";
import { useCallback, useRef, useState } from "react";

export const DAILY_QUESTION_LIMIT = 20;
const QUOTA_KEY = "chat-quota";
/** Tours renvoyés au worker pour le contexte : trois échanges suffisent pour une relance. */
const HISTORY_TURNS = 6;

export interface UserMessage {
  id: string;
  role: "user";
  text: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  text: string;
  read: string[];
  status: "reading" | "streaming" | "done" | "stopped" | "error";
  trace?: Trace;
  sig?: string;
  error?: AgentErrorCode;
}

export type ChatMessage = UserMessage | AssistantMessage;
export type ChatStatus = "ready" | "submitted" | "streaming";

const today = () => new Date().toISOString().slice(0, 10);

// Compteur côté navigateur : il bloque la saisie une fois la limite atteinte, sans jamais l'afficher avant.
// La limite qui compte est celle du worker, qui renvoie le restant.
function readUsed(): number {
  try {
    const saved = JSON.parse(localStorage.getItem(QUOTA_KEY) ?? "null") as { day: string; used: number } | null;
    return saved?.day === today() ? saved.used : 0;
  } catch {
    return 0;
  }
}

function writeUsed(used: number): void {
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify({ day: today(), used }));
  } catch {
    // Stockage indisponible : le compteur ne survit pas au rechargement.
  }
}

function toHistory(messages: ChatMessage[]): HistoryTurn[] {
  const turns: HistoryTurn[] = [];
  for (const m of messages) {
    if (m.role === "user") turns.push({ role: "user", text: m.text });
    else if (m.status === "done" && m.sig) turns.push({ role: "assistant", text: m.text, sig: m.sig });
    // Une réponse arrêtée ou en erreur n'a pas de signature : la question restée sans réponse part aussi.
    else turns.pop();
  }
  return turns.slice(-HISTORY_TURNS);
}

export function useAgentChat(content: SiteContent) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [used, setUsedState] = useState(readUsed);
  const abortRef = useRef<AbortController | null>(null);

  const remaining = Math.max(0, DAILY_QUESTION_LIMIT - used);

  const setUsed = useCallback((next: number) => {
    writeUsed(next);
    setUsedState(next);
  }, []);

  const patchAssistant = useCallback((id: string, patch: (m: AssistantMessage) => AssistantMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === id && m.role === "assistant" ? patch(m) : m)));
  }, []);

  const send = useCallback(
    async (question: string) => {
      const text = question.trim();
      const cached = cachedAnswer(content, text) !== undefined;
      if (!text || status !== "ready" || (remaining === 0 && !cached)) return;

      if (messages.length === 0) track("chat_open");
      const history = toHistory(messages);
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", text },
        { id: assistantId, role: "assistant", text: "", read: [], status: "reading" },
      ]);
      setStatus("submitted");
      // Une suggestion est servie par le site : elle ne coûte rien et ne compte pas dans le quota.
      if (!cached) setUsed(used + 1);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        for await (const event of askAgent(content, text, history, controller.signal)) {
          switch (event.type) {
            case "read":
              if (content.sources[event.sourceId]) {
                patchAssistant(assistantId, (m) =>
                  m.read.includes(event.sourceId) ? m : { ...m, read: [...m.read, event.sourceId] },
                );
              }
              break;
            case "text":
              setStatus("streaming");
              patchAssistant(assistantId, (m) => ({ ...m, status: "streaming", text: m.text + event.delta }));
              break;
            case "quota":
              setUsed(DAILY_QUESTION_LIMIT - Math.min(DAILY_QUESTION_LIMIT, Math.max(0, event.remaining)));
              break;
            case "done":
              patchAssistant(assistantId, (m) => ({ ...m, status: "done", trace: event.trace, sig: event.sig }));
              break;
            case "error":
              if (event.code === "quota") setUsed(DAILY_QUESTION_LIMIT);
              patchAssistant(assistantId, (m) => ({ ...m, status: "error", error: event.code }));
              break;
          }
        }
        // Flux coupé sans « done » : la réponse est incomplète, on le dit plutôt que de la laisser en suspens.
        patchAssistant(assistantId, (m) =>
          m.status === "reading" || m.status === "streaming" ? { ...m, status: "error", error: "unavailable" } : m,
        );
      } catch (error: unknown) {
        const aborted = error instanceof DOMException && error.name === "AbortError";
        patchAssistant(assistantId, (m) =>
          aborted ? { ...m, status: "stopped" } : { ...m, status: "error", error: "unavailable" },
        );
      } finally {
        abortRef.current = null;
        setStatus("ready");
      }
    },
    [content, messages, patchAssistant, remaining, setUsed, status, used],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
  }, []);

  return { messages, status, remaining, send, stop, reset };
}

export type AgentChat = ReturnType<typeof useAgentChat>;
