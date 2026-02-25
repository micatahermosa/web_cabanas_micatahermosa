# Mi Cata Hermosa

Trilingual static website (ES/EN/FR) for Cabañas Mi Cata Hermosa, Catamarca, Argentina.

## Project structure

```
src/              Source files — edit here
  index.html      Spanish (root)
  en/index.html   English
  fr/index.html   French
  assets/
    css/          styles.css is the entry point (imports all others)
    js/
    fonts/
    imgs/         UI assets: logo, icons
  images/         Content photos
  .htaccess       Apache config — copied to www/ at build time

www/              Build output to deplaoy
scripts/          Node build scripts
```

## Setup

```bash
npm install
```

## Commands

| Command | What it does |
|---|---|
| `npm start` | Build, serve `www/` at `http://localhost:8080`, and watch for changes — rebuilds on save, browser auto-reloads |
| `npm run build` | Build everything into `www/` (with const SITE_URL setup in build-html.js) |

`www/` is fully regenerated on every build. Safe to delete and rebuild from scratch.

## What the build does

1. **assets** `node scripts/copy-assets.js` — Copies fonts, images, imgs, glightbox files, and `.htaccess` to `www/`
2. **css** `postcss src/assets/css/styles.css -o www/assets/css/styles.css` — PostCSS merges all `@import`s into one file, autoprefixes, and minifies
3. **js** `node scripts/build-js.js` — Terser minifies `script.js` and `slideshow.js`; `glightbox.min.js` is copied as-is
4. **html** `node scripts/build-html.js` — For each of the three pages:
   - Injects `hreflang` alternate links and `og:url`
   - Rewrites language switcher links from relative to absolute URLs
   - Appends `?v=YYYYMMDD` to all CSS/JS references for cache busting

## Testing against a staging URL

Pass `SITE_URL` as an environment variable — no need to edit any file:

```bash
SITE_URL=https://staging.example.com/testfolder npm run build
```

`npm start` does this automatically with `http://localhost:8080`, so local language links always point to localhost.

## Deploy

1. `npm run build`
2. Upload the contents of `www/` to server


### Note on Gzip — server-side via .htaccess

`src/.htaccess` is copied to `www/.htaccess` by build:assets. It configures Apache (OVH) to compress HTML/CSS/JS/SVG/WOFF2 on-the-fly via mod_deflate — no pre-compression needed on shared hosting. Cache headers are 1 year; the build date stamp (`?v=YYYYMMDD`) on asset URLs invalidates the cache on rebuild.

Verify after deploy: DevTools → Network → HTML file → Response Headers → `content-encoding: gzip`.

### Note: Cloudflare (future improvement)

OVH is in France. Most visitors are in South America (~250ms RTT). Gzip reduces payload
but can't reduce latency. **Cloudflare free tier** would be an option to consider: edge nodes in
São Paulo and Buenos Aires would serve the site locally. Setup: create a free Cloudflare
account, point domain nameservers to Cloudflare, done. It also handles Brotli compression
automatically (better than gzip, ~15% smaller). No code changes needed.
