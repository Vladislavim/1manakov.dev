import {getGuides,guideHash,guideProblems,requiredGuideChecks} from '../../lib/guides.ts';
import {writeJSON} from './api.mjs';
import {existsSync} from 'node:fs';
import {similarPages} from './checks.mjs';
const guides=getGuides(),errors=[],pairs=[];
const approving=process.argv.includes('--approve'),selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
if(selected)for(const slug of selected)if(!guides.some(g=>g.slug===slug))errors.push(`Unknown approval slug: ${slug}`);
const signing=g=>approving&&(!selected||selected.includes(g.slug));
const publishable=g=>signing(g)||(g.indexable&&guideProblems(g).length===0);
const uniqueFields=['title','description','h1','canonical','primaryKeyword','clusterId'];
for(const field of uniqueFields){const seen=new Map();for(const g of guides){const key=String(g[field]).trim().toLowerCase();if(seen.has(key))errors.push(`${g.slug}: duplicate ${field} with ${seen.get(key)}`);seen.set(key,g.slug);}}
const words=s=>new Set(s.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[]);
const approvalCandidate=g=>({...g,status:'indexable',indexable:true,qualityScore:90,review:{hash:guideHash(g),reviewer:'Solo editorial review — AI-assisted',checkedAt:new Date().toISOString(),checks:requiredGuideChecks,notes:'Original answer-first explanation, source support, demand provenance, visual example and publication links checked. No measured client outcomes claimed.'}});
for(const pair of similarPages(guides)){pairs.push(pair);errors.push(`Near-duplicate: ${pair.a}/${pair.b}`);}
for(const g of guides){
 errors.push(...guideProblems(g).map(e=>`${g.slug}: ${e}`));
 if(signing(g))errors.push(...guideProblems(approvalCandidate(g)).map(e=>`${g.slug}: publication preflight: ${e}`));
 if(words(g.body).size<100)errors.push(`${g.slug}: insufficient lexical substance`);
 for(const slug of g.relatedPages)if(!guides.some(p=>p.slug===slug))errors.push(`${g.slug}: broken related guide ${slug}`);
 if(publishable(g))for(const slug of g.relatedPages)if(!guides.some(p=>p.slug===slug&&publishable(p)))errors.push(`${g.slug}: related guide is not published: ${slug}`);
 for(const href of [...g.body.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]))if(href.startsWith('/guides/')&&!guides.some(p=>p.canonical===href))errors.push(`${g.slug}: broken link ${href}`);
 if(g.body.split(/\s+/).length<240)errors.push(`${g.slug}: fewer than 240 words`);
}
// Signing is an explicit editorial operation after source and visual review, never a score side-effect.
if(process.argv.includes('--approve')&&errors.length===0){
 for(const g of guides.filter(g=>!selected||selected.includes(g.slug))){const{body,...meta}=approvalCandidate(g);void body;await writeJSON(`content/guides/${g.slug}.json`,meta);Object.assign(g,meta);}
}
const report={checkedAt:new Date().toISOString(),total:guides.length,indexable:guides.filter(g=>g.indexable).length,errors,similarityPairs:pairs,minimumWords:Math.min(...guides.map(g=>g.body.split(/\s+/).length)),sourceFilesPresent:existsSync('seo/data/keywords.jsonl')};
await writeJSON('seo/reports/content-audit.json',report);console.log(report);if(errors.length)process.exitCode=1;
