const fs   = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://www.micatahermosa.com';

const now = new Date();
const VERSION = now.toISOString().replace(/[-:]/g, '').slice(0, 14);

const pages = [
  {
    src:  'src/index.html',
    out:  'www/index.html',
    lang: 'es',
    url:  `${SITE_URL}/`,
    langLinks: [
      [/href="en\/"/g,  `href="${SITE_URL}/en/"`],
      [/href="fr\/"/g,  `href="${SITE_URL}/fr/"`],
    ],
  },
  {
    src:  'src/en/index.html',
    out:  'www/en/index.html',
    lang: 'en',
    url:  `${SITE_URL}/en/`,
    langLinks: [
      [/href="\.\.\/"/g,     `href="${SITE_URL}/"`],
      [/href="\.\.\/fr\/"/g, `href="${SITE_URL}/fr/"`],
    ],
  },
  {
    src:  'src/fr/index.html',
    out:  'www/fr/index.html',
    lang: 'fr',
    url:  `${SITE_URL}/fr/`,
    langLinks: [
      [/href="\.\.\/"/g,     `href="${SITE_URL}/"`],
      [/href="\.\.\/en\/"/g, `href="${SITE_URL}/en/"`],
    ],
  },
];

const ldjson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  'name': 'Cabañas Mi Cata Hermosa',
  'url': 'https://www.micatahermosa.com',
  'telephone': '+5493834318577',
  'email': 'cabanasmicatahermosa@gmail.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'RP106 n° 2167',
    'addressLocality': 'San Fernando del Valle de Catamarca',
    'addressRegion': 'Catamarca',
    'addressCountry': 'AR',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': -28.425147495815988,
    'longitude': -65.73518954576475,
  },
  'checkinTime': '15:00',
  'checkoutTime': '11:00',
  'priceRange': '$$',
  'currenciesAccepted': 'ARS, USD',
  'availableLanguage': ['Spanish', 'English', 'French'],
}, null, 2);

const hreflang = [
  `<link rel="alternate" hreflang="es"        href="${SITE_URL}/">`,
  `<link rel="alternate" hreflang="en"        href="${SITE_URL}/en/">`,
  `<link rel="alternate" hreflang="fr"        href="${SITE_URL}/fr/">`,
  `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`,
].join('\n    ');

for (const page of pages) {
  fs.mkdirSync(path.dirname(page.out), { recursive: true });

  let html = fs.readFileSync(page.src, 'utf8');

  // Inject hreflang + og:url
  const injection = hreflang + `\n    <meta property="og:url" content="${page.url}">`;
  html = html.replace('<!-- hreflang: added by build script (Phase 7) -->', injection);

  // Inject structured data
  html = html.replace('<!-- ld+json: added by build script -->', `<script type="application/ld+json">\n    ${ldjson.replace(/\n/g, '\n    ')}\n    </script>`);

  // Rewrite relative language switcher links to absolute URLs
  for (const [pattern, replacement] of page.langLinks) {
    html = html.replace(pattern, replacement);
  }

  // Cache-bust CSS and JS with build date
  html = html.replace(/(href|src)="([^"]+\.(?:css|js))"/g, (_, attr, val) => {
    if (val.startsWith('http')) return _;
    return `${attr}="${val}?v=${VERSION}"`;
  });

  fs.writeFileSync(page.out, html);
  console.log(`✓ ${page.out}`);
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = pages.map(p => `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
fs.writeFileSync('www/sitemap.xml', sitemap);
console.log('✓ www/sitemap.xml');

// robots.txt
const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync('www/robots.txt', robots);
console.log('✓ www/robots.txt');
