/* ─────────────────────────────────────────────────────
   GANESH REDDY — PORTFOLIO  |  script.js
   ───────────────────────────────────────────────────── */

/* ── Navbar scroll effect ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.body.style.setProperty('--scrollParam', window.scrollY);
});

// Autonomous "Living" Background Timer
function updateTimeParam() {
  document.body.style.setProperty('--timeParam', performance.now() / 1000);
  requestAnimationFrame(updateTimeParam);
}
updateTimeParam();

/* ── Hamburger menu ───────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Typed.js–style hero tagline ─────────────────── */
const phrases = [
  'Robotics Engineer',
  'Computer Vision Engineer',
  'Embedded Systems Engineer',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

const target = document.getElementById('typed-target');
target.innerHTML = '<span class="typed-text"></span><span class="cursor"></span>';
const typedEl = target.querySelector('.typed-text');

function type() {
  if (paused) return;
  const current = phrases[phraseIdx];

  if (deleting) {
    typedEl.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 45);
  } else {
    typedEl.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; type(); }, 2000);
      return;
    }
    setTimeout(type, 65);
  }
}
type();

/* ── Scroll reveal ────────────────────────────────── */
function addRevealClasses() {
  document.querySelectorAll(
    '.glass-card, .timeline-item, .exp-card, .project-card, .about-text, .about-card, .contact-info, .contact-cta'
  ).forEach(el => el.classList.add('reveal'));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

addRevealClasses();
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered children reveal ────────────────────── */
document.querySelectorAll('.skills-grid, .projects-grid, .exp-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ── Highlight numbers counter animation ─────────── */
function animateCounter(el, target, duration = 1200) {
  const isFloat = target % 1 !== 0;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const val      = eased * target;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const nums = entry.target.querySelectorAll('.highlight-num');
    nums.forEach(span => {
      const raw = parseFloat(span.textContent);
      if (!isNaN(raw)) animateCounter(span, raw);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const highlightsEl = document.querySelector('.about-highlights');
if (highlightsEl) counterObserver.observe(highlightsEl);

/* ── Active nav link on scroll ────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a[href^="#"]');

const navActiveObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = '#fff';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navActiveObserver.observe(s));

/* ── Tilt effect on project cards ────────────────── */
document.querySelectorAll('.project-card, .glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Smooth nav scroll ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Theme Toggle ─────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  function updateThemeIcon() {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // Initial icon sync
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
  });
}
