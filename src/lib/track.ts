/**
 * Medición (05 §5, T09). Una sola función `track()` para GA4 y Meta Pixel.
 * Los scripts los carga Base.astro solo si existe su ID en env; sin ID, `track()` no hace nada.
 * Los clics se clasifican por destino (wa.me / link a tienda con UTM), así cualquier CTA nuevo
 * queda medido sin tener que acordarse de marcarlo.
 */
import { site } from '../config/site';

export type TrackEvent = 'click_tienda' | 'click_whatsapp' | 'form_start' | 'generate_lead';
export type TrackParams = Record<string, string | undefined>;

/** Eventos estándar de Meta que corresponden a cada evento propio (05 §5). */
const META_EVENT: Partial<Record<TrackEvent, string>> = {
  click_whatsapp: 'Contact',
  generate_lead: 'Lead',
};

type Gtag = (cmd: 'event', name: string, params?: TrackParams) => void;
type Fbq = (cmd: 'track', name: string) => void;

export function track(event: TrackEvent, params: TrackParams = {}) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v)) as TrackParams;
  const w = window as unknown as { gtag?: Gtag; fbq?: Fbq };
  w.gtag?.('event', event, clean);
  const meta = META_EVENT[event];
  if (meta) w.fbq?.('track', meta);
  if (import.meta.env.DEV) console.debug('[track]', event, clean, meta ? `→ Meta ${meta}` : '');
}

/** Clave de categoría de la tienda cuya URL coincide con `url` (sin query). */
function categoriaDe(url: URL): string | undefined {
  const base = `${url.origin}${url.pathname}`.replace(/\/$/, '');
  for (const [key, c] of Object.entries(site.tiendanube.categories)) {
    if (c.url.startsWith('http') && c.url.replace(/\/$/, '') === base) return key;
  }
  return undefined;
}

/** Evento que corresponde a un link según su destino, o `null` si no se mide. */
export function classifyLink(href: string, seccion: string): { event: TrackEvent; params: TrackParams } | null {
  let url: URL;
  try { url = new URL(href); } catch { return null; }

  if (url.hostname === 'wa.me') {
    const number = url.pathname.replace(/\D/g, '');
    const tipo = number === site.contact.whatsappLocal.number ? 'local' : 'b2b';
    return { event: 'click_whatsapp', params: { tipo, seccion } };
  }
  if (url.searchParams.get('utm_source') === 'landing') {
    return {
      event: 'click_tienda',
      params: { seccion: url.searchParams.get('utm_campaign') ?? seccion, categoria: categoriaDe(url) },
    };
  }
  return null;
}

/** Nombre de la zona de la página donde está el elemento: `data-seccion`, id de la sección, header o footer. */
function seccionDe(el: Element): string {
  const marked = el.closest<HTMLElement>('[data-seccion]');
  if (marked) return marked.dataset.seccion!;
  if (el.closest('footer')) return 'footer';
  if (el.closest('header')) return 'header';
  const section = el.closest('section[id], section[aria-labelledby]');
  return section?.id || section?.getAttribute('aria-labelledby')?.replace(/-title$/, '') || location.pathname;
}

export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
    if (!a || a.getAttribute('aria-disabled') === 'true') return;
    const hit = classifyLink(a.href, seccionDe(a));
    if (hit) track(hit.event, hit.params);
  }, { capture: true });
}
