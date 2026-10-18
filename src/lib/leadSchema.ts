/**
 * Esquema del formulario de cotización (05 §2). Compartido: cliente (T06) y /api/lead (T08).
 * zod viene re-exportado por Astro (`astro/zod`): no suma dependencias.
 */
import { z } from 'astro/zod';
import { site } from '../config/site';
import { copy } from '../config/copy';

const e = copy.form.errors;

export const rubroOptions = [...site.rubros, site.rubroOtro].map((r) => ({ value: r.slug, label: r.longLabel }));
export const cantidadOptions = ['1–10', '11–30', '31–100', 'Más de 100'] as const;
export const productoOptions = ['Pantalones', 'Camisas', 'Calzado de seguridad', 'Overoles', 'Elementos de seguridad', 'Uniformes', 'Otro'] as const;
export const personalizacionOptions = ['Bordado', 'Estampado', 'Ambos', 'No', 'No sé todavía'] as const;
export const plazoOptions = ['Lo antes posible', 'Este mes', 'Próximos 3 meses', 'Solo averiguo'] as const;

const rubroSlugs = rubroOptions.map((r) => r.value) as [string, ...string[]];
const required = (msg: string = e.required) => z.string({ required_error: msg }).trim().min(1, msg);
const choice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.string({ required_error: e.choose }).refine((v): v is T[number] => (values as readonly string[]).includes(v), e.choose);

/** WhatsApp con código de área; se acepta con o sin 0 / 15 / +54 9 (la normalización es T08). */
const telefono = required().refine((v) => {
  const digits = v.replace(/\D/g, '').length;
  return digits >= 10 && digits <= 13;
}, e.telefono);

export const leadSchema = z.object({
  nombre: required().pipe(z.string().min(2, e.nombre).max(80, e.nombre)),
  empresa: required(),
  telefono,
  email: z.union([z.literal(''), z.string().trim().email(e.email)]),
  localidad: required(),
  rubro: choice(rubroSlugs),
  cantidad: choice(cantidadOptions),
  productos: z.array(choice(productoOptions)).min(1, e.productos),
  personalizacion: choice(personalizacionOptions),
  plazo: z.union([z.literal(''), choice(plazoOptions)]),
  comentario: z.string().max(1000, e.comentario),
  acepta: z.literal(true, { errorMap: () => ({ message: e.acepta }) }),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
