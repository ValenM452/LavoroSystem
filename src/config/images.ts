/**
 * Registro de imágenes: slot → archivo en src/assets/img + alt + estado.
 * Para reemplazar un relleno: pisar el archivo (mismo nombre) y poner `pending: null`.
 * Si la foto es ambiental, completar `alt` con una descripción neutra.
 * Fotos de stock: nunca presentarlas como clientes o trabajos de LAVORO (AGENTS §2.4).
 */
import { site, type CategoryKey, type RubroSlug } from './site';

export interface ImageSlot {
  src: ImageMetadata;
  /** Descripción neutra. Mientras `pending` esté activo se ignora (se renderiza decorativa). */
  alt: string;
  /** Texto del [[PENDIENTE: …]] mientras la imagen sea un relleno; `null` cuando ya es foto real. */
  pending: string | null;
  /** `object-position` del recorte. */
  position?: string;
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

const slot = (path: string, pending: string | null, alt = '', position?: string): ImageSlot => ({
  src: file(path),
  alt,
  pending,
  position,
});

type CategoriaTile = Exclude<CategoryKey, 'promociones'>;

const categorias = Object.fromEntries(
  (Object.entries(site.tiendanube.categories) as [CategoryKey, { label: string; slug: string }][])
    .filter(([key]) => key !== 'promociones')
    .map(([key, c]) => [key, slot(`categorias/${c.slug}`, `foto categoría: ${c.label}`)]),
) as Record<CategoriaTile, ImageSlot>;

const rubros = Object.fromEntries(
  site.rubros.map((r) => [r.slug, slot(`rubros/${r.slug}`, `foto rubro: ${r.label}`)]),
) as Record<RubroSlug, ImageSlot>;

export const images = {
  hero: {
    home: {
      desktop: slot('hero/home-desktop', 'foto hero'),
      mobile: slot('hero/home-mobile', 'foto hero'),
    },
    empresas: {
      desktop: slot('hero/empresas-desktop', 'foto hero empresas'),
      mobile: slot('hero/empresas-mobile', 'foto hero empresas'),
    },
  },
  categorias,
  rubros,
  rubrosSplit: slot('split/rubros', 'foto rubros (split)'),
  personalizacion: slot('personalizacion/banda', 'foto personalización'),
  mapa: slot('local/mapa', 'imagen de mapa'),
} as const;
