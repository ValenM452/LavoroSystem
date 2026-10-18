/**
 * Normaliza un celular argentino al formato de WhatsApp: 549 + código de área + número (05 §2).
 * Acepta con o sin +54, 9, 0 y 15, y cualquier separador:
 *   "03825 15-529781" · "3825529781" · "+54 9 3825 529781" → "5493825529781"
 * Devuelve null si no se puede llegar a los 10 dígitos nacionales.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('54') && digits.length >= 12) {
    digits = digits.slice(2);
    if (digits.startsWith('9') && digits.length === 11) digits = digits.slice(1);
  }
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 12) digits = dropFifteen(input, digits);
  return digits.length === 10 ? `549${digits}` : null;
}

/**
 * Saca el "15" que va después del código de área (2 a 4 dígitos).
 * Si el usuario separó el código de área ("03825 15…"), se usa ese corte; si no, se prueba de 4 a 2.
 */
function dropFifteen(input: string, digits: string): string {
  const firstGroup = input.trim().replace(/^\+?\s*(54)?[\s-]*(9)?[\s-]*/, '').match(/^\(?0?(\d{2,4})\)?[\s-]/);
  const lengths = firstGroup ? [firstGroup[1].length, 4, 3, 2] : [4, 3, 2];
  for (const len of lengths) {
    if (digits.slice(len, len + 2) === '15') return digits.slice(0, len) + digits.slice(len + 2);
  }
  return digits;
}
