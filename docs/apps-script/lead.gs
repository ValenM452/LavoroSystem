/**
 * LAVORO — Receptor de leads B2B (05 §3–4, T08).
 *
 * Se pega a mano en el editor de Apps Script de la Sheet "LAVORO — Leads"
 * (Extensiones → Apps Script). Pasos completos en docs/apps-script/README.md.
 *
 * Contrato con /api/lead (POST, Content-Type: application/json):
 *   { "secret": "<LEAD_WEBHOOK_SECRET>", "lead": { id?, nombre, empresa, telefono, ... } }
 *
 * El secreto viaja en el cuerpo y no en un header: Apps Script no expone los
 * headers de la request a doPost(e), así que `X-Lavoro-Secret` no se puede leer.
 *
 * Respuesta (siempre HTTP 200, Apps Script no permite elegir el código):
 *   { ok: true, id, mail: true|false, duplicado?: true }
 *   { ok: false, error: "unauthorized" | "invalid" | "busy" | "server" }
 *
 * Propiedades del script (Configuración del proyecto → Propiedades del script):
 *   LEAD_WEBHOOK_SECRET  obligatoria. Igual a la variable de entorno de Vercel.
 *   LEAD_NOTIFY_EMAIL    opcional. Por defecto lavorouniformes@gmail.com.
 */

var SHEET_LEADS = 'Leads';
var SHEET_KPIS = 'KPIs';
var DEFAULT_NOTIFY_EMAIL = 'lavorouniformes@gmail.com';

/**
 * Orden de columnas de 05 §3. `estado` … `notas` las completa el negocio a mano.
 * `posible_duplicado` (docs/10 §7.2) va al final para no correr las columnas de una planilla que ya tiene datos.
 */
var COLUMNS = [
  'id', 'fecha', 'nombre', 'empresa', 'telefono', 'email', 'localidad', 'rubro',
  'cantidad', 'productos', 'personalizacion', 'plazo', 'comentario', 'pagina',
  'utm_source', 'utm_medium', 'utm_campaign', 'referrer',
  'estado', 'responsable', 'fecha_contacto', 'monto_cotizado', 'resultado', 'notas',
  'posible_duplicado',
];
var MANUAL_COLUMNS = ['estado', 'responsable', 'fecha_contacto', 'monto_cotizado', 'resultado', 'notas'];
var ESTADOS = ['Nuevo', 'Contactado', 'Cotizado', 'Ganado', 'Perdido', 'Descartado'];
var REQUIRED = ['nombre', 'empresa', 'telefono'];
var MAX_LEN = { comentario: 1000, referrer: 500, pagina: 300 };
/** Ventana para marcar un lead como posible duplicado (mismo teléfono). */
var DUPLICADO_DIAS = 30;
/** Un lead "Nuevo" se pinta de rojo claro cuando pasa este tiempo sin contactar (objetivo interno, docs/10 §7.2). */
var ALERTA_HORAS = 24;
var COLOR_ALERTA = '#f4cccc';
var DEFAULT_MAX_LEN = 200;

// ─── Web App ────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var body = parseBody_(e);
    if (!body || !isAuthorized_(body.secret)) return json_({ ok: false, error: 'unauthorized' });

    var lead = sanitizeLead_(body.lead);
    if (!lead) return json_({ ok: false, error: 'invalid' });

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json_({ ok: false, error: 'busy' });
    try {
      var sheet = getLeadsSheet_();
      // /api/lead puede reintentar: si el id ya está, no se duplica la fila ni el mail.
      if (findRowById_(sheet, lead.id)) return json_({ ok: true, id: lead.id, mail: false, duplicado: true });
      appendLead_(sheet, lead);
    } finally {
      lock.releaseLock();
    }

    var mailOk = sendNotification_(lead);
    return json_({ ok: true, id: lead.id, mail: mailOk });
  } catch (err) {
    console.error('doPost: ' + (err && err.stack ? err.stack : err));
    return json_({ ok: false, error: 'server' });
  }
}

/** Verificación rápida de que la URL publicada responde. No devuelve datos. */
function doGet() {
  return json_({ ok: true, service: 'lavoro-leads' });
}

// ─── Lead ───────────────────────────────────────────────────────────────────

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  try {
    return JSON.parse(e.postData.contents);
  } catch (_) {
    return null;
  }
}

function isAuthorized_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty('LEAD_WEBHOOK_SECRET');
  if (!expected || typeof secret !== 'string' || secret.length !== expected.length) return false;
  var diff = 0;
  for (var i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}

/** Normaliza el payload. La validación completa la hace /api/lead con zod; acá solo lo mínimo. */
function sanitizeLead_(raw) {
  if (!raw || typeof raw !== 'object') return null;
  var lead = {};
  COLUMNS.forEach(function (col) {
    if (MANUAL_COLUMNS.indexOf(col) !== -1 || col === 'fecha') return;
    var value = raw[col];
    if (Array.isArray(value)) value = value.join(', ');
    value = value == null ? '' : String(value).trim();
    lead[col] = value.slice(0, MAX_LEN[col] || DEFAULT_MAX_LEN);
  });
  for (var i = 0; i < REQUIRED.length; i++) if (!lead[REQUIRED[i]]) return null;
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(lead.id)) lead.id = newId_();
  return lead;
}

function newId_() {
  var stamp = Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'yyyyMMdd-HHmmss');
  return 'L-' + stamp + '-' + Utilities.getUuid().slice(0, 4);
}

/**
 * Evita inyección de fórmulas: un texto que empieza con = + - @ se guarda como texto.
 * (El teléfono llega normalizado a 549…, sin "+".)
 */
function cell_(value) {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value;
}

function appendLead_(sheet, lead) {
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var duplicado = findDuplicado_(sheet, header, lead.telefono);
  lead.posible_duplicado = duplicado; // lo calcula el script; si vino en el payload se pisa.
  var row = header.map(function (col) {
    if (col === 'fecha') return new Date();
    if (col === 'estado') return 'Nuevo';
    if (col === 'posible_duplicado') return duplicado;
    if (MANUAL_COLUMNS.indexOf(col) !== -1) return '';
    return cell_(lead[col] == null ? '' : lead[col]);
  });
  sheet.appendRow(row);
}

/**
 * id del lead anterior con el mismo teléfono en los últimos DUPLICADO_DIAS días, o '' si no hay.
 * Solo marca: nunca descarta ni fusiona filas (lo decide quien atiende).
 */
function findDuplicado_(sheet, header, telefono) {
  var tel = String(telefono || '').replace(/\D/g, '');
  var last = sheet.getLastRow();
  var iTel = header.indexOf('telefono'), iFecha = header.indexOf('fecha'), iId = header.indexOf('id');
  if (!tel || last < 2 || iTel === -1 || iFecha === -1 || iId === -1) return '';
  var desde = Date.now() - DUPLICADO_DIAS * 24 * 60 * 60 * 1000;
  var values = sheet.getRange(2, 1, last - 1, header.length).getValues();
  for (var r = values.length - 1; r >= 0; r--) {
    var f = values[r][iFecha];
    if (!(f instanceof Date) || f.getTime() < desde) continue;
    if (String(values[r][iTel]).replace(/\D/g, '') === tel) return 'Sí — ' + values[r][iId];
  }
  return '';
}

function findRowById_(sheet, id) {
  if (sheet.getLastRow() < 2) return null;
  var idCol = colIndex_(sheet, 'id');
  var range = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1);
  return range.createTextFinder(id).matchEntireCell(true).findNext();
}

function sendNotification_(lead) {
  try {
    var to = PropertiesService.getScriptProperties().getProperty('LEAD_NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;
    var ss = getSpreadsheet_();
    var tel = lead.telefono.replace(/\D/g, '');
    // Primer contacto (docs/10 §7.3): link listo para tocar desde el celular. Completar el nombre antes de enviar.
    var primerContacto = 'Hola ' + lead.nombre + ', soy [tu nombre] de LAVORO. Recibimos tu pedido de cotización para ' +
      lead.empresa + '. Para armarte la propuesta, ¿me confirmás los talles aproximados y si tenés el logo en buena calidad?';
    var lines = [
      'RESPONDER POR WHATSAPP (mensaje de primer contacto ya escrito):',
      'https://wa.me/' + tel + '?text=' + encodeURIComponent(primerContacto),
      '',
      'Después de escribirle, en la planilla: estado = Contactado, fecha_contacto y responsable.',
      '',
      '──────────',
      'Entró una nueva solicitud de cotización desde la web.',
      '',
      'Nombre: ' + lead.nombre,
      'Empresa / institución: ' + lead.empresa,
      'WhatsApp: ' + lead.telefono,
      'Email: ' + (lead.email || '—'),
      'Localidad: ' + (lead.localidad || '—'),
      'Rubro: ' + (lead.rubro || '—'),
      'Personas a equipar: ' + (lead.cantidad || '—'),
      'Qué necesita: ' + (lead.productos || '—'),
      'Personalización: ' + (lead.personalizacion || '—'),
      'Para cuándo: ' + (lead.plazo || '—'),
      'Comentarios: ' + (lead.comentario || '—'),
      '',
      'Origen: ' + (lead.pagina || '—') + (lead.utm_source ? ' · utm_source=' + lead.utm_source : ''),
      'ID: ' + lead.id,
      (lead.posible_duplicado ? 'Posible duplicado de: ' + lead.posible_duplicado : ''),
      '',
      'Planilla: ' + ss.getUrl(),
    ];
    var options = { name: 'Web LAVORO' };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) options.replyTo = lead.email;
    MailApp.sendEmail(to, 'Nuevo lead B2B — ' + lead.empresa + ' (' + (lead.rubro || 'sin rubro') + ')', lines.join('\n'), options);
    return true;
  } catch (err) {
    // La fila ya quedó guardada: un fallo de mail no hace fallar el lead.
    console.error('sendNotification_: ' + err);
    return false;
  }
}

// ─── Planilla ───────────────────────────────────────────────────────────────

function getSpreadsheet_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getLeadsSheet_() {
  var sheet = getSpreadsheet_().getSheetByName(SHEET_LEADS);
  if (!sheet) throw new Error('Falta la pestaña "' + SHEET_LEADS + '". Ejecutá configurarPlanilla().');
  return sheet;
}

function colIndex_(sheet, name) {
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var i = header.indexOf(name);
  if (i === -1) throw new Error('Falta la columna "' + name + '" en ' + SHEET_LEADS + '.');
  return i + 1;
}

function colLetter_(index) {
  var s = '';
  for (var n = index; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

/**
 * Ejecutar UNA vez desde el editor (menú ▶ Ejecutar). Crea o completa:
 * pestaña Leads (encabezados, formato, validación de estado) y pestaña KPIs (fórmulas).
 * Es seguro volver a ejecutarla: no borra filas.
 */
function configurarPlanilla() {
  var ss = getSpreadsheet_();
  ss.setSpreadsheetTimeZone('America/Argentina/Buenos_Aires');

  var leads = ss.getSheetByName(SHEET_LEADS) || ss.insertSheet(SHEET_LEADS, 0);
  leads.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
  leads.setFrozenRows(1);
  leads.setFrozenColumns(4);

  var col = function (name) { return COLUMNS.indexOf(name) + 1; };
  var whole = function (name) { return leads.getRange(2, col(name), leads.getMaxRows() - 1, 1); };

  whole('fecha').setNumberFormat('dd/mm/yyyy hh:mm');
  whole('fecha_contacto').setNumberFormat('dd/mm/yyyy');
  whole('monto_cotizado').setNumberFormat('$ #,##0');
  whole('telefono').setNumberFormat('@');
  whole('estado').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build()
  );
  // Columnas que completa el negocio, resaltadas.
  MANUAL_COLUMNS.forEach(function (name) { leads.getRange(1, col(name)).setBackground('#fff2cc'); });
  configurarAlerta_(leads, col);

  configurarKpis_(ss, col);
  SpreadsheetApp.flush();
  console.log('Planilla lista: ' + ss.getUrl());
}

/**
 * Formato condicional (docs/10 §7.2): fila en rojo claro si sigue "Nuevo" pasadas ALERTA_HORAS desde `fecha`.
 * Reemplaza solo la regla propia (se reconoce por el color), así se puede volver a ejecutar sin duplicarla.
 */
function configurarAlerta_(leads, col) {
  var e = colLetter_(col('estado')), f = colLetter_(col('fecha'));
  var range = leads.getRange(2, 1, leads.getMaxRows() - 1, COLUMNS.length);
  var regla = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($' + e + '2="Nuevo",$' + f + '2<>"",NOW()-$' + f + '2>' + ALERTA_HORAS + '/24)')
    .setBackground(COLOR_ALERTA)
    .setRanges([range])
    .build();
  var otras = leads.getConditionalFormatRules().filter(function (r) {
    var b = r.getBooleanCondition();
    return !(b && String(b.getBackground() || '').toLowerCase() === COLOR_ALERTA);
  });
  leads.setConditionalFormatRules(otras.concat([regla]));
}

function configurarKpis_(ss, col) {
  var kpis = ss.getSheetByName(SHEET_KPIS) || ss.insertSheet(SHEET_KPIS);
  kpis.clear();
  var L = function (name) { var c = colLetter_(col(name)); return SHEET_LEADS + '!' + c + '2:' + c; };
  var id = L('id'), estado = L('estado'), monto = L('monto_cotizado');
  var all = SHEET_LEADS + '!A1:' + colLetter_(COLUMNS.length);
  var q = function (name) { return 'Col' + col(name); };

  var rows = [
    ['Resumen', ''],
    ['Leads totales', '=COUNTA(' + id + ')'],
    ['Nuevos (sin contactar)', '=COUNTIF(' + estado + ',"Nuevo")'],
    ['% contactados', '=IFERROR(1-B3/B2,0)'],
    ['Ganados', '=COUNTIF(' + estado + ',"Ganado")'],
    ['Perdidos', '=COUNTIF(' + estado + ',"Perdido")'],
    ['Tasa de cierre (ganados / cerrados)', '=IFERROR(B5/(B5+B6),0)'],
    ['Monto ganado', '=SUMIF(' + estado + ',"Ganado",' + monto + ')'],
    // Objetivo interno (docs/10 §7.2): contactar antes de que pase un día. No se publica.
    ['Contactados al día siguiente o antes', '=SUMPRODUCT((' + L('fecha_contacto') + '<>"")*(' + L('fecha_contacto') + '-INT(' + L('fecha') + ')<=1))'],
    ['% contactados al día siguiente o antes', '=IFERROR(B9/COUNT(' + L('fecha_contacto') + '),0)'],
    ['Posibles duplicados', '=COUNTIF(' + L('posible_duplicado') + ',"Sí*")'],
  ];
  kpis.getRange(1, 1, rows.length, 2).setValues(rows);
  kpis.getRange('A1').setFontWeight('bold');
  kpis.getRange('B4').setNumberFormat('0%');
  kpis.getRange('B7').setNumberFormat('0%');
  kpis.getRange('B8').setNumberFormat('$ #,##0');
  kpis.getRange('B10').setNumberFormat('0%');

  // Tablas agrupadas (se actualizan solas con cada fila nueva).
  kpis.getRange('D1').setValue('Leads por semana (desde el lunes)').setFontWeight('bold');
  kpis.getRange('D2').setFormula(
    '=IFERROR(QUERY(ARRAYFORMULA(IF(' + L('fecha') + '="",,TEXT(INT(' + L('fecha') + ')-WEEKDAY(' + L('fecha') + ',3),"yyyy-mm-dd"))),' +
    '"select Col1, count(Col1) where Col1 is not null group by Col1 order by Col1 desc label Col1 \'Semana\', count(Col1) \'Leads\'",0),"Sin datos")'
  );

  kpis.getRange('G1').setValue('Leads por rubro').setFontWeight('bold');
  kpis.getRange('G2').setFormula(
    '=IFERROR(QUERY({' + all + '},"select ' + q('rubro') + ', count(' + q('id') + ') where ' + q('id') + ' is not null group by ' + q('rubro') +
    ' order by count(' + q('id') + ') desc label ' + q('rubro') + ' \'Rubro\', count(' + q('id') + ') \'Leads\'",1),"Sin datos")'
  );

  kpis.getRange('J1').setValue('Leads por origen (utm_source; vacío = directo)').setFontWeight('bold');
  kpis.getRange('J2').setFormula(
    '=IFERROR(QUERY({' + all + '},"select ' + q('utm_source') + ', count(' + q('id') + ') where ' + q('id') + ' is not null group by ' + q('utm_source') +
    ' order by count(' + q('id') + ') desc label ' + q('utm_source') + ' \'Origen\', count(' + q('id') + ') \'Leads\'",1),"Sin datos")'
  );

  kpis.getRange('M1').setValue('Leads por estado').setFontWeight('bold');
  kpis.getRange(2, 13, ESTADOS.length, 2).setValues(
    ESTADOS.map(function (s) { return [s, '=COUNTIF(' + estado + ',"' + s + '")']; })
  );

  kpis.setColumnWidth(1, 260);
}

// ─── Prueba manual (E3) ─────────────────────────────────────────────────────

/**
 * Simula un POST con el secreto real y un lead marcado PRUEBA.
 * Escribe una fila y manda el mail: borrá la fila después de verificar.
 */
function probarLead() {
  var secret = PropertiesService.getScriptProperties().getProperty('LEAD_WEBHOOK_SECRET');
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        secret: secret,
        lead: {
          nombre: 'PRUEBA — borrar',
          empresa: 'PRUEBA',
          telefono: '5493825000000',
          localidad: 'PRUEBA',
          rubro: 'Otras empresas',
          cantidad: '1–10',
          productos: ['Pantalones', 'Camisas'],
          personalizacion: 'No sé todavía',
          comentario: '=SUMA(1;1) ← debe verse como texto, no como fórmula',
          pagina: '/apps-script/probarLead',
        },
      }),
    },
  });
  console.log(res.getContent());
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
