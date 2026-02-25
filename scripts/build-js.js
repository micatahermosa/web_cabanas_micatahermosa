const fs     = require('fs');
const path   = require('path');
const terser = require('terser');

const OUT_DIR = 'www/assets/js';

const files = [
  { src: 'src/assets/js/script.js',    out: `${OUT_DIR}/script.js` },
  { src: 'src/assets/js/slideshow.js', out: `${OUT_DIR}/slideshow.js` },
];

const copy = [
  { src: 'src/assets/js/glightbox.min.js', out: `${OUT_DIR}/glightbox.min.js` },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  for (const file of files) {
    const code   = fs.readFileSync(file.src, 'utf8');
    const result = await terser.minify(code, { compress: true, mangle: true });
    fs.writeFileSync(file.out, result.code);
    console.log(`✓ ${file.out}`);
  }

  for (const file of copy) {
    fs.copyFileSync(file.src, file.out);
    console.log(`✓ ${file.out} (copied)`);
  }
})();
