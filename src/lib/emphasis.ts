const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Convierte `*palabra*` en <em>. 03 §3: máximo una itálica por titular;
 * si hay más, el build falla para que no llegue a producción.
 */
export function emphasis(text: string): string {
  const matches = text.match(/\*[^*]+\*/g) ?? [];
  if (matches.length > 1) throw new Error(`Titular con más de una itálica: "${text}"`);
  return escapeHtml(text).replace(/\*([^*]+)\*/, '<em>$1</em>');
}
