# 07 — Runbook Tiendanube (Bloque C, carga manual)

> Lo ejecuta una persona en el panel de Tiendanube. Este documento **no fue contrastado contra la cuenta ni contra la ayuda oficial**: cada paso marcado `[[VERIFICAR EN PANEL]]` hay que confirmarlo en pantalla antes de darlo por cierto. Los nombres de menú pueden variar según el plan y las actualizaciones de Tiendanube.
> Cero datos inventados: todo valor comercial (costos, plazos, mínimos, descuentos) lo define el dueño y mientras tanto queda `[[PENDIENTE]]`.

## 0. Antes de empezar

- [ ] Plan contratado: `[[PENDIENTE: plan Tiendanube contratado]]`. `docs/02` A3 pide Impulso o superior (tabla mayorista, dominio propio). [[VERIFICAR EN PANEL]] qué incluye cada plan hoy.
- [ ] Dominio: `[[PENDIENTE: dominio]]`. Subdominio `tienda.` soportado: [[VERIFICAR EN PANEL]] / consultar a soporte de Tiendanube. Plan B en `docs/02` §4.
- [ ] Datos del negocio a mano: `[[PENDIENTE: CUIT / razón social]]`, `[[PENDIENTE: dirección del local]]`, `[[PENDIENTE: horarios]]`, `[[PENDIENTE: redes]]`.
- [ ] Datos de contacto confirmados (de `docs/01` §2): mail lavorouniformes@gmail.com · WhatsApp local 3825 666774.

---

## C1 — Pagos, envíos y retiro en el local

### Medios de pago
1. Ir a Configuración → Medios de pago [[VERIFICAR EN PANEL]].
2. Activar Pago Nube y/o Mercado Pago [[VERIFICAR EN PANEL]: cuáles están disponibles para el plan y el CUIT].
3. Medios a habilitar (tarjeta, transferencia, efectivo en local, etc.): `[[PENDIENTE: medios de pago a habilitar]]`.
4. Cuotas, recargos o descuentos por medio de pago: `[[PENDIENTE: política de cuotas/descuentos]]`. **No activar ninguno sin decisión del dueño.**
5. Cargar datos de la cuenta bancaria / vinculación según pida el panel.

### Envíos
1. Configuración → Medios de envío [[VERIFICAR EN PANEL]].
2. Opciones posibles (el panel dice cuáles están disponibles): envío por correo/transportista integrado, envío con costo propio o por zona. Elegir: `[[PENDIENTE: medios de envío]]`.
3. Zonas y costos: `[[PENDIENTE: zonas y costos de envío]]`. Plazos: `[[PENDIENTE: plazos de entrega]]`.
4. Datos del paquete (peso/medidas por producto) si el medio de envío los exige [[VERIFICAR EN PANEL]].
5. En la landing, "Envíos a todo el país" se publica **solo cuando** el dueño confirme que está configurado (`docs/01` §3).

### Retiro en el local
1. Crear la opción "Retiro en el local" [[VERIFICAR EN PANEL]] (puede estar como punto de retiro o envío de costo cero).
2. Dirección: `[[PENDIENTE: dirección del local]]`. Horarios: `[[PENDIENTE: horarios]]`.
3. Costo: lo que defina el dueño (`[[PENDIENTE: costo de retiro]]`). No poner "gratis" sin confirmación.
4. Revisar el texto del mail de "listo para retirar" [[VERIFICAR EN PANEL]].

---

## C2 — Categorías

1. Productos → Categorías [[VERIFICAR EN PANEL]].
2. Crear las 3 categorías de `data/tiendanube/categorias.md` (Indumentaria, Calzado, Elementos de seguridad) en ese orden, con ese nombre y ese slug.
3. Anotar la URL real de la tienda y completar `TIENDA_URL` en `src/config/site.ts` (las categorías se arman solas).
4. Ordenar en el menú de la tienda [[VERIFICAR EN PANEL]].

## C3 — Carga de productos

> **Pendiente de entregable:** la planilla y el script `build_import.ts` no están hechos porque falta `data/tiendanube/modelo_importacion.csv`. Hasta entonces:

- Opción A (segura): cargar los 40–60 productos prioritarios a mano en el panel, uno por uno.
- Opción B: cuando exista el script, importar `out/import_tiendanube.csv` en Productos → Importar [[VERIFICAR EN PANEL]] y revisar el resultado antes de publicar.

Datos por producto (de `docs/02` B4): nombre, marca, categoría, talles, colores, material, tabla de medidas, precio minorista, stock, fotos (3 por producto, 1:1 o 4:5, fondo liso). Lista de productos: `[[PENDIENTE: lista de productos prioritarios]]`. Precio y stock los define el dueño; nunca se completan por defecto.

Checks al terminar: un producto sin precio o con stock vacío no se publica (el stock vacío puede tomarse como ilimitado [[VERIFICAR EN PANEL]]).

---

## C4 — Tabla de precios mayorista

1. Buscar la función "Tablas de precios" / "Precios mayoristas" [[VERIFICAR EN PANEL]]. Según `docs/05` §1 requiere plan Impulso (1 tabla) o Escala (3 tablas) — dato **no confirmado**.
2. Crear la tabla (nombre sugerido: "Mayorista") [[VERIFICAR EN PANEL]].
3. Definir y registrar las condiciones (el dueño decide, nada se inventa):
   - Monto mínimo de compra: `[[PENDIENTE: monto/cantidad mínima]]`
   - Cantidad mínima de unidades: `[[PENDIENTE: monto/cantidad mínima]]`
   - Alcance del descuento: catálogo, categoría o producto: `[[PENDIENTE: alcance de la tabla]]`
   - Valor del descuento o precios: `[[PENDIENTE: % o precios de la tabla mayorista]]`
4. Verificar cómo se aplica: ¿automático al llegar al mínimo, o por cliente aprobado? [[VERIFICAR EN PANEL]]. `docs/02` deja "cuentas mayoristas aprobadas" para Fase 2.
5. Probar en el carrito con y sin llegar al mínimo.
6. Si el plan no lo permite: el B2B sigue por formulario de cotización + WhatsApp (ya cubierto por la landing). Anotarlo como riesgo.
7. No comunicar descuentos mayoristas en la landing hasta tener los valores aprobados.

---

## C5 — Tema (colores, tipografías, banners)

Seguir `docs/08_TIENDANUBE_TEMA.md`.
1. Elegir un tema base [[VERIFICAR EN PANEL]] y personalizar desde el editor de diseño.
2. Aplicar paleta y tipografías según la tabla de `08`.
3. Subir banners con las medidas de `08` (desktop y mobile).
4. Si el plan permite CSS personalizado [[VERIFICAR EN PANEL]], pegar `theme/tiendanube-custom.css`; si no, omitirlo.
5. Revisar en 375, 768 y 1440 px, y en un celular real.
6. Fotos: nunca presentar fotos de stock como clientes o trabajos de LAVORO.

---

## C6 — Legales, arrepentimiento, Data Fiscal, Meta e Instagram

### Páginas legales
1. Crear páginas (Contenido → Páginas [[VERIFICAR EN PANEL]]): Términos y condiciones, Política de privacidad, Cambios y devoluciones.
2. Pegar el texto de `data/tiendanube/legales/*.md`. **Están marcados `[[REVISAR CONTADOR]]`: no publicar sin revisión.**
3. Completar `[[PENDIENTE: CUIT / razón social]]` y datos de contacto.
4. Enlazar las tres páginas en el pie de la tienda [[VERIFICAR EN PANEL]].

### Botón de arrepentimiento
1. Verificar si Tiendanube lo trae nativo [[VERIFICAR EN PANEL]]. Referencia normativa: Res. 424/2020 de la Secretaría de Comercio Interior — `[[REVISAR CONTADOR]]` que sea aplicable y cómo.
2. Si no es nativo: página/enlace visible en el pie que lleve al formulario o canal de arrepentimiento. `[[PENDIENTE: canal del botón de arrepentimiento]]`.
3. Pasar la URL final a la landing (T10: `[[PENDIENTE: URL botón de arrepentimiento]]`).
4. Incluir el link a Defensa del Consumidor [[PENDIENTE: URL oficial a verificar]].

### Data Fiscal (ARCA)
1. El titular del CUIT genera el QR de Data Fiscal en ARCA `[[PENDIENTE: QR Data Fiscal]]`.
2. Colocarlo en el pie de la tienda [[VERIFICAR EN PANEL]] (imagen + enlace). Validar con el contador.

### Meta e Instagram
1. Ir a Canales de venta / Integraciones → Meta [[VERIFICAR EN PANEL]].
2. Conectar Business Manager y página de Facebook/Instagram: `[[PENDIENTE: redes]]`. Requisitos de la cuenta [[VERIFICAR EN PANEL]].
3. Activar catálogo y Pixel desde la integración nativa.
4. Si hay Pixel en la landing, usar el mismo ID o documentar cuál es cada uno `[[PENDIENTE: ID Pixel]]`.
5. Conectar Google Analytics desde el panel `[[PENDIENTE: ID GA4]]`.
6. Verificar en Meta Events Manager que el Pixel recibe eventos.

---

## C7 — Compra de prueba y reembolso

Antes: verificar que todo el catálogo de prueba tenga precio y stock reales.

Checklist (marcar y anotar fecha/responsable):
- [ ] Producto de bajo valor agregado al carrito desde la categoría correcta.
- [ ] El carrito calcula bien variantes (talle/color), precio y envío o retiro.
- [ ] Checkout con medio de pago real (tarjeta o Mercado Pago).
- [ ] Llega mail de confirmación al cliente (texto correcto, sin datos inventados).
- [ ] Llega aviso de venta al negocio (lavorouniformes@gmail.com u otro configurado).
- [ ] El stock se descuenta.
- [ ] La orden aparece en el panel con estado correcto.
- [ ] Retiro en local: mail/estado de "listo para retirar".
- [ ] Envío: etiqueta/seguimiento según el medio elegido [[VERIFICAR EN PANEL]].
- [ ] Compra mayorista: la tabla se aplica solo al cumplir condiciones (C4).
- [ ] Pixel/GA4 registran compra [[VERIFICAR EN PANEL]].
- [ ] Reembolso total de la orden de prueba desde el panel / medio de pago, y verificar que llega el reintegro y que el stock se repone [[VERIFICAR EN PANEL]].
- [ ] Páginas legales y botón de arrepentimiento accesibles desde el pie.
- [ ] Prueba en celular real, 4G.

Resultado: `[[PENDIENTE: resultado de la compra de prueba]]`.
