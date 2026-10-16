import type { CannedAnswer, SiteContent } from "@/content/types";
import type { AgentEvent } from "@/lib/agent-events";

const READ_DELAY_MS = 420;
const WORD_DELAY_MS = 22;

const wait = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

function pickAnswer(content: SiteContent, question: string): Omit<CannedAnswer, "match"> {
  const q = question.toLowerCase();
  return content.answers.find((a) => a.match.some((m) => q.includes(m))) ?? content.fallback;
}

/**
 * Agent simulé du prototype : rejoue une réponse préparée au rythme d'un vrai flux.
 * Le vrai branchement passera par le worker Cloudflare, avec le même contrat d'événements.
 */
export async function* askMockAgent(
  content: SiteContent,
  question: string,
  signal: AbortSignal,
): AsyncGenerator<AgentEvent> {
  const answer = pickAnswer(content, question);
  const started = performance.now();

  for (const sourceId of answer.read) {
    await wait(READ_DELAY_MS, signal);
    yield { type: "read", sourceId };
  }

  const words = answer.text.split(/(?<=\s)/);
  for (const word of words) {
    await wait(WORD_DELAY_MS, signal);
    yield { type: "text", delta: word };
  }

  const outputTokens = Math.round(answer.text.length / 3.6);
  yield {
    type: "done",
    trace: {
      model: "Claude Haiku 5.5",
      inputTokens: 9400,
      outputTokens,
      durationMs: Math.round(performance.now() - started),
      simulated: true,
    },
  };
}
