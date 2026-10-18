import type { LeadInput } from '../src/lib/leadSchema';

/** Lead válido de ejemplo (datos ficticios). */
export const validInput = (over: Partial<LeadInput> = {}): LeadInput => ({
  nombre: 'Ana Pérez',
  empresa: 'Finca Los Álamos',
  telefono: '03825 15-529781',
  email: '',
  localidad: 'Chilecito, La Rioja',
  rubro: 'campos-fincas',
  cantidad: '11–30',
  productos: ['Pantalones', 'Camisas'],
  personalizacion: 'Bordado',
  plazo: '',
  comentario: '',
  acepta: true,
  ...over,
});
