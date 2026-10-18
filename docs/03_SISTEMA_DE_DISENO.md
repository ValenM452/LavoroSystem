# 03 — Sistema de diseño

## 1. Referencia

Video de referencia: web institucional de **MEF Consultora** (seguridad e higiene). Se toma el **lenguaje visual**, no el contenido ni la paleta.

Rasgos a replicar:

1. **Titulares serif editoriales**, grandes, peso liviano, interlineado ajustado, con **una palabra en itálica** para dar énfasis ("Soluciones técnicas para trabajar *con seguridad*").
2. **Fondo claro cálido** (crema/papel) como base; bloques de **color profundo** a sangre para contraste.
3. **Fotografía industrial real a sangre** con el titular serif encima, en blanco, alineado abajo-izquierda.
4. **Eyebrows**: etiquetas pequeñas en mayúsculas con tracking amplio sobre cada titular.
5. **Mucho aire**: secciones altas, texto de cuerpo corto y angosto (máx. 60 caracteres por línea).
6. **Layouts partidos 50/50**: foto de un lado, panel de color con texto del otro.
7. **Listas numeradas de proceso** en dos columnas (titular a la izquierda, pasos a la derecha).
8. **Botones tipo píldora** chicos y oscuros, nada de botones gigantes.
9. **Bloque contacto** con formulario limpio a la derecha y datos a la izquierda; **mapa** del local con panel de color.
10. **Cierre** con frase serif centrada y un solo botón.
11. Animación mínima: aparición suave al hacer scroll. Sin carruseles, sin parallax agresivo.

Adaptación LAVORO: el **azul marino → bordó/negro**; el **celeste claro → gris piedra**. LAVORO es más "taller y obra" que "consultora": fotos con más textura, grafa, botines, polvo.

## 2. Tokens de color

> Hex provisionales hasta tener el logo en vector. Ajustar `--bordo-700` al bordó exacto del logo.

```css
:root {
  /* Marca */
  --bordo-900: #3E1119;   /* fondos profundos, footer */
  --bordo-700: #6B1C2A;   /* paneles, CTA primario */
  --bordo-500: #8E2A3B;   /* hover, acentos */
  --ink:       #121212;   /* texto principal, negro */
  --graphite:  #2C2C2C;   /* gris oscuro de marca */
  --steel:     #5E5E5E;   /* texto secundario sobre claro */

  /* Superficies */
  --paper:     #F4F1EB;   /* fondo base cálido */
  --paper-2:   #EAE5DC;   /* alternancia de secciones */
  --stone:     #D9D7D2;   /* reemplazo del celeste de la referencia */
  --white:     #FFFFFF;
  --line:      rgba(18,18,18,.14);
  --line-inv:  rgba(255,255,255,.22);

  /* Semánticos */
  --bg: var(--paper);
  --fg: var(--ink);
  --muted: var(--steel);
  --accent: var(--bordo-700);
  --accent-hover: var(--bordo-500);
  --on-accent: #FFFFFF;
  --focus: #C9A227;       /* anillo de foco visible sobre claro y oscuro */
}
```

Reglas: bordó solo en CTA primario, paneles de contraste y detalles. Nunca degradados. Texto sobre foto siempre con overlay `linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0) 60%)` para garantizar AA.

## 3. Tipografía

| Rol | Fuente (Google Fonts) | Uso |
|---|---|---|
| Display | **Source Serif 4** (300/400, itálica 300/400, optical size) | H1–H3, frases de cierre |
| Texto / UI | **Geist** (400/500/600) | Cuerpo, navegación, botones, formularios |
| Eyebrow | Geist 500, mayúsculas, `letter-spacing: .14em`, 12–13 px | Etiquetas de sección |

Escala fluida:

```css
--fs-display: clamp(2.6rem, 1.6rem + 4.6vw, 5.6rem);  /* hero */
--fs-h2:      clamp(2rem, 1.4rem + 2.6vw, 3.6rem);
--fs-h3:      clamp(1.35rem, 1.1rem + 1vw, 1.9rem);
--fs-body:    clamp(1rem, .96rem + .2vw, 1.125rem);
--fs-small:   .875rem;
--lh-tight: 1.04;  --lh-head: 1.12;  --lh-body: 1.6;
```

Titulares: `font-weight: 300`, `letter-spacing: -0.02em`. La palabra destacada va en `<em>` (itálica, mismo color). Máximo una itálica por titular.

## 4. Espaciado y grilla

- Contenedor: `max-width: 1320px`, gutter `clamp(16px, 4vw, 48px)`.
- Grilla 12 columnas desktop, 6 tablet, 4 mobile.
- Ritmo vertical de secciones: `padding-block: clamp(72px, 10vw, 160px)`.
- Radios: `2px` en inputs y tarjetas, `999px` solo en botones píldora. **Nada de tarjetas redondeadas grandes.**
- Sombras: ninguna. La separación se hace con color de fondo y líneas `--line`.

## 5. Componentes

| Componente | Especificación |
|---|---|
| `Button` primario | Píldora, fondo `--accent`, texto blanco, 14–15 px Geist 500, `padding: 12px 22px`, alto mínimo 44 px, flecha `→` opcional |
| `Button` secundario | Píldora, borde 1 px `currentColor`, fondo transparente |
| `Button` WhatsApp | Secundario con ícono de WhatsApp monocromo (no verde) |
| `Eyebrow` | Línea corta de 24 px + texto en mayúsculas |
| `SectionHeading` | Eyebrow + H2 serif + bajada opcional (máx. 2 líneas) |
| `Header` | Fijo, 72 px desktop / 60 px mobile, fondo transparente sobre hero → `--paper` al hacer scroll. Logo izquierda, nav centro, CTA "Cotizar" derecha |
| `MegaMenu` | Panel a ancho completo bajo el header: lista de rubros a la izquierda, imagen del rubro en hover a la derecha. Solo desktop ≥ 1024 px. Abre con hover + click + teclado (`Esc` cierra) |
| `MobileMenu` | Pantalla completa `--bordo-900`, links serif grandes, CTA cotizar y WhatsApp abajo |
| `ImageBand` | Foto a sangre, alto `min(78vh, 760px)`, titular serif blanco abajo-izquierda |
| `SplitPanel` | 50% foto / 50% panel `--bordo-700` o `--ink`; en mobile foto arriba, panel abajo |
| `ProcessList` | Pasos numerados `01–04`, número en serif itálica, separadores `--line` |
| `Field` | Label arriba, input con borde inferior 1 px, foco con línea bordó 2 px; error en texto, no solo color |

## 6. Movimiento

- Aparición al entrar en viewport: `opacity 0→1`, `translateY 16px→0`, 500 ms, `cubic-bezier(.2,.7,.2,1)`, una vez.
- Imágenes de `ImageBand`: escala 1.06→1 al entrar, 1200 ms.
- Hover en links: subrayado que crece de izquierda a derecha.
- Todo desactivado con `prefers-reduced-motion: reduce`.
- Usar `IntersectionObserver` nativo. Sin librerías de animación.

## 7. Qué evitar (look "hecho con IA" / plantilla)

- Íconos genéricos en círculos de colores, grillas de 3 tarjetas con ícono + título + texto.
- Emojis, degradados, glassmorphism, sombras difusas, bordes muy redondeados.
- Contadores animados ("+500 clientes").
- Fotos de stock con gente sonriendo a cámara con casco impecable.
- Textos tipo "Soluciones integrales de excelencia".
