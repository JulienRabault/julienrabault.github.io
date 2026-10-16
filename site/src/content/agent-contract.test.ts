import { describe, expect, it } from "vitest";
import { createStreamSanitizer, parseDirective, sanitizeAnswer } from "./agent-contract";

const SOURCES = new Set(["bl", "cnrs"]);

/** Rejoue un texte morceau par morceau, comme le flux du modèle. */
function stream(text: string, size: number): string {
  const sanitizer = createStreamSanitizer(SOURCES);
  let out = "";
  for (let i = 0; i < text.length; i += size) out += sanitizer.push(text.slice(i, i + size));
  return out + sanitizer.flush();
}

describe("parseDirective", () => {
  it("accepte les liens, widgets, projets et dépôts de la liste", () => {
    expect(parseDirective("link", "cv")).toEqual({ kind: "link", id: "cv" });
    expect(parseDirective("harness", undefined)).toEqual({ kind: "widget", id: "harness" });
    expect(parseDirective("project", "deepfaune")).toEqual({ kind: "project", id: "deepfaune" });
    expect(parseDirective("repo", "llmock")).toEqual({ kind: "repo", id: "llmock" });
    expect(parseDirective("project", "llmock")).toBeNull();
  });

  it("refuse le reste", () => {
    expect(parseDirective("link", "evil")).toBeNull();
    expect(parseDirective("script", undefined)).toBeNull();
    expect(parseDirective("harness", "x")).toBeNull();
  });
});

describe("sanitizeAnswer", () => {
  it("garde les citations connues et retire les inventées", () => {
    expect(sanitizeAnswer("Athena [[bl]] et rien [[fake]].", SOURCES)).toBe("Athena [[bl]] et rien .");
  });

  it("retire les URL brutes et garde le texte des liens markdown", () => {
    expect(sanitizeAnswer("Voir https://evil.example/x et [le CV](https://evil.example).", SOURCES)).toBe("Voir  et le CV.");
    expect(sanitizeAnswer("Va sur www.evil.example maintenant", SOURCES)).toBe("Va sur  maintenant");
  });

  it("retire le HTML", () => {
    expect(sanitizeAnswer('Salut <img src=x onerror="alert(1)"> toi', SOURCES)).toBe("Salut  toi");
  });

  it("garde les directives connues, retire les autres, et plafonne les widgets", () => {
    const text = "{{harness}}\n\n{{timeline}}\n\n{{contact}} {{link:cv}} {{link:phishing}} {{iframe}}";
    expect(sanitizeAnswer(text, SOURCES)).toBe("{{harness}}\n\n{{timeline}}\n\n {{link:cv}}  ");
  });

  it("est idempotent quand un retrait recolle une balise ou une URL", () => {
    for (const text of ["a <<b>script>alert(1)<</b>/script> b", "voir ht<b>tp://evil.example ici", "x <scr<i>ipt> y"]) {
      const once = sanitizeAnswer(text, SOURCES);
      expect(sanitizeAnswer(once, SOURCES)).toBe(once);
      expect(once).not.toMatch(/[<>]|http|evil/);
    }
  });

  it("retire un marqueur laissé ouvert par une réponse tronquée", () => {
    expect(sanitizeAnswer("Fin [[b", SOURCES)).toBe("Fin b");
    expect(sanitizeAnswer("Fin {{harn", SOURCES)).toBe("Fin harn");
    expect(sanitizeAnswer("Fin [[bl]] {{harness}}", SOURCES)).toBe("Fin [[bl]] {{harness}}");
  });
});

describe("createStreamSanitizer", () => {
  const cases = [
    "Athena [[bl]], voir {{link:career}} et https://evil.example/path?x=1 puis [ici](https://a.b) fin.",
    "Deux widgets {{harness}} {{timeline}} puis un de trop {{contact}}. Citation [[cnrs]] et [[nope]].",
    "Texte <b>gras</b> et accolade { seule, crochet [ seul.",
    "Projet {{project:gens}} puis dépôt {{repo:llmock}} et un troisième {{project:deepfaune}}. Coupé [[cn",
  ];

  it.each([1, 2, 3, 7, 50])("donne le même résultat que le nettoyage complet, morceaux de %i", (size) => {
    for (const text of cases) expect(stream(text, size)).toBe(sanitizeAnswer(text, SOURCES));
  });

  it("ne laisse jamais passer un morceau d'URL", () => {
    const sanitizer = createStreamSanitizer(SOURCES);
    const parts = ["Voir http", "s://evil.exa", "mple/x", " ensuite"];
    const emitted = parts.map((p) => sanitizer.push(p)).join("") + sanitizer.flush();
    expect(emitted).not.toContain("http");
    expect(emitted).not.toContain("evil");
  });
});
