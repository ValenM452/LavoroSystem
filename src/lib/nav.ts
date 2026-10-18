/**
 * Mega menú (desktop) y menú de celular. Patrón "disclosure navigation":
 * sin role="menu"; el mega menú no atrapa el foco (cierra al salir),
 * el menú de celular es un <dialog> modal que sí lo atrapa.
 */
const cssMs = (name: string) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

const desktop = matchMedia('(min-width: 1024px)');
const header = document.querySelector<HTMLElement>('[data-header]');

/* ---------- Mega menú ---------- */
const mega = document.querySelector<HTMLElement>('[data-mega]');
if (mega && header) {
  const trigger = mega.querySelector<HTMLButtonElement>('[data-mega-trigger]')!;
  const panel = mega.querySelector<HTMLElement>('[data-mega-panel]')!;
  const items = [...panel.querySelectorAll<HTMLAnchorElement>('[data-mega-item]')];
  const previews = [...panel.querySelectorAll<HTMLElement>('[data-mega-preview]')];
  let openTimer = 0;
  let closeTimer = 0;

  const isOpen = () => !panel.hidden;
  const setPreview = (slug: string) => {
    previews.forEach((p) => (p.hidden = p.dataset.megaPreview !== slug));
    items.forEach((a) => a.classList.toggle('is-active', a.dataset.megaItem === slug));
  };
  const open = () => {
    window.clearTimeout(closeTimer);
    if (isOpen()) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    header.classList.add('has-mega');
    setPreview(items[0]?.dataset.megaItem ?? '');
  };
  const close = (returnFocus = false) => {
    window.clearTimeout(openTimer);
    if (!isOpen()) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    header.classList.remove('has-mega');
    if (returnFocus) trigger.focus();
  };

  trigger.addEventListener('click', () => (isOpen() ? close() : open()));
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      items[0]?.focus();
    }
  });

  items.forEach((a, i) => {
    const slug = a.dataset.megaItem ?? '';
    a.addEventListener('mouseenter', () => setPreview(slug));
    a.addEventListener('focus', () => setPreview(slug));
    a.addEventListener('keydown', (e) => {
      const last = items.length - 1;
      const next = { ArrowDown: Math.min(i + 1, last), ArrowUp: Math.max(i - 1, 0), Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      items[next].focus();
    });
  });

  mega.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.stopPropagation();
      close(true);
    }
  });
  mega.addEventListener('focusout', (e) => {
    const to = e.relatedTarget as Node | null;
    if (to && !mega.contains(to)) close();
  });
  document.addEventListener('click', (e) => {
    if (isOpen() && !mega.contains(e.target as Node)) close();
  });

  // Hover (solo puntero con hover y desktop), con retardos de intención.
  mega.addEventListener('mouseenter', () => {
    if (!desktop.matches || !matchMedia('(hover: hover)').matches) return;
    window.clearTimeout(closeTimer);
    openTimer = window.setTimeout(open, cssMs('--mega-open-delay'));
  });
  mega.addEventListener('mouseleave', () => {
    window.clearTimeout(openTimer);
    if (!isOpen()) return;
    closeTimer = window.setTimeout(() => close(), cssMs('--mega-close-delay'));
  });
  desktop.addEventListener('change', () => close());
}

/* ---------- Menú de celular ---------- */
const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-mobile-open]');
if (dialog && openBtn) {
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-mobile-close]')!;

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  });
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  });
  dialog.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) dialog.close();
  });
  desktop.addEventListener('change', () => {
    if (desktop.matches && dialog.open) dialog.close();
  });
}

export {};
