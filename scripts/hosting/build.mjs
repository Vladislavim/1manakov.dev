import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, copyFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const run = (args) => {
  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit', env: { ...process.env, STATIC_HOSTING: 'true' },
  });
  if (result.status !== 0) process.exit(result.status || 1);
};
// Keep the same content quality gates as the normal production build.
run(['scripts/seo/validate.mjs']);
run(['scripts/seo/audit-guides.mjs']);
run(['node_modules/next/dist/bin/next', 'build']);
copyFileSync('scripts/hosting/apache.htaccess', 'out/.htaccess');
// Exported extensionless sitemap responses need an explicit XML content type.
writeFileSync('out/sitemaps/.htaccess', 'ForceType application/xml\n');
const walk = (dir) => readdirSync(dir).flatMap(name => {
  const file = path.join(dir, name);
  return statSync(file).isDirectory() ? walk(file) : [file];
});
for (const file of walk('out').filter(file => file.includes('__empty-export__'))) unlinkSync(file);
// Next 16 exports segment payloads as nested files but requests dot-joined names.
// Materialize those URLs so shared hosting needs no framework-aware RSC server.
for (const file of walk('out')) {
  const relative = path.relative('out', file).replaceAll('\\', '/');
  const start = relative.indexOf('__next.');
  if (start >= 0 && relative.slice(start).includes('/')) {
    const alias = relative.slice(0, start) + relative.slice(start).replaceAll('/', '.');
    copyFileSync(file, path.join('out', alias));
  }
}
const files = walk('out');
mkdirSync('outputs/hosting', { recursive: true });
writeFileSync('outputs/hosting/manifest.json', JSON.stringify({
  builtAt: new Date().toISOString(), files: files.length,
  bytes: files.reduce((sum, file) => sum + statSync(file).size, 0),
  pages: files.filter(file => file.endsWith('.html')).map(file => path.relative('out', file).replaceAll('\\', '/')),
}, null, 2));
console.log(`Hosting files ready: ${path.join(root, 'out')} (${files.length} files)`);
