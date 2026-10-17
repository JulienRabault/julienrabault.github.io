import { describe, expect, it } from "vitest";
import type { Trace } from "@/lib/agent-events";
import { type ChatMessage, toHistory } from "@/lib/use-agent-chat";

const trace = (simulated: boolean): Trace => ({ model: "m", inputTokens: 0, outputTokens: 0, durationMs: 0, simulated });
const user = (text: string): ChatMessage => ({ id: text, role: "user", text });
const answer = (text: string, extra: Partial<Extract<ChatMessage, { role: "assistant" }>>): ChatMessage => ({
  id: `a-${text}`,
  role: "assistant",
  text,
  read: [],
  status: "done",
  ...extra,
});

describe("toHistory", () => {
  it("garde une suggestion servie par le site, sans son texte, pour que la relance retrouve le sujet", () => {
    const turns = toHistory([user("Peut-il travailler depuis Paris ?"), answer("Oui…", { trace: trace(true) })]);
    expect(turns).toEqual([
      { role: "user", text: "Peut-il travailler depuis Paris ?" },
      { role: "assistant", text: "", cached: true },
    ]);
  });

  it("garde une réponse signée et retire la question d'une réponse arrêtée", () => {
    const turns = toHistory([
      user("Q1"),
      answer("R1", { sig: "s1", trace: trace(false) }),
      user("Q2"),
      answer("R2", { status: "stopped" }),
    ]);
    expect(turns).toEqual([
      { role: "user", text: "Q1" },
      { role: "assistant", text: "R1", sig: "s1" },
    ]);
  });
});
