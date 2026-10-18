/**
 * Datos de negocio de LAVORO. Única fuente: docs/01_NEGOCIO_Y_DATOS.md.
 * Nunca hardcodear estos datos en componentes.
 * Todo valor `[[PENDIENTE: ...]]` debe reemplazarse antes de publicar (T11).
 */

const PENDIENTE_URL_TIENDA = '[[PENDIENTE: URL tienda]]';

const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const site = {
  name: 'LAVORO',
  altName: 'Lavoro Uniformes',
  since: 2011,
  sinceLabel: 'Desde 2011',
  domain: '[[PENDIENTE: dominio]]', // propuesto: lavoro.com.ar
  locality: 'Chilecito, La Rioja, Argentina',

  contact: {
    email: 'lavorouniformes@gmail.com',
    whatsappEmpresas: {
      label: '3825 529781',
      number: '5493825529781',
      url: waLink('5493825529781', 'Hola LAVORO, quiero pedir una cotización para mi empresa.'),
    },
    whatsappLocal: {
      label: '3825 666774',
      number: '5493825666774',
      url: waLink('5493825666774', 'Hola LAVORO, quiero hacer una consulta sobre un producto.'),
    },
    address: '[[PENDIENTE: dirección del local]]',
    hours: '[[PENDIENTE: horarios]]',
    /** "Cómo llegar" (link) y mapa embebido; dependen de la dirección. */
    mapsUrl: '[[PENDIENTE: link Google Maps]]',
    mapsEmbedUrl: '[[PENDIENTE: link Google Maps]]',
  },

  social: {
    instagram: '[[PENDIENTE: redes]]',
    facebook: '[[PENDIENTE: redes]]',
  },

  legal: {
    businessName: '[[PENDIENTE: CUIT / razón social]]',
    cuit: '[[PENDIENTE: CUIT / razón social]]',
  },

  brands: ['Pampero', 'Ombú', 'Gaucho', '21 de Septiembre'],
  brandsPending: '[[PENDIENTE: lista completa]]',

  /** Tienda en Tiendanube. Slugs según data/tiendanube/categorias.md. */
  tiendanube: {
    baseUrl: PENDIENTE_URL_TIENDA,
    categories: {
      pantalones:           { label: 'Pantalones',             slug: 'pantalones',             url: PENDIENTE_URL_TIENDA },
      camisas:              { label: 'Camisas',                slug: 'camisas',                url: PENDIENTE_URL_TIENDA },
      calzadoDeSeguridad:   { label: 'Calzado de seguridad',   slug: 'calzado-de-seguridad',   url: PENDIENTE_URL_TIENDA },
      overoles:             { label: 'Overoles',               slug: 'overoles',               url: PENDIENTE_URL_TIENDA },
      elementosDeSeguridad: { label: 'Elementos de seguridad', slug: 'elementos-de-seguridad', url: PENDIENTE_URL_TIENDA },
      salud:                { label: 'Salud',                  slug: 'salud',                  url: PENDIENTE_URL_TIENDA },
      gastronomia:          { label: 'Gastronomía',            slug: 'gastronomia',            url: PENDIENTE_URL_TIENDA },
      colegios:             { label: 'Colegios',               slug: 'colegios',               url: PENDIENTE_URL_TIENDA },
      promociones:          { label: 'Promociones',            slug: 'promociones',            url: PENDIENTE_URL_TIENDA },
    },
    arrepentimientoUrl: '[[PENDIENTE: URL botón de arrepentimiento]]',
  },

  /** Link del formulario "Data Fiscal" de ARCA (qr.afip.gob.ar/?qr=…), lo genera el titular del CUIT. */
  dataFiscal: '[[PENDIENTE: QR Data Fiscal]]',
  /** Organismos públicos (URLs oficiales, verificadas el 18/10/2026). */
  defensaConsumidorUrl: 'https://www.argentina.gob.ar/economia/industria-y-comercio/defensadelconsumidor',
  reclamoConsumidorUrl: 'https://www.argentina.gob.ar/servicio/iniciar-un-reclamo-ante-defensa-del-consumidor',
  aaipUrl: 'https://www.argentina.gob.ar/aaip',

  /** Rubros B2B (01 §6). `label` = corto (menús, grillas); `longLabel` = completo (select del formulario). */
  rubros: [
    { slug: 'mineria',       label: 'Minería',         longLabel: 'Minería' },
    { slug: 'petroleras',    label: 'Petroleras',      longLabel: 'Petroleras' },
    { slug: 'campos-fincas', label: 'Campos y fincas', longLabel: 'Campos y fincas' },
    { slug: 'bodegas',       label: 'Bodegas',         longLabel: 'Bodegas' },
    { slug: 'construccion',  label: 'Construcción',    longLabel: 'Construcción y corralones' },
    { slug: 'talleres',      label: 'Talleres',        longLabel: 'Talleres mecánicos' },
    { slug: 'salud',         label: 'Salud',           longLabel: 'Salud (hospitales, clínicas, consultorios)' },
    { slug: 'gastronomia',   label: 'Gastronomía',     longLabel: 'Gastronomía' },
    { slug: 'colegios',      label: 'Colegios',        longLabel: 'Colegios' },
    { slug: 'municipios',    label: 'Municipios',      longLabel: 'Municipios e instituciones' },
  ],
  rubroOtro: { slug: 'otro', label: 'Otro', longLabel: 'Otras empresas' },

  /** Rutas internas. */
  paths: {
    home: '/',
    empresas: '/empresas',
    cotizar: '/empresas#cotizar',
    contacto: '/#contacto',
    catalogo: '/#catalogo',
    personalizacion: '/#personalizacion',
    marcas: '/#marcas',
    rubrosEmpresas: '/empresas#rubros',
    terminos: '/legales/terminos',
    privacidad: '/legales/privacidad',
    cambios: '/legales/cambios-y-devoluciones',
    /** Respuesta del formulario cuando se envía sin JS (05 §2). */
    leadOk: '/cotizacion/enviada',
    leadError: '/cotizacion/no-enviada',
  },
} as const;

export type Site = typeof site;
export type CategoryKey = keyof typeof site.tiendanube.categories;
export type RubroSlug = (typeof site.rubros)[number]['slug'];
