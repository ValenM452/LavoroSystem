/**
 * Receptor local de cotizaciones: imita al Apps Script (docs/apps-script/lead.gs) para probar
 * el formulario de punta a punta sin la planilla de Google. Solo para desarrollo.
 *
 *   npm run webhook:local        → http://127.0.0.1:4500
 *
 * - POST /exec  mismo contrato que el Apps Script ({ secret, lead } → { ok, id } / { ok:false, error }).
 * - GET  /      "planilla local": tabla con las cotizaciones recibidas, la más nueva arriba.
 * Guarda en data/leads-local/leads.csv (no se versiona: tiene datos personales).
 * Lee LEAD_WEBHOOK_SECRET de .env.development (ver .env.example).
 */
import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'data', 'leads-local', 'leads.csv');
const PORT = Number(process.env.WEBHOOK_LOCAL_PORT || 4500);
const SECRET = process.env.LEAD_WEBHOOK_SECRET || '';

// Mismas columnas y reglas que lead.gs (05 §3).
const COLUMNS = ['id', 'fecha', 'nombre', 'empresa', 'telefono', 'email', 'localidad', 'rubro', 'cantidad', 'productos', 'personalizacion', 'plazo', 'comentario', 'pagina', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'estado'];
const REQUIRED = ['nombre', 'empresa', 'telefono'];
const MAX_LEN = { comentario: 1000, referrer: 500, pagina: 300 };

if (!SECRET) {
  console.error('Falta LEAD_WEBHOOK_SECRET. Copiá el bloque "Desarrollo local" de .env.example en .env.development.');
  process.exit(1);
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
/** Como en la planilla: un texto que empieza con = + - @ se guarda con ' adelante (no es fórmula). */
const safe = (v) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

function readRows() {
  if (!existsSync(FILE)) return [];
  const rows = [];
  const text = readFileSync(FILE, 'utf8');
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  const [header, ...data] = rows;
  return header ? data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))) : [];
}

function saveLead(lead) {
  const rows = readRows();
  if (lead.id && rows.some((r) => r.id === lead.id)) return { ok: true, id: lead.id, duplicado: true };
  const id = lead.id || `L-local-${Date.now()}`;
  const record = { ...lead, id, fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }), estado: 'Nuevo' };
  record.productos = Array.isArray(record.productos) ? record.productos.join(', ') : record.productos;
  mkdirSync(dirname(FILE), { recursive: true });
  if (!existsSync(FILE)) appendFileSync(FILE, COLUMNS.map(csvCell).join(',') + '\n');
  const line = COLUMNS.map((c) => csvCell(safe(String(record[c] ?? '').slice(0, MAX_LEN[c] ?? 200)))).join(',');
  appendFileSync(FILE, line + '\n');
  console.log(`[webhook-local] cotización ${id}: ${record.nombre} (${record.empresa}) · ${record.rubro}`);
  return { ok: true, id };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function planilla() {
  const rows = readRows().reverse();
  const cols = ['fecha', 'nombre', 'empresa', 'telefono', 'email', 'localidad', 'rubro', 'cantidad', 'productos', 'personalizacion', 'plazo', 'comentario', 'pagina', 'estado'];
  const body = rows.length
    ? rows.map((r) => `<tr>${cols.map((c) => `<td>${esc(r[c] ?? '')}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${cols.length}" class="empty">Todavía no llegó ninguna cotización. Mandá una desde /empresas#cotizar.</td></tr>`;
  return `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Planilla local de cotizaciones</title>
<style>
body{margin:0;font:15px/1.5 system-ui,sans-serif;background:#1E2024;color:#fff}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:20px 24px;background:#9C1C33}
h1{margin:0;font-size:20px}p{margin:0;color:#F2D9DE}
a{color:#1E2024;background:#E9B949;padding:10px 18px;border-radius:999px;font-weight:700;text-decoration:none}
.wrap{overflow:auto;padding:16px 24px}
table{border-collapse:collapse;min-width:100%;background:#26292E;border-radius:10px;overflow:hidden}
th,td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.1);vertical-align:top;white-space:nowrap}
td:nth-child(12){white-space:normal;min-width:240px}
th{background:#33373D;color:#F3D27C;font-weight:600}
.empty{color:#A3A6AC;text-align:center;padding:32px}
</style></head><body>
<header><div><h1>Planilla local de cotizaciones</h1><p>${rows.length} recibida${rows.length === 1 ? '' : 's'} · Solo desarrollo: en producción llegan a la Google Sheet.</p></div><a href="/">Actualizar</a></header>
<div class="wrap"><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>
</body></html>`;
}

const send = (res, status, type, body) => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};

createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/exec')) return send(res, 200, 'text/html; charset=utf-8', planilla());
  if (req.method !== 'POST' || req.url !== '/exec') return send(res, 404, 'text/plain; charset=utf-8', 'No encontrado');

  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 64_000) req.destroy();
  });
  req.on('end', () => {
    // Igual que Apps Script: siempre HTTP 200, el resultado va en `ok`.
    const json = (obj) => send(res, 200, 'application/json; charset=utf-8', JSON.stringify(obj));
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: 'invalid' });
    }
    if (!data || data.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });
    const lead = data.lead || {};
    if (REQUIRED.some((k) => !String(lead[k] ?? '').trim())) return json({ ok: false, error: 'invalid' });
    try {
      json(saveLead(lead));
    } catch (err) {
      console.error('[webhook-local]', err);
      json({ ok: false, error: 'server' });
    }
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`[webhook-local] escuchando en http://127.0.0.1:${PORT} (planilla local en /, receptor en /exec)`);
});
