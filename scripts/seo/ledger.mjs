import {readJSON,writeJSON} from './api.mjs';
import {appendFile,mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {getGuides,guideHash} from '../../lib/guides.ts';
import {classifyMetrics} from './checks.mjs';
const path='seo/data/experiment-ledger.jsonl';await mkdir('seo/data',{recursive:true});
let existing=[];try{existing=(await readFile(path,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);}catch(e){if(e.code!=='ENOENT')throw e;}
const append=async event=>{if(existing.some(e=>e.id===event.id))return;await appendFile(path,JSON.stringify(event)+'\n');existing.push(event);};
const date=new Date().toISOString();
if(process.argv.includes('--snapshot'))for(const p of getGuides().filter(p=>p.indexable)){
 const brief=await readJSON(`seo/data/briefs/${p.slug}.json`);
 const contentHash=guideHash(p),old=existing.some(e=>e.slug===p.slug&&e.type==='publication');
 await append({id:`content:${p.slug}:${contentHash}`,type:old?'content-update':'publication',recordedAt:date,publicationDate:p.publishedAt,batchId:p.batchId,slug:p.slug,clusterId:p.clusterId,targetQueries:[p.primaryKeyword,...p.secondaryKeywords],wordstatDemand:p.wordstatVolume,demandDefinition:'Overlapping broad-match phrase count in Russia; not unique audience',opportunityScore:brief?.opportunityScore??null,pageVersion:p.version,contentHash,ctaVariant:p.cta,relatedCases:p.relatedCases,baseline:{impressions:null,clicks:null,ctr:null,averagePosition:null,indexationStatus:'unknown',ctaClicks:null,caseClicks:null,contacts:null},checkpoints:[30,60,90].map(days=>({day:days,dueAt:new Date(Date.parse(p.publishedAt)+days*86400000).toISOString().slice(0,10)})),deploymentStatus:'repository-ready; live deployment must be recorded separately'});
}
const input=process.argv.find(a=>a.startsWith('--import='))?.slice(9);
if(input){const rows=await readJSON(input);if(!Array.isArray(rows))throw Error('Metric import must be an array');for(const row of rows){if(!getGuides().some(g=>g.slug===row.slug)||!row.measuredAt||!['gsc','yandex-webmaster','analytics','manual'].includes(row.source))throw Error('Invalid metric identity/provenance');for(const field of ['impressions','clicks','ctaClicks','caseClicks','contacts','daysSincePublication'])if(row[field]!=null&&(!Number.isFinite(row[field])||row[field]<0))throw Error(`Invalid ${field}`);if(row.ctr!=null&&(row.ctr<0||row.ctr>1))throw Error('CTR uses 0..1');const id=createHash('sha256').update(JSON.stringify(row)).digest('hex');await append({id:`metrics:${id}`,type:'measurement',recordedAt:date,...row,evaluation:classifyMetrics(row)});}}
await writeJSON('seo/reports/experiment-status.json',getGuides().filter(g=>g.indexable).map(g=>{const measured=existing.filter(e=>e.slug===g.slug&&e.type==='measurement').sort((a,b)=>a.measuredAt.localeCompare(b.measuredAt)).at(-1);return{slug:g.slug,evaluation:measured?.evaluation||classifyMetrics(null),latestMeasurement:measured?.measuredAt||null};}));
console.log(`Ledger: ${existing.length} immutable events`);
