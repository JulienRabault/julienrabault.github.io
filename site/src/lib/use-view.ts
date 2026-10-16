import { track } from "@/lib/analytics";
import { useCallback, useSyncExternalStore } from "react";

export type View = "chat" | "career";

const CAREER_HASH = "#parcours";

function readView(): View {
  return window.location.hash === CAREER_HASH ? "career" : "chat";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

/** La vue vit dans l'URL (#parcours) : le lien se partage et le bouton retour marche. La query (utm, src) est gardée. */
export function useView(): [View, (next: View) => void] {
  const view = useSyncExternalStore(subscribe, readView, () => "chat" as View);

  const setView = useCallback((next: View) => {
    if (next === readView()) return;
    if (next === "career") track("career_open");
    const { pathname, search } = window.location;
    window.history.pushState(null, "", next === "career" ? `${pathname}${search}${CAREER_HASH}` : `${pathname}${search}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0 });
  }, []);

  return [view, setView];
}
