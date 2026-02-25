const fs   = require('fs');
const path = require('path');

const copies = [
  { src: 'src/assets/fonts',          out: 'www/assets/fonts' },
  { src: 'src/assets/imgs',           out: 'www/assets/imgs' },
  { src: 'src/assets/css/glightbox.min.css', out: 'www/assets/css/glightbox.min.css' },
  { src: 'src/images',                out: 'www/images' },
  { src: 'src/.htaccess',             out: 'www/.htaccess' },
  { src: 'src/favicon.svg',          out: 'www/favicon.svg' },
];

for (const { src, out } of copies) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.cpSync(src, out, { recursive: true });
  } else {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.copyFileSync(src, out);
  }

  console.log(`✓ ${out}`);
}
