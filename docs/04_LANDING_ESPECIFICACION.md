# 04 — Especificación de la landing (`/`) y `/empresas`

> Cada sección tiene: objetivo comercial, layout, copy base (editable) y criterio de aceptación.
> El copy es una base de trabajo en español rioplatense. No agrega datos que no estén en `01`.
> Todo link a la tienda sale de `site.ts` → `tiendanube.categories[...]`.

## Mapa de la home

> **Orden, fondos y navegación vigentes: `10_PULIDO_BLOQUES_D_E.md` §3–4.** El copy de cada sección de este documento sigue valiendo.

| # | Sección | Fondo | Objetivo | CTA |
|---|---|---|---|---|
| 1 | Header + mega menú | Transparente → paper | Orientar en 1 segundo | Cotizar |
| 2 | Hero | Foto a sangre | Qué vendemos y a quién | Ver tienda · Cotizar para empresas |
| 3 | Declaración | Paper | Posicionamiento | — |
| 4 | Categorías | Paper-2 | Llevar B2C a la tienda | Cada tarjeta → categoría |
| 5 | Marcas que trabajamos | Paper | Confianza real | — |
| 6 | Banda personalización | Foto a sangre | Diferencial B2B | Ver personalización |
| 7 | Empresas: proceso | Stone | Explicar cómo se cotiza | Solicitar cotización |
| 8 | Rubros (split) | Foto + bordó | Que cada empresa se reconozca | Cotizar para mi rubro |
| 9 | Formulario | Paper | Capturar lead calificado | Enviar solicitud |
| 10 | Local en Chilecito | Ink + mapa | Confianza física, B2C local | Cómo llegar · WhatsApp local |
| 11 | Cierre | Stone | Última conversión | Hablar con LAVORO |
| 12 | Footer | Bordó-900 | Datos, legales | — |

---

## 1. Header + mega menú

- **Nav:** Tienda ↗ · Empresas · Rubros ▾ · Personalización · Marcas · Contacto · **[Cotizar]**
  - "Tienda" abre Tiendanube en la misma pestaña (es el mismo negocio).
  - Personalización, Marcas y Contacto son anclas de la home (`#personalizacion`, `#marcas`, `#contacto`).
- **Mega menú "Rubros"** (desktop): columna izquierda con los 10 rubros de `01` §6; derecha, foto del rubro en hover + frase corta + link "Cotizar para [rubro]" → `/empresas?rubro=mineria#cotizar` (precarga el select del formulario).
- **Barra superior fina** (opcional, 32 px, `--ink`): "Desde 2011 en Chilecito, La Rioja · WhatsApp empresas 3825 529781".

**Acepta si:** teclado abre/cierra el mega menú; en mobile no existe mega menú y el menú de pantalla completa lista Tienda, Empresas, Rubros (acordeón), Personalización, Marcas, Contacto + 2 botones.

## 2. Hero

- Foto a sangre (taller/obra/campo), overlay inferior, alto `100svh` máx. 900 px.
- Eyebrow: `CHILECITO · LA RIOJA · DESDE 2011`
- H1 (serif 300): **Ropa de trabajo y uniformes para equipos que *no paran*.**
- Bajada (máx. 2 líneas): Indumentaria, calzado de seguridad y uniformes para personas y empresas. Bordado y estampado con tu marca.
- CTA primario: **Ver tienda** → Tiendanube. Secundario: **Cotizar para empresas** → `/empresas#cotizar`.
- Mobile: imagen recortada vertical propia (no la desktop escalada), titular en 4–5 líneas máximo.

**Acepta si:** LCP < 2.5 s en 4G simulado; la imagen es `<img fetchpriority="high">`, no background CSS.

## 3. Declaración

Layout tipo referencia "Nos involucramos en cada trabajo…": titular serif grande en 7 columnas, párrafo corto en 4 columnas a la derecha, alineado abajo.

- H2: **Cada trabajo necesita la prenda *adecuada*.**
- Texto: Asesoramos a quien trabaja por su cuenta y a empresas que necesitan equipar a todo su personal: qué prenda conviene para cada tarea, qué talle pedir y cómo identificarla con tu marca.

## 4. Categorías

- Eyebrow `TIENDA` · H2: **Encontrá lo que tu trabajo *pide*.**
- Grilla de 8 tiles con foto (4×2 desktop, 2×4 mobile), sin íconos, nombre en serif sobre la foto: Pantalones · Camisas · Calzado de seguridad · Overoles · Elementos de seguridad · Salud · Gastronomía · Colegios.
- Link "Ver toda la tienda →".

**Acepta si:** cada tile tiene link real (o `[[PENDIENTE: URL]]` visible en dev), área clicable completa, foco visible.

## 5. Marcas que trabajamos  `#marcas`

Reemplaza "Clientes que confían" de la referencia.
- Titular a la izquierda: **Marcas que *trabajamos*.**
- Fila de wordmarks en texto (Source Serif 4 versalitas o Geist 600 mayúsculas, gris `--steel`): PAMPERO · OMBÚ · GAUCHO · 21 DE SEPTIEMBRE · `[[PENDIENTE: más marcas]]`
- Cuando lleguen logos autorizados: SVG monocromo, misma altura óptica.

## 6. Banda personalización  `#personalizacion`

`ImageBand` (foto de bordado/estampado; si no hay foto real, textil de detalle neutro).
- Titular sobre foto: **Tu marca en cada *prenda*.**
- Debajo, en paper, 3 columnas de texto (sin íconos): **Bordado** · **Estampado** · **Asesoramiento** — una oración cada una, sin plazos ni mínimos inventados (`[[PENDIENTE: mínimos de personalización]]`).
- CTA: Consultar personalización → `/empresas#cotizar` con `personalizacion` preseleccionada.

## 7. Empresas: proceso

Layout referencia "Un proceso directo, sin vueltas": titular izquierda (5 col), lista numerada derecha (6 col).
- Eyebrow `EMPRESAS` · H2: **Un proceso directo, *sin vueltas*.**
- 01 **Nos contás qué necesitás.** Rubro, cantidad de personas y prendas.
- 02 **Te armamos la propuesta.** Productos, talles y opciones de personalización.
- 03 **Personalizamos.** Bordado o estampado con el logo de tu empresa.
- 04 **Entregamos.** Retiro en el local o envío. `[[PENDIENTE: confirmar modalidades]]`
- CTA: Solicitar cotización.

## 8. Rubros (split)

`SplitPanel`: foto izquierda, panel `--bordo-700` derecha (referencia "Conocemos realidades distintas").
- Eyebrow `RUBROS` · H2 blanco: **Conocemos trabajos *distintos*.**
- Texto: Cada rubro tiene exigencias propias de abrigo, resistencia, higiene o seguridad. Te ayudamos a elegir según la tarea.
- Lista en dos columnas (links a `/empresas?rubro=…#cotizar`): Minería · Petroleras · Campos y fincas · Bodegas · Construcción · Talleres · Salud · Gastronomía · Colegios · Municipios.

## 9. Formulario  `#contacto` (en home) / `#cotizar` (en /empresas)

Layout referencia "Contanos qué necesita tu empresa": izquierda titular + datos de contacto; derecha formulario.
- H2: **Contanos qué necesita *tu empresa*.**
- Datos: WhatsApp empresas, email, `[[PENDIENTE: dirección]]`.
- Campos y validación: ver `05_SISTEMA_B2B_B2C.md` §2.
- Botón: **Enviar solicitud**. Debajo, texto chico: "Si preferís, escribinos por WhatsApp" (link B2B).
- Estado éxito: reemplaza el form por "Recibimos tu solicitud. Te vamos a contactar por WhatsApp o mail." + botón "Seguir por WhatsApp" con el resumen prellenado.

## 10. Local en Chilecito

Layout referencia "Oficina en Lanús Oeste": panel `--ink` con texto (izquierda, 4 col) superpuesto sobre mapa ancho.
- H2 serif: **Local en *Chilecito*.**
- `[[PENDIENTE: dirección]]` · `[[PENDIENTE: horarios]]` · WhatsApp local 3825 666774.
- Botones: Cómo llegar (Google Maps) · Escribir al local.
- Mapa: imagen estática estilizada con link a Google Maps (no iframe pesado en la carga inicial; iframe solo al hacer click).

## 11. Cierre

- Frase serif centrada: **Una respuesta *cercana y clara*.**
- Bajada: Equipá a tu equipo o encontrá tu ropa de trabajo con quien conoce el oficio.
- Botón único: Hablar con LAVORO → WhatsApp B2B.

## 12. Footer

Columnas: logo + "Desde 2011" · Tienda (categorías) · Empresas (cotizar, rubros, personalización) · Contacto (2 WhatsApp, mail, dirección) · Legales (términos, privacidad, cambios y devoluciones, botón de arrepentimiento, Defensa del Consumidor, Data Fiscal `[[PENDIENTE]]`). Línea final: © 2026 LAVORO · `[[PENDIENTE: razón social / CUIT]]`.

---

## `/empresas`

Reutiliza componentes de la home. Orden:

1. **Hero empresas** (foto a sangre): eyebrow `EMPRESAS E INSTITUCIONES`; H1 **Indumentaria de trabajo para *todo tu equipo*.**; CTA Solicitar cotización (ancla) · WhatsApp empresas.
2. **Qué podemos cotizar**: lista editorial de 6 ítems sin íconos — Ropa de trabajo · Calzado de seguridad · Elementos de seguridad · Uniformes (salud, gastronomía, colegios) · Bordado y estampado · Equipamiento por temporada.
3. **Rubros**: 10 rubros en grilla de fotos 5×2 (desktop) / lista con miniaturas (mobile). Click → precarga rubro y baja al formulario.
4. **Proceso** (mismo componente de la home).
5. **Por qué LAVORO** (solo hechos): Desde 2011 en Chilecito · Local físico donde ver y probar · Marcas reconocidas del rubro · Personalización · Atención por WhatsApp. Sin números inventados.
6. **Formulario** `#cotizar` (completo).
7. **Cierre** con WhatsApp.

**SEO:** `title` "Ropa de trabajo y uniformes para empresas | LAVORO Chilecito"; `description` sin claims inventados; Open Graph con foto real cuando exista.
