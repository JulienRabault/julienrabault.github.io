// Durées de conservation annoncées dans la page de confidentialité du site. Les changer ici, c'est changer ce texte aussi.
export const RETENTION = {
  /** Visites, clics et échanges du chat : 13 mois, la durée que la CNIL retient pour la mesure d'audience. */
  analyticsDays: 395,
  /** Compteurs du quota : ils ne servent que le jour même. Effacés la deuxième nuit, soit deux jours au plus. */
  usageDays: 1,
};

const daysAgo = (now, days) => new Date(now - days * 86_400_000);

/** Efface ce qui a dépassé sa durée de conservation. Lancé chaque nuit par le déclencheur planifié du worker. */
export async function purgeExpired(db, now = Date.now()) {
  if (!db) return { analytics: 0, usage: 0 };
  const analyticsLimit = daysAgo(now, RETENTION.analyticsDays).toISOString();
  const usageLimit = daysAgo(now, RETENTION.usageDays).toISOString().slice(0, 10);
  const [analytics, usage] = await Promise.all([
    db.prepare("DELETE FROM analytics_events WHERE created_at < ?").bind(analyticsLimit).run(),
    db.prepare("DELETE FROM chat_usage WHERE day < ?").bind(usageLimit).run(),
  ]);
  return { analytics: analytics.meta?.changes ?? 0, usage: usage.meta?.changes ?? 0 };
}
