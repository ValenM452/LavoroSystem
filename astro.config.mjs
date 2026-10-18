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

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || undefined,
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
