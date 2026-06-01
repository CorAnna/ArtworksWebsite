/**
 * ╔══════════════════════════════════════════════╗
 * ║  CONFIGURAZIONE SANITY.IO                    ║
 * ║  Sostituisci i valori con i tuoi reali       ║
 * ╚══════════════════════════════════════════════╝
 *
 * COME OTTENERE QUESTI VALORI:
 * 1. Vai su https://www.sanity.io/manage
 * 2. Seleziona il tuo progetto
 * 3. Vai in "Settings" → "API"
 *    - Project ID: stringa alfanumerica (es. "abc123xy")
 *    - Dataset: di solito "production"
 *    - API Version: usa la data odierna (es. "2024-01-01")
 * 4. Crea un token in "Tokens" (Read-only per il frontend)
 *
 * SICUREZZA: questo token è read-only e pubblicabile.
 * NON usare mai token con permessi di scrittura nel frontend!
 */

const SANITY_CONFIG = {
  projectId: '',  // ← es. "abc123xy"
  dataset:   'production',
  apiVersion: '2024-01-01',
  // Token read-only opzionale (necessario se il dataset è privato)
  token: '',  // ← lascia vuoto se il dataset è pubblico
};

/**
 * Costruisce l'URL delle API Sanity (GROQ query)
 */
function sanityQuery(query, params = {}) {
  const encodedQuery = encodeURIComponent(query);
  const encodedParams = Object.entries(params)
    .map(([k,v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join('&');

  const base = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
  const url = `${base}?query=${encodedQuery}${encodedParams ? '&' + encodedParams : ''}`;

  const headers = { 'Content-Type': 'application/json' };
  if (SANITY_CONFIG.token) headers['Authorization'] = `Bearer ${SANITY_CONFIG.token}`;

  return fetch(url, { headers })
    .then(res => {
      if (!res.ok) throw new Error(`Sanity API Error: ${res.status}`);
      return res.json();
    })
    .then(data => data.result);
}

/**
 * Costruisce l'URL di un'immagine Sanity con trasformazioni
 * Docs: https://www.sanity.io/docs/image-urls
 *
 * @param {object} imageRef - riferimento immagine da Sanity (campo `image.asset._ref`)
 * @param {object} options  - { width, height, quality, format }
 */
function sanityImageUrl(imageRef, options = {}) {
  if (!imageRef) return '';

  // Decomposizione del riferimento immagine
  // Formato: "image-<id>-<width>x<height>-<format>"
  const ref = typeof imageRef === 'string' ? imageRef : imageRef._ref;
  if (!ref) return '';

  const parts = ref.replace(/^image-/, '').split('-');
  const format = parts.pop(); // ultimo: formato (jpg, png, webp…)
  const dims   = parts.pop(); // penultimo: dimensioni (800x600)
  const id     = parts.join('-'); // il resto: id

  let url = `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dims}.${format}`;

  // Parametri di trasformazione
  const params = [];
  if (options.width)   params.push(`w=${options.width}`);
  if (options.height)  params.push(`h=${options.height}`);
  if (options.quality) params.push(`q=${options.quality}`);
  if (options.format)  params.push(`fm=${options.format}`);
  // Auto-format per browser moderni (WebP/AVIF)
  params.push('auto=format');

  return url + (params.length ? '?' + params.join('&') : '');
}

window.sanityQuery    = sanityQuery;
window.sanityImageUrl = sanityImageUrl;
window.SANITY_CONFIG  = SANITY_CONFIG;
