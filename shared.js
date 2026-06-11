/* ══════════════════════════════════════════════════════════════
   MIFTAHUL ISLAM TASEEN — PORTFOLIO
   Shared JavaScript — Animations, Scroll, Cursor, Transitions
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══ PROGRESSIVE ENHANCEMENT GATE ═══
     Hidden initial states (reveals, hero entrance) only apply when
     GSAP is confirmed present — if a CDN fails, content stays visible. */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    var pre = document.getElementById('preloader');
    if (pre) pre.remove();
    return;
  }

  document.documentElement.classList.add('has-anim');

  /* ═══ REGISTER GSAP PLUGINS ═══ */
  gsap.registerPlugin(ScrollTrigger);

  /* ═══ PRELOADER ═══ */
  const preloader = document.getElementById('preloader');
  const hasVisited = sessionStorage.getItem('preloaderDone');
  var pageInitialized = false;

  function runPreloader() {
    if (!preloader) { initPage(); return; }

    if (hasVisited) {
      preloader.remove();
      initPage();
      return;
    }

    /* Failsafe — never trap the page behind the preloader
       (throttled tabs, paused rAF, etc.) */
    var failsafe = setTimeout(function () {
      var p = document.getElementById('preloader');
      if (p) {
        sessionStorage.setItem('preloaderDone', '1');
        p.remove();
        initPage();
      }
    }, 4000);

    const chars = preloader.querySelectorAll('.char');
    const line = preloader.querySelector('.preloader-line');
    const sub = preloader.querySelector('.preloader-sub');

    const tl = gsap.timeline({
      onComplete: function () {
        clearTimeout(failsafe);
        sessionStorage.setItem('preloaderDone', '1');
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: function () {
            preloader.classList.add('done');
            preloader.remove();
            initPage();
          }
        });
      }
    });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.3
    })
    .to(line, {
      scaleX: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    .to(sub, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    .to({}, { duration: 0.6 });
  }


  /* ═══ PAGE INITIALIZATION ═══ */
  function initPage() {
    if (pageInitialized) return;
    pageInitialized = true;
    initLenis();
    initCursor();
    initNavbar();
    initThemeToggle();
    initTextReveals();
    initScrollReveals();
    initCounters();
    initMagneticHover();
    initHorizontalScroll();
    initFilterTabs();
    initSkillBars();
    initImageFallbacks();
    initPageTransitions();
    initCardMouseTrack();

    /* Hero entrance */
    heroEntrance();
  }


  /* ═══ LENIS SMOOTH SCROLL ═══ */
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }


  /* ═══ CUSTOM CURSOR ═══ */
  function initCursor() {
    if (window.innerWidth < 768) return;
    if ('ontouchstart' in window) return;

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hover detection */
    var hoverTargets = 'a, button, .filter-tab, .card, .exp-card, .cert-card, input, textarea, .theme-toggle, .menu-toggle';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });

    /* Hide cursor when leaving window */
    document.addEventListener('mouseleave', function () {
      document.body.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', function () {
      document.body.classList.remove('cursor-hidden');
    });
  }


  /* ═══ NAVBAR ═══ */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    /* Scroll effect */
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: function (self) {
        if (self.direction === 1 && self.scroll() > 80) {
          navbar.classList.add('scrolled');
        } else if (self.scroll() <= 80) {
          navbar.classList.remove('scrolled');
        }
      }
    });

    /* Active link */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navbar.querySelectorAll('.navbar-links a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    /* Mobile menu */
    var menuToggle = document.querySelector('.menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }


  /* ═══ THEME TOGGLE ═══ */
  function initThemeToggle() {
    var stored = localStorage.getItem('theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    }

    updateThemeIcon();

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon();
      });
    });
  }

  function updateThemeIcon() {
    var isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    document.querySelectorAll('.theme-toggle i').forEach(function (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
  }


  /* ═══ TEXT REVEAL ANIMATIONS ═══ */
  function initTextReveals() {
    document.querySelectorAll('.text-reveal').forEach(function (el) {
      var inner = el.querySelector('.reveal-inner');
      if (!inner) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(inner, {
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
          });
        }
      });
    });
  }


  /* ═══ HERO ENTRANCE ═══ */
  function heroEntrance() {
    var heroReveals = document.querySelectorAll('.hero .text-reveal .reveal-inner');
    if (!heroReveals.length) return;

    var tl = gsap.timeline({ delay: 0.2 });

    heroReveals.forEach(function (el, i) {
      tl.to(el, {
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, i * 0.12);
    });

    /* Fade in other hero elements */
    var heroFades = document.querySelectorAll('.hero .hero-fade');
    heroFades.forEach(function (el, i) {
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out'
      }, 0.5 + i * 0.1);
    });
  }


  /* ═══ SCROLL-TRIGGERED REVEALS ═══ */
  function initScrollReveals() {
    /* Individual reveals */
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        }
      });
    });

    document.querySelectorAll('.reveal-fade').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(el, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    });

    /* Staggered grid items */
    var staggerGroups = document.querySelectorAll('.stagger-group');
    staggerGroups.forEach(function (group) {
      var items = group.querySelectorAll('.stagger-item');
      ScrollTrigger.create({
        trigger: group,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    });
  }


  /* ═══ NUMBER COUNTERS ═══ */
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0');
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            }
          });
        }
      });
    });
  }


  /* ═══ MAGNETIC HOVER (CARD TILT) ═══ */
  function initMagneticHover() {
    if (window.innerWidth < 768) return;
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.card-tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
    });
  }


  /* ═══ HORIZONTAL SCROLL SECTION ═══ */
  function initHorizontalScroll() {
    var section = document.querySelector('.horizontal-scroll');
    if (!section) return;

    var track = section.querySelector('.hs-track');
    if (!track) return;

    var totalWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: function () { return -totalWidth; },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: function () { return '+=' + totalWidth; },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  }


  /* ═══ FILTER TABS ═══ */
  function initFilterTabs() {
    document.querySelectorAll('.filter-tabs').forEach(function (tabGroup) {
      var tabs = tabGroup.querySelectorAll('.filter-tab');
      var targetId = tabGroup.getAttribute('data-target');
      var container = document.getElementById(targetId);
      if (!container) return;

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');

          var filter = tab.getAttribute('data-filter');
          var items = container.querySelectorAll('[data-category]');

          items.forEach(function (item) {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              gsap.to(item, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
                clearProps: 'all',
                onStart: function () { item.style.display = ''; }
              });
            } else {
              gsap.to(item, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: function () { item.style.display = 'none'; }
              });
            }
          });
        });
      });
    });
  }


  /* ═══ SKILL BARS ═══ */
  function initSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
      var pct = bar.getAttribute('data-width');
      if (!pct) return;

      ScrollTrigger.create({
        trigger: bar,
        start: 'top 92%',
        once: true,
        onEnter: function () {
          bar.style.width = pct + '%';
        }
      });
    });
  }


  /* ═══ IMAGE FALLBACKS ═══ */
  function initImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
      img.addEventListener('error', function () {
        var wrap = img.parentElement;
        if (!wrap) return;
        img.style.display = 'none';
        if (!wrap.querySelector('.img-placeholder')) {
          var ph = document.createElement('div');
          ph.className = 'img-placeholder';
          ph.innerHTML = '<i class="fas fa-image"></i><span>Image</span>';
          wrap.appendChild(ph);
        }
      });
    });
  }


  /* ═══ PAGE TRANSITIONS ═══ */
  function initPageTransitions() {
    var overlay = document.querySelector('.page-transition');
    if (!overlay) return;

    /* Entry animation — only if navigated from internal page */
    var cameFromTransition = sessionStorage.getItem('pageTransition');
    if (cameFromTransition) {
      sessionStorage.removeItem('pageTransition');
      overlay.style.display = 'block';
      overlay.style.transform = 'translateY(0)';
      gsap.to(overlay, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
        delay: 0.05,
        onComplete: function () {
          overlay.style.display = 'none';
          overlay.style.transform = '';
        }
      });
    } else {
      overlay.style.display = 'none';
    }

    /* Exit on link click */
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.setItem('pageTransition', '1');
        overlay.style.display = 'block';
        overlay.style.transform = 'translateY(100%)';

        gsap.to(overlay, {
          y: 0,
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: function () {
            window.location.href = href;
          }
        });
      });
    });
  }


  /* ═══ CARD MOUSE TRACKING (GLOW) ═══ */
  function initCardMouseTrack() {
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }


  /* ═══ INIT ON DOM READY ═══ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloader);
  } else {
    runPreloader();
  }

})();
