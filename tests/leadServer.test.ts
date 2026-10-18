import { describe, expect, it, vi } from 'vitest';
import { createRateLimiter, handleLead, isSpam, MIN_FILL_MS, readFields, whatsappUrlFor, type LeadConfig, type LeadFields } from '../src/lib/leadServer';
import { validInput } from './fixtures';

const NOW = Date.UTC(2026, 9, 23, 15, 0, 0);

const fields = (over: Partial<LeadFields> = {}): LeadFields => ({
  ...validInput(),
  website: '',
  t: String(NOW - 60_000),
  pagina: '/empresas',
  utm_source: 'instagram',
  utm_medium: '',
  utm_campaign: '',
  referrer: '',
  ...over,
});

const silentLog = () => ({ error: vi.fn(), warn: vi.fn() });
const jsonResponse = (body: unknown) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });

const config = (over: Partial<LeadConfig> = {}): LeadConfig => ({
  webhookUrl: 'https://script.google.com/macros/s/x/exec',
  webhookSecret: 's3cret',
  rateLimiter: createRateLimiter(),
  now: () => NOW,
  log: silentLog(),
  fetch: vi.fn(async () => jsonResponse({ ok: true, id: 'L-x', mail: true })) as unknown as typeof fetch,
  ...over,
});

describe('readFields', () => {
  it('lee un POST de formulario sin JS', () => {
    const fd = new FormData();
    fd.set('nombre', 'Ana');
    fd.append('productos[]', 'Pantalones');
    fd.append('productos[]', 'Camisas');
    fd.set('acepta', 'on');
    fd.set('referrer', 'x'.repeat(900));
    const f = readFields(fd);
    expect(f.nombre).toBe('Ana');
    expect(f.productos).toEqual(['Pantalones', 'Camisas']);
    expect(f.acepta).toBe(true);
    expect(f.email).toBe('');
    expect(f.referrer).toHaveLength(500);
  });

  it('lee un JSON del cliente e ignora tipos raros', () => {
    const f = readFields({ nombre: 'Ana', productos: ['Overoles'], acepta: true, empresa: { x: 1 }, t: 123 });
    expect(f.productos).toEqual(['Overoles']);
    expect(f.acepta).toBe(true);
    expect(f.empresa).toBe('');
    expect(f.t).toBe('123');
  });
});

describe('isSpam', () => {
  it('honeypot con valor', () => expect(isSpam({ website: 'http://spam', t: '' }, NOW)).toBe(true));
  it('enviado en menos de 3 s', () => expect(isSpam({ website: '', t: String(NOW - MIN_FILL_MS + 1) }, NOW)).toBe(true));
  it('enviado con tiempo normal', () => expect(isSpam({ website: '', t: String(NOW - 20_000) }, NOW)).toBe(false));
  it('sin JS (t vacío) no se puede medir', () => expect(isSpam({ website: '', t: '' }, NOW)).toBe(false));
});

describe('createRateLimiter', () => {
  it('permite 5 por IP cada 10 min', () => {
    const rl = createRateLimiter();
    for (let i = 0; i < 5; i++) expect(rl.hit('1.1.1.1', NOW + i)).toBe(true);
    expect(rl.hit('1.1.1.1', NOW + 10)).toBe(false);
    expect(rl.hit('2.2.2.2', NOW + 10)).toBe(true);
    expect(rl.hit('1.1.1.1', NOW + 10 * 60_000)).toBe(true);
  });
});

describe('whatsappUrlFor', () => {
  it('arma el resumen de 05 §4 con el nombre largo del rubro', () => {
    const url = whatsappUrlFor({ nombre: 'Ana', empresa: 'Finca', rubro: 'campos-fincas', productos: ['Pantalones', 'Camisas'], cantidad: '11–30' });
    expect(url.startsWith('https://wa.me/5493825529781?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(
      'Hola LAVORO, soy Ana de Finca (Campos y fincas). Necesito cotizar Pantalones, Camisas para 11–30 personas.',
    );
  });
});

describe('handleLead', () => {
  it('envía al Apps Script con el secreto en el cuerpo y devuelve ok', async () => {
    const cfg = config();
    const r = await handleLead(fields(), '1.1.1.1', cfg);
    expect(r.status).toBe('ok');
    const [url, init] = (cfg.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe(cfg.webhookUrl);
    const body = JSON.parse(init.body);
    expect(body.secret).toBe('s3cret');
    expect(body.lead).toMatchObject({ telefono: '5493825529781', rubro: 'Campos y fincas', productos: ['Pantalones', 'Camisas'], pagina: '/empresas', utm_source: 'instagram' });
    expect(body.lead.id).toMatch(/^L-20261023-[0-9a-f]{8}$/);
    expect(body.lead).not.toHaveProperty('acepta');
    expect(body.lead).not.toHaveProperty('website');
  });

  it('descarta spam en silencio, sin llamar al webhook', async () => {
    const cfg = config();
    expect((await handleLead(fields({ website: 'x' }), 'ip', cfg)).status).toBe('discarded');
    expect(cfg.fetch).not.toHaveBeenCalled();
  });

  it('devuelve errores por campo', async () => {
    const r = await handleLead(fields({ telefono: '123', productos: [] }), 'ip', config());
    expect(r).toEqual({ status: 'invalid', errors: { telefono: expect.any(String), productos: expect.any(String) } });
  });

  it('corta al sexto envío de la misma IP', async () => {
    const cfg = config();
    for (let i = 0; i < 5; i++) await handleLead(fields(), 'ip', cfg);
    expect((await handleLead(fields(), 'ip', cfg)).status).toBe('rate_limited');
  });

  it('sin LEAD_WEBHOOK_URL responde respaldo WhatsApp y loguea el lead', async () => {
    const cfg = config({ webhookUrl: '' });
    const r = await handleLead(fields(), 'ip', cfg);
    expect(r).toMatchObject({ status: 'failed', reason: 'not_configured' });
    expect(r.status === 'failed' && r.whatsappUrl).toContain('Finca%20Los%20%C3%81lamos');
    expect(cfg.log!.error).toHaveBeenCalledWith(expect.stringContaining('sin configurar'), expect.stringContaining('5493825529781'));
    expect(cfg.fetch).not.toHaveBeenCalled();
  });

  it('reintenta una vez con el mismo id si el script está ocupado', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ ok: false, error: 'busy' }))
      .mockResolvedValueOnce(jsonResponse({ ok: true, id: 'L-x', mail: true }));
    const r = await handleLead(fields(), 'ip', config({ fetch: fetchMock as unknown as typeof fetch }));
    expect(r.status).toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const ids = fetchMock.mock.calls.map(([, init]) => JSON.parse(init.body).lead.id);
    expect(ids[0]).toBe(ids[1]);
  });

  it('reintenta una vez ante error de red y después se rinde', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    const r = await handleLead(fields(), 'ip', config({ fetch: fetchMock as unknown as typeof fetch }));
    expect(r).toMatchObject({ status: 'failed', reason: 'webhook' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('no reintenta si el script rechaza el secreto', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: false, error: 'unauthorized' }));
    const r = await handleLead(fields(), 'ip', config({ fetch: fetchMock as unknown as typeof fetch }));
    expect(r.status).toBe('failed');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('trata una respuesta HTML (URL o acceso mal configurado) como falla', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('<html>Sign in</html>', { status: 200 }));
    const r = await handleLead(fields(), 'ip', config({ fetch: fetchMock as unknown as typeof fetch }));
    expect(r.status).toBe('failed');
  });

  it('si el mail falla pero la fila se guardó, es éxito con aviso', async () => {
    const cfg = config({ fetch: vi.fn(async () => jsonResponse({ ok: true, id: 'L-x', mail: false })) as unknown as typeof fetch });
    expect((await handleLead(fields(), 'ip', cfg)).status).toBe('ok');
    expect(cfg.log!.warn).toHaveBeenCalled();
  });
});
