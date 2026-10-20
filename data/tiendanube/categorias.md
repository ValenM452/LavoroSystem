# Categorías de la tienda (Tiendanube) — espejo de la landing

> Fuente: `docs/04_LANDING_ESPECIFICACION.md` §4 (8 tiles) + "Promociones" (`docs/02` C2, solo existe en la tienda).
> Discrepancia detectada: `02` C2 dice "Seguridad" y "Uniformes salud"; la landing dice "Elementos de seguridad" y "Salud". Se usan los nombres de la landing. **El dueño confirma.**

## Árbol (decisión del dueño, 20/10/2026)

Tres categorías de primer nivel. La landing (home, /tienda, footer y páginas de rubro) muestra solo estas tres
y cada botón abre su catálogo en Tiendanube.

| Orden | Nombre (en la tienda) | Slug / URL | URL completa |
|---|---|---|---|
| 1 | Indumentaria | `indumentaria` | `https://lavoro8.mitiendanube.com/indumentaria/` |
| 2 | Calzado | `calzado` | `https://lavoro8.mitiendanube.com/calzado/` |
| 3 | Elementos de seguridad | `elementos-de-seguridad` | `https://lavoro8.mitiendanube.com/elementos-de-seguridad/` |

**Estado al 20/10/2026:** la tienda (`https://lavoro8.mitiendanube.com`) responde, pero ninguna de las tres categorías está
creada (las tres URLs dan 404). Mientras tanto, los botones de la landing abren el catálogo completo (`/productos/`).
Al crear cada categoría con ese nombre y ese slug, poner `creada: true` en `src/config/site.ts`.

Notas:
- Qué entra en cada una (de 01 §1): **Indumentaria** = pantalones cargo, camisas, overoles, ropa de grafa y uniformes
  (escolares, salud, gastronómicos); **Calzado** = botines, borcegos y zapatos de seguridad; **Elementos de seguridad** =
  elementos e indumentaria de seguridad.
- Si hacen falta subcategorías (p. ej. Pantalones o Uniformes dentro de Indumentaria), se crean en Tiendanube; la landing
  no cambia. [[PENDIENTE: subcategorías, si el dueño las quiere]]
- Los slugs no llevan tildes ni "ñ". [[VERIFICAR EN PANEL]] el formato real de la URL de categoría (¿`/indumentaria/` o
  `/categorias/indumentaria/`?) y ajustar `categoriaUrl` en `src/config/site.ts`.
- "Promociones" y las categorías por rubro (Salud, Gastronomía, Colegios) quedaron fuera de la landing por pedido del dueño.

## En `src/config/site.ts`

`TIENDA_URL` = `https://lavoro8.mitiendanube.com` (cambiar si se conecta un dominio propio). Cada categoría tiene
`creada: true|false`: con `true` abre `${TIENDA_URL}/<slug>/`; con `false`, el catálogo completo.
