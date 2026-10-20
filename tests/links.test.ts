import { describe, expect, it } from 'vitest';
import { tiendaTarget, whatsappLink } from '../src/lib/links';
import { site } from '../src/config/site';

describe('whatsappLink', () => {
  it('abre la línea pedida con el mensaje codificado', () => {
    const url = whatsappLink('local', 'Hola LAVORO, ¿me pasan la ubicación?');
    expect(url.startsWith(`https://wa.me/${site.contact.whatsappLocal.number}?text=`)).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Hola LAVORO, ¿me pasan la ubicación?');
  });

  it('usa el número de empresas para cotizaciones', () => {
    expect(whatsappLink('empresas', 'x')).toContain(site.contact.whatsappEmpresas.number);
  });
});

describe('tiendaTarget', () => {
  const tiendaPendiente = site.tiendanube.baseUrl.startsWith('[[');

  it('solo existen las tres categorías de la tienda', () => {
    expect(Object.keys(site.tiendanube.categories)).toEqual(['indumentaria', 'calzado', 'elementosDeSeguridad']);
  });

  it.runIf(tiendaPendiente)('sin URL de tienda queda marcada como pendiente (nunca manda a WhatsApp)', () => {
    const t = tiendaTarget('test', 'calzado');
    expect(t.pending).toBeTruthy();
    expect(t.href).not.toContain('wa.me');
  });

  it.runIf(!tiendaPendiente)('con URL de tienda, abre Tiendanube (categoría o catálogo completo) con UTM', () => {
    const t = tiendaTarget('test', 'calzado');
    expect(t.pending).toBeNull();
    expect(t.href.startsWith(site.tiendanube.baseUrl)).toBe(true);
    expect(t.href).toMatch(/\/(calzado|productos)\/\?/);
    expect(t.href).toContain('utm_campaign=test');
    expect(t.href).not.toContain('wa.me');
  });
});
