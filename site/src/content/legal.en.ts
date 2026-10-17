import type { LegalContent } from "./types";

// Must stay true to what the code does: analytics.ts (measurement), chat.js (chat, quota), retention.js (retention).
export const legalEn: LegalContent = {
  link: "Legal notice and privacy",
  title: "Legal notice and privacy",
  updated: "Updated on 16 October 2026.",
  sections: [
    {
      title: "Publisher",
      paragraphs: [
        "This is the personal, non-commercial website of Julien Rabault, AI engineer. Publication director: Julien Rabault. Contact: julienrabault@icloud.com.",
      ],
    },
    {
      title: "Hosting",
      paragraphs: [
        "The site is hosted by GitHub Pages: GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.",
        "The chat agent and the audience measurement run on Cloudflare Workers: Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States.",
      ],
    },
    {
      title: "What the site measures",
      paragraphs: [
        "To understand how the site is used, it records page views and a few clicks (CV, contact, projects), with the referring page, the language, the browser, and the country and network that Cloudflare infers from the IP address. The IP address itself is not stored.",
        "This data is tied to a random identifier kept in your browser and renewed every 13 months. No cookies, no third-party analytics, no advertising.",
      ],
    },
    {
      title: "The chat",
      paragraphs: [
        "Questions asked to the agent and its answers are recorded, to fix the agent and see what visitors are looking for. To produce the answer, the question is sent to Anthropic (Claude model), in the United States. Please do not write personal information in it.",
        "To prevent abuse, the number of questions per day is counted from a fingerprint of the IP address, computed with a secret key: the address cannot be recovered from it, and it is deleted after two days.",
      ],
    },
    {
      title: "Other services",
      paragraphs: [
        "The Career page and some chat answers call GitHub's public API to show repository stars: GitHub then receives your IP address, as with any web page. Fonts are served by the site itself.",
        "If the chat's bot check is enabled, it runs through Cloudflare Turnstile, which inspects the browser to tell a human from a bot, with no advertising cookies.",
      ],
    },
    {
      title: "Browser storage",
      paragraphs: [
        "The site keeps in your browser the theme you chose, the visit identifier and its creation date, today's question count and, for the length of the visit, a session identifier, where the visit came from, the bot-check pass and the state of the chat bubble. You can clear them at any time from your browser settings.",
      ],
    },
    {
      title: "Retention and legal basis",
      paragraphs: [
        "Visits and chat exchanges are deleted automatically after 13 months. This processing relies on Julien Rabault's legitimate interest in understanding how his site is used and improving his agent.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "You can ask to access, correct or delete your data, or object to its processing, by writing to julienrabault@icloud.com. If you are not satisfied with the answer, you can lodge a complaint with the CNIL (cnil.fr), the French data protection authority.",
      ],
    },
    {
      title: "Intellectual property",
      paragraphs: [
        "The texts and visuals on this site belong to Julien Rabault unless stated otherwise. The open source projects mentioned follow their own licences.",
      ],
    },
  ],
};
