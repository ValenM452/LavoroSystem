import { site, type CategoryKey } from '../config/site';

export interface Target {
  href: string;
  /** Texto del `[[PENDIENTE: …]]` si el destino todavía no existe. */
  pending: string | null;
}

export const isPending = (value: string) => value.startsWith('[[');
const pendingText = (value: string) => value.replace(/^\[\[PENDIENTE:\s*/, '').replace(/\]\]$/, '');

function withUtm(url: string, seccion: string): Target {
  if (isPending(url)) return { href: '#', pending: pendingText(url) };
  const u = new URL(url);
  u.searchParams.set('utm_source', 'landing');
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', seccion);
  return { href: u.toString(), pending: null };
}

/** Link a la tienda (raíz o categoría) con UTM de 05 §1. */
export function tiendaTarget(seccion: string, categoria?: CategoryKey): Target {
  const url = categoria ? site.tiendanube.categories[categoria].url : site.tiendanube.baseUrl;
  return withUtm(url, seccion);
}

/** Link a una URL externa de `site.ts` que puede estar pendiente. */
export function externalTarget(url: string): Target {
  return isPending(url) ? { href: '#', pending: pendingText(url) } : { href: url, pending: null };
}

/** Página del rubro (rediseño: un sector por rubro). */
export const rubroPage = (slug: string) => `/rubros/${slug}`;

/** Link a /empresas precargando el rubro (04 §1, T05). */
export const rubroHref = (slug: string) => `${site.paths.empresas}?rubro=${slug}#cotizar`;

/** Link al formulario con personalización preseleccionada (04 §6). */
export const personalizacionHref = `${site.paths.empresas}?personalizacion=1#cotizar`;

export const pendingLabel = (value: string) => pendingText(value);

/** WhatsApp con el mensaje armado según el botón que lo abre. */
export type WhatsappLine = 'empresas' | 'local';
export function whatsappLink(line: WhatsappLine, text: string): string {
  const { number } = line === 'empresas' ? site.contact.whatsappEmpresas : site.contact.whatsappLocal;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
