/**
 * Formulario de cotización — validación en cliente con el esquema compartido (05 §2, T06)
 * y envío JSON a /api/lead (05 §4, T08). Si el envío falla, ofrece WhatsApp como respaldo.
 */
import { leadSchema, rubroOptions, type LeadInput } from './leadSchema';
import { copy } from '../config/copy';
import { site } from '../config/site';
import { track } from './track';

interface LeadResponse { ok: boolean; error?: string; errors?: Record<string, string> }

/** Manda todos los campos (incluidos antispam y atribución); el servidor decide. */
const sendLead = async (url: string, fd: FormData): Promise<LeadResponse> => {
  const body: Record<string, unknown> = {};
  for (const [k, v] of fd) if (k !== 'productos[]') body[k] = String(v);
  body.productos = fd.getAll('productos[]').map(String);
  body.acepta = fd.get('acepta') === 'on';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    return (await res.json()) as LeadResponse;
  } catch {
    return { ok: false };
  }
};

const params = new URLSearchParams(location.search);

for (const root of document.querySelectorAll<HTMLElement>('[data-lead-root]')) init(root);

function init(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-lead-form]')!;
  const summary = root.querySelector<HTMLElement>('[data-lead-summary]')!;
  const success = root.querySelector<HTMLElement>('[data-lead-success]')!;
  const submit = root.querySelector<HTMLButtonElement>('[data-lead-submit]')!;
  const waLink = root.querySelector<HTMLAnchorElement>('[data-lead-wa]')!;
  const failure = root.querySelector<HTMLElement>('[data-lead-failure]')!;
  const failureWa = root.querySelector<HTMLAnchorElement>('[data-lead-failure-wa]')!;
  const el = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  const setValue = (name: string, value: string) => { const f = el(name); if (f) f.value = value; };

  form.noValidate = true;

  // Atribución y tiempo de llenado
  setValue('t', String(Date.now()));
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) setValue(k, params.get(k) ?? '');
  setValue('pagina', location.pathname);
  setValue('referrer', document.referrer);

  // Precarga desde la URL: ?rubro=<slug> y ?personalizacion=1 (04 §1, §6)
  const preload = (search: URLSearchParams) => {
    const rubro = search.get('rubro');
    if (rubro && rubroOptions.some((r) => r.value === rubro)) setValue('rubro', rubro);
    if (search.get('personalizacion') === '1') {
      const radio = form.querySelector<HTMLInputElement>('input[name="personalizacion"][value="No sé todavía"]');
      if (radio) radio.checked = true;
    }
  };
  preload(params);
  // Links a esta misma página con ?rubro=…#cotizar (grilla de rubros, mega menú):
  // precargan el formulario, bajan hasta él y llevan el foco al primer campo, sin recargar.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#cotizar"], a[href*="#contacto"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    const section = document.getElementById(url.hash.slice(1));
    if (url.pathname !== location.pathname || !section?.contains(root)) return;
    e.preventDefault();
    preload(url.searchParams);
    history.pushState(null, '', url);
    section.scrollIntoView();
    el('nombre')?.focus({ preventScroll: true });
  });

  const read = (): LeadInput => {
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '');
    return {
      nombre: s('nombre'),
      empresa: s('empresa'),
      telefono: s('telefono'),
      email: s('email'),
      localidad: s('localidad'),
      rubro: s('rubro'),
      cantidad: s('cantidad'),
      productos: fd.getAll('productos[]').map(String),
      personalizacion: s('personalizacion'),
      plazo: s('plazo'),
      comentario: s('comentario'),
      acepta: fd.get('acepta') === 'on' ? true : (false as unknown as true),
    };
  };

  const controlsFor = (key: string) =>
    [...form.querySelectorAll<HTMLElement>(`[name="${key}"], [name="${key}[]"]`)];

  let submitted = false;
  let sending = false;

  const showErrors = (errors: Map<string, string>, announce: boolean) => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((p) => {
      const key = p.dataset.errorFor!;
      p.textContent = errors.get(key) ?? '';
      controlsFor(key).forEach((c) => (errors.has(key) ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid')));
    });
    if (!errors.size) summary.textContent = '';
    else if (announce) {
      summary.textContent = copy.form.errors.summary(errors.size);
      const first = [...form.elements].find((c) => {
        const n = (c as HTMLInputElement).name?.replace('[]', '');
        return n && errors.has(n);
      }) as HTMLElement | undefined;
      first?.focus();
    }
  };

  const validate = (announce: boolean) => {
    const result = leadSchema.safeParse(read());
    const errors = new Map<string, string>();
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errors.has(key)) errors.set(key, issue.message);
      }
    }
    showErrors(errors, announce);
    return result.success ? result.data : null;
  };

  const setSending = (on: boolean) => {
    sending = on;
    if (on) {
      form.setAttribute('aria-busy', 'true');
      submit.setAttribute('aria-disabled', 'true');
      submit.textContent = copy.form.sending;
    } else {
      form.removeAttribute('aria-busy');
      submit.removeAttribute('aria-disabled');
      submit.textContent = copy.form.submit;
    }
  };

  form.addEventListener('focusin', () => track('form_start', { pagina: location.pathname }), { once: true });
  form.addEventListener('focusout', () => submitted && validate(false));
  form.addEventListener('change', () => submitted && validate(false));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    submitted = true;
    const data = validate(true);
    if (!data) return;

    setSending(true);
    failure.hidden = true;
    const res = await sendLead(form.action, new FormData(form));
    setSending(false);

    // El resumen se arma con los datos ya validados: sirve igual si el servidor no respondió
    // o si respondió con el link genérico (rate limit / spam).
    const rubro = rubroOptions.find((r) => r.value === data.rubro)?.label ?? data.rubro;
    const text = copy.form.waSummary({ nombre: data.nombre, empresa: data.empresa, rubro, productos: data.productos.join(', '), cantidad: data.cantidad });
    const whatsappUrl = `https://wa.me/${site.contact.whatsappEmpresas.number}?text=${encodeURIComponent(text)}`;

    if (res.ok) {
      track('generate_lead', { rubro: data.rubro, cantidad: data.cantidad });
      waLink.href = whatsappUrl;
      form.hidden = true;
      success.hidden = false;
      success.focus();
      return;
    }
    if (res.error === 'invalid' && res.errors) {
      showErrors(new Map(Object.entries(res.errors)), true);
      return;
    }
    failureWa.href = whatsappUrl;
    failure.hidden = false;
    failure.focus();
  });
}

export {};
