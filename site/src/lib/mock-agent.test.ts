import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { cachedAnswer, replayAnswer } from "@/lib/mock-agent";
import { describe, expect, it } from "vitest";

describe("cachedAnswer", () => {
  it("sert chaque suggestion depuis le site, dans les deux langues", () => {
    for (const content of [fr, en]) {
      for (const suggestion of content.suggestions) {
        expect(cachedAnswer(content, suggestion), suggestion).toBeDefined();
      }
    }
  });

  it("reconnaît une suggestion retapée sans ponctuation ni casse", () => {
    expect(cachedAnswer(fr, "résume son parcours")?.read).toContain("cnrs");
    expect(cachedAnswer(fr, "Comment ce chat est-il construit")?.read).toContain("site");
  });

  it("laisse partir au worker une question tapée à la main, même proche", () => {
    expect(cachedAnswer(fr, "Résume son parcours au CNRS")).toBeUndefined();
    expect(cachedAnswer(en, "What is his stack?")).toBeUndefined();
  });

  it("ne cite que des passages connus", () => {
    for (const content of [fr, en]) {
      for (const suggestion of content.suggestions) {
        const answer = cachedAnswer(content, suggestion);
        for (const [, id] of answer?.text.matchAll(/\[\[([a-z0-9-]+)\]\]/g) ?? []) {
          expect(content.sources[id], `${suggestion} cite ${id}`).toBeDefined();
        }
      }
    }
  });
});

describe("replayAnswer", () => {
  it("rejoue lecture, texte puis fin", async () => {
    const types: string[] = [];
    let text = "";
    for await (const event of replayAnswer({ read: ["bl"], text: "Une réponse courte" }, new AbortController().signal, { cached: true })) {
      types.push(event.type);
      if (event.type === "text") text += event.delta;
    }
    expect(types[0]).toBe("read");
    expect(types.at(-1)).toBe("done");
    expect(text).toBe("Une réponse courte");
  });
});
