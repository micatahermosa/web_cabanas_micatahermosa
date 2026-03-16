# Mi Cata Hermosa

Multilingual static landing page (ES/EN/FR) for Cabañas Mi Cata Hermosa, Catamarca, Argentina.

## Infrastructure

**Hosting**: Netlify (auto-deploy from GitHub)  
**CDN**: AWS CloudFront  
**Domain**: Custom domain via OVH

## Project structure
```
src/              Source files
  index.html      Spanish (root)
  en/index.html   English
  fr/index.html   French
  assets/
    css/
    js/
    fonts/
    imgs/
  images/         Content photos

www/              Build output
scripts/          Build scripts
```

## Setup
```bash
npm install
```

## Commands

| Command | What it does |
|---|---|
| `npm start` | Build, serve at `http://localhost:8080`, watch for changes |
| `npm run build` | Build everything into `www/` |

## Build process

1. **assets**: Copies fonts, images, glightbox files
2. **css**: PostCSS merges imports, autoprefixes, minifies
3. **js**: Terser minifies scripts
4. **html**: Injects hreflang, og:url, cache busting timestamps

## Environment variables

**SITE_URL**: Base URL for absolute links

Set in Netlify environment variables or locally:
```bash
SITE_URL=https://example.com npm run build
```

## Deployment

Push to `main` triggers automatic Netlify deployment:
```bash
git add .
git commit -m "Update content"
git push origin main
```

Site live in 1-2 minutes.

## Performance

- Brotli/Gzip compression
- Global CDN
- Auto-renewed SSL
- Cache busting on assets
- HTTP/2