// Aller à un endroit du parcours depuis n'importe où (chat, bulle, frise) : un chapitre, un projet ou une section.
// La cible est gardée jusqu'à ce que la page la prenne : elle peut arriver avant que le parcours soit monté.

const EVENT = "career:jump";
let pending: string | null = null;

export function requestCareerJump(target: string): void {
  pending = target;
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: target }));
}

/** Abonne la page aux demandes ; une demande arrivée avant le montage est servie tout de suite. */
export function onCareerJump(handler: (target: string) => void): () => void {
  const listener = (event: Event) => {
    pending = null;
    handler((event as CustomEvent<string>).detail);
  };
  window.addEventListener(EVENT, listener);
  if (pending) {
    const target = pending;
    pending = null;
    handler(target);
  }
  return () => window.removeEventListener(EVENT, listener);
}
