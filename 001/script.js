const navbar = document.querySelector('.navbar');
const navToggleBtn = document.getElementById('nav-toggle');
const navLinks = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const cards = Array.from(document.querySelectorAll('.card'));
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

function setMenu(open) {
  if (!navbar || !navToggleBtn) return;
  navbar.classList.toggle('is-open', open);
  navToggleBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

function closeMenu() {
  setMenu(false);
}

function getHeaderOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
  const h = Number.parseFloat(raw);
  return (Number.isFinite(h) ? h : 60) + 16;
}

function setActiveLink() {
  if (!sections.length || !navLinks.length) return;

  const y = window.scrollY + getHeaderOffset();
  let activeId = sections[0].id;

  for (const section of sections) {
    if (y >= section.offsetTop) activeId = section.id;
  }

  navLinks.forEach((a) => {
    const id = (a.getAttribute('href') || '').replace('#', '');
    const active = id === activeId;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

if (navToggleBtn && navbar) {
  navToggleBtn.addEventListener('click', () => {
    const open = navbar.classList.contains('is-open');
    setMenu(!open);
  });
}

navLinks.forEach((a) => {
  a.addEventListener('click', () => {
    closeMenu();
    setTimeout(() => setActiveLink(), 0);
  });
});

document.addEventListener('click', (e) => {
  if (!navbar || !navbar.classList.contains('is-open')) return;
  if (navbar.contains(e.target)) return;
  closeMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    setActiveLink();
    ticking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', setActiveLink);
window.addEventListener('hashchange', setActiveLink);
window.addEventListener('load', setActiveLink);

if (cards.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((el) => observer.observe(el));
} else {
  cards.forEach((el) => el.classList.add('is-visible'));
}
