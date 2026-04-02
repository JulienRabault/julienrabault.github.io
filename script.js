// ── Theme toggle ───────────────────────────────────────
function applyTheme(theme, persist) {
  document.documentElement.setAttribute('data-theme', theme);
  if (persist) localStorage.setItem('theme', theme);
  var icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun');
    lucide.createIcons({ elements: [icon] });
  }
}

function initTheme() {
  var saved = localStorage.getItem('theme');
  var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system, false); // no persist on init
}

document.addEventListener('DOMContentLoaded', function () {
  initTheme();

  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true); // persist on user action
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false); // no persist for system sync
    }
  });
});

// ─── Navbar shrink on scroll ───
const navbar = document.querySelector('.navbar-glass');
const navbarInner = navbar ? navbar.querySelector('div') : null;
if (navbarInner) navbarInner.classList.add('navbar-inner');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar) {
    if (y > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });

// ─── Scroll reveal with stagger cascade ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Stagger children (sub-project cards)
      const children = e.target.querySelectorAll('.border-l-2');
      children.forEach((child, j) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(12px)';
        child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        child.style.transitionDelay = `${0.1 + j * 0.08}s`;
        requestAnimationFrame(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      });
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('section').forEach(section => {
  section.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
    revealObserver.observe(el);
  });
});

// ─── Navbar active link ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  const intersecting = entries.filter(e => e.isIntersecting);
  if (intersecting.length === 0) return;
  intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
  const topEntry = intersecting[0];
  navLinks.forEach(link => {
    link.classList.remove('text-[var(--text-primary)]');
    link.classList.add('text-[var(--text-muted)]');
  });
  const active = document.querySelector(`.nav-link[href="#${topEntry.target.id}"]`);
  if (active) {
    active.classList.remove('text-[var(--text-muted)]');
    active.classList.add('text-[var(--text-primary)]');
  }
}, { rootMargin: '-20% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// ─── Hamburger menu ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });

  // Reset overflow on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Dynamic year ───
(function() {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
