# Categorías de la tienda (Tiendanube) — espejo de la landing

> Fuente: `docs/04_LANDING_ESPECIFICACION.md` §4 (8 tiles) + "Promociones" (`docs/02` C2, solo existe en la tienda).
> Discrepancia detectada: `02` C2 dice "Seguridad" y "Uniformes salud"; la landing dice "Elementos de seguridad" y "Salud". Se usan los nombres de la landing. **El dueño confirma.**

## Árbol

Todas son categorías de primer nivel (sin subcategorías en el MVP).

| Orden | Nombre (en la tienda) | Slug / URL | Tile en la landing | URL completa |
|---|---|---|---|---|
| 1 | Pantalones | `pantalones` | Sí | `[[PENDIENTE: URL tienda]]/pantalones` |
| 2 | Camisas | `camisas` | Sí | `[[PENDIENTE: URL tienda]]/camisas` |
| 3 | Calzado de seguridad | `calzado-de-seguridad` | Sí | `[[PENDIENTE: URL tienda]]/calzado-de-seguridad` |
| 4 | Overoles | `overoles` | Sí | `[[PENDIENTE: URL tienda]]/overoles` |
| 5 | Elementos de seguridad | `elementos-de-seguridad` | Sí | `[[PENDIENTE: URL tienda]]/elementos-de-seguridad` |
| 6 | Salud | `salud` | Sí | `[[PENDIENTE: URL tienda]]/salud` |
| 7 | Gastronomía | `gastronomia` | Sí | `[[PENDIENTE: URL tienda]]/gastronomia` |
| 8 | Colegios | `colegios` | Sí | `[[PENDIENTE: URL tienda]]/colegios` |
| 9 | Promociones | `promociones` | No (solo tienda) | `[[PENDIENTE: URL tienda]]/promociones` |

Notas:
- Los slugs no llevan tildes ni "ñ". [[VERIFICAR EN PANEL]]: Tiendanube suele generar la URL de categoría desde el nombre; confirmar el formato real (¿`/pantalones/` o `/categorias/pantalones/`?) y corregir la columna "URL completa".
- "Promociones" lista productos con precio promocional. **No se define ningún descuento acá.** [[PENDIENTE: criterio de qué entra en Promociones]]
- Un producto puede estar en más de una categoría [[VERIFICAR EN PANEL]] (ej. un pantalón en "Pantalones" y "Colegios").

## Snippet para `src/config/site.ts` (pegar cuando exista T01)

`src/config/site.ts` todavía no existe (depende de T01). Cuando se cree, `tiendanube.categories` debe quedar así:

```ts
tiendanube: {
  baseUrl: '[[PENDIENTE: URL tienda]]',
  categories: {
    pantalones:               { label: 'Pantalones',             slug: 'pantalones',             url: '[[PENDIENTE: URL tienda]]' },
    camisas:                  { label: 'Camisas',                slug: 'camisas',                url: '[[PENDIENTE: URL tienda]]' },
    calzadoDeSeguridad:       { label: 'Calzado de seguridad',   slug: 'calzado-de-seguridad',   url: '[[PENDIENTE: URL tienda]]' },
    overoles:                 { label: 'Overoles',               slug: 'overoles',               url: '[[PENDIENTE: URL tienda]]' },
    elementosDeSeguridad:     { label: 'Elementos de seguridad', slug: 'elementos-de-seguridad', url: '[[PENDIENTE: URL tienda]]' },
    salud:                    { label: 'Salud',                  slug: 'salud',                  url: '[[PENDIENTE: URL tienda]]' },
    gastronomia:              { label: 'Gastronomía',            slug: 'gastronomia',            url: '[[PENDIENTE: URL tienda]]' },
    colegios:                 { label: 'Colegios',               slug: 'colegios',               url: '[[PENDIENTE: URL tienda]]' },
    promociones:              { label: 'Promociones',            slug: 'promociones',            url: '[[PENDIENTE: URL tienda]]' },
  },
},
```

Cuando se conozca el dominio, `url` pasa a `${baseUrl}/${slug}` (ajustar al formato real de Tiendanube).
