# 10 — Pulido de los bloques D (landing) y E (sistema B2B de leads)

> Fecha: 18/10/2026. Base: auditoría del preview local (commits d1–d5, e, f) en 375 y 1440 px.
> Este documento **cierra las decisiones** de diseño y de sistema para el lanzamiento del 28/10.
> Donde contradice a `03` o `04`, **gana este documento** (el rediseño d5 lo pidió el dueño).
> Las reglas de `AGENTS.md` siguen vigentes: cero datos inventados, `[[PENDIENTE: …]]` visible, alcance cerrado.

---

## 0. Diagnóstico (qué está bien y qué falta para que se vea profesional)

| Área | Estado actual | Problema | Decisión |
|---|---|---|---|
| Paleta | Bordó + blanco + dorado (d5) | `03` §2 todavía documenta crema/piedra; Codex puede "corregir" hacia atrás | §1 pasa a ser la paleta oficial |
| Ritmo de fondos | Marcas, Proceso, Personalización, Cierre y Footer en bordó | Demasiados bloques oscuros; la página se siente pesada y monótona | Máx. 2 secciones oscuras seguidas, mapa de fondos en §4 |
| Largo de la home | 13.750 px en 375 px (≈ 17 pantallas) | Demasiado para 4G y para un visitante B2C | Objetivo ≤ 10.000 px en 375 px (§4) |
| Header | 7 links + Cotizar | "Tienda" y "Catálogo" compiten; "Marcas" no tiene intención de compra | 5 links + Cotizar (§3) |
| Hero mobile | Foto aparece después de las 2 tarjetas (fuera del primer pantallazo) | Primer pantallazo sin imagen: parece borrador | Foto arriba en mobile (§4.1) |
| Catálogo | 8 tarjetas de texto iguales con número | Se lee como plantilla (grilla de tarjetas, `03` §7) | Lista editorial hasta tener fotos propias; tiles con foto después (§4.3) |
| B2B en la home | 4 secciones seguidas (Empresas, Proceso, Rubros, Personalización) | Se repite el mensaje; el formulario queda lejos del proceso | Orden nuevo: Proceso justo antes del formulario (§4) |
| Fotos | Stock CC de Wikimedia (con créditos) + rellenos grises en categorías | Créditos CC BY sin mostrar al visitante; falta sesión propia | Dirección de arte + lista de tomas + página de créditos (§5) |
| Formulario | Completo y funcional (E) | 11 campos en un bloque largo, se percibe pesado | Agrupar en 2 pasos visuales, sin cambiar campos (§6.2) |
| Sistema de leads | Sheet + KPIs + mail funcionando | Falta el "cómo se trabaja": tiempos, estados, mensajes de respuesta | Manual operativo en §7 |

---

## 1. Colores (oficial)

### 1.1 Paleta

| Token | Hex | Rol | Proporción en pantalla |
|---|---|---|---|
| `--white` | `#FFFFFF` | Fondo base | ~60 % |
| `--sand` **(nuevo)** | `#F6EFE6` | Fondo alterno cálido (reemplaza al "paper" de `03`) | ~15 % |
| `--bordo-050` | `#FBF6F7` | Superficie de tarjetas y campos sobre blanco | detalle |
| `--bordo-700` | `#6B1C2A` | **Color de marca**: CTA primario, paneles | ~15 % |
| `--bordo-900` | `#3E1119` | Bloques profundos, barra superior | ~5 % |
| `--bordo-950` | `#2A0B11` | Footer | — |
| `--bordo-500` | `#8E2A3B` | Hover del CTA | — |
| `--bordo-100` | `#EBD9DC` | Texto secundario sobre bordó | — |
| `--gold-300` | `#E2C27A` | Acento sobre bordó: números, itálicas, CTA sobre fondo oscuro | ≤ 5 % |
| `--gold-500` | `#C9A24A` | Solo líneas y barras decorativas (**nunca texto**: 2,4:1 sobre blanco) | ≤ 3 % |
| `--gold-700` | `#7A5C17` | Eyebrows y acentos como texto sobre claro | — |
| `--ink` | `#1C1416` | Texto principal | — |
| `--steel` | `#5E5E5E` | Texto secundario sobre claro | — |

`--bordo-700` sigue siendo provisional hasta tener el logo en vector `[[PENDIENTE: logo SVG]]`. Cuando llegue, se ajusta solo ese hex y se recalcula la tabla 1.3.

### 1.2 Reglas de uso

1. **Un solo color "que grita" por pantalla:** el bordó. El dorado acompaña, nunca compite (nada de bloques dorados grandes).
2. Botón primario: bordó sobre fondo claro; **dorado (`--gold-300`) con texto `--ink`** sobre fondo bordó. Nunca dos botones dorados en la misma vista.
3. Itálica del titular: `--bordo-700` sobre claro, `--gold-300` sobre oscuro.
4. Sin degradados salvo el overlay de foto (`--overlay-photo`). Sin glassmorphism.
5. Sombra: una sola (`--shadow`), solo en header con scroll, tarjeta del local y formulario.

### 1.3 Contrastes verificados (WCAG 2.1)

| Combinación | Ratio | Uso permitido |
|---|---|---|
| `--ink` / `--white` | 18,1 | Todo |
| `--white` / `--bordo-700` | 11,5 | Todo |
| `--bordo-700` / `--sand` | 10,1 | Todo |
| `--ink` / `--gold-300` | 10,5 | Botón dorado |
| `--bordo-100` / `--bordo-700` | 8,5 | Texto secundario sobre bordó |
| `--gold-300` / `--bordo-700` | 6,7 | Números, itálicas, eyebrows sobre bordó |
| `--steel` / `--white` | 6,5 | Texto secundario |
| `--gold-700` / `--white` | 6,2 | Eyebrows |
| `--steel` / `--sand` | 5,7 | Texto secundario sobre arena |
| `--gold-700` / `--sand` | 5,5 | Eyebrows sobre arena |
| `--gold-500` / `--white` | **2,4** | **Prohibido como texto** |

---

## 2. Tipografía (oficial)

Se mantienen **Source Serif 4** (display) y **Geist** (texto/UI), autoalojadas con `@fontsource-variable`. No se agregan fuentes.

| Estilo | Fuente | Tamaño (375 → 1440) | Peso | Interlineado | Tracking | Uso |
|---|---|---|---|---|---|---|
| Display (H1) | Source Serif 4 | 38 → 74 px (`--fs-display`) | 300 | 1,06 | −0,015em | Solo hero |
| H2 | Source Serif 4 | 30 → 50 px (`--fs-h2`) | 300 | 1,14 | −0,015em | Títulos de sección |
| H3 | Source Serif 4 | 20 → 26 px (`--fs-h3`) | 400 | 1,14 | 0 | Rubros, pasos, tarjetas |
| Lead | Geist | 17 → 20 px (`--fs-lead`) | 400 | 1,6 | 0 | Bajada del hero y de secciones |
| Body | Geist | 16 → 17 px (`--fs-body`) | 400 | 1,6 | 0 | Texto corrido, máx. 60 caracteres |
| Small | Geist | 14 px | 400 | 1,5 | 0 | Notas, legales, ayuda de campos |
| Nav / botones | Geist | 14–15 px | 500 | 1 | 0 | Header, CTA |
| Eyebrow | Geist | 12,5 px | 600 | 1 | 0,16em, MAYÚSCULAS | Sobre cada H2 |
| Número de paso | Source Serif 4 itálica | `--fs-h2` | 300 | 1 | 0 | `01–04` del proceso |
| Wordmark marcas | Geist | 15 → 18 px | 600 | 1 | 0,12em, MAYÚSCULAS | PAMPERO · OMBÚ… |

Reglas:
- **Una itálica por titular**, siempre la palabra que carga el beneficio (`*no paran*`, `*todo tu equipo*`).
- Teléfonos y cifras con `font-variant-numeric: tabular-nums`.
- Nunca texto en mayúsculas de más de 4 palabras fuera de eyebrows y wordmarks.
- Preload solo de Source Serif 4 300 (la del H1, que define el LCP).

---

## 3. Menús y navegación (oficial)

### 3.1 Barra superior (≥ 768 px)
`Desde 2011 en Chilecito, La Rioja` · a la derecha: `WhatsApp empresas 3825 529781` · `Local 3825 666774`. Fondo `--bordo-900`. Sin cambios.

### 3.2 Header desktop (≥ 1024 px)

```
LAVORO     Tienda ↗   Empresas   Rubros ▾   Personalización   Contacto        [ Cotizar ]
```

- Se **sacan** "Catálogo" (duplica a Tienda; el catálogo se alcanza desde el hero) y "Marcas" (queda en el footer y en la home).
- Activo: subrayado dorado de 2 px (ya implementado). En `/empresas`, "Empresas" queda activo.
- Header blanco fijo con sombra al hacer scroll (decisión d5; reemplaza el "transparente sobre hero" de `03` §5).

### 3.3 Mega menú "Rubros" (≥ 1024 px)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ RUBROS QUE EQUIPAMOS                │  [ foto 4:3 del rubro en hover/foco ]   │
│ Minería          Talleres           │                                         │
│ Petroleras       Salud              │  Frase corta del rubro (copy.mega)      │
│ Campos y fincas  Gastronomía        │  Cotizar para Minería →                 │
│ Bodegas          Colegios           │                                         │
│ Construcción     Municipios         │                                         │
│ ─────────────────────────────────── │                                         │
│ Ver todos los rubros →  (/empresas#rubros)                                    │
└───────────────────────────────────────────────────────────────────────────────┘
```
- Eyebrow "Rubros que equipamos" (nunca "clientes"). Dos columnas de 5. Foto ambiental con `alt` neutro.
- Abre con click y teclado; hover con retardo 150 ms / cierre 300 ms (ya implementado). `Esc` cierra y devuelve el foco.

### 3.4 Menú mobile (< 1024 px)
Pantalla completa `--bordo-900`, links en serif 28 px:

1. Tienda ↗
2. Empresas
3. Rubros (acordeón con los 10)
4. Personalización
5. Contacto

Abajo, fijos: **[Cotizar para empresas]** (dorado) · **WhatsApp empresas** (secundario) · línea chica "Local 3825 666774".
El header mobile mantiene `LAVORO` + `Cotizar` + hamburguesa (no se agrega barra inferior fija).

### 3.5 Footer
5 columnas (desktop) / acordeón no, lista apilada (mobile): Marca + "Desde 2011" · Tienda (categorías) · Empresas (Cotizar, Rubros, Personalización, **Marcas**) · Contacto · Legales (+ **Créditos de imágenes**, ver §5.5). Línea final `© 2026 LAVORO · [[PENDIENTE: razón social / CUIT]]`.

---

## 4. Secciones de la home (orden y fondos definitivos)

| # | Sección | Componente | Fondo | CTA (1 primario + 1 secundario máx.) | Alto objetivo 375 px |
|---|---|---|---|---|---|
| 1 | Hero | `Hero` | blanco | Ver tienda · Cotizar para empresas | 1 pantalla + tarjetas |
| 2 | Hechos | `Confianza` | `--sand` | — | ≤ 700 px |
| 3 | Catálogo (B2C) | `Catalogo` | blanco | Ver toda la tienda | ≤ 1.100 px |
| 4 | Marcas | `Marcas` | blanco, filete arriba | — | ≤ 300 px |
| 5 | Empresas | `EmpresasHome` | `--sand` | Solicitar cotización · Ver página para empresas | ≤ 1.000 px |
| 6 | Rubros | `RubrosGrid` | `--bordo-900` (oscuro 1) | Cotizar para mi rubro (tarjetas) | ≤ 1.100 px |
| 7 | Personalización | `Personalizacion` | blanco | Consultar personalización | ≤ 1.000 px |
| 8 | Proceso | `Proceso` | `--sand` | — (el formulario está debajo) | ≤ 800 px |
| 9 | Formulario `#contacto` | `Cotizar` | blanco | Enviar solicitud · WhatsApp | ≤ 2.000 px |
| 10 | Local | `Local` | foto + tarjeta blanca | Escribir al local · Cómo llegar | ≤ 900 px |
| 11 | Cierre | `Cierre` | `--bordo-700` (oscuro 1) | Hablar con LAVORO | ≤ 450 px |
| 12 | Footer | `Footer` | `--bordo-950` (oscuro 2) | — | — |

Regla de ritmo: claro → arena → claro… con **un solo bloque oscuro en el medio** (Rubros, donde las fotos lucen) y el par Cierre + Footer al final.

### 4.1 Hero
- **Mobile:** foto 4:3 arriba a sangre (recorte propio con `object-position`), debajo eyebrow + H1 + bajada + las 2 tarjetas de camino apiladas y compactas (padding 16 px, sin texto descriptivo largo).
- **Desktop:** se mantiene el partido texto/foto actual.
- Tarjeta B2C "Para vos" con fondo `--bordo-050`; tarjeta B2B "Para empresas" en bordó. Iguales en alto.
- La foto es `<img fetchpriority="high">` sin `loading="lazy"`.

### 4.2 Hechos (Confianza)
Titular de `04` §3 a la izquierda + 4 hechos **sin tarjetas**: lista con filete dorado a la izquierda, título serif y una línea. Hechos permitidos (solo estos): Desde 2011 · Local físico para ver y probar · Bordado y estampado · Atención por WhatsApp.

### 4.3 Catálogo
- **Hasta tener fotos propias de producto:** lista editorial en 2 columnas (desktop) / 1 columna (mobile). Cada fila: nombre en serif H3 + descripción de `copy.categorias.descripciones` + flecha; fila entera clicable, filete `--line` entre filas. Sin números ni cajas.
- **Con fotos propias (Bloque B1):** grilla 4×2 / 2×4 de tiles 4:5 con nombre sobre la foto (spec `04` §4). El cambio es solo de componente; los links ya salen de `site.ts`.

### 4.4 Marcas
Franja liviana sobre blanco (ya no bloque bordó): "Marcas que *trabajamos*." a la izquierda, wordmarks en `--steel` a la derecha separados por `·`. `[[PENDIENTE: lista completa]]` visible en dev.

### 4.5 Empresas (bloque B2B de la home)
Split foto (talleres) / texto + "Qué podemos cotizar" en 2 columnas con viñeta dorada. Se mantiene.

### 4.6 Rubros
Grilla de 10 fotos 4:3 (5×2 desktop · 2×5 mobile) sobre `--bordo-900`, nombre del rubro en serif blanco con overlay. Cada tile → `/empresas?rubro=<slug>#cotizar`. Debajo de la grilla, línea chica: "Imágenes ilustrativas de cada rubro." (honestidad sobre el stock).

### 4.7 Personalización
Foto de bordadoras a la izquierda, 3 puntos numerados a la derecha (Bordado · Estampado · Asesoramiento) sobre **blanco**. `[[PENDIENTE: mínimos de personalización]]`.

### 4.8 Proceso
4 pasos en fila (desktop) / columna (mobile) sobre `--sand`, números en serif itálica `--bordo-700`. Sin CTA propio: el formulario sigue inmediatamente. `[[PENDIENTE: confirmar modalidades]]` en el paso 4.

### 4.9 Formulario, Local, Cierre
Ver §6.2 (formulario). Local y Cierre sin cambios de estructura.

### 4.10 `/empresas` (orden definitivo)
Hero empresas → Qué podemos cotizar → Rubros (grilla) → Personalización → Proceso → Por qué LAVORO (mismo componente que Hechos) → Formulario `#cotizar` → Cierre.

---

## 5. Fotografía

### 5.1 Dirección de arte
- **Qué sí:** trabajo real y textura (grafa, cuero de botín, costuras, polvo, luz de tarde riojana), manos trabajando, prendas en uso, el local y su mostrador.
- **Qué no:** gente sonriendo a cámara con casco impecable, logos de terceros visibles, fotos con marcas de otras empresas en la ropa, fondos de estudio azulados.
- **Color:** cálido y levemente desaturado. Si se editan, un único ajuste para todas: temperatura +5, saturación −10, contraste +5. Nada de filtros de Instagram.
- **Encuadre:** sujeto descentrado (regla de tercios), aire en la parte inferior-izquierda cuando lleva texto encima.

### 5.2 Slots del sitio (estado al 18/10)

| Slot | Archivo (`src/assets/img/…`) | Ratio / tamaño mínimo | Fuente | Estado |
|---|---|---|---|---|
| Hero home | `hero/home.jpg` | 3:2 · 2400 px ancho (recorte mobile 4:3 por `position`) | Stock → propia ideal | Stock CC BY |
| Hero /empresas | `hero/empresas.jpg` | ídem | Stock | Stock CC BY |
| Rubros ×10 | `rubros/<slug>.jpg` | 4:3 · 1600×1200 | Stock ambiental | Stock (créditos en `09`) |
| Categorías ×8 | `categorias/<slug>.jpg` | 4:5 · 1200×1500 | **Propias** | Relleno gris → lista editorial (§4.3) |
| Personalización | `personalizacion/bordado.jpg` | 4:3 · 1600 px | Propia si hay bordadora; si no, stock | Stock dominio público |
| Local | `local/chilecito.jpg` | 16:9 · 2400 px | **Propia** (fachada o interior) | Paisaje de la zona (no es el local) |
| OG / redes | `public/og-image.jpg` | 1200×630 | Propia o hero | `[[PENDIENTE: og-image]]` |

Para reemplazar: pisar el archivo con el **mismo nombre** y poner `pending: null` + `alt` en `src/config/images.ts`. Astro genera AVIF/WebP.

### 5.3 Lista de tomas para la sesión en el local (Bloque B1/B2)

Celular en modo foto normal (no retrato), lente principal, luz de ventana, sin flash, JPG máxima calidad. Limpiar el lente.

| # | Toma | Para | Orientación |
|---|---|---|---|
| 1 | Fachada del local de día, con cartel | Local | Horizontal |
| 2 | Interior: estanterías con prendas dobladas por color | Local / OG | Horizontal |
| 3 | Mostrador con prendas apiladas (sin personas o de espaldas) | Local | Horizontal |
| 4 | Pared de calzado de seguridad | Categoría calzado | Vertical |
| 5–12 | Una prenda representativa por categoría (pantalón, camisa, overol, elementos, ambo, chaqueta de cocina, uniforme escolar) colgada o doblada sobre fondo liso | Categorías ×8 | Vertical 4:5 |
| 13 | Detalle de costura / tela de grafa (macro) | Personalización / textura | Horizontal |
| 14 | Bordado terminado en una prenda (logo genérico o de LAVORO, **nunca de un cliente sin permiso**) | Personalización | Horizontal |
| 15 | Bordadora o estampadora en uso (si existe en el local) | Personalización | Horizontal |
| 16 | Manos doblando o etiquetando prendas | Proceso / Empresas | Horizontal |
| 17 | Botín de seguridad apoyado en tierra/piedra (exterior, Chilecito) | Hero alternativo | Horizontal |
| 18 | Prendas en uso por alguien de la familia/equipo, de espaldas o sin cara | Hero / Empresas | Horizontal y vertical |

Productos para Tiendanube: 3 por producto (frente, detalle, uso), fondo blanco/gris liso, 1:1. Ver `05` §6.

### 5.4 Entrega de archivos
Carpeta compartida `LAVORO/fotos/AAAA-MM-DD/`, nombre `<slot>-<n>.jpg` (ej.: `categoria-pantalones-1.jpg`). Se elige 1 por slot y se copia a `src/assets/img/` con el nombre del slot.

### 5.5 Créditos (obligatorio antes de publicar)
Las fotos CC BY exigen atribución visible. Ticket **T15**: página `/legales/creditos-imagenes` generada desde `images.ts` (autor, licencia, link, "recortada") + link en el footer. Cuando una foto pasa a ser propia, desaparece de la lista sola.

---

## 6. Bloque D — pulido de la landing

### 6.1 Cambios de interfaz (resumen de §1–5)
1. Token `--sand` + mapa de fondos de §4.
2. Header de 5 links; menú mobile con el orden de §3.4.
3. Hero mobile con foto arriba.
4. Confianza sin tarjetas; Marcas como franja clara; Personalización sobre blanco; Rubros sobre `--bordo-900`.
5. Catálogo como lista editorial.
6. Orden de la home: Proceso pasa a estar justo antes del formulario.
7. Página de créditos de imágenes.

### 6.2 Formulario (UI, sin cambiar campos ni validación de `05` §2)
- Dos grupos con `<fieldset>` y título chico numerado: **1. Tus datos** (nombre, empresa, WhatsApp, email, localidad) · **2. Tu pedido** (rubro, cantidad, qué necesitás, personalización, plazo, comentarios).
- Indicación arriba: "Los campos opcionales están marcados." (sin prometer tiempos de llenado ni de respuesta).
- Botón ancho completo en mobile. Consentimiento justo arriba del botón.
- Teléfono con `inputmode="tel"` y `autocomplete="tel"`; email `autocomplete="email"`; nombre `autocomplete="name"`; empresa `autocomplete="organization"`.

---

## 7. Bloque E — sistema de leads (manual operativo)

El código (`/api/lead`, Apps Script, Sheet, KPIs) ya está. Lo que falta es **cómo lo usa el negocio**.

### 7.1 Recorrido de un lead

```
Formulario ─▶ /api/lead ─▶ Apps Script ─▶ fila "Nuevo" en Sheet + mail a lavorouniformes@gmail.com
                                            │
           Dueño/vendedor abre el mail ─▶ toca el link wa.me del lead ─▶ escribe (plantilla 7.3)
                                            │
                       Sheet: estado "Contactado" + fecha_contacto + responsable
                                            │
                   Arma propuesta ─▶ "Cotizado" + monto_cotizado ─▶ "Ganado" / "Perdido"
```

### 7.2 Estados (columna `estado`)

| Estado | Significa | Quién lo pone | Siguiente paso |
|---|---|---|---|
| Nuevo | Llegó del formulario | Automático | Contactar |
| Contactado | Se le escribió o llamó | Responsable | Pedir datos que falten (talles, logo) |
| Cotizado | Se envió una propuesta con precio | Responsable | Seguimiento a los pocos días |
| Ganado | Compró | Responsable | Registrar `monto_cotizado` final |
| Perdido | No compró (anotar motivo en `notas`) | Responsable | — |
| Descartado | Spam, error o no es B2B (derivar a la tienda) | Responsable | — |

**Objetivo interno (no se publica):** pasar de Nuevo a Contactado en menos de 24 h hábiles. Se mide en la pestaña KPIs.

Mejoras al Apps Script (ticket **T16**):
- Formato condicional: fila en rojo claro si `estado = Nuevo` y pasaron más de 24 h desde `fecha`.
- Columna calculada `posible_duplicado` si el mismo `telefono` ya tiene otro lead en los últimos 30 días.
- Mail de aviso con el link `wa.me` **arriba de todo** y el texto de la plantilla 7.3 prellenado.

### 7.3 Plantillas de respuesta por WhatsApp (para copiar)

> No incluyen precios, plazos ni descuentos: esos datos los pone la persona en cada caso.

**Primer contacto**
> Hola {nombre}, soy {responsable} de LAVORO. Recibimos tu pedido de cotización para {empresa}. Para armarte la propuesta, ¿me confirmás los talles aproximados y si tenés el logo en buena calidad?

**Envío de propuesta**
> {nombre}, te paso la propuesta para {empresa}. Cualquier cambio de prendas, talles o personalización lo ajustamos. ¿Lo revisás y me decís?

**Seguimiento**
> Hola {nombre}, ¿pudiste ver la propuesta de LAVORO? Si querés, la vemos juntos o pasás por el local.

**Lead que es minorista (Descartado → tienda)**
> ¡Gracias por escribirnos! Para compras por unidad podés ver todo en nuestra tienda: [[PENDIENTE: URL tienda]]. Si necesitás algo puntual, escribinos al local: 3825 666774.

### 7.4 Rutina semanal (lunes, 15 minutos)
1. Filtrar `estado = Nuevo` → no debería quedar ninguno de la semana anterior.
2. Filtrar `Cotizado` con más de 7 días → mandar seguimiento.
3. Mirar KPIs: leads por rubro y por origen (`utm_source`) → decidir qué rubro empujar en redes.
4. Anotar en `notas` el motivo de cada "Perdido".

### 7.5 Datos personales (Ley 25.326)
- La Sheet se comparte **solo** con quien atiende ventas (no "cualquiera con el link").
- Leads Perdidos/Descartados con más de 12 meses: se borran. `[[REVISAR CONTADOR]]`
- La política de privacidad (`/legales/privacidad`) debe nombrar este uso: contacto comercial por la solicitud.

### 7.6 Prueba de punta a punta (E3) — checklist

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Envío normal con JS | Fila "Nuevo" + mail + pantalla de éxito con botón WhatsApp |
| 2 | Envío sin JS | Redirige a `/cotizacion/enviada`, fila creada |
| 3 | Campo obligatorio vacío | Error debajo del campo, foco en el primero, nada en la Sheet |
| 4 | Teléfono `03825 15-529781` | Se guarda como `5493825529781` |
| 5 | Honeypot con valor | Pantalla de éxito, **sin** fila |
| 6 | 6 envíos en 10 min | El 6.º muestra respaldo de WhatsApp |
| 7 | `LEAD_WEBHOOK_URL` vacío en preview | Respaldo de WhatsApp, no rompe |
| 8 | `?rubro=bodegas` en la URL | Select precargado en "Bodegas" |
| 9 | Evento `generate_lead` en GA4 DebugView y `Lead` en Meta | Registrados |

---

## 8. Plan de ejecución

| Ticket | Bloque | Qué | Docs | Fecha | Quién |
|---|---|---|---|---|---|
| ✅ **T12** | D | Tokens: `--sand`, mapa de fondos de §4, quitar fondos bordó de Marcas/Personalización/Proceso | 10 §1, §4 | Lun 19 | Codex |
| ✅ **T13** | D | Header de 5 links, menú mobile §3.4, mega menú con "Ver todos los rubros", footer con Marcas | 10 §3 | Lun 19 | Codex |
| ✅ **T14** | D | Hero mobile con foto arriba; Confianza sin tarjetas; Catálogo como lista editorial; reorden de la home y `/empresas` | 10 §4 | Mar 20 | Codex |
| ✅ **T15** | D | Página `/legales/creditos-imagenes` desde `images.ts` + link en footer | 10 §5.5 | Mar 20 | Codex |
| ✅ **T16** | E | Formulario en 2 grupos + `autocomplete`; Apps Script: formato condicional, posible duplicado, mail con wa.me arriba | 10 §6.2, §7.2 | Mié 21 | Codex |
| **T17** | E | Prueba de punta a punta (§7.6) con la Sheet real + capacitación de 15 min al dueño con §7 | 10 §7 | Jue 22 | Vos + dueño |
| B1–B2 | B | Sesión de fotos según §5.3 | 10 §5 | 19–21 | Vos + dueño |
| — | D | Cambiar Catálogo a tiles con foto cuando estén las 8 fotos | 10 §4.3 | Al recibir fotos | Codex |

Cada ticket se cierra con la definición de terminado de `AGENTS.md` §6 (375/768/1440, AA, foco, `prefers-reduced-motion`, build y check sin warnings) y el reporte de §7.

### Criterio de "profesional" para aprobar el 27/10
- [ ] Primer pantallazo en 375 px muestra foto, titular y los dos caminos (tienda / cotizar).
- [ ] Home ≤ 10.000 px de alto en 375 px. *Medido tras T12–T16 (18/10): 11.812 px con footer (10.221 hasta el Cierre); antes 13.754. Lo que más pesa: formulario (2.297) y footer (1.591).*
- [ ] Nunca más de 2 bloques oscuros seguidos.
- [ ] Ninguna foto de stock sin crédito publicado; ninguna presentada como cliente.
- [ ] Un lead de prueba llega a la Sheet, al mail, y el dueño sabe qué hacer con él (§7).
- [ ] Lighthouse mobile: Performance ≥ 90 · Accesibilidad ≥ 95 · SEO ≥ 95.

---

## 9. Fuera de alcance detectado (propuestas, no se programan)
- Barra inferior fija en mobile con "Tienda / Cotizar": descartada por ahora (el header ya tiene Cotizar fijo).
- Formulario en pasos reales (wizard): solo agrupación visual; un wizard es Fase 2.
- Respuesta automática por WhatsApp (API de WhatsApp Business): Fase 2.
- Presupuesto en PDF automático desde la Sheet: Fase 2 (ya listado en `02` §1).
