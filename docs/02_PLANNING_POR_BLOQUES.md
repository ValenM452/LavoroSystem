# 02 — Planning por bloques (18/10 → 28/10/2026)

> 10 días corridos. La definición original de "entregado" (tienda B2C+B2B, mega menú, cotizador, armador de uniformes, dashboard de métricas, Meta Ads, legales) es trabajo de 2–3 meses. Este plan separa lo que **sale el 28/10** de lo que **sale después**, sin que lo de después obligue a rehacer lo de ahora.

## 0. Arquitectura decidida (pendiente de OK del dueño)

| Pieza | Dónde vive | Quién la hace |
|---|---|---|
| Landing institucional + B2B (`/`, `/empresas`, legales) | Código (Astro) en Vercel, dominio raíz | Codex, con revisión humana |
| Formulario de cotización → leads | `/api/lead` → Google Apps Script → Google Sheet + mail | Codex + configuración manual de la Sheet |
| Catálogo, carrito, checkout, pagos, stock, envíos | Tiendanube | Manual (dueño / vos) |
| Precios mayoristas B2B en tienda | Tablas de precios de Tiendanube (requiere plan **Impulso** o superior) | Manual |
| Medición | GA4 + Meta Pixel en landing; estadísticas nativas + integración Meta de Tiendanube | Codex (landing) + manual (Tiendanube) |

**Consecuencia:** se abandona Framer. Lo hecho en la rama `sheer-fjord` (estructura de Home y `/empresas`) se usa como referencia de contenido, no se migra.

## 1. Alcance 28/10 (MVP) vs. Fase 2

| Pedido original | 28/10 | Fase 2 (noviembre en adelante) |
|---|---|---|
| Tienda B2C conectada | Tiendanube operativa con **los 40–60 productos más vendidos** con fotos reales | Resto del catálogo (200–250) en tandas semanales |
| Venta B2B | Formulario de cotización + WhatsApp + 1 tabla mayorista en Tiendanube (si el plan lo permite) | Cuentas mayoristas aprobadas, pago/envío por tabla |
| Navegación tipo Adidas | Mega menú "Rubros" con imágenes en la landing (desktop) + menú simple en mobile | Mega menú dentro del tema de Tiendanube |
| Cotización y presupuestos | Formulario calificado → Sheet con estados | Presupuesto en PDF automático |
| Armar / crear uniforme | Dentro del formulario: prendas + cantidades + personalización | Configurador visual |
| Métricas (stock, carritos, leads, gráficos) | Leads en Sheet con pestaña de KPIs; stock/carritos desde el panel de Tiendanube; GA4 | Dashboard unificado |
| Meta Ads e Instagram | Pixel instalado + catálogo de Tiendanube conectado a Meta | Campañas |
| Marcas | Bloque "Marcas que trabajamos" en la landing | Página por marca |
| Envíos a todo el país | Configurado en Tiendanube | — |
| Legales (ARCA, privacidad, términos) | Páginas legales + botón de arrepentimiento + Data Fiscal (validar con contador) | — |

## 2. Bloques de trabajo

### BLOQUE A — Decisiones y bloqueos (18–19/10) · DUEÑO
Sin esto, nada de lo demás se puede entregar.
- [ ] A1. OK a la arquitectura del §0 (y a dejar Framer).
- [ ] A2. **Comprar dominio** `.com.ar` en NIC Argentina (la propagación puede tardar hasta 48 h). **Límite: 20/10.**
- [ ] A3. Contratar plan de Tiendanube que permita dominio propio y tablas mayoristas (Impulso o superior).
- [ ] A4. Dirección del local, horarios, redes, CUIT/razón social para legales.
- [ ] A5. Logo en el mejor formato disponible (aunque sea PNG grande).
- [ ] A6. Lista de los 40–60 productos prioritarios (los que más se venden).

### BLOQUE B — Contenido y fotos (19–23/10) · DUEÑO + VOS
**Es el camino crítico.** Sin fotos no hay tienda.
- [ ] B1. Sesión de fotos de productos en el local: fondo blanco/gris liso, luz de ventana, celular en modo normal, 3 fotos por producto (frente, detalle, uso). Ver `05` §6.
- [ ] B2. 6–10 fotos del local, mostrador, estanterías, bordadora/estampado si existe.
- [ ] B3. Fotos ambientales de stock (Unsplash/Pexels con licencia libre) para hero y rubros, sin presentarlas como clientes.
- [ ] B4. Ficha de cada producto: nombre, marca, talles, colores, material, tabla de medidas, precio minorista.

### BLOQUE C — Tiendanube (20–25/10) · MANUAL
- [ ] C1. Medios de pago (Mercado Pago / Pago Nube), envíos nacionales, retiro en local.
- [ ] C2. Categorías espejo de la landing: Pantalones, Camisas, Calzado de seguridad, Overoles, Seguridad, Uniformes salud, Gastronomía, Colegios, Promociones.
- [ ] C3. Carga de productos (CSV para acelerar).
- [ ] C4. Tabla de precios mayoristas (monto o cantidad mínima).
- [ ] C5. Tema: colores y tipografías alineados a `03_SISTEMA_DE_DISENO.md`, banners con el mismo estilo.
- [ ] C6. Páginas legales, botón de arrepentimiento, integración Meta/Instagram.
- [ ] C7. Compra de prueba real (y reembolso).

### BLOQUE D — Landing en código (19–24/10) · CODEX
Tickets en `06_TICKETS_CODEX.md`. Decisiones de diseño cerradas en `10_PULIDO_BLOQUES_D_E.md`.
- [x] D1. Scaffold + tokens + layout (T01–T02).
- [x] D2. Secciones de la landing (T03–T06).
- [x] D3. `/empresas` (T07).
- [x] D4. Pulido: fondos y paleta oficial (T12), menús (T13), hero mobile, catálogo y orden de secciones (T14), créditos de imágenes (T15).

### BLOQUE E — Sistema B2B de leads (22–24/10) · CODEX + MANUAL
- [x] E1. Google Sheet "LAVORO — Leads" con columnas del `05` §3 + Apps Script (T08).
- [x] E2. Endpoint `/api/lead`, validación, anti-spam, mail, éxito con salto a WhatsApp (T08).
- [x] E3. Formulario en 2 grupos + mejoras del Apps Script: alerta de 24 h, posible duplicado, mail con WhatsApp arriba (T16).
- [ ] E4. Lead de prueba de punta a punta con la checklist de `10` §7.6 + capacitación al dueño con el manual de `10` §7 (T17).

### BLOQUE F — Medición y legales (24–25/10) · CODEX
- [ ] F1. GA4 + Meta Pixel + eventos (T09).
- [ ] F2. Páginas legales y footer legal (T10).

### BLOQUE G — QA, aprobación y salida (26–28/10)
- [ ] G1. QA en 375/768/1440 + celular real Android de gama media en 4G (T11).
- [ ] G2. Lighthouse mobile: Performance ≥ 90, Accesibilidad ≥ 95.
- [ ] G3. Revisión con el dueño (tu papá) el **27/10**. Lista de cambios cerrada ese día.
- [ ] G4. DNS: raíz → Vercel; `tienda.` → Tiendanube (verificar soporte de subdominio, ver `05` §1).
- [ ] G5. Publicación **28/10** solo con aprobación explícita.

## 3. Calendario

| Fecha | Foco | Hito de control |
|---|---|---|
| Dom 18 | Bloque A + T01 | Arquitectura aprobada |
| Lun 19 | A2–A6, T02, inicio fotos | Dominio comprado o fecha cerrada |
| Mar 20 | T03–T04, fotos, C1–C2 | **Último día para dominio** |
| Mié 21 | T05–T06, carga de productos | Landing completa en preview (sin form) |
| Jue 22 | T07, Sheet + Apps Script, carga | `/empresas` en preview |
| Vie 23 | T08, carga, C4 | Lead de prueba llega a Sheet y mail |
| Sáb 24 | T09, C5 tema | Pixel y GA4 registrando |
| Dom 25 | T10, C6, C7 compra de prueba | Tienda vende de punta a punta |
| Lun 26 | T11 QA total | Lista de bugs cerrada |
| Mar 27 | Revisión con el dueño + correcciones | Congelamiento |
| Mié 28 | DNS + publicación | **Entrega** |

## 4. Riesgos y mitigación

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| No hay fotos de productos | Alta | Sesión de fotos el 19–21; salir con 40 productos, no con 250 |
| Dominio no propaga a tiempo | Media | Comprar antes del 20/10; respaldo: preview de Vercel + `mitiendanube.com` |
| Subdominio no soportado por Tiendanube | Media | Verificar el 19/10 con soporte de Tiendanube. Plan B: invertir (tienda en `lavoro.com.ar`, landing en `empresas.lavoro.com.ar`) o un segundo dominio para la tienda |
| Alcance crece ("y si agregamos…") | Alta | Todo pedido nuevo va a la columna Fase 2 de esta tabla |
| Datos legales incompletos | Media | Textos base + validación del contador antes de publicar |

## 5. Indicadores para después del lanzamiento

Medir desde el día 1, revisar cada lunes:
- Leads B2B por semana y por rubro (Sheet).
- % de leads contactados en < 24 h hábiles (objetivo interno, no se publica).
- Tasa lead → cotización → venta.
- Clics a Tienda desde la landing; ventas Tiendanube; tasa de conversión de la tienda.
- Clics a WhatsApp (B2B vs. local).
