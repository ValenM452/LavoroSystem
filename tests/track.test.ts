import { describe, expect, it } from 'vitest';
import { classifyLink } from '../src/lib/track';
import { site } from '../src/config/site';

describe('classifyLink (05 §5)', () => {
  it('WhatsApp de empresas → click_whatsapp b2b', () => {
    expect(classifyLink(site.contact.whatsappEmpresas.url, 'hero')).toEqual({
      event: 'click_whatsapp',
      params: { tipo: 'b2b', seccion: 'hero' },
    });
  });

  it('WhatsApp del local → click_whatsapp local', () => {
    expect(classifyLink(site.contact.whatsappLocal.url, 'footer')?.params.tipo).toBe('local');
  });

  it('link a tienda con UTM → click_tienda con la sección de utm_campaign', () => {
    const hit = classifyLink('https://tienda.example.com/?utm_source=landing&utm_medium=referral&utm_campaign=catalogo', 'otra');
    expect(hit?.event).toBe('click_tienda');
    expect(hit?.params.seccion).toBe('catalogo');
  });

  it('links internos, mailto o pendientes no se miden', () => {
    expect(classifyLink('http://localhost/empresas#cotizar', 'x')).toBeNull();
    expect(classifyLink(`mailto:${site.contact.email}`, 'x')).toBeNull();
    expect(classifyLink('#', 'x')).toBeNull();
  });
});
