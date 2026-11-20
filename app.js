/**
 * LUMINARIES CAPITAL — INTERACTIVE ENGINE
 * Implements 3D card parade, physics micro-demos, gauge simulation, and modal routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomepageStories();
  initProductTabs();
  initHeroCalculator();
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
  let resumeDrawingAt = 0;
  window.addEventListener('scroll', () => {
    resumeDrawingAt = performance.now() + 180;
  }, { passive: true });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    // The soft background can be upscaled independently of the text and cards.
    const scale = Math.min(1, 256 / Math.max(rect.width, rect.height, 1));
    width = Math.max(1, Math.round(rect.width * scale));
    height = Math.max(1, Math.round(rect.height * scale));
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
    ctx.filter = 'blur(' + Math.max(2, height * 0.03) + 'px)';

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
      ctx.lineWidth = Math.max(1, height * 0.2);
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
    if (now >= resumeDrawingAt && now - lastFrame >= frameInterval) {
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
function initPlatformHybridScroll() {
  const viewport = document.getElementById('platform-cards-viewport');
  const stream = document.getElementById('platform-cards-stream');
  if (!viewport || !stream) return;

  const cards = Array.from(stream.querySelectorAll('.platform-stream-card'));
  const pills = Array.from(document.querySelectorAll('.platform-nav-pill'));
  const capsuleItems = Array.from(document.querySelectorAll('.capsule-item'));
  const capsuleNextBtn = document.getElementById('capsule-next-btn');
  const vehicleCta = document.getElementById('platform-active-vehicle-cta');

  if (cards.length === 0) return;

  const vehicleData = [
    { name: "Flex Save", link: "save.html#flex", ctaText: "Explore Flex Save" },
    { name: "Steady Save", link: "save.html#steady", ctaText: "Explore Steady Save" },
    { name: "GoalSave™", link: "save.html#goalsave", ctaText: "Launch GoalSave™" },
    { name: "Dollar Save", link: "save.html#usd", ctaText: "Explore Dollar Save" },
    { name: "Circle Pot", link: "save.html#circle", ctaText: "Explore Circle Pot" },
    { name: "Treasury Desk", link: "invest.html#institutional", ctaText: "Explore Treasury Desk" }
  ];

  let activeIndex = 0;

  function updateActiveCard(index) {
    if (index < 0 || index >= cards.length) return;
    activeIndex = index;

    // Update Card Focus States
    cards.forEach((card, i) => {
      const isActive = i === index;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
      card.inert = !isActive;
    });

    // Update Pill Tabs
    pills.forEach((pill, i) => {
      const isActive = i === index;
      pill.classList.toggle('is-active', isActive);
      pill.setAttribute('aria-selected', String(isActive));
      pill.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && window.innerWidth <= 900) {
        const strip = pill.parentElement;
        const bounds = strip.getBoundingClientRect();
        const tab = pill.getBoundingClientRect();
        const offset = tab.left < bounds.left ? tab.left - bounds.left
          : Math.max(0, tab.right - bounds.right);
        if (offset) strip.scrollBy({ left: offset, behavior: 'instant' });
      }
    });

    // Update Apple Capsule Dots
    capsuleItems.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });

    // Update Footer Direct Link
    const data = vehicleData[index];
    if (vehicleCta && data) {
      vehicleCta.href = data.link;
      const spanText = vehicleCta.querySelector('span:first-child');
      if (spanText) spanText.textContent = data.ctaText;
    }
  }

  function jumpToCard(targetIndex) {
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    updateActiveCard(targetIndex);

    // Calculate translation to center the target card directly in the viewport
    const card = cards[targetIndex];
    if (!card) return;

    if (window.innerWidth <= 900) {
      const bounds = viewport.getBoundingClientRect();
      const selected = card.getBoundingClientRect();
      viewport.scrollBy({
        left: selected.left - bounds.left + (selected.width - bounds.width) / 2,
        behavior: 'instant'
      });
      return;
    }

    const viewportWidth = viewport.offsetWidth;
    const cardWidth = card.offsetWidth;
    const cardLeft = card.offsetLeft;
    const targetX = (viewportWidth / 2) - (cardLeft + cardWidth / 2);
    stream.style.transform = `translate3d(${targetX.toFixed(1)}px, -50%, 0)`;
  }

  // Quick-Jump: Clicking Pill tabs above
  pills.forEach((pill, idx) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      jumpToCard(idx);
    });

    pill.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let targetIndex = activeIndex;
      if (event.key === 'ArrowRight') targetIndex = (activeIndex + 1) % pills.length;
      if (event.key === 'ArrowLeft') targetIndex = (activeIndex - 1 + pills.length) % pills.length;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = pills.length - 1;
      pills[targetIndex]?.focus({ preventScroll: true });
      jumpToCard(targetIndex);
    });
  });

  // Apple Capsule dots click
  capsuleItems.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      jumpToCard(idx);
    });
  });

  // Apple Capsule Next Button click below (arrow)
  if (capsuleNextBtn) {
    capsuleNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % cards.length;
      jumpToCard(nextIndex);
    });
  }

  // Clicking an inactive card directly brings it to center
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      // If clicking inside a direct action link/button inside the card, let link work
      if (e.target.closest('a') && idx === activeIndex) return;
      if (idx !== activeIndex) {
        e.preventDefault();
        jumpToCard(idx);
      }
    });
  });

  // On resize, ensure current card stays centered
  window.addEventListener('resize', () => {
    jumpToCard(activeIndex);
  }, { passive: true });

  // Initial centering
  window.requestAnimationFrame(() => {
    jumpToCard(0);
  });
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
   5. TILE 4 MICRO-DEMO: GOALSAVE™ BUDGET GAUGE
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
        if (label) label.textContent = 'USD Yield: 8.4% APY · Daily Compounding';
      } else {
        if (display) display.textContent = 'UGX 9,450,000';
        if (label) label.textContent = 'UGX Treasury: 12.8% APY · Zero Hidden Fees';
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
      confirmBtn.textContent = '✓ Confirmed';
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
   9. GOALSAVE™ CALCULATOR ENGINE (for save.html)
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
