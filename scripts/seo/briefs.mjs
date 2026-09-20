import {readFile} from 'node:fs/promises';
import {readJSON,writeJSON} from './api.mjs';
const source=process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:null;
const all=source?await readJSON(source,[]):[...await readJSON('seo/data/golden-content.json',[]),...await readJSON('seo/data/batch-content.json',[]),...await readJSON('seo/data/batch-plan.json',[])];
const keywords=(await readFile('seo/data/keywords.jsonl','utf8')).trim().split('\n').map(JSON.parse);
const opportunities=await readJSON('seo/data/opportunities.json',[]);
for(const p of all){
 if(await readJSON(`seo/data/briefs/${p.slug}.json`)&&!process.argv.includes('--force-refresh'))continue;
 const k=keywords.find(k=>k.normalizedQuery===p.keyword);if(!k)throw Error(`No demand: ${p.slug}`);
 const sections=p.body?[...p.body.matchAll(/^## (.+)$/gm)].map(m=>m[1]):['Конкретная задача и границы решения','Пример с объяснением выбора','Проверка в рабочем сценарии'];
 const brief={slug:p.slug,clusterId:`intent-${p.slug}`,parentClusterId:k.clusterId,primaryKeyword:p.keyword,secondaryKeywords:[],intent:p.pageType,topic:p.topic,userProblem:p.title,directAnswer:p.answer||null,title:p.title,description:p.description||null,h1:p.title,sections,researchNeeded:[{url:p.source,task:'Read primary source; distinguish supported requirements from original design recommendations.'}],examples:p.rows||[],visualIdeas:[p.visualTitle||'Concrete interface decision with alternatives and consequences'],visualValue:p.visualValue||'static-ui-example',relatedCases:[],relatedPages:[],cta:p.cta?{headline:p.cta,prompt:p.prompt}:null,schema:['Article','BreadcrumbList'],indexable:false,canonical:`/guides/${p.slug}`,qualityScore:0,demandEvidence:k.evidence,wordstatVolume:k.frequency,opportunityScore:opportunities.find(o=>o.clusterId===k.clusterId)?.score??null,status:'brief',createdAt:new Date().toISOString(),provenance:p.body?'Retrospective brief from existing authored draft; not represented as pre-writing research':'Pre-writing plan; research and editorial gates still required'};
 await writeJSON(`seo/data/briefs/${p.slug}.json`,brief);
}
await writeJSON('seo/reports/briefs-state.json',{count:all.length,slugs:all.map(p=>p.slug),completedAt:new Date().toISOString()});console.log(`Briefs: ${all.length}`);
