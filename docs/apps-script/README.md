# Apps Script — receptor de leads B2B (E1 / T08)

Cómo dejar andando la planilla **"LAVORO — Leads"** y el webhook que recibe el formulario de cotización de la web.

Se hace **una sola vez** y a mano, con la cuenta de Google `lavorouniformes@gmail.com`. Se tarda unos 15 minutos. No hace falta programar nada.

```
Formulario web ─▶ /api/lead (Vercel) ─▶ este Apps Script ─┬─▶ fila nueva en la pestaña "Leads"
                                                          └─▶ mail a lavorouniformes@gmail.com
```

---

## 1. Crear la planilla

1. Entrar a [sheets.new](https://sheets.new) con la cuenta `lavorouniformes@gmail.com`.
2. Ponerle de nombre **LAVORO — Leads**.
3. No hace falta crear columnas: el script lo hace en el paso 3.

## 2. Pegar el script

1. En la planilla: **Extensiones → Apps Script**.
2. Borrar todo lo que aparece en `Código.gs` y pegar el contenido completo de [`lead.gs`](./lead.gs).
3. Guardar (ícono del disquete o `Ctrl + S`). Nombre del proyecto: **LAVORO Leads**.
4. **Configuración del proyecto** (ícono de engranaje, a la izquierda):
   - **Zona horaria:** `(GMT-03:00) Buenos Aires`.
   - **Propiedades del script → Agregar propiedad:**

     | Propiedad | Valor |
     |---|---|
     | `LEAD_WEBHOOK_SECRET` | Una clave larga al azar (ver abajo). **Obligatoria.** |
     | `LEAD_NOTIFY_EMAIL` | Opcional. Si no se carga, los avisos van a `lavorouniformes@gmail.com`. Se pueden poner varias direcciones separadas por coma. |

   Para generar la clave, en una terminal:

   ```bash
   openssl rand -hex 32
   ```

   Guardarla en un lugar seguro (gestor de contraseñas): la misma clave va después en Vercel. **No pegarla en el repo, en chats ni en mails.**

## 3. Armar las pestañas

1. En el editor, arriba, elegir la función **`configurarPlanilla`** y tocar **▶ Ejecutar**.
2. La primera vez Google pide permisos: **Revisar permisos → elegir la cuenta → Configuración avanzada → Ir a LAVORO Leads (no seguro) → Permitir**. El aviso de "no seguro" aparece porque el script es propio y no está verificado por Google; es normal.
3. Volver a la planilla. Tienen que aparecer:
   - **Leads**: las 24 columnas de `05 §3` + `posible_duplicado` al final. Las 6 de fondo amarillo son las que completa el negocio a mano: `estado`, `responsable`, `fecha_contacto`, `monto_cotizado`, `resultado`, `notas`.
   - `estado` tiene lista desplegable: Nuevo · Contactado · Cotizado · Ganado · Perdido · Descartado. Cada lead entra como **Nuevo**.
   - **Alerta de 24 h:** una fila que sigue en **Nuevo** más de 24 h después de `fecha` se pinta de rojo claro. Se va sola al cambiar el estado.
   - **`posible_duplicado`:** el script escribe `Sí — L-…` si el mismo teléfono ya mandó otra solicitud en los últimos 30 días. Solo avisa: no borra ni junta filas.
   - **KPIs**: resumen (totales, % contactados, tasa de cierre, monto ganado, % contactados al día siguiente o antes, posibles duplicados) y tablas por semana, rubro, origen y estado. Se actualizan solas.

Se puede volver a ejecutar `configurarPlanilla` sin perder filas ni duplicar la alerta (la pestaña KPIs sí se rehace desde cero: no escribir a mano en ella).

**Planilla creada con la versión anterior del script:** pegar el `lead.gs` nuevo, volver a ejecutar `configurarPlanilla` (agrega la columna `posible_duplicado` al final y la alerta) e **Implementar → Gestionar implementaciones → editar → Versión: nueva** para que la Web App use el código nuevo. La URL no cambia.

### El mail de aviso

Arriba de todo trae un link **wa.me** con el mensaje de primer contacto ya escrito (`docs/10 §7.3`): tocarlo desde el celular, cambiar `[tu nombre]` y enviar. Después, en la planilla: `estado = Contactado`, `fecha_contacto` y `responsable`. El resto de las plantillas de respuesta y la rutina semanal están en `docs/10_PULIDO_BLOQUES_D_E.md` §7.

## 4. Publicar como Web App

1. En el editor: **Implementar → Nueva implementación**.
2. Tipo (engranaje): **Aplicación web**.
3. Completar:
   - Descripción: `v1`
   - **Ejecutar como:** `Yo (lavorouniformes@gmail.com)`
   - **Quién tiene acceso:** `Cualquier usuario` (sin esto Vercel no puede llamarlo; lo protege la clave secreta)
4. **Implementar** → copiar la **URL de la aplicación web** (termina en `/exec`).
5. Comprobar que responde: abrir esa URL en el navegador. Tiene que mostrar `{"ok":true,"service":"lavoro-leads"}`.

> Si más adelante se cambia el código: **Implementar → Administrar implementaciones → ✏️ → Versión: Nueva versión → Implementar.** Así la URL no cambia. Crear una "Nueva implementación" genera otra URL y habría que actualizar Vercel.

## 5. Cargar las variables en Vercel

En el proyecto de Vercel: **Settings → Environment Variables**, para los entornos **Preview** (y Production cuando el dueño apruebe la salida):

| Variable | Valor |
|---|---|
| `LEAD_WEBHOOK_URL` | La URL `/exec` del paso 4 |
| `LEAD_WEBHOOK_SECRET` | La misma clave del paso 2 |

Después hacer un redeploy del preview para que las tome. Para probar en local, copiarlas en `.env` (nunca en `.env.example`).

Si `LEAD_WEBHOOK_URL` queda vacía, la web no se rompe: el formulario ofrece el botón de WhatsApp como respaldo (criterio de T08).

## 6. Probar

**Desde el editor (prueba el script solo):**

1. Elegir la función **`probarLead`** → **▶ Ejecutar**.
2. En el registro tiene que aparecer `{"ok":true,"id":"L-…","mail":true}`.
3. Verificar en la planilla: fila nueva con nombre `PRUEBA — borrar`, estado `Nuevo`, y el comentario `=SUMA(1;1)…` visto **como texto** (no como fórmula).
4. Verificar que llegó el mail `Nuevo lead B2B — PRUEBA (Otras empresas)`. Mirar también Spam la primera vez y marcarlo como "No es spam".
5. **Borrar la fila de prueba.**

**Desde la terminal (prueba la URL publicada):**

```bash
curl -sL -X POST "$LEAD_WEBHOOK_URL" -H "Content-Type: application/json" -d '{"secret":"clave-incorrecta","lead":{}}'
```

Tiene que responder `{"ok":false,"error":"unauthorized"}` y **no** crear filas. (`-L` hace falta porque Google responde con una redirección.)

La prueba de punta a punta (formulario → Vercel → planilla → mail) es la tarea **E3**, cuando esté el endpoint `/api/lead`.

**En la compu, sin la planilla (receptor local):**

`scripts/webhook-local.mjs` imita este script con el mismo contrato, para probar el formulario sin Google.

1. Crear `.env.development` con `LEAD_WEBHOOK_URL=http://127.0.0.1:4500/exec` y un `LEAD_WEBHOOK_SECRET` (ver `.env.example`).
2. Correr `npm run webhook:local` y, en otra terminal, `npm run dev`.
3. Mandar una cotización desde `http://localhost:4321/empresas#cotizar`.
4. Verla en la planilla local: `http://127.0.0.1:4500`. Se guarda en `data/leads-local/leads.csv` (no se versiona) y no envía mail.

---

## Referencia técnica (para `/api/lead`)

**Request:** `POST <LEAD_WEBHOOK_URL>`, `Content-Type: application/json`, siguiendo redirecciones.

```json
{
  "secret": "<LEAD_WEBHOOK_SECRET>",
  "lead": {
    "id": "opcional, [A-Za-z0-9_-]{6,64}; si se repite, no se duplica la fila",
    "nombre": "…", "empresa": "…", "telefono": "5493825529781",
    "email": "", "localidad": "…", "rubro": "Minería",
    "cantidad": "11–30", "productos": ["Pantalones", "Camisas"],
    "personalizacion": "Bordado", "plazo": "", "comentario": "",
    "pagina": "/empresas", "utm_source": "", "utm_medium": "", "utm_campaign": "", "referrer": ""
  }
}
```

- **El secreto va en el cuerpo, no en el header `X-Lavoro-Secret`:** Apps Script no le pasa los headers de la request a `doPost`. Esto corrige lo que dice `05 §4`.
- `rubro`: mandar el texto largo (`longLabel` de `site.ts`), no el slug, para que la planilla se lea bien.
- `productos`: array o texto; se guarda como `Pantalones, Camisas`.
- `telefono`: ya normalizado a `549…` por `/api/lead`.
- `fecha`, `estado`, `posible_duplicado` y las columnas manuales las pone el script; si vienen en el payload se ignoran.
- Requeridos mínimos en el script: `nombre`, `empresa`, `telefono` (la validación completa es la de `zod` en `/api/lead`).
- Textos que empiezan con `=`, `+`, `-` o `@` se guardan con `'` adelante, para que no se ejecuten como fórmula.
- Largo máximo: 1000 caracteres en `comentario`, 500 en `referrer`, 300 en `pagina`, 200 en el resto.

**Response** (siempre HTTP 200; mirar el campo `ok`):

| Respuesta | Significado | Qué hace `/api/lead` |
|---|---|---|
| `{"ok":true,"id":"…","mail":true}` | Fila guardada y mail enviado | Éxito |
| `{"ok":true,"id":"…","mail":false}` | Fila guardada, el mail falló | Éxito (el lead está en la planilla); loguear aviso |
| `{"ok":true,…,"duplicado":true}` | Ese `id` ya existía | Éxito |
| `{"ok":false,"error":"unauthorized"}` | Clave incorrecta o sin configurar | Respaldo WhatsApp + log de error |
| `{"ok":false,"error":"invalid"}` | Faltan nombre, empresa o teléfono | Respaldo WhatsApp + log |
| `{"ok":false,"error":"busy"}` | Otro envío tenía la planilla tomada > 10 s | Reintentar 1 vez con el mismo `id` |
| `{"ok":false,"error":"server"}` | Error interno (ver Ejecuciones en Apps Script) | Respaldo WhatsApp + log |
| HTML en vez de JSON | URL mal copiada o acceso no es "Cualquier usuario" | Respaldo WhatsApp + log |

## Límites y mantenimiento

- **Cupo de mails de Google:** cuenta Gmail gratuita, unos 100 destinatarios por día. Sobra para el lanzamiento; si `LEAD_NOTIFY_EMAIL` tiene varias direcciones, cada una cuenta.
- **Validación de `estado`:** queda aplicada a las primeras ~1000 filas. Si algún día se pasa de eso, volver a ejecutar `configurarPlanilla`.
- **Errores:** en el editor, **Ejecuciones** (ícono de lista) muestra cada llamada y sus errores.
- **Cambiar la clave:** actualizar la propiedad `LEAD_WEBHOOK_SECRET` y la variable en Vercel al mismo tiempo, y redeployar.
- **Datos personales:** la planilla tiene datos de contacto de personas (Ley 25.326). Compartirla solo con quien atiende los leads, nunca con enlace público.
