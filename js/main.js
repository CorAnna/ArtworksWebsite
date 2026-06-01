/**
 * ╔══════════════════════════════════════════════╗
 * ║  MAIN.JS — Logica principale del portfolio   ║
 * ╚══════════════════════════════════════════════╝
 */

/* ── DATI DI DEMO (usati se Sanity non è configurato) ────────────────────────
   Sostituisci questi con i tuoi dati reali tramite Sanity CMS.
   Le immagini sono placeholder pubblici da Unsplash.
   ────────────────────────────────────────────────────────────────────────── */
const DEMO_ARTWORKS = [
  {
    _id: 'd1', slug: 'composizione-in-rosso',
    title: 'Composizione in Rosso', category: 'pittura',
    year: 2023, technique: 'Olio su tela', size: '80 × 100 cm',
    description: "Un' esplorazione del colore primario nella sua forma più pura, tra stratificazioni materiche e velature traslucide.",
    image: { asset: { _ref: '' } },
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  },
  {
    _id: 'd2', slug: 'forma-nella-pietra',
    title: 'Forma nella Pietra', category: 'scultura',
    year: 2022, technique: 'Marmo di Carrara', size: '40 × 60 × 30 cm',
    description: 'La materia rivela la propria anima quando l'artista sa solo togliere.',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&q=80',
  },
  {
    _id: 'd3', slug: 'studio-di-luce',
    title: 'Studio di Luce', category: 'disegno',
    year: 2023, technique: 'Carboncino su carta', size: '50 × 70 cm',
    description: 'Il carboncino cattura i silenzi della luce radente sulle forme.',
    imageUrl: 'https://images.unsplash.com/photo-1581369583228-69f2ba4cff7f?w=600&q=80',
  },
  {
    _id: 'd4', slug: 'blu-profondo',
    title: 'Blu Profondo', category: 'pittura',
    year: 2023, technique: 'Acrilico e pigmenti', size: '100 × 120 cm',
    description: 'Il blu come abisso, come cielo, come silenzio percettivo.',
    imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=600&q=80',
  },
  {
    _id: 'd5', slug: 'equilibrio-precario',
    title: 'Equilibrio Precario', category: 'scultura',
    year: 2021, technique: 'Bronzo', size: '25 × 80 × 25 cm',
    description: 'La tensione tra peso e leggerezza si risolve in un istante sospeso.',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80',
  },
  {
    _id: 'd6', slug: 'linee-del-vento',
    title: 'Linee del Vento', category: 'disegno',
    year: 2022, technique: 'Inchiostro di China', size: '35 × 50 cm',
    description: 'L'inchiostro traccia il moto invisibile dell'aria sulla superficie bianca.',
    imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&q=80',
  },
  {
    _id: 'd7', slug: 'terra-bruciata',
    title: 'Terra Bruciata', category: 'pittura',
    year: 2022, technique: 'Olio e sabbia', size: '60 × 80 cm',
    description: 'I toni caldi della terra si fondono con la consistenza della sabbia del Mediterraneo.',
    imageUrl: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=600&q=80',
  },
  {
    _id: 'd8', slug: 'ritratto-n3',
    title: 'Ritratto N.3', category: 'disegno',
    year: 2023, technique: 'Matita su carta', size: '21 × 29.7 cm',
    description: 'Terzo di una serie di studi sul volto umano tra luce diffusa e ombra portata.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
  },
  {
    _id: 'd9', slug: 'geometria-organica',
    title: 'Geometria Organica', category: 'scultura',
    year: 2023, technique: 'Legno di olivo', size: '30 × 45 × 20 cm',
    description: 'L'ordine matematico e la curva naturale dialogano nel medesimo oggetto.',
    imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
  },
];

/* ── QUERY GROQ PER SANITY ────────────────────────────────────────────────── */
const GROQ_QUERY = `*[_type == "artwork"] | order(year desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  year,
  technique,
  size,
  description,
  image
}`;

/* ── STATO APPLICAZIONE ──────────────────────────────────────────────────── */
let allArtworks = [];
let filteredArtworks = [];
let currentLightboxIndex = 0;
let currentFilter = 'all';

/* ── INIT ──────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initCursor();
  initHeader();
  initHeroTitles();
  initFilters();
  animateLoader();
  setupForm();
  setupRevealObserver();
  document.getElementById('year').textContent = new Date().getFullYear();

  // Carica opere
  await loadArtworks();
});

/* ── LOADER ─────────────────────────────────────────────────────────────────── */
function animateLoader() {
  const fill   = document.getElementById('loaderFill');
  const loader = document.getElementById('loader');
  // Simula progresso
  fill.style.width = '60%';
  setTimeout(() => { fill.style.width = '100%'; }, 400);
  setTimeout(() => { loader.classList.add('hidden'); }, 1000);
}

/* ── CURSORE PERSONALIZZATO ──────────────────────────────────────────────── */
function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  // Lag morbido
  function animate() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Hover state
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .gallery-item, .filter-btn, .nav-link, .lightbox-close, .lightbox-prev, .lightbox-next')) {
      cursor.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .gallery-item, .filter-btn')) {
      cursor.classList.remove('hovered');
    }
  });
  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
}

/* ── HEADER SCROLL ───────────────────────────────────────────────────────── */
function initHeader() {
  const header    = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav       = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ── HERO TITLE WRAP (per animazione a righe) ────────────────────────────── */
function initHeroTitles() {
  document.querySelectorAll('.hero-title-line').forEach(line => {
    const text = line.textContent;
    line.innerHTML = `<span class="inner">${text}</span>`;
  });
}

/* ── FILTRI ──────────────────────────────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.filter-btn, .nav-link[data-filter]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const filter = btn.dataset.filter;
      if (!filter) return;
      setFilter(filter);
      if (btn.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      document.getElementById('lavori')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function setFilter(filter) {
  currentFilter = filter;
  filteredArtworks = filter === 'all'
    ? [...allArtworks]
    : allArtworks.filter(a => a.category === filter);

  renderGallery(filteredArtworks);
}

/* ── CARICAMENTO OPERE DA SANITY ─────────────────────────────────────────── */
async function loadArtworks() {
  const loading = document.getElementById('galleryLoading');
  const grid    = document.getElementById('galleryGrid');

  loading.style.display = 'block';
  grid.style.display    = 'none';

  try {
    // Controlla se Sanity è configurato
    if (window.SANITY_CONFIG?.projectId &&
        window.SANITY_CONFIG.projectId !== 'INSERISCI_IL_TUO_PROJECT_ID') {

      const results = await window.sanityQuery(GROQ_QUERY);
      allArtworks = results.map(art => ({
        ...art,
        imageUrl: art.image?.asset?._ref
          ? window.sanityImageUrl(art.image.asset._ref, { width: 800, quality: 85 })
          : '',
      }));
    } else {
      // Fallback dati demo
      console.info('[Portfolio] Sanity non configurato — uso dati demo.');
      await new Promise(r => setTimeout(r, 600)); // simula latenza
      allArtworks = DEMO_ARTWORKS;
    }
  } catch (err) {
    console.warn('[Portfolio] Errore Sanity, uso dati demo:', err.message);
    allArtworks = DEMO_ARTWORKS;
  }

  loading.style.display = 'none';
  filteredArtworks = [...allArtworks];
  renderGallery(filteredArtworks);
  initLightbox();
}

/* ── RENDER GRIGLIA ──────────────────────────────────────────────────────── */
function renderGallery(artworks) {
  const grid  = document.getElementById('galleryGrid');
  const empty = document.getElementById('galleryEmpty');

  if (!artworks.length) {
    grid.style.display  = 'none';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.style.display  = 'block';

  grid.innerHTML = artworks.map((art, idx) => `
    <article class="gallery-item reveal"
             data-id="${art._id}"
             data-index="${idx}"
             tabindex="0"
             role="button"
             aria-label="Apri ${art.title}">
      <img
        src="${art.imageUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80'}"
        alt="${art.title}"
        loading="lazy"
        decoding="async"
      />
      <div class="gallery-item-overlay">
        <div class="gallery-item-info">
          <span class="gallery-item-cat">${art.category || ''}</span>
          <span class="gallery-item-title">${art.title}</span>
        </div>
      </div>
    </article>
  `).join('');

  // Click / keyboard
  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(parseInt(item.dataset.index));
      }
    });
  });

  // Attiva reveal observer
  setupRevealObserver();
  // Conta animazione
  animateCounters();
}

/* ── LIGHTBOX ─────────────────────────────────────────────────────────────── */
function initLightbox() {
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');

  backdrop.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(+1));

  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(+1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const art = filteredArtworks[index];
  if (!art) return;

  const img = document.getElementById('lightboxImg');
  img.src = art.imageUrl || '';
  img.alt = art.title;
  document.getElementById('lightboxCategory').textContent  = art.category || '';
  document.getElementById('lightboxTitle').textContent     = art.title;
  document.getElementById('lightboxDesc').textContent      = art.description || '';
  document.getElementById('lightboxYear').textContent      = art.year || '';
  document.getElementById('lightboxTechnique').textContent = art.technique || '';
  document.getElementById('lightboxSize').textContent      = art.size || '';

  document.getElementById('lightbox').classList.add('open');
  document.getElementById('lightboxBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightboxBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  const len = filteredArtworks.length;
  currentLightboxIndex = (currentLightboxIndex + dir + len) % len;
  openLightbox(currentLightboxIndex);
}

/* ── REVEAL ON SCROLL ─────────────────────────────────────────────────────── */
function setupRevealObserver() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        obs.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  // Anche sezioni
  document.querySelectorAll('.about-section, .contact-section, .filters-section').forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
}

/* ── COUNTER ANIMATI ─────────────────────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target) || 0;
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;
      const timer  = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ── FORM CONTATTI ────────────────────────────────────────────────────────── */
function setupForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.style.opacity = '0.6';
    btn.disabled = true;

    // Netlify Forms: aggiunge l'attributo "name" se si usa Netlify
    // In alternativa, integra con Formspree, EmailJS, ecc.
    // Qui simuliamo un invio con delay
    await new Promise(r => setTimeout(r, 1000));

    form.reset();
    btn.style.opacity = '';
    btn.disabled = false;
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  });
}
