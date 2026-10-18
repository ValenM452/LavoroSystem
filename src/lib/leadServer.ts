/**
 * Lógica de servidor de /api/lead (05 §4, T08). Sin dependencias de Astro para poder testearla.
 * Orden: antispam → rate limit → validación (zod) → envío al Apps Script → respuesta con whatsappUrl.
 * Contrato del webhook: docs/apps-script/README.md ("Referencia técnica").
 */
import { leadSchema, rubroOptions, type Lead, type LeadInput } from './leadSchema';
import { copy } from '../config/copy';
import { site } from '../config/site';

/** Campos que no valida zod: antispam y atribución (05 §2). */
export interface LeadExtras {
  website: string;
  t: string;
  pagina: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
}
export type LeadFields = LeadInput & LeadExtras;

export type LeadResult =
  | { status: 'ok'; id: string; whatsappUrl: string }
  /** Spam (honeypot o tiempo): se responde como éxito para no dar pistas. */
  | { status: 'discarded'; whatsappUrl: string }
  | { status: 'invalid'; errors: Record<string, string> }
  | { status: 'rate_limited'; whatsappUrl: string }
  | { status: 'failed'; reason: 'not_configured' | 'webhook'; whatsappUrl: string };

export interface LeadConfig {
  webhookUrl?: string;
  webhookSecret?: string;
  rateLimiter: RateLimiter;
  fetch?: typeof fetch;
  now?: () => number;
  log?: Pick<Console, 'error' | 'warn'>;
}

/** Envío en menos de 3 s desde que cargó el formulario → bot (05 §2). */
export const MIN_FILL_MS = 3000;
/** Primer intento + reintento; entra holgado en el límite de una función de Vercel. */
const WEBHOOK_TIMEOUTS_MS = [6000, 3000];

const EXTRA_KEYS = ['website', 't', 'pagina', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer'] as const;
const EXTRA_MAX_LEN: Record<string, number> = { referrer: 500, pagina: 300 };
const TEXT_KEYS = ['nombre', 'empresa', 'telefono', 'email', 'localidad', 'rubro', 'cantidad', 'personalizacion', 'plazo', 'comentario'] as const;

const genericWhatsapp = site.contact.whatsappEmpresas.url;

// ─── Lectura del request ────────────────────────────────────────────────────

/** Unifica un POST de formulario (sin JS) y uno JSON (con JS) en los mismos campos. */
export function readFields(source: FormData | Record<string, unknown>): LeadFields {
  const isForm = typeof FormData !== 'undefined' && source instanceof FormData;
  const get = (k: string): unknown => (isForm ? (source as FormData).get(k) : (source as Record<string, unknown>)[k]);
  const all = (k: string): unknown[] => {
    if (isForm) return (source as FormData).getAll(k);
    const v = (source as Record<string, unknown>)[k];
    return Array.isArray(v) ? v : v == null ? [] : [v];
  };
  const str = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');

  const fields = {} as Record<string, unknown>;
  for (const k of TEXT_KEYS) fields[k] = str(get(k));
  fields.productos = [...all('productos'), ...all('productos[]')].map(str).filter(Boolean);
  const acepta = get('acepta');
  fields.acepta = acepta === true || acepta === 'on' || acepta === 'true';
  for (const k of EXTRA_KEYS) fields[k] = str(get(k)).trim().slice(0, EXTRA_MAX_LEN[k] ?? 200);
  return fields as unknown as LeadFields;
}

// ─── Reglas ─────────────────────────────────────────────────────────────────

/**
 * Honeypot con valor, o `t` válido con menos de 3 s → spam.
 * Sin JS `t` llega vacío y no se puede medir: quedan el honeypot y el rate limit.
 */
export function isSpam(fields: Pick<LeadExtras, 'website' | 't'>, now: number): boolean {
  if (fields.website) return true;
  const t = Number(fields.t);
  if (!fields.t || !Number.isFinite(t) || t <= 0 || t > now) return false;
  return now - t < MIN_FILL_MS;
}

export function whatsappUrlFor(lead: Pick<Lead, 'nombre' | 'empresa' | 'rubro' | 'productos' | 'cantidad'>): string {
  const text = copy.form.waSummary({
    nombre: lead.nombre,
    empresa: lead.empresa,
    rubro: rubroLabel(lead.rubro),
    productos: lead.productos.join(', '),
    cantidad: lead.cantidad,
  });
  return `https://wa.me/${site.contact.whatsappEmpresas.number}?text=${encodeURIComponent(text)}`;
}

const rubroLabel = (slug: string) => rubroOptions.find((r) => r.value === slug)?.label ?? slug;

export function newLeadId(now: number): string {
  const day = new Date(now).toISOString().slice(0, 10).replace(/-/g, '');
  return `L-${day}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Rate limit en memoria de la función: 5 envíos por IP cada 10 min (05 §4). */
export interface RateLimiter { hit(key: string, now: number): boolean }

export function createRateLimiter({ limit = 5, windowMs = 10 * 60_000 } = {}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now) {
      const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] >= windowMs) hits.delete(k);
      return true;
    },
  };
}

// ─── Flujo ──────────────────────────────────────────────────────────────────

export async function handleLead(fields: LeadFields, ip: string, config: LeadConfig): Promise<LeadResult> {
  const now = (config.now ?? Date.now)();
  const log = config.log ?? console;

  if (isSpam(fields, now)) return { status: 'discarded', whatsappUrl: genericWhatsapp };
  if (!config.rateLimiter.hit(ip || 'unknown', now)) return { status: 'rate_limited', whatsappUrl: genericWhatsapp };

  const parsed = leadSchema.safeParse(fields);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: 'invalid', errors };
  }

  const lead = parsed.data;
  const id = newLeadId(now);
  const whatsappUrl = whatsappUrlFor(lead);
  const payload = {
    id,
    nombre: lead.nombre,
    empresa: lead.empresa,
    telefono: lead.telefono,
    email: lead.email,
    localidad: lead.localidad,
    rubro: rubroLabel(lead.rubro),
    cantidad: lead.cantidad,
    productos: lead.productos,
    personalizacion: lead.personalizacion,
    plazo: lead.plazo,
    comentario: lead.comentario,
    pagina: fields.pagina,
    utm_source: fields.utm_source,
    utm_medium: fields.utm_medium,
    utm_campaign: fields.utm_campaign,
    referrer: fields.referrer,
  };

  if (!config.webhookUrl || !config.webhookSecret) {
    // El lead nunca se pierde en silencio: queda en los logs de Vercel (05 §4).
    log.error('[lead] webhook sin configurar; lead no registrado', JSON.stringify(payload));
    return { status: 'failed', reason: 'not_configured', whatsappUrl };
  }

  const sent = await sendToWebhook(config.webhookUrl, config.webhookSecret, payload, config.fetch ?? fetch, log);
  if (!sent) {
    log.error('[lead] el Apps Script no confirmó; lead no registrado', JSON.stringify(payload));
    return { status: 'failed', reason: 'webhook', whatsappUrl };
  }
  return { status: 'ok', id, whatsappUrl };
}

/**
 * POST al Apps Script. Reintenta una vez (mismo id: el script no duplica) solo si hubo
 * error de red / timeout o respondió `busy`. Cualquier otra respuesta se toma como definitiva.
 */
async function sendToWebhook(
  url: string,
  secret: string,
  lead: Record<string, unknown>,
  doFetch: typeof fetch,
  log: Pick<Console, 'error' | 'warn'>,
): Promise<boolean> {
  const body = JSON.stringify({ secret, lead });
  for (const timeout of WEBHOOK_TIMEOUTS_MS) {
    let data: { ok?: boolean; error?: string; mail?: boolean } | null = null;
    try {
      const res = await doFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        redirect: 'follow',
        signal: AbortSignal.timeout(timeout),
      });
      data = await res.json().catch(() => null);
      if (!data) {
        log.error(`[lead] respuesta no JSON del Apps Script (HTTP ${res.status}). ¿URL /exec y acceso "Cualquier usuario"?`);
        return false;
      }
    } catch (err) {
      log.warn('[lead] error de red con el Apps Script', String(err));
      continue;
    }
    if (data.ok) {
      if (data.mail === false) log.warn('[lead] guardado en la planilla, pero el mail de aviso falló', lead.id);
      return true;
    }
    if (data.error !== 'busy') {
      log.error('[lead] el Apps Script rechazó el lead:', data.error);
      return false;
    }
  }
  return false;
}
