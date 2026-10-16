# Portfolio analytics

Le Worker collecte maintenant trois types de donnees anonymes:

- `page_view`: une visite de page, envoyee sur `/events`.
- `chat_open`: ouverture du widget.
- `chat_message`: question posee au chatbot, enregistree cote Worker avec la reponse et le statut.

Les IP ne sont pas stockees. Le site envoie seulement un identifiant aleatoire de navigateur, un identifiant de session, la page, la langue, le referrer et la taille du viewport.

## Setup D1

Depuis `cloudflare-worker/`:

```powershell
wrangler d1 create jr_portfolio_analytics
```

Copier le `database_id` retourne dans `wrangler.toml`, puis decommenter le bloc:

```toml
[[d1_databases]]
binding = "ANALYTICS_DB"
database_name = "jr_portfolio_analytics"
database_id = "..."
```

Initialiser la table:

```powershell
wrangler d1 execute jr_portfolio_analytics --file schema.sql --remote
```

Ajouter un token admin:

```powershell
wrangler secret put ADMIN_TOKEN
```

Redeployer:

```powershell
wrangler deploy
```

## Voir les stats

Dashboard web:

```text
https://jr-portfolio-chat.julienrabault.workers.dev/admin
```

Entrer le `ADMIN_TOKEN` dans la page. Il est conserve uniquement dans le `localStorage` du navigateur.

API JSON:

```powershell
$env:ADMIN_TOKEN = "ton-token"
Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $env:ADMIN_TOKEN" } `
  "https://jr-portfolio-chat.julienrabault.workers.dev/admin/stats?days=30"
```

Le JSON contient:

- `summary.page_views`: vues totales.
- `summary.unique_visitors`: visiteurs uniques anonymes.
- `previousSummary`: memes KPI sur la periode precedente pour calculer les evolutions.
- `daily` / `weekly`: series temporelles pour les graphes jour/semaine.
- `summary.chat_opens`: ouvertures du chatbot.
- `summary.chat_messages`: questions posees.
- `summary.chat_users`: visiteurs ayant utilise le chatbot.
- `topCountries`, `devices`, `browsers`, `languages`, `topOrganizations`: audience anonyme.
- `topSources`, `topCampaigns`: performance des liens trackes `src` / `utm_*`.
- `recentQuestions`: les 50 dernieres questions sur la periode.

## Liens trackes

Le dashboard `/admin` contient un generateur de liens. Le site lit:

- `src`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

Exemple:

```text
https://julienrabault.github.io/?src=linkedin&utm_source=linkedin&utm_medium=dm&utm_campaign=mistral-2026
```

## Chat v2 (site React, `/v2/chat`)

Le nouveau site appelle `POST /v2/chat` (code dans `chat.js`) et reçoit la réponse en flux SSE :
`quota`, `read` (passage cité), `text`, puis `done` (trace et signature) ou `error` (`quota`, `budget`, `unavailable`).

- La connaissance et le contrat (liens, widgets, filtre) sont importés depuis `site/src/content/` : modifier le site suffit, `wrangler deploy` les embarque.
- Le prompt système est mis en cache (prompt caching) : seules la question et l'historique changent d'un appel à l'autre.
- Quota : `CHAT_PER_VISITOR_PER_DAY` questions par visiteur et par jour, `CHAT_PER_DAY` pour tout le site. Le visiteur est un hash (jour, IP, `IP_SALT`), l'IP n'est pas stockée.
- Historique : seules les réponses signées par le worker (`HISTORY_SECRET`) sont renvoyées au modèle, une réponse forgée par le client est écartée avec sa question.
- Sortie filtrée côté worker puis côté navigateur : pas d'URL, pas de HTML, citations et widgets sur liste blanche.

Mise en place (une fois) :

```powershell
wrangler d1 execute jr_portfolio_analytics --file schema.sql --remote   # ajoute la table chat_usage
wrangler secret put HISTORY_SECRET   # chaîne aléatoire longue
wrangler secret put IP_SALT          # chaîne aléatoire
wrangler deploy
```

Tests : `node --test cloudflare-worker/` depuis la racine du dépôt (Node 24).

L'ancien endpoint `/chat` reste en place pour l'ancien site tant que le nouveau n'est pas en ligne.

## Accès discret au dashboard

Sur le nouveau site, `/#admin` redirige vers `/admin` du worker. Le dashboard reste protégé par `ADMIN_TOKEN`.
Le générateur de liens propose la page d'arrivée (chat ou parcours, FR ou EN) en plus de la source.
Événement ajouté : `career_open` (ouverture de la page Parcours).
