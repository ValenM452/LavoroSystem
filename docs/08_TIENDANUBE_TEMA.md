# 08 — Tema de Tiendanube

> Traduce `docs/03_SISTEMA_DE_DISENO.md` a lo que permite el editor de un tema de Tiendanube. Lo que depende del tema o del plan está marcado `[[VERIFICAR EN PANEL]]`; no se afirma que algo sea posible sin comprobarlo.

## 1. Paleta

Hex provisionales hasta tener el logo en vector. `[[PENDIENTE: bordó exacto del logo]]`.

| Rol en la tienda | Token | Hex |
|---|---|---|
| Fondo base | `--paper` | `#F4F1EB` |
| Fondo alterno | `--paper-2` | `#EAE5DC` |
| Texto principal | `--ink` | `#121212` |
| Texto secundario | `--steel` | `#5E5E5E` |
| Botón primario / acento | `--bordo-700` | `#6B1C2A` |
| Hover | `--bordo-500` | `#8E2A3B` |
| Texto sobre acento | `--on-accent` | `#FFFFFF` |
| Footer / fondos profundos | `--bordo-900` | `#3E1119` |
| Líneas | `--line` | `rgba(18,18,18,.14)` (usar `#D9D7D2` si el editor no admite alfa) |

Reglas: bordó solo en CTA primario, paneles de contraste y detalles. Sin degradados salvo el overlay de texto sobre foto. Los colores en el editor se cargan por campos (fondo, texto, botón, etc.) [[VERIFICAR EN PANEL]]: mapear cada token al campo más cercano del tema elegido. Comprobar contraste AA (texto blanco sobre `#6B1C2A` y `#3E1119` cumple; verificar el resto en pantalla).

## 2. Tipografías

| Rol | Ideal (`03`) | Si el tema no la ofrece |
|---|---|---|
| Títulos | Source Serif 4 (300/400, itálica) | Serif del selector del tema lo más cercana (p. ej. una serif editorial de la lista) [[VERIFICAR EN PANEL]] |
| Texto/UI | Geist (400/500/600) | Sans neutra del selector del tema [[VERIFICAR EN PANEL]] |

- El editor nativo suele ofrecer solo una lista de Google Fonts [[VERIFICAR EN PANEL]]; Source Serif 4 y Geist pueden o no estar.
- Cargar fuentes propias o por `@import` requiere CSS personalizado / edición del tema, que depende del plan [[VERIFICAR EN PANEL]].
- Títulos en peso 300, interlineado ajustado (1.04–1.12); la itálica en una palabra por titular requiere HTML en el texto del banner, que el editor puede no permitir [[VERIFICAR EN PANEL]].

## 3. Banners

Las medidas dependen del tema elegido: **confirmar en el editor del tema** (suele indicar el tamaño recomendado). Mientras tanto, usar las del sistema de la landing (`docs/05` §6) como punto de partida:

| Uso | Desktop | Mobile | Notas |
|---|---|---|---|
| Banner principal | 2400×1350 (16:9) | 1080×1600 (vertical) | Zona de texto abajo-izquierda; overlay `linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0) 60%)` para AA |
| Banner de categoría / promo | 2400×1000 [[VERIFICAR EN PANEL]] | 1080×1080 [[VERIFICAR EN PANEL]] | Medidas tentativas, ajustar al tema |
| Tile de categoría | 1200×1500 (4:5) | ídem | Mismo formato que las tiles de la landing |

- Formato: JPG o WebP optimizado, idealmente < 300 KB por banner (4G).
- Si el tema ofrece un banner distinto para mobile, usarlo; si no, componer una imagen que recorte bien en ambos.
- Textos en el banner: voseo, sin superlativos, **sin precios ni descuentos hasta que existan** (`[[PENDIENTE: promociones]]`).
- Fotos de stock = solo ambientales, sin rotular como clientes.

## 4. Elementos de estilo que sí se pueden aproximar

- Botones: píldora (radio 999px) solo con CSS personalizado [[VERIFICAR EN PANEL]]; si no, usar el radio más alto que permita el tema.
- Sin sombras ni degradados: desactivar sombras en tarjetas si el tema las trae.
- Inputs con radio 2px y borde: igual, solo con CSS.

## 5. CSS personalizado

`theme/tiendanube-custom.css` — **usar solo si el plan permite CSS personalizado** [[VERIFICAR EN PANEL]]. Los selectores son genéricos: cada tema tiene clases distintas, hay que inspeccionar y ajustar. No es un reemplazo de la configuración nativa; probar en un tema duplicado antes de publicar.
