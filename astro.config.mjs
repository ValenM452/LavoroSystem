// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

/**
 * Página de tokens solo en desarrollo: se inyecta en `astro dev`
 * y no existe en el build de producción.
 * @returns {import('astro').AstroIntegration}
 */
function devTokensPage() {
  return {
    name: 'lavoro:dev-tokens',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev') {
          injectRoute({ pattern: '/_tokens', entrypoint: './src/dev/Tokens.astro' });
        }
      },
    },
  };
}

/**
 * URL pública del sitio (canonical, og:url, og:image). WhatsApp y las redes necesitan la imagen con URL absoluta.
 * Orden: PUBLIC_SITE_URL (dominio propio) → en Vercel, la URL de producción o la de la rama de la vista previa.
 */
function siteUrl() {
  const env = process.env;
  if (env.PUBLIC_SITE_URL) return env.PUBLIC_SITE_URL;
  if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const host = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  return host ? `https://${host}` : undefined;
}

export default defineConfig({
  site: siteUrl(),
  output: 'static',
  adapter: vercel(),
  integrations: [devTokensPage()],
  // Secretos de /api/lead: se leen en runtime (Vercel), nunca quedan en el bundle.
  env: {
    schema: {
      LEAD_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      LEAD_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Medición (T09): sin ID no se carga el script. Se fijan en el build (públicos).
      PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
