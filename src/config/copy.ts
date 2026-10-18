/**
 * Textos de la landing. Fuente: docs/04_LANDING_ESPECIFICACION.md (la sección se indica en cada bloque).
 * Si 04 no define un texto, va un [[PENDIENTE: …]]. Datos de negocio: src/config/site.ts.
 * `*palabra*` = única itálica del titular (ver lib/emphasis.ts).
 */
import { site, type RubroSlug } from './site';

export const copy = {
  /** 04 §1 — barra superior (opcional) */
  topbar: `${site.sinceLabel} en Chilecito, La Rioja · WhatsApp empresas ${site.contact.whatsappEmpresas.label}`,

  /** 04 §1 — navegación */
  nav: {
    tienda: 'Tienda',
    empresas: 'Empresas',
    rubros: 'Rubros',
    personalizacion: 'Personalización',
    marcas: 'Marcas',
    contacto: 'Contacto',
    cotizar: 'Cotizar',
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    whatsapp: 'WhatsApp empresas',
  },

  /** 04 §1 — mega menú. Frase corta por rubro (redactada; 04 no la define). */
  mega: {
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

  /** 04 §12 — footer */
  footer: {
    tienda: 'Tienda',
    verTienda: 'Ver toda la tienda',
    empresas: 'Empresas',
    cotizar: 'Cotizar',
    rubros: 'Rubros',
    personalizacion: 'Personalización',
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
    copyright: '© 2026 LAVORO',
  },

  /** 04 §2 */
  hero: {
    eyebrow: `Chilecito · La Rioja · ${site.sinceLabel}`,
    title: 'Ropa de trabajo y uniformes para equipos que *no paran*.',
    lead: 'Indumentaria, calzado de seguridad y uniformes para personas y empresas. Bordado y estampado con tu marca.',
    ctaTienda: 'Ver tienda',
    ctaEmpresas: 'Cotizar para empresas',
  },

  /** 04 §3 */
  declaracion: {
    title: 'Cada trabajo necesita la prenda *adecuada*.',
    text: 'Asesoramos a quien trabaja por su cuenta y a empresas que necesitan equipar a todo su personal: qué prenda conviene para cada tarea, qué talle pedir y cómo identificarla con tu marca.',
  },

  /** 04 §4 */
  categorias: {
    eyebrow: 'Tienda',
    title: 'Encontrá lo que tu trabajo *pide*.',
    verTienda: 'Ver toda la tienda',
  },

  /** 04 §5 */
  marcas: {
    title: 'Marcas que *trabajamos*.',
    pending: 'más marcas',
  },

  /** 04 §6 — las oraciones de cada columna no están escritas en 04. */
  personalizacion: {
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
    optional: '(opcional)',
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

  /** 04 §10 — sin texto para el botón que carga el mapa interactivo (ver mapa). */
  local: {
    title: 'Local en *Chilecito*.',
    waLabel: 'WhatsApp local',
    comoLlegar: 'Cómo llegar',
    escribir: 'Escribir al local',
    cargarMapa: 'Ver mapa interactivo',
  },

  /** 04 §11 */
  cierre: {
    title: 'Una respuesta *cercana y clara*.',
    lead: 'Equipá a tu equipo o encontrá tu ropa de trabajo con quien conoce el oficio.',
    cta: 'Hablar con LAVORO',
  },

  a11y: {
    skip: 'Saltar al contenido',
    principal: 'Principal',
    logoLabel: 'LAVORO, inicio',
  },
} as const;
