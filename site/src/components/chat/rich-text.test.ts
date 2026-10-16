import { describe, expect, it } from "vitest";
import { toBlocks } from "./rich-text";

describe("toBlocks", () => {
  it("sort un widget du milieu d'un paragraphe et le pose après", () => {
    expect(toBlocks("Voici le harnais {{harness}} et la suite.")).toEqual([
      { type: "p", text: "Voici le harnais  et la suite." },
      { type: "widget", request: { kind: "widget", id: "harness" } },
    ]);
  });

  it("garde les liens dans le texte et retire les directives inconnues", () => {
    expect(toBlocks("Le CV : {{link:cv}} {{link:evil}} {{iframe}}")).toEqual([{ type: "p", text: "Le CV : {{link:cv}}" }]);
  });

  it("reconnaît les listes à puces", () => {
    expect(toBlocks("- un [[bl]]\n- deux")).toEqual([{ type: "list", items: ["un [[bl]]", "deux"] }]);
  });

  it("cache un marqueur encore ouvert pendant le flux", () => {
    expect(toBlocks("Texte {{harn")).toEqual([{ type: "p", text: "Texte" }]);
    expect(toBlocks("Texte [[bl")).toEqual([{ type: "p", text: "Texte" }]);
  });
});
