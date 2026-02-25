# Mi Cata Hermosa — Todo

## Phase 1 — Typography & Design Details

- [x] Check if mobile version is all good when it comes to font sizes, spacings etc
- [x] Replace Identidad & naturaleza icon by something more vegetal (tree ? leaves ?)
- [x] hover and current state color for language switcher should use --color-terracotta and font-ui

## Phase 2 — Assets to Prepare

- [x] **Check if Glightbox can handle webp + jpg fallback, and mobile-size image variants**
- [x] **Prepare mobile-size image variants for all galleries** — All 6 trigger images now use srcset with 600w mobile variant + 800w full. All 69 lightbox hrefs updated to .webp. At the end mobile variants aren't triggering often because of high DPR screens, but it's good to have them ready for lower-end devices.

---

## Phase 3 — Technical Fixes
- [x] **Google Map — cross-origin / CSP check** — Test for `X-Frame-Options` or CSP errors in console. Fallback if needed: static map image linking to Google Maps, or a plain CTA button with coordinates.

---

## Phase 5 — Responsive Review
- [x] **Section stacking order on mobile** — Walk the full page at narrow viewport. Confirm logical flow: hero → cabañas → servicios → ubicación → nosotros → catamarca → footer.
- [x] **Block order within split sections** — Hornerito: added .stack-reverse so text comes first when stacked. Naranjero and halves already correct.
- [x] Verify coherency of menu items vs section titles (and decide which term to keep if conflict)
- [x] **Nav — hamburger & language switcher** — Added Escape-to-close, Tab focus trap, body scroll lock, and focus-first-link on open.
- [x] **Hero Slider** — Added mobile-size images to srcset to not force intrusive slider on small devices. Test on mobile to confirm they load and look good. 
---

## Phase 6 — Translations

- [x] **English version** — Create `en/index.html`. Translate all content. Update
      `hreflang` meta tags on all three versions. Language nav links point to
      correct pages. Translate `alt` text on all images.
- [x] **French version** — Create `fr/index.html`. Same process as English.
- [x] **Shared assets** — CSS/JS/fonts are shared, no duplication needed. Confirm
      folder structure (`en/`, `fr/` alongside root `index.html`).

---

## Phase 7 — Build & Deploy ✓

- [x] **Build pipeline is implemented and working. Run `npm run build` to produce `www/`.

| Script | Command | What it does |
|---|---|---|
| `build:assets` | `node scripts/copy-assets.js` | Copies fonts, imgs, images, glightbox.min.css/js, .htaccess |
| `build:css` | `postcss src/assets/css/styles.css -o www/assets/css/styles.css` | Merges @imports → autoprefixes → minifies |
| `build:js` | `node scripts/build-js.js` | Minifies script.js + slideshow.js via terser; copies glightbox.min.js |
| `build:html` | `node scripts/build-html.js` | Injects hreflang + og:url; rewrites lang links to absolute URLs |

### Note on Gzip — server-side via .htaccess

`src/.htaccess` is copied to `www/.htaccess` by build:assets. Apache (OVH) compresses
HTML/CSS/JS/SVG on-the-fly via mod_deflate. No pre-compression needed on shared hosting.

Added: font/woff2 and image/svg+xml to the cache headers.

Verify after deploy: DevTools → Network → click the HTML file → Response Headers →
look for `content-encoding: gzip`.


---

### Note: Cloudflare (future improvement)

OVH is in France. Most visitors are in South America (~250ms RTT). Gzip reduces payload
but can't reduce latency. **Cloudflare free tier** would be the real fix: edge nodes in
São Paulo and Buenos Aires would serve the site locally. Setup: create a free Cloudflare
account, point domain nameservers to Cloudflare, done. It also handles Brotli compression
automatically (better than gzip, ~15% smaller). No code changes needed.