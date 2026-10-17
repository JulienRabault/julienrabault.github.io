import type { CannedAnswer, SiteContent } from "@/content/types";
import type { AgentEvent } from "@/lib/agent-events";

const READ_DELAY_MS = 420;
const WORD_DELAY_MS = 22;
/** Une réponse en cache n'attend aucun modèle : la lecture est brève, le texte arrive vite mais reste lisible. */
const CACHED_READ_DELAY_MS = 160;
const CACHED_WORD_DELAY_MS = 8;

type Answer = Omit<CannedAnswer, "match">;

/** Le worker passe les mêmes réponses préparées, sans le reste du contenu du site. */
export type PreparedAnswers = Pick<SiteContent, "suggestions" | "answers">;

const wait = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

function pickAnswer(content: PreparedAnswers, question: string): Answer | undefined {
  const q = question.toLowerCase();
  return content.answers.find((a) => a.match.some((m) => q.includes(m)));
}

const normalize = (text: string) => text.toLowerCase().replace(/[\s  ?!.]+/g, " ").trim();

/**
 * Les suggestions sont ce que la plupart des visiteurs cliquent : leur réponse est rédigée d'avance et servie
 * par le site, sans appel au modèle. Une question tapée à la main, même proche, part au worker.
 */
export function cachedAnswer(content: PreparedAnswers, question: string): Answer | undefined {
  const asked = normalize(question);
  if (!content.suggestions.some((s) => normalize(s) === asked)) return undefined;
  return pickAnswer(content, question);
}

/** Rejoue une réponse préparée au rythme d'un flux, avec le même contrat d'événements que le worker. */
export async function* replayAnswer(
  answer: Answer,
  signal: AbortSignal,
  { cached }: { cached: boolean },
): AsyncGenerator<AgentEvent> {
  const started = performance.now();

  for (const sourceId of answer.read) {
    await wait(cached ? CACHED_READ_DELAY_MS : READ_DELAY_MS, signal);
    yield { type: "read", sourceId };
  }

  const words = answer.text.split(/(?<=\s)/);
  for (const word of words) {
    await wait(cached ? CACHED_WORD_DELAY_MS : WORD_DELAY_MS, signal);
    yield { type: "text", delta: word };
  }

  yield {
    type: "done",
    trace: {
      model: "Claude Sonnet 5.5",
      inputTokens: 0,
      outputTokens: Math.round(answer.text.length / 3.6),
      durationMs: Math.round(performance.now() - started),
      simulated: true,
    },
  };
}

/**
 * Agent simulé du développement (pas d'URL de worker) : rejoue la réponse préparée la plus proche.
 */
export async function* askMockAgent(
  content: SiteContent,
  question: string,
  signal: AbortSignal,
): AsyncGenerator<AgentEvent> {
  yield* replayAnswer(pickAnswer(content, question) ?? content.fallback, signal, { cached: false });
}
