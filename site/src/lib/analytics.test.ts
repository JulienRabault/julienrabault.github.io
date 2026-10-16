import { describe, expect, it } from "vitest";
import { classifyLink } from "./analytics";

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
