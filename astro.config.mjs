// @ts-check
import { defineConfig } from 'astro/config';
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
});
