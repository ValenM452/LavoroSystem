# 06 — Tickets para Codex

> Un ticket = una tarea de Codex = una rama = un PR/preview. Ejecutar en orden.
> Plantilla de prompt para cada ticket:
>
> ```
> Leé AGENTS.md y los docs indicados. Ejecutá el ticket Txx de docs/06_TICKETS_CODEX.md.
> No hagas nada fuera del ticket. Al terminar, reportá con el formato de AGENTS.md §7.
> ```

---

### T01 — Scaffold y tokens
**Docs:** AGENTS.md, 03.
- Proyecto Astro 5 + TypeScript estricto + adapter Vercel (modo `static` con la ruta `/api/lead` server).
- `src/styles/tokens.css` exactamente con los tokens de `03` §2–4. `base.css` con reset moderno, tipografía y utilidades de contenedor/grilla.
- Fuentes Source Serif 4 y Geist autoalojadas (`@fontsource-variable/*`) con `font-display: swap` y preload de la display.
- `src/config/site.ts` con todos los datos de `01` §2 y placeholders de §3.
- Página `/` vacía con una "página de tokens" en `/_tokens` (solo en dev) mostrando colores, tipos y botones.
**Acepta si:** build limpio; `/_tokens` no existe en el build de producción.

### T02 — Layout: Header, MegaMenu, MobileMenu, Footer, Button
**Docs:** 03 §5–6, 04 §1 y §12.
- `Base.astro` con SEO (title, description, canonical, OG), `lang="es-AR"`.
- Header con comportamiento transparente → sólido al hacer scroll.
- MegaMenu accesible (`aria-expanded`, `Esc`, foco atrapado solo mientras está abierto, cierre al salir).
- MobileMenu pantalla completa con bloqueo de scroll del body.
- Footer completo con placeholders legales.
- Utilidad `reveal` (IntersectionObserver) de `03` §6.
**Acepta si:** navegable 100 % con teclado; sin scroll horizontal en 320 px.

### T03 — Hero + Declaración
**Docs:** 04 §2–3.
- Hero con imagen `astro:assets`, `fetchpriority="high"`, recortes distintos desktop/mobile con `<picture>`.
- Usar imagen placeholder neutra gris con texto `[[PENDIENTE: foto hero]]` si no hay foto en `src/assets/img/`.

### T04 — Categorías + Marcas
**Docs:** 04 §4–5.
- Tiles con link de `site.ts`. Wordmarks de marcas en texto.

### T05 — Personalización + Proceso + Rubros
**Docs:** 04 §6–8.
- Componentes `ImageBand`, `ProcessList`, `SplitPanel` reutilizables (se usan otra vez en `/empresas`).
- Links de rubros con `?rubro=<slug>#cotizar`. Slugs: `mineria, petroleras, campos-fincas, bodegas, construccion, talleres, salud, gastronomia, colegios, municipios, otro`.

### T06 — Formulario (solo UI) + Local + Cierre
**Docs:** 04 §9–11, 05 §2.
- Formulario completo con validación en cliente (`zod` compartido en `src/lib/leadSchema.ts`), precarga de `rubro` desde query, campos ocultos de atribución.
- Envío simulado (mock) que muestra el estado de éxito. El endpoint real es T08.
- Mapa estático con carga del iframe bajo demanda.
**Acepta si:** todos los errores son anunciados por lector de pantalla (`aria-describedby`, `aria-live`).

### T07 — Página `/empresas`
**Docs:** 04 "/empresas".
- Solo reutilizar componentes. Si hace falta uno nuevo, justificarlo en el reporte.

### T08 — Endpoint `/api/lead` + Apps Script
**Docs:** 05 §3–4.
- `src/pages/api/lead.ts` según `05` §4 (validación servidor, honeypot, tiempo, rate limit, normalización de teléfono, respaldo WhatsApp).
- `docs/apps-script/lead.gs` listo para pegar + `docs/apps-script/README.md` con pasos para crear la Sheet, columnas, validación de `estado`, publicar como Web App y copiar la URL a Vercel.
- Tests unitarios del schema y del normalizador de teléfono (`vitest`): casos `03825 15-529781`, `3825529781`, `+54 9 3825 529781`.
- Nota: el secreto viaja en el cuerpo, no en el header `X-Lavoro-Secret` (Apps Script no lee headers). Ver `05` §4.
**Acepta si:** con `LEAD_WEBHOOK_URL` vacío, el form muestra el respaldo de WhatsApp y no rompe.

### T09 — Medición
**Docs:** 05 §5.
- `src/lib/track.ts` + eventos de la tabla. GA4 y Pixel solo si existe su ID en env.
- Carga diferida; verificar que no empeora LCP.

### T10 — Legales
**Docs:** 05 §7.
- `/legales/terminos`, `/legales/privacidad`, `/legales/cambios-y-devoluciones` con estructura y textos base marcados `[[REVISAR CONTADOR]]`.
- Links a botón de arrepentimiento (URL de Tiendanube `[[PENDIENTE]]`), Defensa del Consumidor y Data Fiscal.

### T11 — QA final
- Revisar 320, 375, 768, 1024, 1440 px. Lista de defectos y corrección.
- Lighthouse mobile ≥ 90 performance, ≥ 95 accesibilidad, ≥ 95 SEO.
- `sitemap.xml`, `robots.txt`, favicon, imagen OG, 404 con estilo.
- Reporte final con **todos** los `[[PENDIENTE]]` que siguen en el sitio. Si queda alguno visible, el sitio **no** se publica.

### T12 — Paleta oficial y ritmo de fondos
**Docs:** 10 §1, §4.
- Agregar `--sand: #F6EFE6` a `tokens.css` y una utilidad `.section--sand`. Actualizar el comentario de cabecera de `tokens.css` con la tabla de contrastes de `10` §1.3.
- Aplicar el mapa de fondos de `10` §4: Marcas, Personalización y Proceso dejan el bordó; Rubros pasa a `--bordo-900`.
**Acepta si:** nunca hay más de 2 secciones oscuras seguidas; contraste AA verificado en cada combinación nueva.

### T13 — Menús
**Docs:** 10 §3.
- Header desktop: Tienda ↗ · Empresas · Rubros ▾ · Personalización · Contacto · [Cotizar].
- Mega menú: eyebrow "Rubros que equipamos", 2 columnas de 5, link final "Ver todos los rubros" → `/empresas#rubros`.
- Menú mobile con el orden de `10` §3.4 y botones al pie. Footer: "Marcas" en la columna Empresas.
**Acepta si:** navegable con teclado; `Esc` cierra mega menú y menú mobile devolviendo el foco.

### T14 — Hero mobile, Confianza, Catálogo y orden de secciones
**Docs:** 10 §4.
- Hero mobile: foto arriba (4:3), tarjetas de camino compactas. Desktop sin cambios.
- Confianza: hechos como lista con filete dorado, sin tarjetas.
- Catálogo: componente de lista editorial (fila entera clicable); conservar `CatalogCard` para cuando haya fotos.
- Orden de la home y de `/empresas` según `10` §4 y §4.10. Nota "Imágenes ilustrativas de cada rubro." bajo la grilla.
**Acepta si:** home ≤ 10.000 px de alto en 375 px; primer pantallazo en 375 px con foto + H1 + inicio de las tarjetas.

### T15 — Créditos de imágenes
**Docs:** 10 §5.5, 09.
- `/legales/creditos-imagenes` generada desde `src/config/images.ts` (solo slots con `credit`): uso, autor, licencia, link a la fuente, "recortada".
- Link "Créditos de imágenes" en la columna Legales del footer.
**Acepta si:** cada foto CC BY usada en el sitio aparece una vez; las propias no aparecen.

### T16 — Formulario en 2 grupos + Apps Script
**Docs:** 10 §6.2, §7.2; 05 §2–3.
- `LeadForm`: `<fieldset>` "1. Tus datos" y "2. Tu pedido", atributos `autocomplete` e `inputmode`, botón ancho completo en mobile. **Sin cambiar campos, nombres ni validación.**
- `lead.gs`: formato condicional de "Nuevo" con más de 24 h; columna `posible_duplicado` (mismo teléfono en 30 días); mail con el link `wa.me` y la plantilla de primer contacto de `10` §7.3 al principio. Actualizar `docs/apps-script/README.md`.
**Acepta si:** `npm test` pasa; `configurarPlanilla()` se puede volver a correr sobre una Sheet con datos sin borrar nada.

### T17 — Prueba de punta a punta (manual)
**Docs:** 10 §7.6.
- Correr los 9 casos con la Sheet real en un preview de Vercel. Anotar resultado de cada uno en el reporte.

---

## Fuera de alcance (no programar, anotar si aparece)

Carrito propio · login / cuentas · portal privado cliente/empresa/dueño · configurador visual de uniformes · dashboard de métricas · CMS · blog · chat bot · integración por API con Tiendanube · multi-idioma.
