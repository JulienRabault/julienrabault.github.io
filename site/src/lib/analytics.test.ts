import { describe, expect, it } from "vitest";
import { classifyLink, VISITOR_MAX_AGE_MS, visitorId } from "./analytics";

const HOST = "julienrabault.github.io";
const types = (href: string, label = "", download = false) => classifyLink(href, label, download, HOST).map((e) => e.type);

describe("classifyLink", () => {
  it("reconnaît le CV, même ouvert sans téléchargement", () => {
    expect(types("/CV_JULIEN_RABAULT.pdf", "Télécharger le CV", true)).toEqual(["cv_download"]);
    expect(classifyLink("/CV_JULIEN_RABAULT_EN.pdf", "CV", false, HOST)[0].metadata.file).toBe("CV_JULIEN_RABAULT_EN.pdf");
  });

  it("classe email et LinkedIn en contact", () => {
    expect(classifyLink("mailto:julienrabault@icloud.com", "Email", false, HOST)[0].metadata.channel).toBe("email");
    expect(classifyLink("https://www.linkedin.com/in/julien-rabault", "", false, HOST)[0].metadata.channel).toBe("linkedin");
  });

  it("distingue le profil GitHub d'un dépôt", () => {
    expect(types("https://github.com/JulienRabault")).toEqual(["github_click"]);
    expect(types("https://github.com/JulienRabault/LLMock", "LLMock")).toEqual(["github_click", "project_open"]);
  });

  it("compte une publication externe comme projet, ignore les liens internes", () => {
    expect(types("https://ojs.aaai.org/index.php/AIES/article/view/36689", "AIES 2025")).toEqual(["project_open"]);
    expect(types("/#parcours")).toEqual([]);
    expect(types(`https://${HOST}/en/`)).toEqual([]);
  });
});

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

describe("visitorId", () => {
  it("garde le même identifiant pendant 13 mois, puis en tire un nouveau", () => {
    const storage = memoryStorage();
    const start = Date.parse("2026-01-01T00:00:00Z");
    const first = visitorId(() => storage, start);
    expect(visitorId(() => storage, start + VISITOR_MAX_AGE_MS - 1)).toBe(first);
    expect(visitorId(() => storage, start + VISITOR_MAX_AGE_MS + 1)).not.toBe(first);
  });

  it("renouvelle un identifiant ancien qui n'a pas de date", () => {
    const storage = memoryStorage();
    storage.setItem("jr-visitor-id", "v_ancien");
    expect(visitorId(() => storage)).not.toBe("v_ancien");
  });
});
