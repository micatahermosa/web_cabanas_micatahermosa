const fs   = require('fs');
const path = require('path');

// const SITE_URL = process.env.SITE_URL || 'https://www.micatahermosa.com';
const SITE_URL = process.env.SITE_URL || 'https://www.intersticios.com/cab';
const VERSION  = new Date().toISOString().slice(0, 10).replace(/-/g, '');

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
