import http from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve('out');
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.txt':'text/plain', '.xml':'application/xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon', '.pdf':'application/pdf' };
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const alias = pathname.replace(/^\/play\/?$/, '/lab').replace(/^\/journal(?=\/|$)/, '/guides');
  if (alias !== pathname) { res.writeHead(301,{Location:alias}).end(); return; }
  const base = path.resolve(root, '.' + pathname);
  if (!base.startsWith(root + path.sep) && base !== root || pathname.split('/').some(p=>p.startsWith('.'))) { res.writeHead(403).end(); return; }
  const file = [base,base+'.html',path.join(base,'index.html')].find(f=>existsSync(f)&&statSync(f).isFile());
  if (!file) { res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(readFileSync(path.join(root,'404.html'))); return; }
  res.writeHead(200,{'Content-Type':pathname.startsWith('/sitemaps/')?'application/xml':mime[path.extname(file)]||'application/octet-stream'}).end(readFileSync(file));
}).listen(3010,'127.0.0.1',()=>console.log('Static hosting preview: http://127.0.0.1:3010'));
