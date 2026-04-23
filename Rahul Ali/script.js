/* =========================================================
   RAHUL ALI — PORTFOLIO SCRIPTS
   Features:
     1. Sticky navbar + active link highlighting
     2. Hamburger menu toggle
     3. Typing animation
     4. Scroll reveal (IntersectionObserver)
     5. Skill bar animation
     6. Contact form handling
     7. Back-to-top button
     8. Footer year
   ========================================================= */

/* ---- 1. DOM READY ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypingAnimation();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

/* ============================================================
   1. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
   ============================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add .scrolled class when user scrolls past 60px
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight the nav link whose section is in view
    let current = '';
    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 120;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   2. HAMBURGER MENU TOGGLE
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  const toggle = () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);

  // Close menu when a link is clicked
  links.forEach(link => link.addEventListener('click', close));

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      close();
    }
  });
}

/* ============================================================
   3. TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
  const el    = document.getElementById('typedText');
  if (!el) return;

  // Roles to cycle through
  const words = [
    'Web Developer',
    'Frontend Developer',
    'Freelancer',
    'UI Enthusiast',
    'Open Source Contributor'
  ];

  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  // Timing (ms)
  const TYPE_SPEED   = 85;
  const DELETE_SPEED = 45;
  const PAUSE_END    = 1800; // pause at end of word
  const PAUSE_START  = 350;  // pause before typing next word

  const type = () => {
    const currentWord = words[wordIndex];
    const displayed   = currentWord.substring(0, charIndex);
    el.textContent    = displayed;

    if (!isDeleting && charIndex < currentWord.length) {
      // Typing forward
      charIndex++;
      setTimeout(type, TYPE_SPEED);
    } else if (!isDeleting && charIndex === currentWord.length) {
      // Finished typing — pause then delete
      setTimeout(() => { isDeleting = true; type(); }, PAUSE_END);
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      charIndex--;
      setTimeout(type, DELETE_SPEED);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next word
      isDeleting  = false;
      wordIndex   = (wordIndex + 1) % words.length;
      setTimeout(type, PAUSE_START);
    }
  };

  // Kick off after a short delay so page feels loaded
  setTimeout(type, 800);
}

/* ============================================================
   4. SCROLL REVEAL  (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after first reveal to avoid toggling
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // trigger when 12% visible
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   5. SKILL BAR ANIMATION
   ============================================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  if (!('IntersectionObserver' in window)) {
    fills.forEach(fill => {
      fill.style.width = fill.dataset.width + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill   = entry.target;
          const target = fill.dataset.width || '0';
          // Small timeout lets the CSS transition fire
          setTimeout(() => { fill.style.width = target + '%'; }, 200);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ============================================================
   6. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormMessage(success, '⚠️ Please fill in all required fields.', '#ff6b6b');
      return;
    }
    if (!isValidEmail(email)) {
      showFormMessage(success, '⚠️ Please enter a valid email address.', '#ff6b6b');
      return;
    }

    // Simulate form submission (no back-end in this demo)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled   = false;
      submitBtn.innerHTML  = 'Send Message <i class="ri-send-plane-line"></i>';
      showFormMessage(success, '✅ Message sent! I\'ll get back to you soon.', 'var(--accent)');
      // Clear the success message after 5s
      setTimeout(() => { success.textContent = ''; }, 5000);
    }, 1200);
  });
}

/** Show a message in the form feedback element */
function showFormMessage(el, msg, color) {
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
}

/** Simple email regex validator */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   7. BACK-TO-TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 450);
  };

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   8. FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   9. SMOOTH SCROLL (polyfill-like for older Safari)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});