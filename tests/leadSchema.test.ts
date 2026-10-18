import { describe, expect, it } from 'vitest';
import { leadSchema, type LeadInput } from '../src/lib/leadSchema';
import { validInput } from './fixtures';

const errorsOf = (input: LeadInput) => {
  const r = leadSchema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => String(i.path[0]));
};

describe('leadSchema', () => {
  it('acepta un lead completo y normaliza el teléfono', () => {
    const r = leadSchema.safeParse(validInput());
    expect(r.success).toBe(true);
    expect(r.success && r.data.telefono).toBe('5493825529781');
  });

  it('acepta los opcionales completos', () => {
    expect(errorsOf(validInput({ email: 'ana@finca.com', plazo: 'Este mes', comentario: 'Logo en el pecho' }))).toEqual([]);
  });

  it.each([
    ['nombre', { nombre: '' }],
    ['nombre', { nombre: 'A' }],
    ['nombre', { nombre: 'x'.repeat(81) }],
    ['empresa', { empresa: '   ' }],
    ['telefono', { telefono: '529781' }],
    ['email', { email: 'no-es-mail' }],
    ['localidad', { localidad: '' }],
    ['rubro', { rubro: 'inventado' }],
    ['cantidad', { cantidad: '5' }],
    ['productos', { productos: [] }],
    ['productos', { productos: ['Gorras'] }],
    ['personalizacion', { personalizacion: '' }],
    ['plazo', { plazo: 'Mañana' }],
    ['comentario', { comentario: 'x'.repeat(1001) }],
    ['acepta', { acepta: false as unknown as true }],
  ] as const)('marca error en %s', (field, over) => {
    expect(errorsOf(validInput(over as Partial<LeadInput>))).toContain(field);
  });
});
