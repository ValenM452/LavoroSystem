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

---

## Fuera de alcance (no programar, anotar si aparece)

Carrito propio · login / cuentas · portal privado cliente/empresa/dueño · configurador visual de uniformes · dashboard de métricas · CMS · blog · chat bot · integración por API con Tiendanube · multi-idioma.
