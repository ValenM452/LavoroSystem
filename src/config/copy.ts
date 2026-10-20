/**
 * Textos de la landing. Fuente: docs/04_LANDING_ESPECIFICACION.md (la sección se indica en cada bloque).
 * Si 04 no define un texto, va un [[PENDIENTE: …]]. Datos de negocio: src/config/site.ts.
 * Rediseño: los textos marcados "redactado" son nuevos (sin precios, plazos, mínimos, stock ni números).
 * `*palabra*` = única itálica del titular (ver lib/emphasis.ts).
 */
import { site, type RubroSlug } from './site';

export const copy = {
  /** 04 §1 — barra superior */
  topbar: {
    left: `${site.sinceLabel} en Chilecito, La Rioja`,
    empresas: 'WhatsApp empresas',
    local: 'Local',
  },

  /** 04 §1 — navegación */
  nav: {
    tienda: 'Tienda',
    empresas: 'Empresas',
    rubros: 'Rubros',
    catalogo: 'Catálogo',
    personalizacion: 'Personalización',
    marcas: 'Marcas',
    contacto: 'Contacto',
    cotizar: 'Cotizar',
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    whatsapp: 'WhatsApp empresas',
    cotizarEmpresas: 'Cotizar para empresas',
    local: 'Local',
  },

  /** 04 §1 — mega menú. Frase corta por rubro (redactada; 04 no la define). */
  mega: {
    eyebrow: 'Rubros que equipamos',
    verTodos: 'Ver todos los rubros',
    cotizarPara: (rubro: string) => `Cotizar para ${rubro}`,
    frases: {
      mineria: 'Indumentaria y calzado de seguridad para el trabajo en mina y planta.',
      petroleras: 'Ropa de trabajo y elementos de seguridad para equipos en yacimiento.',
      'campos-fincas': 'Ropa de trabajo y calzado para tareas rurales y de cosecha.',
      bodegas: 'Uniformes y ropa de trabajo para viñedo, bodega y atención al público.',
      construccion: 'Ropa de grafa, calzado de seguridad y elementos de protección para obra.',
      talleres: 'Overoles, ropa de trabajo y calzado para talleres mecánicos.',
      salud: 'Ambos y uniformes para hospitales, clínicas y consultorios.',
      gastronomia: 'Uniformes para cocina, salón y atención al público.',
      colegios: 'Uniformes escolares e indumentaria identificada con el escudo de la institución.',
      municipios: 'Ropa de trabajo identificada para personal municipal e instituciones.',
    } satisfies Record<RubroSlug, string>,
  },

  /** 04 §2 y §"/empresas" — meta de cada página (derivados del H1 y la bajada del hero) */
  seo: {
    /** Imagen de redes (public/og-image.jpg). La foto es ilustrativa, no es un trabajo de LAVORO. */
    ogImageAlt: 'La palabra LAVORO detrás del Cerro Fitz Roy al atardecer, con el texto: Ropa de trabajo y uniformes para equipos que no paran.',
    home: {
      title: 'Ropa de trabajo y uniformes para equipos que no paran | LAVORO Chilecito',
      description:
        'Indumentaria, calzado de seguridad y uniformes para personas y empresas. Bordado y estampado con tu marca.',
    },
  },

  /** 04 "/empresas" — reutiliza componentes de la home. */
  empresas: {
    seo: {
      title: 'Ropa de trabajo y uniformes para empresas | LAVORO Chilecito',
      // Armada con textos de 04 (§2 bajada + eyebrow de /empresas), sin claims nuevos.
      description:
        'Indumentaria de trabajo, calzado de seguridad y uniformes para empresas e instituciones. Bordado y estampado con tu marca.',
    },
    heroCredito: 'Aconcagua, Mendoza. Foto: Mario Roberto Durán Ortiz, CC BY 3.0. Imagen ilustrativa.',
    hero: {
      eyebrow: 'Empresas e instituciones',
      title: 'Indumentaria de trabajo para *todo tu equipo*.',
      cta: 'Solicitar cotización',
      wa: 'WhatsApp empresas',
    },
    cotizamos: {
      title: 'Qué podemos cotizar',
      items: [
        { title: 'Ropa de trabajo' },
        { title: 'Calzado de seguridad' },
        { title: 'Elementos de seguridad' },
        { title: 'Uniformes (salud, gastronomía, colegios)' },
        { title: 'Bordado y estampado' },
        { title: 'Equipamiento por temporada' },
      ],
    },
    porque: {
      title: 'Por qué LAVORO',
      items: [
        { title: `${site.sinceLabel} en Chilecito` },
        { title: 'Local físico donde ver y probar' },
        { title: 'Marcas reconocidas del rubro' },
        { title: 'Personalización' },
        { title: 'Atención por WhatsApp' },
      ],
    },
  },

  /** 05 §7 — páginas legales (T10) */
  legales: {
    eyebrow: 'Legales',
    toc: 'En esta página',
    review: 'Texto base pendiente de validación por el contador o asesor legal. No publicar sin esa revisión.',
    vigencia: 'Vigente desde:',
  },

  /** docs/10 §5.5 — atribución de fotos de stock (CC BY exige crédito visible). */
  creditos: {
    seoTitle: 'Créditos de imágenes · LAVORO',
    description: 'Autoría y licencia de las fotos ilustrativas usadas en el sitio de LAVORO.',
    title: 'Créditos de *imágenes*.',
    lead: 'Algunas fotos del sitio son imágenes ilustrativas de ambientes de trabajo, con licencia libre. No muestran clientes, equipos ni trabajos de LAVORO.',
    uso: 'Dónde se usa',
    autor: 'Autor',
    licencia: 'Licencia',
    fuente: 'Ver original',
    recorte: 'Imagen recortada para el sitio.',
    usos: {
      heroHome: 'Portada de inicio',
      heroEmpresas: 'Portada de empresas',
      empresas: 'Bloque empresas (inicio)',
      personalizacion: 'Personalización',
      local: 'Local en Chilecito',
      rubro: (r: string) => `Rubro: ${r}`,
    },
  },

  /** 04 §12 — footer */
  footer: {
    tienda: 'Tienda',
    verTienda: 'Ver toda la tienda',
    empresas: 'Empresas',
    cotizar: 'Cotizar',
    rubros: 'Rubros',
    personalizacion: 'Personalización',
    marcas: 'Marcas',
    contacto: 'Contacto',
    empresasWa: 'Empresas y cotizaciones',
    localWa: 'Local',
    legales: 'Legales',
    terminos: 'Términos y condiciones',
    privacidad: 'Política de privacidad',
    cambios: 'Cambios y devoluciones',
    arrepentimiento: 'Botón de arrepentimiento',
    defensa: 'Defensa del Consumidor',
    dataFiscal: 'Data Fiscal',
    creditos: 'Créditos de imágenes',
    copyright: '© 2026 LAVORO',
  },

  /** 04 §2 + rediseño: dos caminos de compra (B2C / B2B). Textos de las tarjetas: redactado. */
  hero: {
    eyebrow: `Chilecito · La Rioja · ${site.sinceLabel}`,
    title: 'Ropa de trabajo y uniformes para equipos que *no paran*.',
    lead: 'Indumentaria, calzado de seguridad y uniformes para personas y empresas. Bordado y estampado con tu marca.',
    ctaTienda: 'Ver tienda',
    ctaEmpresas: 'Cotizar para empresas',
    b2c: { label: 'Para vos', title: 'Comprá en la tienda', text: 'Ropa de trabajo, calzado de seguridad y uniformes.' },
    b2b: { label: 'Para empresas', title: 'Pedí una cotización', text: 'Equipamos a todo tu personal, con tu marca.' },
  },

  /**
   * Rediseño 20/10: home corta. Portada + dos puertas, índice de rubros, accesos a tienda y local.
   * Textos redactados con datos de 01 y 04 (sin precios, plazos, stock ni números).
   */
  portada: {
    kicker: `Indumentaria, calzado de seguridad y uniformes. ${site.sinceLabel} en Chilecito, La Rioja.`,
    credito: 'Cerro Fitz Roy, Patagonia. Foto: Masa Sakano, CC BY-SA 2.0. Imagen ilustrativa.',
    title: 'Ropa de trabajo y uniformes para equipos que no paran.',
    lead: 'Indumentaria, calzado de seguridad y uniformes en Chilecito. Para quien trabaja y para empresas que equipan a todo su personal.',
    puertas: {
      tienda: { title: 'Comprar para mí', text: 'Ropa de trabajo, calzado y uniformes en la tienda online.' },
      empresa: { title: 'Equipar a mi empresa', text: 'Cotización para todo tu personal, con tu marca.' },
    },
  },
  rubrosIndex: {
    title: '¿En qué trabajás?',
    lead: 'Elegí tu rubro y te mostramos qué se usa y cómo cotizarlo.',
    ver: (r: string) => `Ver ${r}`,
    nota: 'Imágenes ilustrativas de cada rubro.',
  },
  tiendaHome: {
    title: 'Tienda online',
    lead: 'Elegí una categoría. Precios, talles, colores y stock se ven en la tienda.',
    verTodo: 'Ver todas las categorías',
  },
  accesos: {
    empresas: { title: 'Para empresas', text: 'Bordado y estampado con tu marca, y asesoramiento según la tarea de cada rubro.', cta: 'Ir a empresas' },
    local: { title: 'Local en Chilecito', text: 'Para ver y probar las prendas antes de comprar.', cta: 'Ver contacto y local' },
  },

  /** Página por rubro (/rubros/<slug>). */
  rubroPage: {
    seoTitle: (r: string) => `Ropa de trabajo para ${r} | LAVORO Chilecito`,
    volver: 'Todos los rubros',
    cotizar: (r: string) => `Cotizar para ${r}`,
    categoriasTitle: 'Qué podés ver en la tienda',
    categoriasLead: 'Cada categoría abre la tienda online con precios, talles y colores.',
    empresaTitle: '¿Equipás a un equipo completo?',
    empresaText: 'Contanos cuántas personas son y qué necesitan. Te armamos la propuesta con tu marca bordada o estampada.',
    otros: 'Otros rubros',
    ilustrativa: 'Imagen ilustrativa.',
  },

  /** Página /tienda (accesos a Tiendanube). */
  tiendaPage: {
    seoTitle: 'Tienda de ropa de trabajo | LAVORO Chilecito',
    description: 'Pantalones, camisas, calzado de seguridad, overoles, elementos de seguridad y uniformes. Comprá en la tienda online de LAVORO.',
    title: 'Tienda',
    lead: 'Elegí una categoría y seguí la compra en la tienda online, con precios, talles, colores y stock.',
  },

  /** Página /contacto. */
  contactoPage: {
    seoTitle: 'Contacto y local en Chilecito | LAVORO',
    description: 'WhatsApp para empresas y para el local de LAVORO en Chilecito, La Rioja.',
    title: 'Contacto',
    lead: 'Escribinos al WhatsApp que corresponda y te respondemos por ahí.',
    empresas: { title: 'Empresas y cotizaciones', text: 'Pedidos para equipos, uniformes y personalización.' },
    local: { title: 'Local', text: 'Consultas por productos, talles y compras en el local.' },
  },

  /** Rediseño: franja de confianza. Solo hechos de 01 y de "Por qué LAVORO" (04 /empresas). */
  confianza: {
    items: [
      { title: site.sinceLabel, text: 'En Chilecito, La Rioja.' },
      { title: 'Local físico', text: 'Para ver y probar las prendas.' },
      { title: 'Personalización', text: 'Bordado y estampado con tu marca.' },
      { title: 'Atención por WhatsApp', text: 'Para personas y empresas.' },
    ],
  },

  /** 04 §3 */
  declaracion: {
    title: 'Cada trabajo necesita la prenda *adecuada*.',
    text: 'Asesoramos a quien trabaja por su cuenta y a empresas que necesitan equipar a todo su personal: qué prenda conviene para cada tarea, qué talle pedir y cómo identificarla con tu marca.',
  },

  /** 04 §4 — Catálogo. Descripciones tomadas de 01 §1 ("Qué vende"). Sin stock ni precios: eso vive en la tienda. */
  categorias: {
    eyebrow: 'Catálogo',
    title: 'Encontrá lo que tu trabajo *pide*.',
    lead: 'Elegí una categoría y seguí la compra en la tienda online.',
    verTienda: 'Ver toda la tienda',
    verCategoria: 'Ver en la tienda',
    ilustrativa: 'Imagen ilustrativa',
    descripciones: {
      indumentaria: 'Pantalones cargo, camisas, overoles, ropa de grafa y uniformes.',
      calzado: 'Botines, borcegos y zapatos de seguridad.',
      elementosDeSeguridad: 'Elementos e indumentaria de seguridad.',
    },
  },

  /** 04 §5 */
  marcas: {
    eyebrow: 'Marcas',
    title: 'Marcas que *trabajamos*.',
    pending: 'más marcas',
  },

  /** Rediseño: bloque B2B en la home (titular de 04 /empresas; texto de 04 §3). */
  empresasHome: {
    eyebrow: 'Empresas e instituciones',
    title: 'Indumentaria de trabajo para *todo tu equipo*.',
    text: 'Asesoramos a empresas que necesitan equipar a todo su personal: qué prenda conviene para cada tarea, qué talle pedir y cómo identificarla con tu marca.',
    listTitle: 'Qué podemos cotizar',
    cta: 'Solicitar cotización',
    more: 'Ver la página para empresas',
  },

  /** 04 §6 — las oraciones de cada columna no están escritas en 04. */
  personalizacion: {
    eyebrow: 'Personalización',
    title: 'Tu marca en cada *prenda*.',
    // Oraciones redactadas (04 pide una por columna, sin plazos ni mínimos).
    items: [
      { title: 'Bordado', text: 'Bordamos el logo o el nombre de tu empresa en las prendas que elijas.' },
      { title: 'Estampado', text: 'Estampamos tu marca en la ropa de trabajo de todo tu equipo.' },
      { title: 'Asesoramiento', text: 'Te ayudamos a elegir la técnica, la prenda y la ubicación del logo según el uso.' },
    ],
    minimos: 'mínimos de personalización',
    cta: 'Consultar personalización',
  },

  /** 04 §7 */
  proceso: {
    eyebrow: 'Empresas',
    title: 'Un proceso directo, *sin vueltas*.',
    steps: [
      { title: 'Nos contás qué necesitás.', text: 'Rubro, cantidad de personas y prendas.' },
      { title: 'Te armamos la propuesta.', text: 'Productos, talles y opciones de personalización.' },
      { title: 'Personalizamos.', text: 'Bordado o estampado con el logo de tu empresa.' },
      { title: 'Entregamos.', text: 'Retiro en el local o envío.', pending: 'confirmar modalidades' },
    ],
    cta: 'Solicitar cotización',
  },

  /** 04 §8 */
  rubros: {
    eyebrow: 'Rubros',
    title: 'Conocemos trabajos *distintos*.',
    text: 'Cada rubro tiene exigencias propias de abrigo, resistencia, higiene o seguridad. Te ayudamos a elegir según la tarea.',
    cta: 'Cotizar para mi rubro',
    nota: 'Imágenes ilustrativas de cada rubro.',
  },

  /** 04 §9 + 05 §2 (campos). Mensajes de error y "(opcional)": microcopy de interfaz, no está en 04. */
  form: {
    title: 'Contanos qué necesita *tu empresa*.',
    datosWa: 'WhatsApp empresas',
    datosEmail: 'Email',
    datosDireccion: 'Dirección',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    alt: 'Si preferís, escribinos por WhatsApp',
    success: 'Recibimos tu solicitud. Te vamos a contactar por WhatsApp o mail.',
    successCta: 'Seguir por WhatsApp',
    /** Respaldo si /api/lead no pudo registrar la solicitud (05 §4). */
    failure: 'No pudimos enviar tu solicitud. Mandala por WhatsApp y seguimos por ahí.',
    failureCta: 'Enviar por WhatsApp',
    optional: '(opcional)',
    /** docs/10 §6.2 — agrupación visual del formulario (sin cambiar campos). */
    grupos: { datos: '1. Tus datos', pedido: '2. Tu pedido' },
    nota: 'Los campos opcionales están marcados.',
    choose: 'Elegí una opción',
    labels: {
      nombre: 'Nombre y apellido',
      empresa: 'Empresa / institución',
      telefono: 'WhatsApp',
      email: 'Email',
      localidad: 'Localidad y provincia',
      rubro: 'Rubro',
      cantidad: 'Cantidad de personas a equipar',
      productos: 'Qué necesitás',
      personalizacion: 'Personalización',
      plazo: '¿Para cuándo?',
      comentario: 'Comentarios',
    },
    acepta: 'Acepto que LAVORO me contacte por esta solicitud.',
    privacidad: 'Ver política de privacidad.',
    errors: {
      required: 'Completá este campo.',
      nombre: 'Escribí entre 2 y 80 caracteres.',
      telefono: 'Escribí un WhatsApp válido, con código de área.',
      email: 'Revisá el formato del email.',
      choose: 'Elegí una opción.',
      productos: 'Elegí al menos una opción.',
      comentario: 'Máximo 1000 caracteres.',
      acepta: 'Necesitamos tu consentimiento para contactarte.',
      summary: (n: number) => (n === 1 ? 'Revisá 1 campo marcado.' : `Revisá ${n} campos marcados.`),
    },
    /** 05 §4 — resumen prellenado para WhatsApp */
    waSummary: (d: { nombre: string; empresa: string; rubro: string; productos: string; cantidad: string }) =>
      `Hola LAVORO, soy ${d.nombre} de ${d.empresa} (${d.rubro}). Necesito cotizar ${d.productos} para ${d.cantidad} personas.`,
  },

  /** Páginas de respuesta del formulario sin JS (05 §2). Microcopy de interfaz. */
  leadRespuesta: {
    ok: {
      seoTitle: 'Solicitud enviada | LAVORO',
      eyebrow: 'Cotización',
      title: 'Recibimos tu *solicitud*.',
      lead: 'Te vamos a contactar por WhatsApp o mail. Si querés adelantar algo, escribinos.',
    },
    error: {
      seoTitle: 'No pudimos enviar tu solicitud | LAVORO',
      eyebrow: 'Cotización',
      title: 'No pudimos enviar tu *solicitud*.',
      lead: 'Puede faltar un dato o haber un problema de nuestro lado. Volvé al formulario para revisarlo o escribinos por WhatsApp.',
    },
    volver: 'Volver al formulario',
    inicio: 'Volver al inicio',
    whatsapp: 'Escribir por WhatsApp',
  },

  /** 04 §10 — sin texto para el botón que carga el mapa interactivo (ver mapa). */
  local: {
    eyebrow: 'Visitanos',
    title: 'Local en *Chilecito*.',
    horarios: 'Horarios',
    waLabel: 'WhatsApp local',
    comoLlegar: 'Cómo llegar',
    /** Mientras no esté el link de Google Maps. */
    pedirUbicacion: 'Pedir la ubicación por WhatsApp',
    escribir: 'Escribir al local',
    cargarMapa: 'Ver mapa interactivo',
  },

  /** 04 §11 */
  cierre: {
    eyebrow: 'Hablemos',
    title: 'Una respuesta *cercana y clara*.',
    lead: 'Equipá a tu equipo o encontrá tu ropa de trabajo con quien conoce el oficio.',
    cta: 'Hablar con LAVORO',
  },

  /** Mensajes de WhatsApp precargados según el botón (para que el local sepa desde dónde escriben). */
  wa: {
    rubro: (r: string) => `Hola LAVORO, quiero cotizar ropa de trabajo para ${r.toLowerCase()}.`,
    empresas: 'Hola LAVORO, quiero pedir una cotización para mi empresa.',
    local: 'Hola LAVORO, quiero hacer una consulta en el local.',
    ubicacion: 'Hola LAVORO, ¿me pasan la ubicación del local en Chilecito?',
  },
  /** Botón de cada categoría: abre su catálogo en Tiendanube. */
  categoriaCta: 'Ver catálogo',

  dock: { tienda: 'Tienda', rubros: 'Rubros', cotizar: 'Cotizar', menu: 'Menú', etiqueta: 'Accesos rápidos' },

  a11y: {
    skip: 'Saltar al contenido',
    principal: 'Principal',
    logoLabel: 'LAVORO, inicio',
  },
} as const;
