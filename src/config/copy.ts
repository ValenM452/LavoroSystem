/**
 * Textos de la landing. Fuente: docs/04_LANDING_ESPECIFICACION.md (la sección se indica en cada bloque).
 * Si 04 no define un texto, va un [[PENDIENTE: …]]. Datos de negocio: src/config/site.ts.
 * `*palabra*` = única itálica del titular (ver lib/emphasis.ts).
 */
import { site } from './site';

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

  /** 04 §1 — mega menú. La frase corta por rubro no está definida en 04. */
  mega: {
    cotizarPara: (rubro: string) => `Cotizar para ${rubro}`,
    frase: (rubro: string) => `frase rubro: ${rubro}`,
  },

  /** 04 §2 y §"/empresas" — meta de cada página (derivados del H1 y la bajada del hero) */
  seo: {
    home: {
      title: 'Ropa de trabajo y uniformes para equipos que no paran | LAVORO Chilecito',
      description:
        'Indumentaria, calzado de seguridad y uniformes para personas y empresas. Bordado y estampado con tu marca.',
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
    items: [
      { title: 'Bordado', pending: 'texto Bordado' },
      { title: 'Estampado', pending: 'texto Estampado' },
      { title: 'Asesoramiento', pending: 'texto Asesoramiento' },
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
    cargarMapa: 'mapa interactivo: texto del botón',
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
