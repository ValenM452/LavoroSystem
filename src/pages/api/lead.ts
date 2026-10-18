/**
 * POST /api/lead (05 §4, T08). Única función server del sitio.
 * - Con JS: JSON → responde JSON `{ ok, whatsappUrl, … }`.
 * - Sin JS: formulario normal → redirección 303 a /cotizacion/enviada o /cotizacion/no-enviada.
 */
import type { APIRoute } from 'astro';
import { LEAD_WEBHOOK_SECRET, LEAD_WEBHOOK_URL } from 'astro:env/server';
import { createRateLimiter, handleLead, readFields, type LeadResult } from '../../lib/leadServer';
import { site } from '../../config/site';

export const prerender = false;

// Vive mientras la instancia de la función esté caliente: suficiente para el lanzamiento.
const rateLimiter = createRateLimiter();

const STATUS: Record<LeadResult['status'], number> = { ok: 200, discarded: 200, invalid: 400, rate_limited: 429, failed: 502 };

export const POST: APIRoute = async (context) => {
  const { request } = context;
  const wantsJson = (request.headers.get('content-type') ?? '').includes('application/json');

  let fields;
  try {
    fields = readFields(wantsJson ? await request.json() : await request.formData());
  } catch {
    return wantsJson ? json({ ok: false, error: 'bad_request' }, 400) : redirect(site.paths.leadError);
  }

  const result = await handleLead(fields, clientIp(request, () => context.clientAddress), {
    webhookUrl: LEAD_WEBHOOK_URL,
    webhookSecret: LEAD_WEBHOOK_SECRET,
    rateLimiter,
  });

  if (!wantsJson) return redirect(result.status === 'ok' || result.status === 'discarded' ? site.paths.leadOk : site.paths.leadError);

  switch (result.status) {
    case 'ok':
    case 'discarded':
      return json({ ok: true, whatsappUrl: result.whatsappUrl }, STATUS[result.status]);
    case 'invalid':
      return json({ ok: false, error: 'invalid', errors: result.errors }, STATUS.invalid);
    case 'rate_limited':
      return json({ ok: false, error: 'rate_limited', whatsappUrl: result.whatsappUrl }, STATUS.rate_limited);
    case 'failed':
      return json({ ok: false, error: result.reason, whatsappUrl: result.whatsappUrl }, STATUS.failed);
  }
};

/**
 * En Vercel `x-forwarded-for` lo pone la plataforma (no lo controla el cliente).
 * `clientAddress` se lee en un callback porque Astro lo define como getter que puede lanzar.
 */
function clientIp(request: Request, clientAddress: () => string | undefined): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  try {
    return clientAddress() ?? '';
  } catch {
    return '';
  }
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

const redirect = (location: string) => new Response(null, { status: 303, headers: { Location: location } });
