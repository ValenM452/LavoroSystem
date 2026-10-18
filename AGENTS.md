# AGENTS.md — LAVORO (landing + sistema B2B/B2C)

> Codex lee este archivo primero. Es la fuente de reglas. Los detalles están en `/docs`.
> Si una instrucción de un ticket contradice este archivo, gana este archivo y avisás.

## 1. Qué estamos construyendo

LAVORO vende indumentaria de trabajo, calzado de seguridad y uniformes desde Chilecito, La Rioja (Argentina), a personas (B2C) y a empresas e instituciones (B2B).

Este repositorio es **solo el sitio institucional/landing** (`lavoro.com.ar` — dominio pendiente de compra). La **tienda** (catálogo, carrito, checkout, stock, precios mayoristas) vive en **Tiendanube** y NO se programa acá: la landing enlaza a ella.

```
lavoro.com.ar  (este repo, Astro en Vercel)
 ├─ /            Landing: B2C → Tienda · B2B → Cotización
 ├─ /empresas    Página B2B completa + formulario de cotización
 ├─ /legales/*   Términos, privacidad, cambios y devoluciones
 └─ /api/lead    Recibe el formulario → Google Sheets + mail
tienda.lavoro.com.ar  (Tiendanube — NO es código de este repo)
```

Lectura obligatoria antes de cualquier ticket:

1. `docs/01_NEGOCIO_Y_DATOS.md` — qué es real y qué no se puede inventar.
2. `docs/03_SISTEMA_DE_DISENO.md` — tokens, tipografía, componentes.
3. El documento específico del ticket (`04`, `05` o `06`).

## 2. Reglas no negociables

1. **No inventar datos comerciales.** Prohibido escribir precios, stock, plazos de entrega o de envío, cantidad de clientes, testimonios, reseñas, logos de clientes, certificaciones, garantías, descuentos o estadísticas. Si falta un dato, usar placeholder visible con este formato: `[[PENDIENTE: descripción]]` y listarlo en el reporte final.
2. **Único dato temporal permitido:** "Desde 2011". No usar 2012 ni "más de una década".
3. **No hay sección "Clientes que confían".** La referencia de diseño la tiene; LAVORO no tiene clientes autorizados para mostrar. Se reemplaza por **"Marcas que trabajamos"** (Pampero, Ombú, Gaucho, 21 de Septiembre) en texto hasta que haya logos oficiales autorizados.
4. **Fotos:** nunca presentar fotos de stock como clientes, equipos o trabajos de LAVORO. Las fotos ambientales llevan `alt` descriptivo y neutro.
5. **Español de Argentina** (voseo: "contanos", "pedí", "elegí"). Tono claro, directo, comercial. Sin superlativos vacíos.
6. **Alcance cerrado.** No agregar funciones fuera del ticket (ni carrito propio, ni login, ni portal privado, ni dashboard, ni configurador de uniformes, ni CMS). Si algo parece necesario, se anota en el reporte como propuesta, no se programa.
7. **Mobile primero.** Todo se diseña y prueba primero a 375 px; después 768 px y 1440 px.
8. **No hacer deploy a producción ni tocar DNS.** Solo previews. Producción la aprueba el dueño del proyecto.
9. **Secretos fuera del repo.** Todo en variables de entorno (`.env.example` documentado, `.env` en `.gitignore`).

## 3. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Astro 5** (salida estática + 1 endpoint server) | Sitio de contenido, casi sin JS, carga rápida en 4G |
| Estilos | CSS propio con custom properties (tokens en `src/styles/tokens.css`) | Control fino del estilo editorial; nada de look de plantilla |
| JS cliente | Vanilla TS en islas mínimas (menú, mega menú, formulario) | Sin frameworks de UI |
| Imágenes | `astro:assets` → AVIF/WebP con `srcset` | LCP |
| Hosting | Vercel (adapter `@astrojs/vercel`) | Previews por rama + función `/api/lead` |
| Leads | Google Apps Script (webhook) → Google Sheet + mail a `lavorouniformes@gmail.com` | CRM mínimo sin costo, el negocio lo puede leer |
| Medición | GA4 + Meta Pixel (IDs por env) | Ver `docs/05_SISTEMA_B2B_B2C.md` §5 |

Versiones: fijar versiones exactas en `package.json` (sin `^`).

## 4. Estructura del repo

```
src/
  components/      Header, MegaMenu, Footer, Button, Eyebrow, SectionHeading, ...
  sections/        Una sección de la landing = un componente (Hero.astro, Proceso.astro, ...)
  layouts/         Base.astro (head, SEO, tracking)
  pages/           index.astro, empresas.astro, legales/*.astro, api/lead.ts
  config/          site.ts (contactos, URLs de Tiendanube, textos pendientes)
  styles/          tokens.css, base.css
  assets/img/      Fotos optimizables
public/            favicon, og-image, robots.txt
docs/              Contexto (no se despliega)
```

**Todos los datos de negocio** (teléfonos, mail, dirección, horarios, URLs de categorías de Tiendanube, redes) viven en `src/config/site.ts`. Nunca hardcodeados en componentes.

## 5. Comandos

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # debe pasar sin warnings
npm run preview
npm run check      # astro check (tipos)
npm test           # vitest (schema, teléfono, /api/lead)
```

## 6. Definición de "terminado" para cada ticket

- [ ] `npm run build` y `npm run check` pasan.
- [ ] Revisado en 375, 768 y 1440 px: sin scroll horizontal, sin texto cortado, botones táctiles ≥ 44 px.
- [ ] Contraste AA en todo el texto. Foco de teclado visible. `prefers-reduced-motion` respetado.
- [ ] Cero datos inventados. Placeholders `[[PENDIENTE: ...]]` listados.
- [ ] Reporte final con: archivos tocados, qué se hizo, qué quedó pendiente, capturas o descripción por breakpoint.

## 7. Cómo reportar

Al terminar un ticket, responder con:

```
TICKET: Txx
HECHO: (lista corta)
ARCHIVOS: (lista)
PENDIENTES DE DATOS: (lista de [[PENDIENTE]])
RIESGOS / DUDAS: (si hay)
FUERA DE ALCANCE DETECTADO: (propuestas, sin implementar)
```
