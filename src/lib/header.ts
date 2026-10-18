/** Header transparente → sólido al salir del tope de la página (04 §1, T02). */
const header = document.querySelector<HTMLElement>('[data-header]');
const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');

if (header && sentinel) {
  if (!('IntersectionObserver' in window)) {
    header.classList.add('is-solid');
  } else {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry.isIntersecting);
    }).observe(sentinel);
  }
}

export {};
