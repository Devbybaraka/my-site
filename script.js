/* ==========================================================================
   Newton Baraka — portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var THEME_KEY = 'nb-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f5f1' : '#08080a');
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  var stored = null;
  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (e) {}

  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  /* ── Mobile menu ───────────────────────────────────────────────────────── */
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  /* ── Sticky nav + scroll progress ──────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('progressBar');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      progressBar.style.width = (ratio * 100).toFixed(2) + '%';
    }
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ── Active nav link ───────────────────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ── Reveal on scroll ──────────────────────────────────────────────────── */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ── Hero headline ─────────────────────────────────────────────────────── */
  var heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    window.requestAnimationFrame(function () {
      window.setTimeout(function () {
        heroTitle.classList.add('is-ready');
      }, reduced ? 0 : 120);
    });
  }

  /* ── Counters ──────────────────────────────────────────────────────────── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (counter) {
      countObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCount);
  }

  /* ── Work filters ──────────────────────────────────────────────────────── */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('#workGrid .card');

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');

      filters.forEach(function (other) {
        var active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-selected', String(active));
      });

      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        var show = filter === 'all' || tags.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ── Card spotlight follows the pointer ────────────────────────────────── */
  if (finePointer) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((event.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* ── Magnetic buttons ──────────────────────────────────────────────────── */
  if (finePointer && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach(function (element) {
      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.14;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.22;
        element.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      element.addEventListener('pointerleave', function () {
        element.style.transform = '';
      });
    });
  }

  /* ── Custom cursor ─────────────────────────────────────────────────────── */
  var cursor = document.querySelector('.cursor');
  if (cursor && finePointer && !reduced) {
    var dot = cursor.querySelector('.cursor__dot');
    var ring = cursor.querySelector('.cursor__ring');
    var targetX = 0;
    var targetY = 0;
    var ringX = 0;
    var ringY = 0;

    document.addEventListener('pointermove', function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = 'translate(' + targetX + 'px,' + targetY + 'px)';

      var interactive = event.target.closest('a, button, input, textarea, select, .card');
      cursor.classList.toggle('is-hover', Boolean(interactive));
    });

    (function loop() {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.transform = 'translate(' + ringX.toFixed(1) + 'px,' + ringY.toFixed(1) + 'px)';
      window.requestAnimationFrame(loop);
    })();
  }

  /* ── Local time in Nairobi ─────────────────────────────────────────────── */
  var localTime = document.getElementById('localTime');
  if (localTime) {
    var formatter;
    try {
      formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Nairobi'
      });
    } catch (e) {
      formatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    var tick = function () {
      localTime.textContent = formatter.format(new Date()) + ' EAT';
    };
    tick();
    window.setInterval(tick, 20000);
  }

  /* ── Footer year ───────────────────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Contact form ──────────────────────────────────────────────────────── */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setError(name, message) {
    var input = form.elements[name];
    if (!input) return;
    var field = input.closest('.field');
    var error = form.querySelector('[data-error-for="' + name + '"]');
    if (field) field.classList.toggle('has-error', Boolean(message));
    if (error) error.textContent = message || '';
  }

  if (form) {
    ['name', 'email', 'message'].forEach(function (name) {
      var input = form.elements[name];
      if (input) {
        input.addEventListener('input', function () {
          setError(name, '');
          if (status) status.textContent = '';
        });
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var budget = form.elements.budget.value;
      var message = form.elements.message.value.trim();
      var valid = true;

      if (name.length < 2) {
        setError('name', 'Please tell me your name.');
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      }
      if (message.length < 10) {
        setError('message', 'A sentence or two is plenty — at least 10 characters.');
        valid = false;
      }
      if (!valid) {
        var firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var subject = 'New project enquiry — ' + name;
      var body = [
        'Name: ' + name,
        'Email: ' + email,
        budget ? 'Budget: ' + budget : null,
        '',
        message
      ]
        .filter(function (line) {
          return line !== null;
        })
        .join('\n');

      window.location.href =
        'mailto:devbybaraka@gmail.com?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body);

      if (status) {
        status.textContent = 'Opening your email app — if nothing happens, write to devbybaraka@gmail.com.';
      }
    });
  }
})();
