import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const cacheDir = resolve('data/seo/wordstat');
const endpoint = 'https://searchapi.api.cloud.yandex.net/v2/wordstat/';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function json(path, fallback) { try { return JSON.parse(await readFile(path, 'utf8')); } catch { return fallback; } }

export async function wordstat(method, parameters) {
  if (!['topRequests', 'dynamics', 'regions', 'getRegionsTree'].includes(method)) throw new Error('Unsupported Wordstat method');
  const key = process.env.WORDSTAT_API_KEY, folder = process.env.YANDEX_FOLDER_ID;
  if (!key || !folder) throw new Error('Set WORDSTAT_API_KEY and YANDEX_FOLDER_ID in the environment');
  await mkdir(cacheDir, { recursive: true });
  const identity = createHash('sha256').update(JSON.stringify({ method, parameters })).digest('hex');
  const path = resolve(cacheDir, `${identity}.json`);
  const cached = await json(path, null);
  if (cached && Date.now() - Date.parse(cached.retrievedAt) < 30 * 86400000) return { ...cached, cacheHit: true };
  const ledgerPath = resolve(cacheDir, 'quota-ledger.json');
  for (let attempt = 0; attempt < 5; attempt++) {
    const recent = (await json(ledgerPath, [])).filter(time => Date.now() - time < 3600000);
    if (recent.length >= 90) throw new Error('Local hourly safety budget reached; cached results are preserved');
    await wait(Math.max(0, 1100 - (Date.now() - (recent.at(-1) || 0))));
    recent.push(Date.now());
    await writeFile(ledgerPath, JSON.stringify(recent));
    let response;
    try {
      response = await fetch(endpoint + method, { method: 'POST', signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Api-Key ${key}`, 'Content-Type': 'application/json', 'x-client-request-id': randomUUID() },
        body: JSON.stringify({ ...parameters, folderId: folder }) });
    } catch {
      if (attempt === 4) throw new Error('Wordstat network timeout; cached results preserved');
      await wait(1000 * 2 ** attempt); continue;
    }
    if ([429, 503, 504].includes(response.status) && attempt < 4) {
      const retry = Number(response.headers.get('retry-after'));
      await wait(Math.min(60000, Math.max(Number.isFinite(retry) ? retry * 1000 : 0, 1500 * 2 ** attempt)));
      continue;
    }
    if (!response.ok) throw new Error(`Wordstat HTTP ${response.status}; request ${response.headers.get('x-request-id') || 'unavailable'}. Credentials and response body omitted.`);
    const record = { method, parameters, retrievedAt: new Date().toISOString(), data: await response.json() };
    await writeFile(path, JSON.stringify(record, null, 2));
    return record;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) {
  const seeds = JSON.parse(await readFile('data/seo/seeds.json', 'utf8'));
  const results = [];
  for (const seed of seeds) {
    try {
      const record = await wordstat('topRequests', { phrase: seed.query, numPhrases: '40', regions: ['225'] });
      results.push({ topic: seed.topic, ...record });
      console.log(`${seed.topic}: ${record.cacheHit ? 'cache' : 'fetched'}`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
      break;
    }
  }
  await mkdir('data/seo/research', { recursive: true });
  await writeFile('data/seo/research/wordstat-batch.json', JSON.stringify({ generatedAt: new Date().toISOString(), region: 225, results }, null, 2));
}
