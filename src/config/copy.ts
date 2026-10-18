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

  a11y: {
    skip: 'Saltar al contenido',
    principal: 'Principal',
    logoLabel: 'LAVORO, inicio',
  },
} as const;
