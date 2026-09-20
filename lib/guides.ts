import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type GuideStatus='candidate'|'brief'|'draft'|'reviewed'|'indexable'|'noindex'|'merge'|'rejected';
export type Guide={
 slug:string; title:string; description:string; h1:string; clusterId:string; intent:string; topic:string;
 primaryKeyword:string; secondaryKeywords:string[]; wordstatVolume:number; demandEvidence:{query:string;count:number;retrievedAt:string}[];
 directAnswer:string; userProblem:string; pageType:'problem-solving'|'comparison'|'how-to'|'checklist'|'examples'|'diagnostic';
 visualValue:'none'|'diagram'|'static-ui-example'|'before-after'|'interactive';
 visual?:{title:string;columns:string[];rows:string[][];caption:string};
 publishedAt:string; updatedAt:string; reviewedAt:string; author:string; status:GuideStatus; indexable:boolean;
 canonical:string; relatedPages:string[]; relatedCases:string[]; sources:{url:string;title:string;publisher:string;accessedAt:string;supports:string[]}[];
 qualityScore:number; batchId:string; golden:boolean; version:number;
 cta:{headline:string;text:string;buttonLabel:string;briefPrompt:string};
 review?:{hash:string;reviewer:string;checkedAt:string;checks:string[];notes:string};
 body:string;
};
export const GUIDE_PAGE_SIZE=12;
export const guideTopics:Record<string,string>={forms:'Формы и ввод',navigation:'Навигация',accessibility:'Доступность',interaction:'Состояния и обратная связь',systems:'Дизайн-системы',research:'Исследования',prototyping:'Прототипы',commerce:'Покупка и заказ',product:'Структура продукта'};
export const requiredGuideChecks=['intent','unique-value','similarity','facts','metadata','links','editorial','sources'];
export function guideHash(guide:Guide){const {review:_review,status:_status,indexable:_indexable,qualityScore:_score,...content}=guide;void _review;void _status;void _indexable;void _score;return createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(content).sort(([a],[b])=>a.localeCompare(b))))).digest('hex');}
let cached:Guide[]|undefined;
export function getGuides():Guide[]{
 if(cached)return cached;
 const dir=join(process.cwd(),'content/guides');
 if(!existsSync(dir))return [];
 cached=readdirSync(dir).filter(n=>n.endsWith('.json')).sort().map(name=>{const metadata=JSON.parse(readFileSync(join(dir,name),'utf8'));if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)||name!==`${metadata.slug}.json`)throw new Error('Invalid guide filename');return{...metadata,body:readFileSync(join(dir,`${metadata.slug}.mdx`),'utf8').trim()};});
 return cached;
}
export function guideProblems(g:Guide){const errors:string[]=[];
 for(const field of ['slug','title','description','h1','clusterId','intent','topic','primaryKeyword','directAnswer','userProblem','canonical','batchId','author'] as const)if(typeof g[field]!=='string'||!g[field].trim())errors.push(`missing ${field}`);
 if(!guideTopics[g.topic])errors.push('unknown topic');
 if(!['problem-solving','comparison','how-to','checklist','examples','diagnostic'].includes(g.pageType))errors.push('unknown page type');
 if(!['none','diagram','static-ui-example','before-after','interactive'].includes(g.visualValue))errors.push('unknown visual type');
 if(!['candidate','brief','draft','reviewed','indexable','noindex','merge','rejected'].includes(g.status))errors.push('invalid status');
 if(g.canonical!==`/guides/${g.slug}`)errors.push('canonical mismatch');
 if(!Array.isArray(g.sources)||!Array.isArray(g.relatedPages)||!Array.isArray(g.relatedCases)||!Array.isArray(g.demandEvidence))errors.push('missing structured content');
 if(/^# |^\s*(import |export )|<\/?[a-zA-Z][^>]*>/m.test(g.body))errors.push('unsafe Markdown/MDX syntax');
 if(g.status==='indexable'||g.indexable){
  if(g.status!=='indexable'||g.indexable!==true)errors.push('status/indexable conflict');
  if(!g.review||g.review.hash!==guideHash(g)||!requiredGuideChecks.every(c=>g.review!.checks.includes(c)))errors.push('missing or stale editorial approval');
  if(g.qualityScore<90)errors.push('quality gate incomplete');
  if(g.body.split(/\s+/).length<240)errors.push('thin content requires expansion');
  if((g.body.match(/^## /gm)||[]).length<3)errors.push('missing useful structure');
  if(!g.sources?.length||g.sources.some(s=>!/^https:\/\//.test(s.url)||!s.supports?.length||!s.publisher||!s.accessedAt))errors.push('source provenance incomplete');
  if(!g.demandEvidence?.length||g.demandEvidence.every(e=>e.count<=0))errors.push('no real demand evidence');
  if(!g.relatedPages?.length)errors.push('missing link context');
  if(g.relatedPages?.includes(g.slug))errors.push('self-related link');
  if(!g.cta?.headline||!g.cta?.briefPrompt)errors.push('missing contextual CTA');
  if(g.description.length<70||g.description.length>220||g.title.length>100)errors.push('metadata length');
  if(g.directAnswer.length<80||g.directAnswer.length>900)errors.push('answer-first block needs review');
  if([g.publishedAt,g.updatedAt,g.reviewedAt].some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(Date.parse(d))))errors.push('invalid editorial dates');
 }
 return errors;
}
let publishedCache:Guide[]|undefined;
export const publishedGuides=()=>publishedCache??(publishedCache=getGuides().filter(g=>g.status==='indexable'&&g.indexable&&guideProblems(g).length===0));
