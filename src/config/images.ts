/**
 * Registro de imágenes: slot → archivo en src/assets/img + alt + estado.
 * Para reemplazar un relleno: pisar el archivo (mismo nombre) y poner `pending: null`.
 * Si la foto es ambiental, completar `alt` con una descripción neutra.
 * Fotos de stock: nunca presentarlas como clientes o trabajos de LAVORO (AGENTS §2.4).
 */
import { site, type RubroSlug } from './site';

export interface ImageSlot {
  src: ImageMetadata;
  /** Descripción neutra. Mientras `pending` esté activo se ignora (se renderiza decorativa). */
  alt: string;
  /** Texto del [[PENDIENTE: …]] mientras la imagen sea un relleno; `null` cuando ya es foto real. */
  pending: string | null;
  /** `object-position` del recorte. */
  position?: string;
  /** Foto de stock: autor, licencia y origen (CC BY exige atribución visible antes de publicar). */
  credit?: { author: string; license: string; source: string };
}

const files = import.meta.glob<ImageMetadata>('../assets/img/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

function file(path: string): ImageMetadata {
  const hit = Object.entries(files).find(
    ([key]) => key.replace('../assets/img/', '').replace(/\.[^.]+$/, '') === path,
  );
  if (!hit) throw new Error(`Falta la imagen src/assets/img/${path}.(jpg|png|webp|avif)`);
  return hit[1];
}

const slot = (path: string, pending: string | null, alt = '', position?: string, credit?: ImageSlot['credit']): ImageSlot => ({
  src: file(path),
  alt,
  pending,
  position,
  credit,
});

/**
 * Fotos de rubros: stock ambiental de Wikimedia Commons (CC0 / dominio público / CC BY), recortadas a 1600×1200.
 * Son ambientes de trabajo, NO clientes ni trabajos de LAVORO (AGENTS §2.4). Créditos: docs/09_CREDITOS_IMAGENES.md.
 */
const rubroFotos: Record<RubroSlug, { alt: string; position?: string; credit: NonNullable<ImageSlot['credit']> }> = {
  mineria: { alt: 'Camión minero y pala cargadora en una mina a cielo abierto', position: '60% 50%', credit: { author: 'Peabody Energy, Inc.', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Coal_Haul_Truck_at_North_Antelope_Rochelle.png' } },
  petroleras: { alt: 'Bomba de extracción de petróleo en un paisaje árido', credit: { author: 'Maurice Chédel', license: 'Dominio público', source: 'https://commons.wikimedia.org/wiki/File:Oil_pump_Talara_Peru.JPG' } },
  'campos-fincas': { alt: 'Personas trabajando la tierra en un campo cultivado', credit: { author: 'Md Ridwan Hassan', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Agricultural_workers_in_a_crop_field_at_Bangladesh_Agricultural_University,_Mymensingh.jpg' } },
  bodegas: { alt: 'Cosecha de uva entre hileras de un viñedo', credit: { author: 'ליזי שאנן (PikiWiki Israel)', license: 'CC BY 2.5', source: 'https://commons.wikimedia.org/wiki/File:118251_moshav_givat_yeshayahu_-_grape_harvest_for_wine_pr_PikiWiki_Israel.jpg' } },
  construccion: { alt: 'Dos trabajadores con casco y chaleco en una obra', position: '78% 60%', credit: { author: 'Daniel Mekis (Boudoirphotographyguide)', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Construction_Photography_of_Workers_on_Site_by_Construction_Photographer_Daniel_Mekis.jpg' } },
  talleres: { alt: 'Mecánico trabajando en la carrocería de un auto en un taller', position: '70% 50%', credit: { author: 'Igor Ovsyannykov', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Car_Restoration_Workshop_(Unsplash).jpg' } },
  salud: { alt: 'Profesional de la salud con ambo, cofia y barbijo', position: '62% 50%', credit: { author: 'U.S. Army Southern European Task Force, Africa', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Nurse_at_the_Ouakam_Military_Hospital,_Senegal_(51355690917).jpg' } },
  gastronomia: { alt: 'Dos cocineros con delantal en la cocina de un restaurante', position: '35% 50%', credit: { author: 'MarkBuckawicki', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Restaurant_Kitchen_expo_station.jpg' } },
  colegios: { alt: 'Aula escolar vacía con pupitres', credit: { author: 'Harrison Keely', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:A_public_school_classroom_at_Springfield_Township_High_School_in_Pennsylvania,_United_States_01.jpg' } },
  municipios: { alt: 'Cuadrilla trabajando en la pavimentación de una calle', position: '25% 60%', credit: { author: 'mardoqueo sagastume', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Unnamed_Road,_Guatemala_-_panoramio_(19).jpg' } },
};

const rubros = Object.fromEntries(
  site.rubros.map((r) => {
    const f = rubroFotos[r.slug];
    return [r.slug, slot(`rubros/${r.slug}`, null, f.alt, f.position, f.credit)];
  }),
) as Record<RubroSlug, ImageSlot>;

export const images = {
  /**
   * Portadas (rediseño 20/10): paisajes de montaña de Wikimedia Commons. Ilustrativas: no son
   * Chilecito ni trabajos de LAVORO. La de inicio tiene su perfil trazado en config/ridge.ts.
   */
  hero: {
    home: slot('paisajes/fitzroy-atardecer', null, 'Cerro Fitz Roy al atardecer, en la Patagonia', '54% 40%', {
      author: 'Masa Sakano',
      license: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Mount_Fitz_Roy_at_Sunset.jpg',
    }),
    empresas: slot('paisajes/aconcagua', null, 'Cerro Aconcagua nevado, en Mendoza', '50% 45%', {
      author: 'Mario Roberto Durán Ortiz (Mariordo)',
      license: 'CC BY 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:Aconcagua_13.JPG',
    }),
  },
  rubros,
  /** Bloque Empresas de la home. */
  empresas: rubros.talleres,
  /** Máquinas bordadoras industriales (recorte sin marcas ni personas). No son del taller de LAVORO. */
  personalizacion: slot('personalizacion/bordado', null, 'Máquinas bordadoras industriales con hilos de colores', '40% 50%', {
    author: 'USAID Pakistan',
    license: 'Dominio público',
    source: 'https://commons.wikimedia.org/wiki/File:Industrial_embroidery_machine.jpg',
  }),
  /** Paisaje de la zona (Cuesta de Miranda, Ruta 40). No es el local: el mapa real queda pendiente de la dirección. */
  local: slot('local/chilecito', null, 'Cuesta de Miranda, en la Ruta 40, cerca de Chilecito', '50% 60%', {
    author: 'Elvis Boaventura',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Cuesta_Miranda_(Ruta_40_-_La_Rioja)_-_panoramio.jpg',
  }),
} as const;
