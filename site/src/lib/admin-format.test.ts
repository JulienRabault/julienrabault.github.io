import { describe, expect, it } from "vitest";
import { actionDetail, delta, fillDays, referrerHost, slug, timeAgo, trackedLink } from "./admin-format";

describe("trackedLink", () => {
  const base = "https://julienrabault.github.io/";

  it("pose la source, la campagne et la page", () => {
    expect(trackedLink({ base, locale: "fr", page: "chat", source: "linkedin" })).toBe(
      "https://julienrabault.github.io/?src=linkedin",
    );
    expect(trackedLink({ base, locale: "en", page: "parcours", source: "LinkedIn", campaign: "Mistral AI" })).toBe(
      "https://julienrabault.github.io/en/?src=linkedin&utm_campaign=mistral-ai#parcours",
    );
  });

  it("garde le sous-dossier du site et ignore une source vide", () => {
    expect(trackedLink({ base: "https://julienrabault.github.io/v2", locale: "fr", page: "chat", source: "  " })).toBe(
      "https://julienrabault.github.io/v2/",
    );
  });
});

describe("slug", () => {
  it("retire accents, espaces et ponctuation", () => {
    expect(slug(" Welcome to the Jungle ! ")).toBe("welcome-to-the-jungle");
    expect(slug("Société Générale")).toBe("societe-generale");
  });
});

describe("delta", () => {
  it("compare à la période précédente, sauf s'il n'y a rien avant", () => {
    expect(delta(15, 10)).toBe(50);
    expect(delta(5, 10)).toBe(-50);
    expect(delta(5, 0)).toBeNull();
  });
});

describe("fillDays", () => {
  it("met un point par jour, y compris les jours sans visite", () => {
    const now = new Date("2026-10-17T12:00:00Z");
    const points = fillDays(
      [{ day: "2026-10-16", page_views: 4, unique_visitors: 3, chat_messages: 2, chat_suggestions: 1 }],
      3,
      now,
    );
    expect(points).toEqual([
      { day: "2026-10-15", visitors: 0, questions: 0 },
      { day: "2026-10-16", visitors: 3, questions: 3 },
      { day: "2026-10-17", visitors: 0, questions: 0 },
    ]);
  });
});

describe("libellés", () => {
  it("lit le domaine d'origine et le détail d'une action", () => {
    expect(referrerHost("https://www.linkedin.com/feed/")).toBe("linkedin.com");
    expect(referrerHost("direct")).toBe("Accès direct");
    expect(actionDetail('{"channel":"email"}')).toBe("email");
    expect(actionDetail("pas du json")).toBe("");
  });

  it("dit depuis quand", () => {
    const now = Date.parse("2026-10-17T12:00:00Z");
    expect(timeAgo("2026-10-17T09:00:00Z", now)).toBe("il y a 3 heures");
    expect(timeAgo("2026-10-17T11:59:50Z", now)).toBe("à l'instant");
  });
});
