// Nav background on scroll
const header = document.getElementById('header');
if (header) addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });

// Mobile menu
const burger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu());
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Highlight the current page in the nav
  const here = location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a:not(.nav-cta)').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === here || href.replace('.html', '') === here) a.classList.add('active');
  });
}

// Scroll reveal — fall back to fully visible if IntersectionObserver is unavailable
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Animated counters
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterIO.unobserve(e.target);
    const el = e.target;
    if (!el.dataset.count) return;
    const target = +el.dataset.count, suffix = el.dataset.suffix || '+';
    const start = performance.now(), dur = 1800;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => counterIO.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq.open').forEach(f => f.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Form: graceful submit (works before a form backend is connected)
const form = document.getElementById('consultForm');
if (form) {
  form.addEventListener('submit', function (e) {
    const action = this.getAttribute('action') || '';
    if (action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      document.getElementById('formSuccess').style.display = 'block';
      this.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
      document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
