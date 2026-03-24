/* ============================================================
   BESPOKE Garden Play — Pitch Deck App
   ============================================================ */

const IMG_BASE = 'assets/images/';
const SWIPE_THRESHOLD = 50;

// ── State ────────────────────────────────────────────────────
const state = {
  currentView: 'hub',       // 'hub' | 'category' | 'narrative'
  currentCategoryId: null,
  currentIndex: 0,
  catalogue: null,
  touch: { startX: 0, startY: 0, active: false },
  imgCache: {},
};

// ── DOM refs ─────────────────────────────────────────────────
const views = {
  hub:       document.getElementById('view-hub'),
  category:  document.getElementById('view-category'),
  narrative: document.getElementById('view-narrative'),
};

const els = {
  categoryGrid:        document.getElementById('category-grid'),
  galleryBg:           document.getElementById('gallery-bg'),
  galleryCategoryName: document.getElementById('gallery-category-name'),
  galleryCounter:      document.getElementById('gallery-counter'),
  galleryLabel:        document.getElementById('gallery-label'),
  galleryDots:         document.getElementById('gallery-dots'),
  btnPrev:             document.getElementById('btn-prev'),
  btnNext:             document.getElementById('btn-next'),
  btnBackCategory:     document.getElementById('btn-back-category'),
  narrativeBg:         document.getElementById('narrative-bg'),
  narrativeCounter:    document.getElementById('narrative-counter'),
  narrativeBrand:      document.getElementById('narrative-brand'),
  narrativeHeadline:   document.getElementById('narrative-headline'),
  narrativeSub:        document.getElementById('narrative-sub'),
  narrativeTitleWrap:  document.getElementById('narrative-title-wrap'),
  narrativeLabel:      document.getElementById('narrative-label'),
  narrativeProgressFill: document.getElementById('narrative-progress-fill'),
  btnNarrativePrev:    document.getElementById('btn-narrative-prev'),
  btnNarrativeNext:    document.getElementById('btn-narrative-next'),
  btnBackNarrative:    document.getElementById('btn-back-narrative'),
  btnNarrative:        document.getElementById('btn-narrative'),
};

// ── Image preloading ─────────────────────────────────────────
function preload(filename) {
  if (!filename || state.imgCache[filename]) return;
  const img = new Image();
  img.src = IMG_BASE + filename;
  state.imgCache[filename] = img;
}

function preloadAhead(images, currentIndex, lookahead = 3) {
  for (let i = 0; i <= lookahead; i++) {
    const idx = currentIndex + i;
    if (idx < images.length) preload(images[idx].image || images[idx]);
  }
}

// ── View switching ────────────────────────────────────────────
function showView(name) {
  Object.entries(views).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
  state.currentView = name;
}

// ── Hub ───────────────────────────────────────────────────────
function buildHub() {
  const { categories } = state.catalogue;

  categories.forEach(cat => {
    preload(cat.hero);

    const tile = document.createElement('div');
    tile.className = 'category-tile';
    tile.setAttribute('data-id', cat.id);

    const img = document.createElement('img');
    img.src = IMG_BASE + cat.hero;
    img.alt = cat.name;
    img.draggable = false;

    const overlay = document.createElement('div');
    overlay.className = 'category-tile-overlay';

    const name = document.createElement('p');
    name.className = 'category-tile-name';
    name.textContent = cat.name;

    const count = document.createElement('p');
    count.className = 'category-tile-count';
    count.textContent = `${cat.products.length} pieces`;

    overlay.append(name, count);
    tile.append(img, overlay);

    tile.addEventListener('click', () => openCategory(cat.id));
    els.categoryGrid.appendChild(tile);
  });
}

// ── Category Gallery ──────────────────────────────────────────
function openCategory(categoryId) {
  const cat = state.catalogue.categories.find(c => c.id === categoryId);
  if (!cat) return;

  state.currentCategoryId = categoryId;
  state.currentIndex = 0;

  els.galleryCategoryName.textContent = cat.name;
  buildDots(els.galleryDots, cat.products.length);
  buildGalleryBg(els.galleryBg, cat.products.map(p => p.image));
  renderCategorySlide(0);

  preloadAhead(cat.products, 0);
  showView('category');
}

function renderCategorySlide(index) {
  const cat = state.catalogue.categories.find(c => c.id === state.currentCategoryId);
  const product = cat.products[index];

  // Update background image
  const imgs = els.galleryBg.querySelectorAll('.gallery-bg-img');
  imgs.forEach((img, i) => {
    img.classList.toggle('visible', i === index);
  });

  // Update label
  els.galleryLabel.classList.remove('visible');
  requestAnimationFrame(() => {
    els.galleryLabel.textContent = product.title;
    requestAnimationFrame(() => els.galleryLabel.classList.add('visible'));
  });

  // Counter
  els.galleryCounter.textContent = `${index + 1} / ${cat.products.length}`;

  // Dots
  updateDots(els.galleryDots, index);

  // Arrows
  els.btnPrev.disabled = index === 0;
  els.btnNext.disabled = index === cat.products.length - 1;

  // Preload ahead
  preloadAhead(cat.products, index);

  state.currentIndex = index;
}

function buildGalleryBg(container, imageFiles) {
  container.innerHTML = '';
  imageFiles.forEach((filename, i) => {
    const img = document.createElement('img');
    img.className = 'gallery-bg-img' + (i === 0 ? ' visible' : '');
    img.src = IMG_BASE + filename;
    img.alt = '';
    img.draggable = false;
    container.appendChild(img);
  });
}

// ── Dot Indicators ────────────────────────────────────────────
function buildDots(container, count) {
  container.innerHTML = '';
  // Only show dots if reasonable count
  if (count > 30) return;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    container.appendChild(dot);
  }
}

function updateDots(container, index) {
  container.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ── Narrative ─────────────────────────────────────────────────
function openNarrative() {
  state.currentIndex = 0;
  const { narrative } = state.catalogue;
  const imageFiles = narrative.map(s => s.image);

  buildGalleryBg(els.narrativeBg, imageFiles);
  renderNarrativeSlide(0);
  preloadAhead(narrative, 0);

  showView('narrative');
}

function renderNarrativeSlide(index) {
  const { narrative } = state.catalogue;
  const slide = narrative[index];

  // Background image
  const imgs = els.narrativeBg.querySelectorAll('.gallery-bg-img');
  imgs.forEach((img, i) => img.classList.toggle('visible', i === index));

  // Brand overlay or title
  const isBrand = slide.type === 'brand';
  const isAtmosphere = slide.type === 'atmosphere';

  els.narrativeBrand.classList.toggle('visible', isBrand);
  els.narrativeTitleWrap.style.opacity = (isBrand || isAtmosphere) ? '0' : '1';

  if (isBrand) {
    els.narrativeHeadline.textContent = slide.headline;
    els.narrativeSub.textContent = slide.sub;
  }

  if (!isBrand && !isAtmosphere) {
    els.narrativeLabel.classList.remove('visible');
    requestAnimationFrame(() => {
      els.narrativeLabel.textContent = slide.title;
      requestAnimationFrame(() => els.narrativeLabel.classList.add('visible'));
    });
  }

  // Progress bar
  const pct = ((index + 1) / narrative.length) * 100;
  els.narrativeProgressFill.style.width = pct + '%';

  // Counter
  els.narrativeCounter.textContent = `${index + 1} / ${narrative.length}`;

  // Arrows
  els.btnNarrativePrev.disabled = index === 0;
  els.btnNarrativeNext.disabled = index === narrative.length - 1;

  preloadAhead(narrative, index);
  state.currentIndex = index;
}

// ── Navigation ────────────────────────────────────────────────
function navigateCategory(dir) {
  const cat = state.catalogue.categories.find(c => c.id === state.currentCategoryId);
  const next = state.currentIndex + dir;
  if (next < 0 || next >= cat.products.length) return;
  renderCategorySlide(next);
}

function navigateNarrative(dir) {
  const next = state.currentIndex + dir;
  if (next < 0 || next >= state.catalogue.narrative.length) return;
  renderNarrativeSlide(next);
}

// ── Touch / Swipe ─────────────────────────────────────────────
function attachSwipe(el, onSwipeLeft, onSwipeRight) {
  el.addEventListener('touchstart', e => {
    state.touch.startX = e.touches[0].clientX;
    state.touch.startY = e.touches[0].clientY;
    state.touch.active = true;
  }, { passive: true });

  el.addEventListener('touchend', e => {
    if (!state.touch.active) return;
    const dx = e.changedTouches[0].clientX - state.touch.startX;
    const dy = e.changedTouches[0].clientY - state.touch.startY;
    state.touch.active = false;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) onSwipeLeft();
    else onSwipeRight();
  }, { passive: true });
}

// ── Keyboard support ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (state.currentView === 'category') {
    if (e.key === 'ArrowRight') navigateCategory(1);
    if (e.key === 'ArrowLeft')  navigateCategory(-1);
    if (e.key === 'Escape')     showView('hub');
  }
  if (state.currentView === 'narrative') {
    if (e.key === 'ArrowRight') navigateNarrative(1);
    if (e.key === 'ArrowLeft')  navigateNarrative(-1);
    if (e.key === 'Escape')     showView('hub');
  }
});

// ── Event Listeners ───────────────────────────────────────────
els.btnNarrative.addEventListener('click', openNarrative);
els.btnBackCategory.addEventListener('click', () => showView('hub'));
els.btnBackNarrative.addEventListener('click', () => showView('hub'));

els.btnPrev.addEventListener('click', () => navigateCategory(-1));
els.btnNext.addEventListener('click', () => navigateCategory(1));
els.btnNarrativePrev.addEventListener('click', () => navigateNarrative(-1));
els.btnNarrativeNext.addEventListener('click', () => navigateNarrative(1));

attachSwipe(views.category,
  () => navigateCategory(1),
  () => navigateCategory(-1)
);
attachSwipe(views.narrative,
  () => navigateNarrative(1),
  () => navigateNarrative(-1)
);

// ── Init ──────────────────────────────────────────────────────
async function init() {
  const res = await fetch('data/catalogue.json');
  state.catalogue = await res.json();
  buildHub();
  showView('hub');

  // Preload all hero images in background
  state.catalogue.categories.forEach(cat => preload(cat.hero));
  state.catalogue.narrative.forEach(s => preload(s.image));
}

init();
