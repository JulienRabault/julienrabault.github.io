import type { RepoId } from "./agent-contract";

// Dépôts montrés en carte GitHub. La description vient du parcours (openSource), traduite ; les chiffres
// (étoiles, dernière mise à jour, état de la PR) sont lus en direct sur l'API GitHub, avec ces valeurs en repli.
export interface RepoInfo {
  owner: string;
  name: string;
  /** Une pull request plutôt qu'un dépôt. */
  pull?: number;
  language: string;
  pypi?: string;
}

export const REPOS: Record<RepoId, RepoInfo> = {
  "llmock": { owner: "JulienRabault", name: "LLMock", language: "Python", pypi: "llmock" },
  "ddpm-weather": { owner: "JulienRabault", name: "DDPM-weather", language: "Python" },
  "uniqpath": { owner: "JulienRabault", name: "uniqpath", language: "Python", pypi: "uniqpath" },
  "bananaml": { owner: "JulienRabault", name: "DaysToBananaDeath", language: "Python" },
  "langchain-pr": { owner: "langchain-ai", name: "langchain", pull: 37008, language: "Python" },
};

export const repoUrl = (repo: RepoInfo): string =>
  `https://github.com/${repo.owner}/${repo.name}${repo.pull ? `/pull/${repo.pull}` : ""}`;
