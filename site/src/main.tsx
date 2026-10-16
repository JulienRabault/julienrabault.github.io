import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { en } from "./content/en";
import { fr } from "./content/fr";
import { startAnalytics } from "./lib/analytics";

// Une page HTML par langue (/ et /en/), une seule appli : la langue vient de <html lang>.
const content = document.documentElement.lang === "en" ? en : fr;

startAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App content={content} />
  </StrictMode>,
);
