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
