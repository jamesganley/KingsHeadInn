// Copy only the site's linked resources into a new, dated upload directory.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist', 'kings-head-' + new Date().toISOString().replace(/[:.]/g, '-'));
const pending = ['index.html', 'food.html', 'rooms.html', 'events.html', 'live-sport.html', 'reservation.html', 'ales.html', 'robots.txt', 'sitemap.xml'];
const copied = new Set();
while (pending.length) {
  const name = pending.pop();
  if (copied.has(name)) continue;
  const source = path.resolve(root, name);
  if (!source.startsWith(root + path.sep)) throw new Error('Path outside project: ' + name);
  if (!fs.statSync(source).isFile()) throw new Error('Not a file: ' + name);
  if (/\.(html|css|js)$/.test(name)) {
    const text = fs.readFileSync(source, 'utf8');
    const refs = [];
    for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) refs.push(match[1]);
    for (const match of text.matchAll(/srcset=["']([^"']+)["']/g)) {
      for (const item of match[1].split(',')) refs.push(item.trim().split(/\s+/)[0]);
    }
    for (const match of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) refs.push(match[1]);
    for (const ref of refs) {
      if (!ref || ref.startsWith('#') || /^(https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) continue;
      const url = new URL(ref, pathToFileURL(source));
      url.search = ''; url.hash = '';
      pending.push(path.relative(root, fileURLToPath(url)));
    }
  }
  const target = path.join(out, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  copied.add(name);
}
console.log(out);
console.log(copied.size + ' files copied. Upload the CONTENTS of this directory to the web root.');
