import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {readJSON,writeJSON} from './api.mjs';
const source=process.argv[2]||'seo/data/golden-content.json';
const entries=await readJSON(source,[]);
const keywords=(await readFile('seo/data/keywords.jsonl','utf8')).trim().split('\n').map(JSON.parse);
await mkdir('content/guides',{recursive:true});
const date=new Date().toISOString().slice(0,10);
for(const item of entries){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)||typeof item.body!=='string'||item.body.split(/\s+/).length<240)throw new Error('Generation requires a safe slug and a completed authored body of at least 240 words.');
 const evidence=keywords.find(k=>k.normalizedQuery===item.keyword);
 if(!evidence)throw new Error(`Missing real demand evidence: ${item.keyword}`);
 const existing=await readJSON(`content/guides/${item.slug}.json`);
 if(existing&&!process.argv.includes('--force-refresh'))continue;
 const metadata={slug:item.slug,title:item.title,description:item.description,h1:item.title,clusterId:evidence.clusterId||`${evidence.topic}-${evidence.intent}`,intent:item.pageType,topic:item.topic,primaryKeyword:evidence.query,secondaryKeywords:[],wordstatVolume:evidence.frequency,demandEvidence:[{query:evidence.query,count:evidence.frequency,retrievedAt:evidence.evidence[0].retrievedAt}],directAnswer:item.answer,userProblem:item.answer,pageType:item.pageType,visualValue:item.visualValue||'static-ui-example',visual:{title:item.visualTitle||'Решение на конкретном примере',columns:item.columns,rows:item.rows,caption:'Авторский учебный пример. Формулировки адаптируйте к данным и ограничениям своего продукта.'},publishedAt:date,updatedAt:date,reviewedAt:date,author:'Владислав Иманаков',status:'draft',indexable:false,canonical:`/guides/${item.slug}`,relatedPages:entries.filter(x=>x.slug!==item.slug).sort((a,b)=>Number(b.topic===item.topic)-Number(a.topic===item.topic)).slice(0,3).map(x=>x.slug),relatedCases:item.topic==='prototyping'?['pdp']:item.topic==='navigation'?['khasaut-tour']:[],sources:[{url:item.source,title:item.sourceTitle,publisher:item.publisher,accessedAt:date,supports:[item.supports]}],qualityScore:0,batchId:'ru-2026-09-19-01',golden:source.includes('golden'),version:1,cta:{headline:item.cta,text:'Пришлите ссылку на сайт и опишите место, где человеку трудно продолжить. Начнём с конкретного сценария и его ограничений.',buttonLabel:item.cta,briefPrompt:item.prompt}};
 await writeJSON(`content/guides/${item.slug}.json`,metadata);
 await writeFile(`content/guides/${item.slug}.mdx`,item.body.trim()+'\n');
 console.log(`Draft: ${item.slug}`);
}
await writeJSON('seo/reports/generation-state.json',{source,slugs:entries.map(p=>p.slug),completedAt:new Date().toISOString(),publication:'draft only; existing files retained unless force-refresh'});
