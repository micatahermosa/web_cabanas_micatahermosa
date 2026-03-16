# Mi Cata Hermosa

Multilingual static landing page (ES/EN/FR) for Cabañas Mi Cata Hermosa, Catamarca, Argentina.

## Infrastructure

**Domain**: OVH Canada (`micatahermosa.com`)  
**DNS**: OVH Canada (points to Netlify)  
**Hosting**: Netlify (CDN via AWS CloudFront, São Paulo PoP for Argentina) >> Free account, so github repo needs to be public, but we can keep it private and deploy manually via Netlify dashboard if needed. 
**Repository**: GitHub ~~private~~ repo (`micatahermosa/web_cabanas_micatahermosa`)  
**Deployment**: Automatic via Netlify on push to `main` branch

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

www/              Build output (deployed to Netlify)
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
| `npm run build` | Build everything into `www/` (with SITE_URL from environment variable) |

`www/` is fully regenerated on every build. Safe to delete and rebuild from scratch.

## What the build does

1. **assets** `node scripts/copy-assets.js` — Copies fonts, images, imgs, and glightbox files to `www/`
2. **css** `postcss src/assets/css/styles.css -o www/assets/css/styles.css` — PostCSS merges all `@import`s into one file, autoprefixes, and minifies
3. **js** `node scripts/build-js.js` — Terser minifies `script.js` and `slideshow.js`; `glightbox.min.js` is copied as-is
4. **html** `node scripts/build-html.js` — For each of the three pages:
   - Injects `hreflang` alternate links and `og:url`
   - Rewrites language switcher links from relative to absolute URLs
   - Appends `?v=YYYYMMDD` to all CSS/JS references for cache busting

## Environment variables

**SITE_URL**: Base URL for absolute links (hreflang, og:url, language switcher)

Set in Netlify: **Site settings** → **Environment variables** → `SITE_URL=https://www.micatahermosa.com`

For local testing with a staging URL:

```bash
SITE_URL=https://staging.example.com npm run build
```

`npm start` uses `http://localhost:8080` automatically.

## Deployment

### Automatic (recommended)

Push to `main` branch triggers automatic deployment via Netlify:

```bash
git add .
git commit -m "Update content"
git push origin main
```

Netlify will:
1. Run `npm run build`
2. Deploy `www/` to CDN
3. Site live in 1-2 minutes at `https://www.micatahermosa.com`

### Manual (if needed)

1. `npm run build`
2. Drag and drop `www/` folder into Netlify dashboard

## Performance

Netlify automatically handles:
- **Compression**: Brotli/Gzip for all assets
- **CDN**: Global edge network (São Paulo PoP serves Argentina)
- **SSL**: Let's Encrypt certificate (auto-renewed)
- **Cache headers**: Optimized automatically
- **HTTP/2**: Enabled by default

Cache busting adds date stamps on css/js files, ensures updates are always visible.
