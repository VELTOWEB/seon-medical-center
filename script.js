/* =========================================================
   SEON MEDICAL CENTER — interaction & motion
   No external libraries required
========================================================= */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const intro = document.getElementById('intro');
  const skipIntro = intro?.querySelector('.intro__skip');
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const pointerGlow = document.getElementById('pointerGlow');
  const cursor = document.getElementById('cursor');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const toast = document.getElementById('toast');
  const hero = document.querySelector('.hero');
  const heroImageWrap = document.querySelector('.hero__image-wrap');
  const impact = document.querySelector('.impact');
  const impactWords = [...document.querySelectorAll('.impact-word')];
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];

  let introDone = false;
  let menuLastFocus = null;
  let scrollTicking = false;
  let pointerTicking = false;
  let toastTimer;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* Intro: 2–3 second brand sequence, then curtain reveal */
  const completeIntro = (instant = false) => {
    if (introDone) return;
    introDone = true;

    if (instant || reducedMotion) {
      intro?.classList.add('is-hidden');
      body.classList.remove('is-loading');
      body.classList.add('site-ready');
      return;
    }

    intro?.classList.add('is-exiting');
    body.classList.remove('is-loading');
    window.setTimeout(() => body.classList.add('site-ready'), 230);
    window.setTimeout(() => intro?.classList.add('is-hidden'), 1080);
  };

  if (reducedMotion) {
    completeIntro(true);
  } else {
    window.setTimeout(() => completeIntro(false), 1850);
  }
  skipIntro?.addEventListener('click', () => completeIntro(false));

  /* Scroll state: header, progress, back-to-top, parallax, impact copy */
  const updateImpact = () => {
    if (!impact || !impactWords.length) return;
    const rect = impact.getBoundingClientRect();
    const travel = Math.max(impact.offsetHeight - window.innerHeight, 1);
    const sectionProgress = clamp(-rect.top / travel, 0, 1);

    impactWords.forEach((word, index) => {
      const threshold = 0.1 + index * (0.66 / impactWords.length);
      word.classList.toggle('is-lit', sectionProgress >= threshold);
    });
  };

  const updateScroll = () => {
    const y = window.scrollY;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = clamp(y / max, 0, 1);

    progress?.style.setProperty('transform', `scaleX(${ratio})`);
    header?.classList.toggle('is-scrolled', y > 28);
    backTop?.classList.toggle('is-visible', y > 720);

    if (!reducedMotion && window.innerWidth > 900) {
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax || 0);
        const rect = item.getBoundingClientRect();
        if (rect.bottom > -120 && rect.top < window.innerHeight + 120) {
          const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
          item.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });
    } else {
      parallaxItems.forEach((item) => item.style.removeProperty('transform'));
    }

    updateImpact();
    scrollTicking = false;
  };

  const requestScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScroll);
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScroll();

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  /* Section reveals */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  /* Animated statistics */
  const counters = [...document.querySelectorAll('.counter')];
  const animateCounter = (counter) => {
    if (counter.dataset.counted === 'true') return;
    counter.dataset.counted = 'true';
    const target = Number(counter.dataset.target || 0);
    const duration = 1700;
    const start = performance.now();

    const frame = (time) => {
      const elapsed = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - elapsed, 4);
      counter.textContent = Math.round(target * eased).toLocaleString('ko-KR');
      if (elapsed < 1) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => {
      counter.textContent = Number(counter.dataset.target || 0).toLocaleString('ko-KR');
    });
  }

  /* Mobile full-screen menu */
  const closeMenu = (restoreFocus = false) => {
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', '전체 메뉴 열기');
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    body.classList.remove('menu-open');
    if (restoreFocus) menuLastFocus?.focus();
  };

  const openMenu = () => {
    menuLastFocus = document.activeElement;
    menuToggle?.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    menuToggle?.setAttribute('aria-label', '전체 메뉴 닫기');
    mobileMenu?.classList.add('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    window.setTimeout(() => mobileMenu?.querySelector('a')?.focus(), 250);
  };

  menuToggle?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) closeMenu(true);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileMenu?.classList.contains('is-open')) closeMenu();
  }, { passive: true });

  /* Horizontal gallery controls and drag */
  const gallery = document.getElementById('gallery');
  document.querySelectorAll('[data-gallery]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.gallery === 'next' ? 1 : -1;
      gallery?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.68, 720), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (gallery && finePointer) {
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    gallery.addEventListener('pointerdown', (event) => {
      dragging = true;
      startX = event.clientX;
      startScroll = gallery.scrollLeft;
      gallery.classList.add('is-dragging');
      gallery.setPointerCapture(event.pointerId);
    });
    gallery.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      gallery.scrollLeft = startScroll - (event.clientX - startX) * 1.1;
    });
    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      gallery.classList.remove('is-dragging');
      if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
    };
    gallery.addEventListener('pointerup', stopDrag);
    gallery.addEventListener('pointercancel', stopDrag);
    gallery.addEventListener('pointerleave', (event) => {
      if (dragging) stopDrag(event);
    });
  }

  /* Cursor, pointer glow, hero depth and magnetic buttons */
  if (finePointer && !reducedMotion) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;

    const renderPointer = () => {
      cursorX += (pointerX - cursorX) * 0.2;
      cursorY += (pointerY - cursorY) * 0.2;
      cursor?.style.setProperty('transform', `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`);
      pointerGlow?.style.setProperty('transform', `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`);
      pointerTicking = true;
      window.requestAnimationFrame(renderPointer);
    };
    window.requestAnimationFrame(renderPointer);

    document.addEventListener('mousemove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor?.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursor?.classList.remove('is-visible'));

    document.querySelectorAll('a, button, .service-card, .gallery-card').forEach((element) => {
      element.addEventListener('mouseenter', () => cursor?.classList.add('is-active'));
      element.addEventListener('mouseleave', () => cursor?.classList.remove('is-active'));
    });

    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('mousemove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
      });
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    hero?.addEventListener('mousemove', (event) => {
      if (!heroImageWrap || window.innerWidth <= 900) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroImageWrap.style.transform = `translate3d(${x * -9}px, ${y * -7}px, 0) scale(1.025)`;
    }, { passive: true });
    hero?.addEventListener('mouseleave', () => {
      if (heroImageWrap) heroImageWrap.style.transform = '';
    });
  } else if (!pointerTicking) {
    cursor?.remove();
  }

  /* Clear portfolio-only non-working links without dead navigation */
  const showToast = (message = '포트폴리오용 샘플 버튼입니다.') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  document.querySelectorAll('a[href="tel:0200000000"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('가상 병원의 샘플 전화번호입니다.');
    });
  });
  document.querySelectorAll('.footer__nav a[href="#footer"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('SNS 링크는 실제 병원 정보로 교체해 주세요.');
    });
  });
  document.querySelectorAll('.sample-action').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('온라인 상담 기능을 연결할 수 있는 샘플 버튼입니다.');
    });
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
});
