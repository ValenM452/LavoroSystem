# 05 — Sistema B2B / B2C

## 1. Arquitectura

```
                 ┌──────────────── lavoro.com.ar (Astro · Vercel) ───────────────┐
Visitante ──────▶│  /  ·  /empresas  ·  /legales/*                                │
                 │     │ B2C: clic categoría ───────────────┐                    │
                 │     │ B2B: formulario ─▶ POST /api/lead  │                    │
                 └─────┼───────────────────────┬────────────┼────────────────────┘
                       │                       │            ▼
                       │                       │   tienda.lavoro.com.ar (Tiendanube)
                       │                       │   catálogo · carrito · checkout · stock
                       │                       │   tabla de precios mayorista · envíos
                       │                       ▼
                       │          Google Apps Script (webhook, secreto compartido)
                       │             ├─▶ Google Sheet "LAVORO — Leads"
                       │             └─▶ Mail a lavorouniformes@gmail.com
                       ▼
                 wa.me/5493825529781 (resumen prellenado)
```

- **B2C** se resuelve 100 % en Tiendanube. La landing solo deriva tráfico con UTM: `?utm_source=landing&utm_medium=referral&utm_campaign=<seccion>`.
- **B2B** tiene dos caminos: formulario (lead registrado) y WhatsApp directo (más rápido, menos trazable). Se mide cuál usa cada uno.
- **Precios mayoristas en tienda**: tablas de precios de Tiendanube (desde plan Impulso: 1 tabla; Escala: 3). Condiciones por monto mínimo y/o cantidad mínima; descuentos por catálogo, categoría o producto. Se configura a mano, no por código.
- **Subdominio de la tienda:** verificar con Tiendanube que acepte `tienda.lavoro.com.ar`. Si no, ver plan B en `02` §4.

## 2. Formulario de cotización

| Campo | `name` | Tipo | Obligatorio | Notas |
|---|---|---|---|---|
| Nombre y apellido | `nombre` | text | Sí | 2–80 caracteres |
| Empresa / institución | `empresa` | text | Sí | — |
| WhatsApp | `telefono` | tel | Sí | Normalizar a `549` + código de área + número; aceptar con o sin 0/15 |
| Email | `email` | email | No | — |
| Localidad y provincia | `localidad` | text | Sí | Para cotizar envío |
| Rubro | `rubro` | select | Sí | Lista de `01` §6 + "Otro". Precarga desde `?rubro=` |
| Cantidad de personas a equipar | `cantidad` | select | Sí | 1–10 · 11–30 · 31–100 · Más de 100 |
| Qué necesitás | `productos[]` | checkbox múltiple | Sí (≥1) | Pantalones · Camisas · Calzado de seguridad · Overoles · Elementos de seguridad · Uniformes · Otro |
| Personalización | `personalizacion` | radio | Sí | Bordado · Estampado · Ambos · No · No sé todavía |
| ¿Para cuándo? | `plazo` | select | No | Lo antes posible · Este mes · Próximos 3 meses · Solo averiguo |
| Comentarios | `comentario` | textarea | No | Máx. 1000 caracteres |
| Consentimiento | `acepta` | checkbox | Sí | "Acepto que LAVORO me contacte por esta solicitud. Ver política de privacidad." |
| Honeypot | `website` | text oculto | — | Si viene con valor → descartar en silencio |
| Tiempo de llenado | `t` | hidden | — | Timestamp al cargar; si se envía en < 3 s → descartar |
| Atribución | `utm_*`, `pagina`, `referrer` | hidden | — | Capturados de la URL / `document.referrer` |

UX:
- Validación en cliente y en servidor (mismo esquema, `zod`).
- Errores debajo de cada campo, en texto. Foco al primer error.
- Botón con estado "Enviando…" y deshabilitado durante el envío.
- Funciona sin JS (POST normal + página de respuesta) — mejora progresiva.

## 3. Google Sheet "LAVORO — Leads"

Pestaña `Leads` (una fila por solicitud):

`id` · `fecha` · `nombre` · `empresa` · `telefono` · `email` · `localidad` · `rubro` · `cantidad` · `productos` · `personalizacion` · `plazo` · `comentario` · `pagina` · `utm_source` · `utm_medium` · `utm_campaign` · `referrer` · **`estado`** · **`responsable`** · **`fecha_contacto`** · **`monto_cotizado`** · **`resultado`** · **`notas`**

Las columnas en negrita las completa el negocio a mano. `estado` con validación de datos: Nuevo · Contactado · Cotizado · Ganado · Perdido · Descartado.

Pestaña `KPIs` (fórmulas, sin código): leads por semana, por rubro, por origen; % contactados; tasa de cierre; monto ganado.

Este es el "sistema B2B" del lanzamiento: simple, legible por tu papá desde el celular, y exportable cuando haya un CRM real.

## 4. Endpoint `/api/lead`

- `POST`, `Content-Type: application/json` o `application/x-www-form-urlencoded`.
- Pasos: parsear → honeypot y tiempo → validar con `zod` → normalizar teléfono → `fetch` al Apps Script con header `X-Lavoro-Secret: ${LEAD_WEBHOOK_SECRET}` → responder `{ ok: true, whatsappUrl }`.
- `whatsappUrl`: `https://wa.me/5493825529781?text=` + resumen: `Hola LAVORO, soy {nombre} de {empresa} ({rubro}). Necesito cotizar {productos} para {cantidad} personas.`
- Si el Apps Script falla: responder `{ ok: false }` y mostrar en el front el botón de WhatsApp como respaldo. El lead **nunca** se pierde en silencio: loguear el payload (sin datos sensibles extra) en los logs de Vercel.
- Rate limit simple por IP (memoria de la función, 5 por 10 min) — suficiente para el lanzamiento.

Variables de entorno (`.env.example`):

```
LEAD_WEBHOOK_URL=
LEAD_WEBHOOK_SECRET=
PUBLIC_GA4_ID=
PUBLIC_META_PIXEL_ID=
PUBLIC_SITE_URL=
```

Apps Script (`docs/apps-script/lead.gs`, lo pega a mano el dueño de la cuenta Google): `doPost(e)` → valida secreto → `appendRow` en `Leads` con `estado = "Nuevo"` → `MailApp.sendEmail` a lavorouniformes@gmail.com con asunto `Nuevo lead B2B — {empresa} ({rubro})` → `ContentService` JSON.

## 5. Medición

| Evento | Dónde | GA4 | Meta Pixel |
|---|---|---|---|
| Vista de página | Todas | `page_view` | `PageView` |
| Clic a tienda | Hero, categorías, nav | `click_tienda` (`seccion`, `categoria`) | — |
| Clic WhatsApp empresas | Todos los CTA B2B | `click_whatsapp` (`tipo: b2b`, `seccion`) | `Contact` |
| Clic WhatsApp local | Local, footer | `click_whatsapp` (`tipo: local`) | `Contact` |
| Inicio de formulario | Primer foco en el form | `form_start` | — |
| Lead enviado | Respuesta `ok` | `generate_lead` (`rubro`, `cantidad`) | `Lead` |

- Scripts cargados con `defer`/después de la interacción para no afectar LCP.
- Implementar con una función `track(evento, params)` única en `src/lib/track.ts`.
- En Tiendanube: activar la integración nativa con Meta (catálogo + pixel) y Google Analytics desde el panel.

## 6. Fotografía requerida

| Uso | Cantidad | Formato | Fuente |
|---|---|---|---|
| Hero home | 1 desktop (2400×1350) + 1 mobile (1080×1600) | Horizontal / vertical | Stock libre (ambiental) o foto propia |
| Hero /empresas | 1 + 1 | Ídem | Stock libre |
| Rubros | 10 (1600×1200) | Horizontal | Stock libre, sin logos de empresas visibles |
| Categorías | 8 (1200×1500) | Vertical | **Propias** (productos reales del local) |
| Personalización | 1 banda + 2 detalle | Horizontal | Propias si existe bordado; si no, detalle textil |
| Local | 2–4 | Horizontal | **Propias** |
| Productos Tiendanube | 3 por producto, 1:1 o 4:5, fondo liso | — | **Propias** |

Regla: las fotos de stock son de ambiente (una obra, un campo, un taller). Nunca se rotulan como "nuestros clientes" ni muestran logos de terceros.

## 7. Legales (a validar con contador antes de publicar)

En landing y en Tiendanube:
- Términos y condiciones · Política de privacidad (Ley 25.326 de Protección de Datos Personales) · Cambios y devoluciones.
- **Botón de arrepentimiento** visible en la tienda (Resolución 424/2020 de la Secretaría de Comercio Interior). Verificar si Tiendanube lo trae nativo.
- Link a Defensa del Consumidor.
- **Data Fiscal (ARCA)** con el QR del titular del CUIT.

Codex arma la estructura y textos base marcados `[[REVISAR CONTADOR]]`; no redacta como asesoría legal definitiva.
