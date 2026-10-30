/**
 * LUMINARIES CAPITAL â€” INTERACTIVE ENGINE
 * Implements 3D card parade, physics micro-demos, gauge simulation, and modal routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroShader();
  initHeroScrollAnimation();
  initManifestoScrollReveal();
  initPlatformHybridScroll();
  init3DCardCarousel();
  initPhysicsToy();
  initGoalSaveGauge();
  initCoinDemo();
  initCurrencyToggle();
  initControlUI();
  initShowcaseParallax();
  initHowItWorksWheel();
  initEditorialFooter();
  initGoalSaveCalculator();
  initContactForm();
});

/* ========================================================================== 
   HERO SHADER — native canvas interpretation of the supplied ShaderGradient
   ========================================================================== */
function initHeroShader() {
  const canvas = document.getElementById('hero-shader-canvas');
  const hero = document.getElementById('hero-scroll-track');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const animate = !reducedMotion && !saveData;
  const frameInterval = 1000 / 10;
  let width = 1;
  let height = 1;
  let frameId = null;
  let lastFrame = 0;
  let isVisible = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    draw(performance.now());
  }

  function addGlow(x, y, radius, color) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(0.52, color.replace('0.82', '0.28'));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function draw(now) {
    const time = now * 0.0002;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const base = ctx.createLinearGradient(width, height, 0, 0);
    base.addColorStop(0, '#001b18');
    base.addColorStop(0.28, '#002B28');
    base.addColorStop(0.58, '#007f72');
    base.addColorStop(0.82, '#00A896');
    base.addColorStop(1, '#07110d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'screen';
    addGlow(
      width * (0.2 + Math.sin(time * 1.1) * 0.09),
      height * (0.36 + Math.cos(time * 0.8) * 0.12),
      Math.max(width, height) * 0.62,
      'rgba(0,168,150,0.82)'
    );
    addGlow(
      width * (0.76 + Math.cos(time * 0.72) * 0.1),
      height * (0.52 + Math.sin(time * 0.66) * 0.14),
      Math.max(width, height) * 0.54,
      'rgba(228,242,34,0.82)'
    );

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(225 * Math.PI / 180);
    ctx.translate(-width / 2, -height / 2);
    ctx.filter = 'blur(24px)';

    for (let wave = 0; wave < 5; wave += 1) {
      const phase = time * 2 + wave * 1.25;
      const y = height * (0.08 + wave * 0.22) + Math.sin(phase) * height * 0.08;
      const waveGradient = ctx.createLinearGradient(0, y, width, y);
      waveGradient.addColorStop(0, 'rgba(0,43,40,0.76)');
      waveGradient.addColorStop(0.46, 'rgba(0,168,150,0.58)');
      waveGradient.addColorStop(0.78, 'rgba(228,242,34,0.38)');
      waveGradient.addColorStop(1, 'rgba(0,43,40,0.68)');

      ctx.beginPath();
      ctx.moveTo(-width * 0.2, y);
      ctx.bezierCurveTo(
        width * 0.18,
        y + Math.sin(phase) * height * 0.24,
        width * 0.72,
        y + Math.cos(phase * 0.82) * height * 0.22,
        width * 1.2,
        y + Math.sin(phase * 0.64) * height * 0.1
      );
      ctx.strokeStyle = waveGradient;
      ctx.lineWidth = Math.max(70, height * 0.2);
      ctx.stroke();
    }

    ctx.restore();
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    const vignette = ctx.createRadialGradient(
      width * 0.5, height * 0.42, Math.min(width, height) * 0.12,
      width * 0.5, height * 0.48, Math.max(width, height) * 0.78
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function tick(now) {
    if (!isVisible || document.hidden) {
      frameId = null;
      return;
    }
    if (now - lastFrame >= frameInterval) {
      draw(now);
      lastFrame = now;
    }
    frameId = window.requestAnimationFrame(tick);
  }

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (animate && isVisible && !frameId) frameId = window.requestAnimationFrame(tick);
    }, { threshold: 0.01 }).observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    if (animate && !document.hidden && isVisible && !frameId) {
      frameId = window.requestAnimationFrame(tick);
    }
  });

  resize();
  if (animate) frameId = window.requestAnimationFrame(tick);
}

function initEditorialFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      footer.classList.add('is-visible');
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(footer);
  } else {
    footer.classList.add('is-visible');
  }

  footer.querySelectorAll('.footer-nav-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      if (window.innerWidth > 640) return;
      const column = toggle.closest('.footer-nav-col');
      const willOpen = !column.classList.contains('is-open');

      footer.querySelectorAll('.footer-nav-col').forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.footer-nav-toggle')?.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        column.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   1. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const nav = document.getElementById('main-nav');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const megamenu = document.getElementById('revolut-megamenu');
  const discoverLink = document.getElementById('megamenu-discover-link');
  const discoverText = document.getElementById('megamenu-discover-text');
  const pillItems = document.querySelectorAll('.nav-pill-item.has-dropdown');

  if (nav) {
    let navTicking = false;
    const updateNavbarState = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      navTicking = false;
    };
    const requestNavbarUpdate = () => {
      if (navTicking) return;
      navTicking = true;
      window.requestAnimationFrame(updateNavbarState);
    };

    updateNavbarState();
    window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
  }

  if (mobileBtn && mobileDrawer) {
    const drawerLinks = Array.from(mobileDrawer.querySelectorAll('a'));

    const closeMobileMenu = (restoreFocus = false) => {
      mobileDrawer.classList.remove('active');
      mobileBtn.classList.remove('is-open');
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mobile-nav-open');
      if (restoreFocus) mobileBtn.focus();
    };

    const openMobileMenu = () => {
      mobileDrawer.classList.add('active');
      mobileBtn.classList.add('is-open');
      mobileBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mobile-nav-open');
      drawerLinks[0]?.focus();
    };

    mobileBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) closeMobileMenu();
      else openMobileMenu();
    });

    drawerLinks.forEach((link) => link.addEventListener('click', () => closeMobileMenu()));

    document.addEventListener('click', (event) => {
      if (!mobileDrawer.classList.contains('active') || nav.contains(event.target)) return;
      closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (!mobileDrawer.classList.contains('active')) return;
      if (event.key === 'Escape') {
        closeMobileMenu(true);
        return;
      }
      if (event.key !== 'Tab' || drawerLinks.length === 0) return;

      const first = drawerLinks[0];
      const last = drawerLinks[drawerLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileMenu();
    }, { passive: true });
  }

  if (megamenu && pillItems.length > 0) {
    let closeTimeout = null;

    function openMegamenu(targetKey, activeItem) {
      clearTimeout(closeTimeout);
      pillItems.forEach(item => item.classList.remove('is-open'));
      if (activeItem) activeItem.classList.add('is-open');

      // Activate corresponding megamenu panel (save, invest, about)
      const panels = megamenu.querySelectorAll('.megamenu-panel');
      panels.forEach(p => p.classList.remove('is-active'));

      const targetPanel = megamenu.querySelector(`#megamenu-panel-${targetKey}`);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      } else if (panels.length > 0) {
        panels[0].classList.add('is-active');
      }

      megamenu.classList.add('is-open');
    }

    function scheduleClose() {
      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        megamenu.classList.remove('is-open');
        pillItems.forEach(item => item.classList.remove('is-open'));
      }, 220);
    }

    pillItems.forEach(item => {
      const link = item.querySelector('.nav-pill');
      const target = link ? link.getAttribute('data-megamenu-target') : null;

      item.addEventListener('mouseenter', () => {
        openMegamenu(target, item);
      });

      item.addEventListener('mouseleave', () => {
        scheduleClose();
      });

      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (megamenu.classList.contains('is-open') && item.classList.contains('is-open')) {
            megamenu.classList.remove('is-open');
            item.classList.remove('is-open');
          } else {
            openMegamenu(target, item);
          }
        });
      }
    });

    megamenu.addEventListener('mouseenter', () => {
      clearTimeout(closeTimeout);
    });

    megamenu.addEventListener('mouseleave', () => {
      scheduleClose();
    });

    window.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target)) {
        megamenu.classList.remove('is-open');
        pillItems.forEach(item => item.classList.remove('is-open'));
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        megamenu.classList.remove('is-open');
        pillItems.forEach(item => item.classList.remove('is-open'));
      }
    });
  }
}

/* ==========================================================================
   SCROLL-DRIVEN HOW-IT-WORKS WHEEL
   ========================================================================== */
function initHowItWorksWheel() {
  const track = document.getElementById('how-wheel-track');
  const rotor = document.getElementById('how-wheel-rotor');
  const items = Array.from(document.querySelectorAll('.how-orbit-item'));
  const panels = Array.from(document.querySelectorAll('.how-step-panel'));
  const count = document.getElementById('how-wheel-count');
  const progressFill = document.getElementById('how-wheel-progress-fill');

  if (!track || !rotor || items.length !== 3 || panels.length !== 3) return;

  let activeStep = -1;
  let ticking = false;

  const setActiveStep = (nextStep) => {
    if (nextStep === activeStep) return;
    activeStep = nextStep;

    items.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeStep);
      item.setAttribute('aria-pressed', String(index === activeStep));
    });

    panels.forEach((panel, index) => {
      const isActive = index === activeStep;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    if (count) count.textContent = String(activeStep + 1).padStart(2, '0');
  };

  const updateWheel = () => {
    const rect = track.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      ticking = false;
      return;
    }
    const distance = Math.max(track.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
    const revealProgress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight * 0.72), 0), 1);
    const rotation = progress * -240;
    const nextStep = Math.min(2, Math.round(progress * 2));

    const sticky = document.getElementById('how-it-works');
    if (sticky) sticky.style.setProperty('--how-reveal', revealProgress.toFixed(3));
    rotor.style.setProperty('--wheel-rotation', `${rotation}deg`);
    if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
    setActiveStep(nextStep);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateWheel);
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      const distance = track.offsetHeight - window.innerHeight;
      const targetTop = window.scrollY + track.getBoundingClientRect().top + (distance * index / 2);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  updateWheel();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
}

/* ==========================================================================
   2. HERO SCROLL-SCRUB REVEAL & STATIC BACKGROUND ANIMATION
   Background remains static while headings translate up & 3D cards rise and reveal
   ========================================================================== */
function initHeroScrollAnimation() {
  const track = document.getElementById('hero-scroll-track');
  const stickyFrame = document.getElementById('hero-sticky-frame');
  const heroHeader = document.getElementById('hero-header');
  const carouselStage = document.getElementById('carousel-stage');
  const heroBottomBar = document.getElementById('hero-bottom-bar');
  const bgImg = document.getElementById('hero-bg-img');
  const bgVideo = document.getElementById('hero-bg-video');

  if (!track || !heroHeader || !carouselStage) return;

  // Keep playback stable while the hero is visible. Repeated play/pause calls during
  // scrolling caused decoder churn and visible frame jumps.
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.playsInline = true;
    const allowHeroVideo = !(navigator.connection && navigator.connection.saveData) &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Loop before the source ending so the final five seconds are never shown.
    const HERO_VIDEO_END_TRIM = 5;
    bgVideo.addEventListener('timeupdate', () => {
      if (!Number.isFinite(bgVideo.duration) || bgVideo.duration <= HERO_VIDEO_END_TRIM) return;
      if (bgVideo.currentTime >= bgVideo.duration - HERO_VIDEO_END_TRIM) {
        bgVideo.currentTime = 0;
        const replayPromise = bgVideo.play();
        if (replayPromise) replayPromise.catch(() => {});
      }
    });

    const showVideo = () => {
      if (!allowHeroVideo) {
        bgVideo.pause();
        return;
      }
      bgVideo.classList.add('is-ready');
      const playPromise = bgVideo.play();
      if (playPromise) playPromise.catch(() => {});
    };

    if (bgVideo.readyState >= 2) showVideo();
    else bgVideo.addEventListener('loadeddata', showVideo, { once: true });

    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && allowHeroVideo && !document.hidden) {
          const playPromise = bgVideo.play();
          if (playPromise) playPromise.catch(() => {});
        } else {
          bgVideo.pause();
        }
      }, { threshold: 0.02 });
      heroObserver.observe(track);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden || !allowHeroVideo) {
        bgVideo.pause();
      } else if (track.getBoundingClientRect().bottom > 0) {
        const playPromise = bgVideo.play();
        if (playPromise) playPromise.catch(() => {});
      }
    });
  }

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroHeader.style.setProperty('--hero-text-y', '0px');
    carouselStage.style.setProperty('--hero-cards-y', '0px');
    carouselStage.style.setProperty('--hero-cards-opacity', '1');
    carouselStage.style.setProperty('--hero-cards-pointer', 'auto');
    if (heroBottomBar) {
      heroBottomBar.style.setProperty('--hero-cards-y', '0px');
      heroBottomBar.style.setProperty('--hero-cards-opacity', '1');
      heroBottomBar.style.setProperty('--hero-cards-pointer', 'auto');
    }
    return;
  }

  let ticking = false;
  let heroStartY = 160;

  function measureHero() {
    const contentStage = document.getElementById('hero-content-stage');
    const stagePt = contentStage ? (parseFloat(window.getComputedStyle(contentStage).paddingTop) || 115) : 115;
    const headerHeight = heroHeader.offsetHeight || 310;
    const desiredBottomPadding = Math.max(Math.round(window.innerHeight * 0.08), 72);
    heroStartY = Math.max(Math.round(window.innerHeight - headerHeight - stagePt - desiredBottomPadding), 160);
  }

  measureHero();

  function update() {
    const rect = track.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      ticking = false;
      return;
    }
    const scrollableDist = track.offsetHeight - window.innerHeight;
    
    // Normalized scroll progress 0.0 -> 1.0
    const rawProgress = -rect.top / Math.max(scrollableDist, 1);
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    // Smooth cubic ease for noticeable, tactile scroll scrub
    const eased = 1 - Math.pow(1 - progress, 2.5);

    // Dynamic travel distance: starts anchored cleanly at the BOTTOM CENTER of the screen
    // Moves UP into docked top position with generous bottom padding so it never touches the screen bottom
    const textY = Math.round((1 - eased) * heroStartY);
    
    // 3D Cards: starts 480px below view, ascends smoothly and locks in beneath headings
    const cardsEased = Math.pow(progress, 1.4);
    const cardsY = Math.round((1 - cardsEased) * 480);
    
    // Cards fade into view once headings have traveled upward
    const cardsOpacity = Math.min(Math.max((progress - 0.22) / 0.65, 0), 1);
    const pointerEvents = progress > 0.6 ? 'auto' : 'none';

    heroHeader.style.setProperty('--hero-text-y', `${textY}px`);
    carouselStage.style.setProperty('--hero-cards-y', `${cardsY}px`);
    carouselStage.style.setProperty('--hero-cards-opacity', `${cardsOpacity.toFixed(3)}`);
    carouselStage.style.setProperty('--hero-cards-pointer', pointerEvents);

    // Toggle between bottom-centered state (CTAs below paragraph) and docked state (left-aligned as initially)
    if (heroHeader) {
      if (progress >= 0.28 && !heroHeader.classList.contains('is-docked')) {
        heroHeader.classList.add('is-docked');
        heroHeader.classList.remove('is-bottom');
      } else if (progress <= 0.22 && !heroHeader.classList.contains('is-bottom')) {
        heroHeader.classList.add('is-bottom');
        heroHeader.classList.remove('is-docked');
      }
    }

    if (heroBottomBar) {
      heroBottomBar.style.setProperty('--hero-cards-y', `${cardsY}px`);
      heroBottomBar.style.setProperty('--hero-cards-opacity', `${cardsOpacity.toFixed(3)}`);
      heroBottomBar.style.setProperty('--hero-cards-pointer', pointerEvents);
    }

    // Subtle background scale during travel
    if (bgImg) {
      bgImg.style.transform = `scale(1.04) translateY(${(progress * -20).toFixed(1)}px)`;
    }
    if (bgVideo) {
      bgVideo.style.transform = `scale(1.02) translateY(${(progress * -15).toFixed(1)}px)`;
    }

    // Smooth transition dissolve into the platform section
    if (stickyFrame) {
      const veilProgress = Math.max(0, Math.min(1, (progress - 0.70) / 0.28));
      stickyFrame.style.setProperty('--hero-transition-veil', veilProgress.toFixed(3));
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    measureHero();
    requestTick();
  }, { passive: true });
  update(); // Initial run
}

/* ==========================================================================
   1.5 MANIFESTO SCROLL REVEAL (Word-by-word illuminate on scroll)
   ========================================================================== */
function initManifestoScrollReveal() {
  const section = document.getElementById('manifesto-section');
  const textEl = document.getElementById('manifesto-text');
  if (!section || !textEl) return;

  const rawText = textEl.textContent.trim();
  const words = rawText.split(/\s+/);
  
  // Highlight keywords
  const brandKeywords = ['Luminaries', 'Capital', 'Africa', 'purpose', 'wealth'];

  textEl.innerHTML = words.map(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const isBrand = brandKeywords.includes(cleanWord);
    return `<span class="manifesto-word${isBrand ? ' brand-accent' : ''}">${word}</span>`;
  }).join(' ');

  const wordSpans = textEl.querySelectorAll('.manifesto-word');
  const totalWords = wordSpans.length;
  let ticking = false;

  // Mobile uses a normal reading flow instead of another long sticky sequence.
  if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
    wordSpans.forEach((span) => {
      span.style.opacity = '1';
      span.style.transform = 'none';
      span.classList.add('is-active');
    });
    return;
  }

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wordSpans.forEach(span => {
      span.style.opacity = '1';
      span.style.transform = 'none';
      span.classList.add('is-active');
    });
    return;
  }

  function updateWords() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.bottom <= 0 || rect.top >= windowHeight) {
      ticking = false;
      return;
    }
    const totalScrollable = rect.height - windowHeight;
    
    if (totalScrollable <= 0) {
      ticking = false;
      return;
    }

    // Progress through the sticky section:
    // 0 = section top reaches viewport top
    // 1 = section bottom reaches viewport bottom
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

    // Calculate each word's reveal
    const windowSize = 0.055; // Transition window per word
    
    for (let i = 0; i < totalWords; i++) {
      const span = wordSpans[i];
      const wordCenter = (i + 0.5) / totalWords;
      
      const wordFraction = (progress - (wordCenter - windowSize)) / (windowSize * 1.5);
      const clampedFraction = Math.min(Math.max(wordFraction, 0), 1);
      
      // Interpolate opacity from 0.14 to 1.0
      const currentOpacity = 0.14 + (0.86 * clampedFraction);
      span.style.opacity = currentOpacity.toFixed(3);
      span.style.transform = `translateY(${(2.5 * (1 - clampedFraction)).toFixed(1)}px)`;
      
      if (clampedFraction >= 0.65) {
        span.classList.add('is-active');
      } else {
        span.classList.remove('is-active');
      }
    }

    ticking = false;
  }

  function requestWordTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateWords);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestWordTick, { passive: true });
  window.addEventListener('resize', requestWordTick, { passive: true });
  updateWords(); // Initial calculation
}

/* ==========================================================================
   2B. PLATFORM SCROLL STREAM & QUICK-JUMP TABS (HYBRID)
   Gallery-white sticky stage: 6 cards glide across on scroll,
   synced seamlessly with floating pill tabs and live counters.
   ========================================================================== */
function initPlatformHybridScroll() {
  const track = document.getElementById('platform-scroll-track');
  const viewport = document.getElementById('platform-cards-viewport');
  const stream = document.getElementById('platform-cards-stream');
  if (!track || !stream) return;

  const cards = Array.from(stream.querySelectorAll('.platform-stream-card'));
  const pills = Array.from(document.querySelectorAll('.platform-nav-pill'));
  const capsuleItems = Array.from(document.querySelectorAll('.capsule-item'));
  const capsuleNextBtn = document.getElementById('capsule-next-btn');
  const vehicleCta = document.getElementById('platform-active-vehicle-cta');

  if (cards.length === 0) return;

  const vehicleData = [
    { name: "Flex Save", link: "save.html#flex", ctaText: "Explore Flex Save" },
    { name: "Steady Save", link: "save.html#steady", ctaText: "Explore Steady Save" },
    { name: "GoalSaveâ„¢", link: "save.html#goalsave", ctaText: "Launch GoalSaveâ„¢" },
    { name: "Dollar Save", link: "save.html#usd", ctaText: "Explore Dollar Save" },
    { name: "Circle Pot", link: "save.html#circle", ctaText: "Explore Circle Pot" },
    { name: "Treasury Desk", link: "invest.html#institutional", ctaText: "Explore Treasury Desk" }
  ];

  let activeIndex = 0;
  let ticking = false;
  let cardStride = 0;
  let maxStreamTranslate = 0;

  function measurePlatformStream() {
    if (window.innerWidth <= 900) return;
    const cardWidth = cards[0]?.offsetWidth || 0;
    const styles = window.getComputedStyle(stream);
    const gap = parseFloat(styles.columnGap || styles.gap) || 32;
    cardStride = cardWidth + gap;
    maxStreamTranslate = (cards.length - 1) * cardStride;
  }

  function updateActiveCard(index) {
    if (index < 0 || index >= cards.length) return;
    activeIndex = index;

    // Update Card Focus States
    cards.forEach((card, i) => {
      const isActive = i === index;
      if (isActive) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
      card.setAttribute('aria-hidden', String(!isActive));
      card.inert = !isActive;
    });

    // Update Pill Tabs
    pills.forEach((pill, i) => {
      if (i === index) {
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');
        pill.setAttribute('tabindex', '0');
        if (window.innerWidth <= 900) {
          window.requestAnimationFrame(() => {
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          });
        }
      } else {
        pill.classList.remove('is-active');
        pill.setAttribute('aria-selected', 'false');
        pill.setAttribute('tabindex', '-1');
      }
    });

    // Update Apple Capsule Dots
    capsuleItems.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });

    // Update Footer Direct Link
    const data = vehicleData[index];
    if (vehicleCta && data) {
      vehicleCta.href = data.link;
      const spanText = vehicleCta.querySelector('span:first-child');
      if (spanText) spanText.textContent = data.ctaText;
    }
  }

  // Smooth Jump Helper
  function jumpToCard(targetIndex) {
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    if (window.innerWidth <= 900) {
      // Mobile: smooth snap scroll into view
      const targetCard = cards[targetIndex];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        updateActiveCard(targetIndex);
      }
      return;
    }

    // Desktop: Smoothly scroll the window to the exact track position
    const targetProgress = targetIndex / (cards.length - 1);
    const scrollY = window.scrollY || window.pageYOffset;
    const trackTop = track.getBoundingClientRect().top + scrollY;
    const scrollableDist = track.offsetHeight - window.innerHeight;
    const targetScrollY = Math.round(trackTop + (targetProgress * scrollableDist) + 2);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
    updateActiveCard(targetIndex);
  }

  // Scroll Scrub Calculation (Desktop)
  function handleScroll() {
    // If mobile layout (cards stream is static/snap-scrolling), let observer handle it
    if (window.innerWidth <= 900) {
      ticking = false;
      return;
    }

    const rect = track.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      ticking = false;
      return;
    }
    const scrollableDist = track.offsetHeight - window.innerHeight;
    if (scrollableDist <= 0) {
      ticking = false;
      return;
    }

    const rawProgress = -rect.top / scrollableDist;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    // Compute exact horizontal offset so active card is centered in viewport
    const currentX = -(progress * maxStreamTranslate);
    stream.style.transform = `translateX(${currentX.toFixed(1)}px)`;

    // Calculate which card is closest to center
    const cardIndex = Math.min(Math.round(progress * (cards.length - 1)), cards.length - 1);
    if (cardIndex !== activeIndex) {
      updateActiveCard(cardIndex);
    }

    ticking = false;
  }

  function requestScrollTick() {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestScrollTick, { passive: true });
  window.addEventListener('resize', () => {
    measurePlatformStream();
    handleScroll();
  }, { passive: true });

  // Quick-Jump: Clicking Pill tabs
  pills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(pill.getAttribute('data-index') || '0', 10);
      jumpToCard(targetIndex);
    });

    pill.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = pills.indexOf(pill);
      let targetIndex = currentIndex;
      if (event.key === 'ArrowRight') targetIndex = (currentIndex + 1) % pills.length;
      if (event.key === 'ArrowLeft') targetIndex = (currentIndex - 1 + pills.length) % pills.length;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = pills.length - 1;
      pills[targetIndex].focus();
      jumpToCard(targetIndex);
    });
  });

  // Apple Capsule dots click
  capsuleItems.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      jumpToCard(targetIndex);
    });
  });

  // Apple Capsule Next Button click
  if (capsuleNextBtn) {
    capsuleNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % cards.length;
      jumpToCard(nextIndex);
    });
  }

  // Mobile Swipe Observer: updates pills when user swipes cards
  if ('IntersectionObserver' in window) {
    const mobileObserver = new IntersectionObserver((entries) => {
      if (window.innerWidth > 900) return;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const idx = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          updateActiveCard(idx);
        }
      });
    }, {
      root: viewport,
      threshold: 0.55
    });

    cards.forEach(card => mobileObserver.observe(card));
  }

  // Initial calculation
  measurePlatformStream();
  handleScroll();
  updateActiveCard(0);
}

/* ==========================================================================
   3. 3D FLOATING CARD CAROUSEL (Per design.md specifications)
   Continuous horizontal parade, perspective tilt, cursor tracking, scroll speed-up
   ========================================================================== */
function init3DCardCarousel() {
  const container = document.getElementById('carousel-stage');
  const track = document.getElementById('carousel-track');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');

  if (!container || !track) return;

  let cards = Array.from(track.querySelectorAll('.fin-card-3d'));
  // Clone cards to enable seamless infinite parade loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    track.appendChild(clone);
  });

  const allCards = Array.from(track.querySelectorAll('.fin-card-3d'));
  let position = 0;
  const shouldAutoParade = !window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseSpeed = 0.55;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let totalWidth = 0;

  function measureCarousel() {
    totalWidth = track.scrollWidth / 2;
  }

  measureCarousel();
  window.addEventListener('resize', measureCarousel, { passive: true });

  // Track hover state to gently pause or slow
  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { 
    isHovered = false; 
    resetCardTilts();
  });

  // Drag interaction
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    dragOffset = position;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      position = dragOffset + deltaX;
      updateParadePosition();
    }
    // Interactive 3D cursor tilt ONLY when hovering over the carousel stage
    if (isHovered) {
      handleCardCursorTilt(e);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      track.style.transition = 'transform 0.1s linear';
    }
  });

  // Touch support for mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    dragOffset = position;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    position = dragOffset + deltaX;
    updateParadePosition();
  }, { passive: true });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Manual Prev / Next controls
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      position += 360;
      updateParadePosition();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      position -= 360;
      updateParadePosition();
    });
  }

  // Main Animation Loop with Intersection Culling
  let isCarouselInView = true;
  let rafId = null;

  if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCarouselInView = entry.isIntersecting;
        if (isCarouselInView && !rafId) {
          rafId = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.05 });
    carouselObserver.observe(container);
  }

  function tick() {
    if (!isCarouselInView) {
      rafId = null;
      return;
    }
    if (shouldAutoParade && !isDragging && !isHovered) {
      position -= baseSpeed;
      if (Math.abs(position) >= totalWidth) {
        position = 0;
      } else if (position > 0) {
        position = -totalWidth;
      }
      updateParadePosition();
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function updateParadePosition() {
    track.style.transform = `translateX(${position}px)`;
  }

  // Tilt cards slightly toward cursor
  function handleCardCursorTilt(e) {
    allCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const inView = rect.right > 0 && rect.left < window.innerWidth;
      if (!inView) return;

      const isMouseOver = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isMouseOver) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 16;
        const rotateX = -((y - centerY) / centerY) * 12;

        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(40px) scale(1.04)`;
      } else if (!isHovered) {
        card.style.transform = `rotateY(-20deg) rotateX(6deg)`;
      }
    });
  }

  function resetCardTilts() {
    allCards.forEach(card => {
      card.style.transform = `rotateY(-20deg) rotateX(6deg)`;
    });
  }
}

/* ==========================================================================
   3. TILE 2 MICRO-DEMO: KINETIC DOT MOTION / WEALTH FLOW PHYSICS TOY
   Two black & teal balance nodes that orbit and bounce with physics
   ========================================================================== */
function initPhysicsToy() {
  const canvas = document.getElementById('physics-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * pixelRatio);
    canvas.height = Math.round(rect.height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Two orbiting dots with elastic spring physics
  let angle = 0;
  let speed = 0.035;
  let radius = 64;
  let center = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
  let mouse = { x: center.x, y: center.y, isHovered: false };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovered = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.isHovered = false;
  });

  canvas.addEventListener('click', () => {
    speed = 0.12; // impulse burst
    radius = 85;
    setTimeout(() => {
      speed = 0.035;
      radius = 64;
    }, 600);
  });

  let isCanvasVisible = true;
  let canvasFrame = null;

  function draw() {
    if (!isCanvasVisible) {
      canvasFrame = null;
      return;
    }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    center.x = width / 2;
    center.y = height / 2;

    // Follow mouse smoothly
    if (mouse.isHovered) {
      center.x += (mouse.x - center.x) * 0.12;
      center.y += (mouse.y - center.y) * 0.12;
    }

    angle += speed;

    const dot1 = {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * (radius * 0.55),
      size: 11
    };

    const dot2 = {
      x: center.x - Math.cos(angle) * radius,
      y: center.y - Math.sin(angle) * (radius * 0.55),
      size: 9
    };

    // Draw orbital ellipse track
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius, radius * 0.55, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(17, 19, 15, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Connecting elastic spring line
    ctx.beginPath();
    ctx.moveTo(dot1.x, dot1.y);
    ctx.lineTo(dot2.x, dot2.y);
    ctx.strokeStyle = 'rgba(0, 168, 150, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dot 1: Charcoal Black (Primary anchor)
    ctx.beginPath();
    ctx.arc(dot1.x, dot1.y, dot1.size, 0, Math.PI * 2);
    ctx.fillStyle = '#111315';
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;

    // Dot 2: Teal / Solar glow (Illumination)
    ctx.beginPath();
    ctx.arc(dot2.x, dot2.y, dot2.size, 0, Math.PI * 2);
    ctx.fillStyle = '#00A896';
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 168, 150, 0.4)';
    ctx.shadowBlur = 12;

    // Reset shadow
    ctx.shadowBlur = 0;

    canvasFrame = requestAnimationFrame(draw);
  }

  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver(([entry]) => {
      isCanvasVisible = entry.isIntersecting;
      if (isCanvasVisible && !canvasFrame) canvasFrame = requestAnimationFrame(draw);
    }, { threshold: 0.05 });
    canvasObserver.observe(canvas);
  }

  canvasFrame = requestAnimationFrame(draw);
}

/* ==========================================================================
   4. TILE 3 MICRO-DEMO: 3D SPINNING COIN
   Flips and spins in 3D with realistic physics and sound feedback
   ========================================================================== */
function initCoinDemo() {
  const coinWrap = document.getElementById('coin-interactive-wrap');
  const coin = document.getElementById('coin-3d');
  if (!coinWrap || !coin) return;

  let flipped = false;

  coinWrap.addEventListener('click', () => {
    flipped = !flipped;
    coin.style.animation = 'none';
    const targetDeg = flipped ? 540 : 0;
    coin.style.transform = `rotateY(${targetDeg}deg) scale(1.12)`;
    playTickSound(680);

    setTimeout(() => {
      coin.style.transform = `rotateY(${flipped ? 180 : 0}deg) scale(1)`;
    }, 400);
  });
}

/* ==========================================================================
   5. TILE 4 MICRO-DEMO: GOALSAVEâ„¢ BUDGET GAUGE
   Animated semicircle arc reading "68% / Budget consumed" with interactive slider
   ========================================================================== */
function initGoalSaveGauge() {
  const slider = document.getElementById('gauge-slider');
  const arc = document.getElementById('gauge-fill-arc');
  const percentText = document.getElementById('gauge-percent-val');
  const amountText = document.getElementById('gauge-amount-display');

  if (!slider || !arc || !percentText) return;

  const totalLength = 377; // Approximate half circumference for r=120

  function updateGauge() {
    const val = parseInt(slider.value, 10);
    const offset = totalLength - (totalLength * (val / 100));
    arc.style.strokeDashoffset = offset;
    percentText.textContent = `${val}%`;

    if (amountText) {
      const targetUGX = 18400000;
      const currentSaved = Math.round((targetUGX * val) / 100);
      amountText.textContent = `UGX ${currentSaved.toLocaleString('en-US')}`;
    }
  }

  slider.addEventListener('input', updateGauge);
  updateGauge();
}

/* ==========================================================================
   6. TILE 5: CURRENCY & LIVE RATE TOGGLE
   ========================================================================== */
function initCurrencyToggle() {
  const buttons = document.querySelectorAll('.curr-btn');
  const display = document.getElementById('transparency-rate-display');
  const label = document.getElementById('currency-unit-label');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playTickSound(440);

      const curr = btn.getAttribute('data-currency');
      if (curr === 'USD') {
        if (display) display.textContent = '$2,500.00';
        if (label) label.textContent = 'USD Yield: 8.4% APY Â· Daily Compounding';
      } else {
        if (display) display.textContent = 'UGX 9,450,000';
        if (label) label.textContent = 'UGX Treasury: 12.8% APY Â· Zero Hidden Fees';
      }
    });
  });
}

/* ==========================================================================
   7. CONTROL UI & ACTIONS (Section 3 left tile)
   ========================================================================== */
function initControlUI() {
  const swapBtn = document.getElementById('control-swap-btn');
  const confirmBtn = document.getElementById('control-confirm-btn');
  const statusBadge = document.getElementById('control-status-badge');

  if (swapBtn && statusBadge) {
    swapBtn.addEventListener('click', () => {
      statusBadge.textContent = 'Allocated to Vault (Fixed)';
      statusBadge.style.color = '#00A896';
      playTickSound(520);
    });
  }

  if (confirmBtn && statusBadge) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.textContent = 'âœ“ Confirmed';
      confirmBtn.style.background = '#004D47';
      playTickSound(720);
      setTimeout(() => {
        confirmBtn.textContent = 'Confirm Allocation';
        confirmBtn.style.background = '#00A896';
      }, 2000);
    });
  }
}

/* ==========================================================================
   8. SECTION 3 SHOWCASE PARALLAX
   ========================================================================== */
function initShowcaseParallax() {
  const tile = document.getElementById('showcase-full-tile');
  const bg = document.getElementById('showcase-pan-bg');

  if (!tile || !bg) return;

  tile.addEventListener('mousemove', (e) => {
    const rect = tile.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    bg.style.transform = `scale(1.06) translate(${x * -25}px, ${y * -20}px)`;
  });

  tile.addEventListener('mouseleave', () => {
    bg.style.transform = 'scale(1) translate(0, 0)';
  });
}

/* ==========================================================================
   9. GOALSAVEâ„¢ CALCULATOR ENGINE (for save.html)
   ========================================================================== */
function initGoalSaveCalculator() {
  const targetSlider = document.getElementById('calc-target-slider');
  const monthsSlider = document.getElementById('calc-months-slider');
  const targetVal = document.getElementById('calc-target-val');
  const monthsVal = document.getElementById('calc-months-val');
  const freqLabel = document.getElementById('calc-freq-label');
  const resAmount = document.getElementById('calc-res-amount');
  const resSubtext = document.getElementById('calc-res-subtext');
  const sumSaved = document.getElementById('calc-sum-saved');
  const estYield = document.getElementById('calc-est-yield');
  const completionDate = document.getElementById('calc-completion-date');

  const btnMonthly = document.getElementById('btn-freq-monthly');
  const btnWeekly = document.getElementById('btn-freq-weekly');
  const btnDaily = document.getElementById('btn-freq-daily');

  if (!targetSlider || !monthsSlider) return;

  let frequency = 'monthly'; // 'monthly', 'weekly', 'daily'
  const ANNUAL_RATE = 0.085; // 8.5% p.a.

  function formatUGX(num) {
    return 'UGX ' + Math.round(num).toLocaleString('en-US');
  }

  function calculate() {
    const target = parseFloat(targetSlider.value) || 15000000;
    const months = parseInt(monthsSlider.value, 10) || 12;

    targetVal.textContent = formatUGX(target);
    monthsVal.textContent = `${months} Month${months > 1 ? 's' : ''}`;

    let periods = months;
    let periodText = 'per month';
    if (frequency === 'weekly') {
      periods = Math.round(months * 4.333);
      periodText = 'per week';
    } else if (frequency === 'daily') {
      periods = months * 30;
      periodText = 'per day';
    }

    const requiredContribution = target / periods;
    const estInterest = target * (ANNUAL_RATE * (months / 12)) * 0.55;

    resAmount.textContent = formatUGX(requiredContribution);
    resSubtext.textContent = `${periodText} over ${months} months`;
    sumSaved.textContent = formatUGX(target);
    estYield.textContent = `+${formatUGX(estInterest)}`;

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    completionDate.textContent = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  }

  targetSlider.addEventListener('input', () => {
    calculate();
    playTickSound(380);
  });

  monthsSlider.addEventListener('input', () => {
    calculate();
    playTickSound(440);
  });

  if (btnMonthly && btnWeekly && btnDaily) {
    const buttons = [btnMonthly, btnWeekly, btnDaily];
    btnMonthly.addEventListener('click', () => {
      frequency = 'monthly';
      freqLabel.textContent = 'Monthly';
      buttons.forEach(b => b.classList.remove('active'));
      btnMonthly.classList.add('active');
      calculate();
      playTickSound(520);
    });
    btnWeekly.addEventListener('click', () => {
      frequency = 'weekly';
      freqLabel.textContent = 'Weekly';
      buttons.forEach(b => b.classList.remove('active'));
      btnWeekly.classList.add('active');
      calculate();
      playTickSound(520);
    });
    btnDaily.addEventListener('click', () => {
      frequency = 'daily';
      freqLabel.textContent = 'Daily';
      buttons.forEach(b => b.classList.remove('active'));
      btnDaily.classList.add('active');
      calculate();
      playTickSound(520);
    });
  }

  calculate();
}

/* ==========================================================================
   10. CONTACT FORM HANDLER (for contact.html)
   ========================================================================== */
function initContactForm() {
  window.handleContactSubmit = function() {
    const form = document.getElementById('contact-form-elem');
    const successMsg = document.getElementById('contact-success-msg');
    if (!form || !successMsg) return;

    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playTickSound(700);
  };
}

/* ==========================================================================
   11. ELEGANT SYNTH AUDIO MICRO-FEEDBACK
   Subtle audio feedback for tactile fintech interactions
   ========================================================================== */
let audioCtx;
function playTickSound(freq = 580) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.045);
  } catch (e) {
    // Audio is optional enhancement
  }
}

