/**
 * LUMINARIES CAPITAL — INTERACTIVE ENGINE
 * Implements 3D card parade, physics micro-demos, gauge simulation, and modal routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomepageStories();
  initProductTabs();
  initHeroCalculator();
  initManifestoScrollReveal();
  initEditorialFooter();
  initGoalSaveCalculator();
  initContactForm();
  initSitewideMotion();
});

/* ========================================================================== 
   HERO SHADER — native canvas interpretation of the supplied ShaderGradient
   ========================================================================== */
function initHeroCalculator() {
  const calculator = document.querySelector('.hero-calculator');
  if (!calculator) return;

  const deposit = calculator.querySelector('#projection-deposit');
  const months = calculator.querySelector('#projection-months');
  const rate = calculator.querySelector('#projection-rate');
  const depositRange = calculator.querySelector('#projection-deposit-range');
  const monthsRange = calculator.querySelector('#projection-months-range');
  const rateRange = calculator.querySelector('#projection-rate-range');
  const saved = calculator.querySelector('#projection-saved');
  const invested = calculator.querySelector('#projection-invested');
  const gain = calculator.querySelector('#projection-gain');
  const gainPct = calculator.querySelector('#projection-gain-pct');
  const durationLabel = calculator.querySelector('#projection-duration-label');
  const chartEndLabel = calculator.querySelector('#projection-chart-end');
  const barPrincipal = calculator.querySelector('#projection-bar-principal');
  const barGrowth = calculator.querySelector('#projection-bar-growth');
  const chartSaved = calculator.querySelector('#projection-chart-saved');
  const chartInvested = calculator.querySelector('#projection-chart-invested');
  const chartArea = calculator.querySelector('#projection-chart-area');
  const chartDot = calculator.querySelector('#projection-chart-dot');
  const depositMinLabel = calculator.querySelector('#projection-deposit-min');
  const depositMaxLabel = calculator.querySelector('#projection-deposit-max');
  const note = calculator.querySelector('#projection-note');
  const assumptions = note ? note.textContent : '';
  const denomination = calculator.querySelector('#projection-currency');
  const unit = calculator.querySelector('#projection-unit');
  const presets = Array.from(calculator.querySelectorAll('.planner-preset'));

  const currencyScales = {
    UGX: { min: 20000, max: 2000000, step: 10000, scale: 1, minTxt: 'UGX 20k', maxTxt: 'UGX 2M' },
    TZS: { min: 15000, max: 1500000, step: 5000, scale: 0.7, minTxt: 'TZS 15k', maxTxt: 'TZS 1.5M' },
    RWF: { min: 10000, max: 800000, step: 5000, scale: 0.35, minTxt: 'RWF 10k', maxTxt: 'RWF 800k' },
    BIF: { min: 20000, max: 2000000, step: 10000, scale: 0.8, minTxt: 'BIF 20k', maxTxt: 'BIF 2M' },
    NGN: { min: 10000, max: 1000000, step: 5000, scale: 0.45, minTxt: 'NGN 10k', maxTxt: 'NGN 1M' },
    KES: { min: 1000, max: 100000, step: 500, scale: 0.035, minTxt: 'KES 1k', maxTxt: 'KES 100k' },
    ETB: { min: 1000, max: 100000, step: 500, scale: 0.035, minTxt: 'ETB 1k', maxTxt: 'ETB 100k' },
    SSP: { min: 5000, max: 500000, step: 2500, scale: 0.25, minTxt: 'SSP 5k', maxTxt: 'SSP 500k' },
    GHS: { min: 100, max: 10000, step: 50, scale: 0.004, minTxt: 'GHS 100', maxTxt: 'GHS 10k' },
    ZMW: { min: 200, max: 20000, step: 100, scale: 0.007, minTxt: 'ZMW 200', maxTxt: 'ZMW 20k' },
    ZAR: { min: 200, max: 15000, step: 100, scale: 0.005, minTxt: 'ZAR 200', maxTxt: 'ZAR 15k' },
    NAD: { min: 200, max: 15000, step: 100, scale: 0.005, minTxt: 'NAD 200', maxTxt: 'NAD 15k' },
    BWP: { min: 150, max: 10000, step: 50, scale: 0.004, minTxt: 'BWP 150', maxTxt: 'BWP 10k' },
    USD: { min: 10, max: 2000, step: 10, scale: 0.0003, minTxt: 'USD 10', maxTxt: 'USD 2k' },
    EUR: { min: 10, max: 2000, step: 10, scale: 0.0003, minTxt: 'EUR 10', maxTxt: 'EUR 2k' },
    GBP: { min: 10, max: 2000, step: 10, scale: 0.00025, minTxt: 'GBP 10', maxTxt: 'GBP 2k' }
  };

  let formatter;
  let currentScale = currencyScales.UGX;

  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = Math.min(max, Math.max(min, parseFloat(slider.value) || min));
    const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    slider.style.setProperty('--slider-pct', `${pct.toFixed(1)}%`);
  }

  function formatDuration(m) {
    if (m < 12) return `${m} ${m === 1 ? 'month' : 'months'}`;
    const yrs = Math.floor(m / 12);
    const rem = m % 12;
    if (rem === 0) return `${yrs} ${yrs === 1 ? 'year' : 'years'}`;
    return `${yrs}y ${rem}m`;
  }

  function setCurrency(rebalanceAmount = false) {
    const code = denomination.value;
    currentScale = currencyScales[code] || currencyScales.USD;
    formatter = new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency', currency: code, currencyDisplay: 'code',
      maximumFractionDigits: ['UGX', 'TZS', 'RWF', 'BIF', 'KES', 'NGN'].includes(code) ? 0 : 2
    });
    const digits = formatter.resolvedOptions().maximumFractionDigits;
    deposit.step = deposit.min = String(10 ** -digits);
    unit.textContent = '(' + code + ')';

    if (depositRange) {
      depositRange.min = String(currentScale.min);
      depositRange.max = String(currentScale.max);
      depositRange.step = String(currentScale.step);
    }
    if (depositMinLabel) depositMinLabel.textContent = currentScale.minTxt;
    if (depositMaxLabel) depositMaxLabel.textContent = currentScale.maxTxt;

    if (rebalanceAmount) {
      const activePreset = presets.find((btn) => btn.classList.contains('is-active'));
      const baseUgx = activePreset ? parseFloat(activePreset.dataset.deposit) : 100000;
      const scaled = Math.max(currentScale.min, Math.round((baseUgx * currentScale.scale) / currentScale.step) * currentScale.step);
      deposit.value = String(scaled);
      if (depositRange) depositRange.value = String(Math.min(currentScale.max, Math.max(currentScale.min, scaled)));
    }
  }

  function renderChart(payment, periods, monthlyRate) {
    if (!chartSaved || !chartInvested || !chartArea) return;
    const width = 420;
    const height = 132;
    const padX = 8;
    const padTop = 14;
    const padBottom = 10;
    const plotW = width - padX * 2;
    const plotH = height - padTop - padBottom;
    const steps = 24;

    const savedPts = [];
    const invPts = [];
    let maxVal = 1;

    for (let i = 0; i <= steps; i += 1) {
      const m = (periods * i) / steps;
      const sVal = payment * m;
      const factor = monthlyRate === 0 ? m : Math.expm1(m * Math.log1p(monthlyRate)) / monthlyRate;
      const iVal = Math.max(0, payment * factor);
      savedPts.push(sVal);
      invPts.push(iVal);
      if (sVal > maxVal) maxVal = sVal;
      if (iVal > maxVal) maxVal = iVal;
    }

    const toXY = (val, idx) => {
      const x = padX + (plotW * idx) / steps;
      const y = padTop + plotH * (1 - val / maxVal);
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    };

    const savedCoords = savedPts.map(toXY);
    const invCoords = invPts.map(toXY);

    const savedD = savedCoords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
    const invD = invCoords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
    const lastInv = invCoords[invCoords.length - 1];
    const areaD = `${invD} L${lastInv[0]} ${height} L${padX} ${height} Z`;

    chartSaved.setAttribute('d', savedD);
    chartInvested.setAttribute('d', invD);
    chartArea.setAttribute('d', areaD);
    if (chartDot) {
      chartDot.setAttribute('cx', String(lastInv[0]));
      chartDot.setAttribute('cy', String(lastInv[1]));
    }
  }

  function update(event) {
    const target = event?.target;
    if (target === denomination) {
      setCurrency(true);
    } else if (target === depositRange) {
      deposit.value = depositRange.value;
      presets.forEach((btn) => btn.classList.remove('is-active'));
    } else if (target === monthsRange) {
      months.value = monthsRange.value;
      presets.forEach((btn) => btn.classList.remove('is-active'));
    } else if (target === rateRange) {
      rate.value = rateRange.value;
      presets.forEach((btn) => btn.classList.remove('is-active'));
    } else if (target === deposit || target === months || target === rate) {
      presets.forEach((btn) => btn.classList.remove('is-active'));
    }

    if (depositRange && Number.isFinite(deposit.valueAsNumber)) {
      depositRange.value = String(Math.min(parseFloat(depositRange.max), Math.max(parseFloat(depositRange.min), deposit.valueAsNumber)));
    }
    if (monthsRange && Number.isFinite(months.valueAsNumber)) {
      monthsRange.value = String(Math.min(parseFloat(monthsRange.max), Math.max(parseFloat(monthsRange.min), months.valueAsNumber)));
    }
    if (rateRange && Number.isFinite(rate.valueAsNumber)) {
      rateRange.value = String(Math.min(parseFloat(rateRange.max), Math.max(parseFloat(rateRange.min), rate.valueAsNumber)));
    }

    updateSliderFill(depositRange);
    updateSliderFill(monthsRange);
    updateSliderFill(rateRange);

    const invalid = [deposit, months, rate].find((input) => !input.validity.valid);
    if (invalid) {
      saved.textContent = invested.textContent = '—';
      if (gain) gain.textContent = '—';
      if (gainPct) gainPct.textContent = 'Invalid input';
      if (note) note.textContent = invalid.validationMessage;
      return;
    }

    const payment = deposit.valueAsNumber;
    const periods = months.valueAsNumber;
    const monthlyRate = rate.valueAsNumber / 1200;
    const factor = monthlyRate === 0 ? periods : Math.expm1(periods * Math.log1p(monthlyRate)) / monthlyRate;
    const totalSaved = payment * periods;
    const totalInvested = payment * factor;
    const netGain = totalInvested - totalSaved;
    const pctGain = totalSaved > 0 ? (netGain / totalSaved) * 100 : 0;

    saved.textContent = formatter.format(totalSaved);
    invested.textContent = formatter.format(totalInvested);

    if (gain) {
      const sign = netGain >= 0 ? '+' : '−';
      gain.textContent = `${sign}${formatter.format(Math.abs(netGain))}`;
    }
    if (gainPct) {
      const arrow = netGain >= 0 ? '↗ +' : '↘ ';
      gainPct.textContent = `${arrow}${pctGain.toFixed(1)}% growth`;
      gainPct.classList.toggle('is-negative', netGain < 0);
    }
    if (durationLabel) durationLabel.textContent = formatDuration(periods);
    if (chartEndLabel) chartEndLabel.textContent = `Month ${periods}`;

    if (barPrincipal && barGrowth) {
      if (totalInvested > 0 && netGain >= 0) {
        const principalShare = Math.min(100, Math.max(0, (totalSaved / totalInvested) * 100));
        barPrincipal.style.width = `${principalShare.toFixed(1)}%`;
        barGrowth.style.width = `${(100 - principalShare).toFixed(1)}%`;
      } else {
        barPrincipal.style.width = '100%';
        barGrowth.style.width = '0%';
      }
    }

    renderChart(payment, periods, monthlyRate);

    if (event && target !== depositRange && target !== monthsRange && target !== rateRange &&
      invested.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const result of [saved, invested]) {
        result.getAnimations().forEach((animation) => animation.cancel());
        result.animate(
          [{ transform: 'translateY(3px)', opacity: 0.7 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: 180, easing: 'ease-out' }
        );
      }
    }
    if (note) note.textContent = assumptions;
  }

  presets.forEach((btn) => {
    btn.addEventListener('click', () => {
      presets.forEach((item) => item.classList.remove('is-active'));
      btn.classList.add('is-active');
      const baseUgx = parseFloat(btn.dataset.deposit) || 100000;
      const scaled = Math.max(currentScale.min, Math.round((baseUgx * currentScale.scale) / currentScale.step) * currentScale.step);
      deposit.value = String(scaled);
      months.value = btn.dataset.months || '12';
      rate.value = btn.dataset.rate || '8';
      update({ target: btn });
    });
  });

  calculator.addEventListener('input', update);
  calculator.addEventListener('change', update);
  setCurrency(false);
  update();
}

function initProductTabs() {
  const section = document.querySelector('.product-feature');
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const strip = document.querySelector('.deck-strip');
  const pickerButtons = [...strip.querySelectorAll('.deck-picker button')];
  const label = strip.querySelector('#deck-position');
  const orbit = matchMedia('(prefers-reduced-motion: no-preference)');
  const visibleDeck = () => strip.querySelector('.deck-window:not([hidden])');
  function syncPicker() {
    const deck = visibleDeck();
    const cards = [...deck.querySelectorAll('li')];
    let index = 0;
    if (orbit.matches) {
      const turn = cards[0].getAnimations().find(animation => animation.animationName === 'deck-orbit');
      const progress = turn?.effect.getComputedTiming().progress || 0;
      index = Math.round(progress * cards.length) % cards.length;
    } else {
      const distance = card => Math.abs(Math.max(0, Math.min(card.offsetLeft, deck.scrollWidth - deck.clientWidth)) - deck.scrollLeft);
      index = cards.reduce((best, card, i) => distance(card) < distance(cards[best]) ? i : best, 0);
    }
    pickerButtons.forEach((button, i) => {
      button.setAttribute('aria-current', String(i === index));
      button.setAttribute('aria-label', 'Show ' + cards[i].querySelector('strong').textContent);
    });
    const name = cards[index].querySelector('strong').textContent;
    label.textContent = (index + 1) + ' / ' + cards.length + ' · ' + name;
  }
  function pickCard(index) {
    const deck = visibleDeck();
    const cards = [...deck.querySelectorAll('li')];
    if (orbit.matches) {
      for (const card of cards) {
        for (const animation of card.getAnimations()) {
          if (animation.animationName?.startsWith('deck-')) {
            animation.currentTime = index * animation.effect.getTiming().duration / cards.length;
          }
        }
      }
    } else {
      deck.scrollTo({ left: cards[index].offsetLeft, behavior: 'instant' });
    }
    syncPicker();
  }
  pickerButtons.forEach((button, index) => {
    button.addEventListener('click', () => pickCard(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const count = pickerButtons.length;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + count) % count;
      pickerButtons[next].focus();
      pickCard(next);
    });
  });
  strip.querySelectorAll('.deck-window').forEach(deck => {
    deck.addEventListener('scroll', syncPicker, { passive: true });
    let touchStartX = 0;
    let touchStartY = 0;
    deck.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    deck.addEventListener('touchend', (e) => {
      if (!orbit.matches || !e.changedTouches || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;
      const currentIdx = pickerButtons.findIndex((b) => b.getAttribute('aria-current') === 'true');
      const count = pickerButtons.length;
      const base = currentIdx >= 0 ? currentIdx : 0;
      const nextIdx = (base + (dx < 0 ? 1 : -1) + count) % count;
      pickCard(nextIdx);
    }, { passive: true });
  });
  orbit.addEventListener('change', syncPicker);
  let timer;
  if (strip) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        strip.classList.toggle('in-view', entry.isIntersecting);
        clearInterval(timer);
        if (entry.isIntersecting) {
          syncPicker();
          timer = setInterval(syncPicker, 500);
        }
      }).observe(strip);
    }
  }
  function select(tab) {
    section.dataset.product = tab.id;
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      const deck = document.getElementById(item === tabs[0] ? 'deck-save' : 'deck-invest');
      if (deck) deck.hidden = !active;
    }
    syncPicker();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[1] : tabs[1 - index];
      select(target);
      target.focus();
    });
  });
}

function initHomepageStories() {
  const rail = document.querySelector('.story-rail');
  if (!rail) return;
  const [previous, next] = document.querySelectorAll('.story-arrows button');
  const dots = [...rail.closest('.audiences').querySelectorAll('.story-pager button')];
  let active = 0;
  function position(index) {
    const card = rail.children[index];
    return Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth,
      card.offsetLeft + (card.offsetWidth - rail.clientWidth) / 2));
  }
  function go(index) {
    rail.scrollTo({ left: position(index), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function updateArrows() {
    active = dots.reduce((nearest, _, i) => Math.abs(position(i) - rail.scrollLeft) <
      Math.abs(position(nearest) - rail.scrollLeft) ? i : nearest, 0);
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === active)));
    Array.from(rail.children).forEach((card, i) => {
      card.dataset.centered = String(i === active);
    });
    previous.disabled = rail.scrollLeft < 2;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  }
  [previous, next].forEach((button, i) => {
    button.addEventListener('click', () => {
      go(Math.max(0, Math.min(dots.length - 1, active + (i ? 1 : -1))));
    });
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  rail.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
  rail.querySelectorAll('.story-photo').forEach(card => {
    const button = card.querySelector('.product-story-toggle');
    const details = card.querySelector('.story-summary');
    const expand = open => {
      button.setAttribute('aria-expanded', String(open));
      card.classList.toggle('is-expanded', open);
      details.inert = !open;
    };
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') expand(true);
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse' && !card.contains(document.activeElement)) expand(false);
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) expand(true);
    });
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) expand(false);
    });
    card.addEventListener('click', event => {
      if (!event.target.closest('a')) expand(details.inert);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Escape') { button.focus(); expand(false); }
    });
  });
  const filters = document.querySelectorAll('.voice-filters button');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const selected = filter === button;
      filter.setAttribute('aria-pressed', String(selected));
      document.getElementById(filter.getAttribute('aria-controls')).hidden = !selected;
    });
  }));
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

  // Only skip sticky sequence on ultra-short landscape screens (< 520px height).
  if (window.matchMedia && window.matchMedia('(max-height: 519px)').matches) {
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
    section.classList.add('manifesto-tracking');
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
    const wordProgress = Math.min(progress / 0.82, 1.05);
    section.classList.toggle('network-visible', progress >= 0.86);

    // Calculate each word's reveal
    const windowSize = 0.055; // Transition window per word
    
    for (let i = 0; i < totalWords; i++) {
      const span = wordSpans[i];
      const wordCenter = (i + 0.5) / totalWords;
      
      const wordFraction = (wordProgress - (wordCenter - windowSize)) / (windowSize * 1.5);
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
   2B. PLATFORM INTERACTIVE CAROUSEL (TABS & ARROW DRIVEN)
   Pure white gallery stage: 6 cards glide smoothly horizontally,
   navigated via the top tabs, bottom capsule arrow, capsule dots, or card clicks.
   Zero scroll-jacking: page scrolls naturally!
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
  if (new URLSearchParams(window.location.search).get('example') === 'monthly') {
    targetSlider.value = '1200000';
    monthsSlider.value = '12';
  }

  let frequency = 'monthly'; // 'monthly', 'weekly', 'daily'
  const ANNUAL_RATE = 0.085; // 8.5% p.a.

  function formatUGX(num) {
    return 'UGX ' + Math.round(num).toLocaleString('en-US');
  }

  function syncSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = Math.min(max, Math.max(min, parseFloat(slider.value) || min));
    const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    slider.style.setProperty('--slider-pct', `${pct.toFixed(1)}%`);
  }

  function calculate() {
    syncSliderFill(targetSlider);
    syncSliderFill(monthsSlider);
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
  window.handleContactSubmit = async function () {
    const form = document.getElementById('contact-form-elem');
    const successMsg = document.getElementById('contact-success-msg');
    const errorMsg = document.getElementById('contact-error-msg');
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitLabel = document.getElementById('contact-submit-label');
    if (!form || !successMsg) return;

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value) return;

    const payload = {
      category: document.getElementById('inquiry-tier')?.value || '',
      name: document.getElementById('full-name')?.value?.trim() || '',
      organization: document.getElementById('organization-name')?.value?.trim() || 'Not specified',
      email: document.getElementById('email-addr')?.value?.trim() || '',
      phone: document.getElementById('phone-number')?.value?.trim() || '',
      portfolio_scale: document.getElementById('portfolio-scale')?.value || '',
      message: document.getElementById('inquiry-message')?.value?.trim() || '',
      _subject: 'New Luminaries Capital Website Inquiry',
      _template: 'table',
      _captcha: 'false'
    };

    const originalText = submitLabel ? submitLabel.textContent : 'Submit Inquiry & Connect with an Advisor';
    if (errorMsg) errorMsg.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Sending inquiry...';

    try {
      const response = await fetch('https://formsubmit.co/ajax/christianokitovs@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Submission failed');

      form.reset();
      form.style.display = 'none';
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playTickSound(700);
    } catch (err) {
      const subject = encodeURIComponent(`Luminaries Capital Inquiry — ${payload.category}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nOrganization: ${payload.organization}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nVolume: ${payload.portfolio_scale}\n\n${payload.message}`
      );
      if (errorMsg) {
        errorMsg.innerHTML = `We could not deliver your inquiry automatically right now. Please try again or <a href="mailto:christianokitovs@gmail.com?subject=${subject}&body=${body}" style="color:#052d28; font-weight:600; text-decoration:underline;">send directly via email</a>.`;
        errorMsg.style.display = 'block';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = originalText;
    }
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

/* ==========================================================================
   12. SITEWIDE MOTION CHOREOGRAPHY (Scroll Reveals, Progress Bar & Spotlight)
   ========================================================================== */
function initSitewideMotion() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Subtle top scroll progress bar (GPU scaleX)
  let bar = document.querySelector('.scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }

  let progressTicking = false;
  const updateProgress = () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    progressTicking = false;
  };
  const requestProgress = () => {
    if (progressTicking) return;
    progressTicking = true;
    window.requestAnimationFrame(updateProgress);
  };
  updateProgress();
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });

  // 2. Calibrated scroll-reveal cascade across homepage & all subpages
  const staggerContainers = [
    '.products-deep-grid',
    '.about-pillars-grid',
    '.subpage-glass-grid',
    '.governance-grid',
    '.planner-shell',
    '.interactive-calc-box',
    '.contact-grid',
    '.about-strategy-grid',
    '.story-rail'
  ];

  const singleTargets = [
    '.audiences header',
    '.projection-heading',
    '.subpage-section-head',
    '.about-banner-card',
    '.about-hq-card',
    '.subpage-dark-band',
    '.subpage-notice-card',
    '.comparison-table-wrap'
  ];

  const revealNodes = new Set();

  staggerContainers.forEach((selector) => {
    document.querySelectorAll(selector).forEach((container) => {
      Array.from(container.children).forEach((child, index) => {
        if (child.nodeType !== 1) return;
        const delay = (index % 3) * 85;
        child.style.setProperty('--reveal-delay', `${delay}ms`);
        child.classList.add('motion-reveal');
        revealNodes.add(child);
      });
    });
  });

  singleTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!revealNodes.has(el)) {
        el.classList.add('motion-reveal');
        revealNodes.add(el);
      }
    });
  });

  document.documentElement.classList.add('motion-ready');

  const revealEl = (el) => {
    el.classList.add('is-revealed');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealEl(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );

    revealNodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        revealEl(el);
      } else {
        observer.observe(el);
      }
    });
  } else {
    revealNodes.forEach(revealEl);
  }

  // 3. Subtle cursor spotlight sheen on dark elevated surfaces (desktop fine pointer only)
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const darkSurfaces = document.querySelectorAll(
      '.planner-stage-col, .calc-results-col, .subpage-hero-card, .subpage-dark-band, .subpage-glass-tile'
    );
    darkSurfaces.forEach((surface) => {
      surface.classList.add('motion-spotlight');
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty('--spot-x', `${x.toFixed(1)}%`);
        surface.style.setProperty('--spot-y', `${y.toFixed(1)}%`);
      }, { passive: true });
    });
  }
}
