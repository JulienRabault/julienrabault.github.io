import type { Stats, Summary } from "@/lib/admin-api";

/** Données d'exemple, chargées seulement en dev avec le jeton « demo ». Rien ici n'est une vraie visite. */

function summary(scale: number): Summary {
  const n = (value: number) => Math.round(value * scale);
  return {
    page_views: n(412),
    unique_visitors: n(183),
    sessions: n(221),
    chat_opens: n(96),
    chat_messages: n(74),
    chat_suggestions: n(51),
    chat_users: n(48),
    cv_downloads: n(22),
    contact_clicks: n(9),
    project_opens: n(31),
    github_clicks: n(17),
    action_users: n(38),
  };
}

const SOURCES = [
  { source: "linkedin", page_views: 168, unique_visitors: 81, chat_messages: 34 },
  { source: "inconnu", page_views: 121, unique_visitors: 54, chat_messages: 18 },
  { source: "candidature-mistral", page_views: 38, unique_visitors: 6, chat_messages: 11 },
  { source: "welcome-to-the-jungle", page_views: 52, unique_visitors: 27, chat_messages: 7 },
  { source: "github", page_views: 33, unique_visitors: 15, chat_messages: 4 },
];

export function demoStats(days: number, source?: string): Stats {
  const scale = (days / 30) * (source ? 0.3 : 1);
  const now = Date.now();
  const at = (hoursAgo: number) => new Date(now - hoursAgo * 3_600_000).toISOString();
  const daily = Array.from({ length: days }, (_, i) => {
    const day = new Date(now - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10);
    const wave = 4 + Math.round(3 * Math.sin(i / 2.3) + (i % 7 === 2 ? 6 : 0) + i / 6);
    return {
      day,
      page_views: wave * 2,
      unique_visitors: Math.max(0, Math.round(wave * (source ? 0.4 : 1))),
      chat_messages: Math.max(0, Math.round(wave / 2 - 1)),
      chat_suggestions: Math.max(0, Math.round(wave / 3)),
    };
  });

  return {
    generatedAt: new Date(now).toISOString(),
    periodDays: days,
    summary: summary(scale),
    previousSummary: summary(scale * 0.78),
    daily,
    topReferrers: [
      { referrer: "https://www.linkedin.com/", page_views: 140, unique_visitors: 70 },
      { referrer: "direct", page_views: 118, unique_visitors: 52 },
      { referrer: "https://www.google.com/", page_views: 41, unique_visitors: 22 },
      { referrer: "https://github.com/JulienRabault", page_views: 30, unique_visitors: 14 },
    ],
    availableSources: SOURCES,
    topSources: source ? SOURCES.filter((row) => row.source === source) : SOURCES,
    topCampaigns: [
      { source: "candidature-mistral", medium: "-", campaign: "mistral", page_views: 38, unique_visitors: 6, chat_messages: 11 },
    ],
    topCountries: [
      { country: "FR", page_views: 280, unique_visitors: 131 },
      { country: "CA", page_views: 61, unique_visitors: 24 },
      { country: "US", page_views: 38, unique_visitors: 16 },
      { country: "CH", page_views: 12, unique_visitors: 5 },
    ],
    topOrganizations: [
      { organization: "Orange", page_views: 92, unique_visitors: 40 },
      { organization: "Free SAS", page_views: 71, unique_visitors: 33 },
      { organization: "Mistral AI", page_views: 14, unique_visitors: 3 },
      { organization: "Bell Canada", page_views: 22, unique_visitors: 9 },
    ],
    devices: [
      { device: "desktop", page_views: 290, unique_visitors: 121 },
      { device: "mobile", page_views: 118, unique_visitors: 60 },
      { device: "tablet", page_views: 4, unique_visitors: 2 },
    ],
    recruiterActions: [
      { event_type: "career_open", events: 64, unique_visitors: 51 },
      { event_type: "project_open", events: 31, unique_visitors: 19 },
      { event_type: "cv_download", events: 22, unique_visitors: 20 },
    ],
    recentActions: [
      { id: 91, created_at: at(0.4), event_type: "cv_download", page_path: "/#parcours", source: "candidature-mistral", country: "FR", metadata: '{"file":"CV_JULIEN_RABAULT.pdf"}' },
      { id: 90, created_at: at(2), event_type: "contact_click", page_path: "/", source: "linkedin", country: "FR", metadata: '{"channel":"email"}' },
      { id: 88, created_at: at(5), event_type: "project_open", page_path: "/#parcours", source: "github", country: "CA", metadata: '{"project":"LLMock"}' },
      { id: 85, created_at: at(27), event_type: "career_open", page_path: "/", source: "inconnu", country: "US", metadata: null },
    ],
    recentQuestions: [
      {
        id: 412,
        created_at: at(0.3),
        language: "fr",
        page_path: "/",
        country: "FR",
        source: "candidature-mistral",
        campaign: "mistral",
        question: "Qu'a-t-il construit autour des évaluations d'agents ?",
        answer:
          "Chez Berger-Levrault, il a monté le banc d'évaluation des agents : des jeux de cas réels, des juges automatiques et un suivi à chaque version.\n\nLe gain sur le temps de revue est **estimé à -40 à -50 %**.",
        status: "ok",
      },
      {
        id: 409,
        created_at: at(3),
        language: "en",
        page_path: "/en/",
        country: "CA",
        source: "linkedin",
        campaign: null,
        question: "Does he have experience with HPC?",
        answer: "Yes. Four years at CNRS training deep learning models on a supercomputer.",
        status: "ok",
      },
      {
        id: 401,
        created_at: at(30),
        language: "fr",
        page_path: "/",
        country: "FR",
        source: "inconnu",
        campaign: null,
        question: "Quel est son salaire ?",
        answer: "Ce n'est pas un sujet que je traite ici. Pour en parler, écrivez-lui directement.",
        status: "client_abort",
      },
    ],
    topSuggestions: [
      { question: "Résume son parcours", events: 29, unique_visitors: 25 },
      { question: "Comment ce chat est-il construit ?", events: 14, unique_visitors: 13 },
      { question: "Qu'a-t-il fait sur les agents ?", events: 6, unique_visitors: 6 },
      { question: "Où peut-il travailler ?", events: 2, unique_visitors: 2 },
    ],
  };
}
