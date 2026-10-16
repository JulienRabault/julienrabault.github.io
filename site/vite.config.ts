import { createHash } from 'node:crypto'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const TURNSTILE = 'https://challenges.cloudflare.com'

/**
 * Politique de sécurité du contenu, posée en balise meta (GitHub Pages ne permet pas d'en-têtes).
 * Seulement au build : en dev, Vite injecte ses propres scripts. Le script de thème en ligne est autorisé par son empreinte.
 */
function contentSecurityPolicy(chatUrl: string | undefined): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
          ([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`,
        )
        const worker = chatUrl ? new URL(chatUrl).origin : ''
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${inline.join(' ')} ${TURNSTILE}`,
          // Les styles en ligne viennent des animations et des composants : sans script injecté, ils ne peuvent rien exfiltrer.
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          `connect-src 'self' ${worker} https://api.github.com ${TURNSTILE}`,
          `frame-src ${TURNSTILE}`,
          "worker-src 'self' blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ]
          .map((directive) => directive.replace(/\s+/g, ' ').trim())
          .join('; ')
        // Juste après le jeu de caractères, avant tout script : une politique en meta ne vaut que pour ce qui la suit.
        const tags = `
    <meta http-equiv="Content-Security-Policy" content="${policy}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />`
        if (!/<meta charset[^>]*>/i.test(html)) throw new Error('index.html sans <meta charset> : la CSP ne peut pas être placée')
        return html.replace(/<meta charset[^>]*>/i, (charset) => charset + tags)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  return {
    // Racine du site par défaut ; VITE_BASE=/v2/ pour une préversion servie dans un sous-dossier.
    base: env.VITE_BASE || '/',
    plugins: [react(), tailwindcss(), contentSecurityPolicy(env.VITE_CHAT_URL)],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    // Deux points d'entrée : / en français, /en/ en anglais.
    build: {
      rollupOptions: {
        input: { fr: path.resolve(import.meta.dirname, 'index.html'), en: path.resolve(import.meta.dirname, 'en/index.html') },
      },
    },
  }
})
