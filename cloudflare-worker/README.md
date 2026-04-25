# Portfolio analytics

Le Worker collecte maintenant trois types de donnees anonymes:

- `page_view`: une visite de page.
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

```powershell
$env:ADMIN_TOKEN = "ton-token"
Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $env:ADMIN_TOKEN" } `
  "https://jr-portfolio-chat.julienrabault.workers.dev/admin/stats?days=30"
```

Le JSON contient:

- `summary.page_views`: vues totales.
- `summary.unique_visitors`: visiteurs uniques anonymes.
- `summary.chat_opens`: ouvertures du chatbot.
- `summary.chat_messages`: questions posees.
- `summary.chat_users`: visiteurs ayant utilise le chatbot.
- `recentQuestions`: les 50 dernieres questions sur la periode.
