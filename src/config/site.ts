/**
 * Datos de negocio de LAVORO. Única fuente: docs/01_NEGOCIO_Y_DATOS.md.
 * Nunca hardcodear estos datos en componentes.
 * Todo valor `[[PENDIENTE: ...]]` debe reemplazarse antes de publicar (T11).
 */

/** URL raíz de la tienda en Tiendanube (sin barra final). Dato del dueño, 20/10/2026. */
const TIENDA_URL = 'https://lavoro8.mitiendanube.com';
/** Catálogo completo de la tienda: destino de una categoría mientras no esté creada en Tiendanube. */
const CATALOGO_URL = `${TIENDA_URL}/productos/`;
/**
 * URL de una categoría. `creada: false` → abre el catálogo completo (la categoría todavía da 404 en la tienda).
 * Al crearla en el panel de Tiendanube con ese slug, poner `creada: true`.
 */
const categoriaUrl = (slug: string, creada: boolean) => (creada ? `${TIENDA_URL}/${slug}/` : CATALOGO_URL);

const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const site = {
  name: 'LAVORO',
  altName: 'Lavoro Uniformes',
  since: 2011,
  sinceLabel: 'Desde 2011',
  domain: '[[PENDIENTE: dominio]]', // propuesto: lavoro.com.ar (la tienda hoy usa lavoro8.mitiendanube.com)
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

  /**
   * Tienda en Tiendanube: tres categorías (decisión del dueño, 20/10/2026). Ver data/tiendanube/categorias.md.
   * Al 20/10/2026 la tienda no tiene categorías creadas (verificado: /indumentaria/ etc. dan 404), así que
   * las tres abren el catálogo completo hasta que se creen. [[PENDIENTE: crear las 3 categorías en Tiendanube]]
   */
  tiendanube: {
    baseUrl: TIENDA_URL,
    categories: {
      indumentaria:         { label: 'Indumentaria',           slug: 'indumentaria',           url: categoriaUrl('indumentaria', false) },
      calzado:              { label: 'Calzado',                slug: 'calzado',                url: categoriaUrl('calzado', false) },
      elementosDeSeguridad: { label: 'Elementos de seguridad', slug: 'elementos-de-seguridad', url: categoriaUrl('elementos-de-seguridad', false) },
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

  /**
   * Categorías de la tienda que se muestran en la página de cada rubro (/rubros/<slug>).
   * Derivadas de la frase de cada rubro (copy.mega.frases) y de 01 §1. Validar con el dueño.
   */
  rubroCategorias: {
    mineria:         ['indumentaria', 'calzado', 'elementosDeSeguridad'],
    petroleras:      ['indumentaria', 'calzado', 'elementosDeSeguridad'],
    'campos-fincas': ['indumentaria', 'calzado'],
    bodegas:         ['indumentaria', 'calzado'],
    construccion:    ['indumentaria', 'calzado', 'elementosDeSeguridad'],
    talleres:        ['indumentaria', 'calzado'],
    salud:           ['indumentaria'],
    gastronomia:     ['indumentaria'],
    colegios:        ['indumentaria'],
    municipios:      ['indumentaria', 'calzado', 'elementosDeSeguridad'],
  },

  /** Rutas internas. */
  paths: {
    home: '/',
    empresas: '/empresas',
    cotizar: '/empresas#cotizar',
    tienda: '/tienda',
    contacto: '/contacto',
    catalogo: '/tienda',
    personalizacion: '/empresas#personalizacion',
    marcas: '/tienda#marcas',
    rubros: '/#rubros',
    rubrosEmpresas: '/#rubros',
    terminos: '/legales/terminos',
    privacidad: '/legales/privacidad',
    cambios: '/legales/cambios-y-devoluciones',
    creditos: '/legales/creditos-imagenes',
    /** Respuesta del formulario cuando se envía sin JS (05 §2). */
    leadOk: '/cotizacion/enviada',
    leadError: '/cotizacion/no-enviada',
  },
} as const;

export type Site = typeof site;
export type CategoryKey = keyof typeof site.tiendanube.categories;
export type RubroSlug = (typeof site.rubros)[number]['slug'];
