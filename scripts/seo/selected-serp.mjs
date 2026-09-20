import {readJSON,writeJSON,requestYandex} from './api.mjs';
import {readdir} from 'node:fs/promises';
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const briefs=await Promise.all((await readdir('seo/data/briefs')).filter(f=>f.endsWith('.json')).map(f=>readJSON(`seo/data/briefs/${f}`)));
const assessments=await readJSON('seo/data/serp-assessments.json',[]),selected=await readJSON('seo/data/selected-serp.json',[]);
for(const b of briefs){
 if(selected.some(s=>s.slug===b.slug)&&!process.argv.includes('--force-refresh'))continue;
 let record=assessments.findLast(s=>s.query===b.primaryKeyword);
 if(!record){const r=await requestYandex('serp',{query:{searchType:'SEARCH_TYPE_RU',queryText:b.primaryKeyword,page:'0'},region:'225',responseFormat:'FORMAT_XML',groupSpec:{groupMode:'GROUP_MODE_FLAT',groupsOnPage:'10',docsInGroup:'1'}},{force:process.argv.includes('--force-refresh')});const xml=Buffer.from(r.data.rawData||'','base64').toString('utf8');if(/<error\b/.test(xml))throw Error('SERP API error');record={checkedAt:r.retrievedAt,documents:[...xml.matchAll(/<doc\b[^>]*>([\s\S]*?)<\/doc>/g)].map(([,d])=>({url:clean(/<url>([\s\S]*?)<\/url>/.exec(d)?.[1]||''),title:clean(/<title>([\s\S]*?)<\/title>/.exec(d)?.[1]||'')})).filter(d=>d.url)};}
 const row={slug:b.slug,query:b.primaryKeyword,...record};
 const index=selected.findIndex(s=>s.slug===b.slug);if(index>=0)selected[index]=row;else selected.push(row);
 await writeJSON('seo/data/selected-serp.json',selected);console.log(`Selected SERP: ${selected.length}/${briefs.length}`);
}
const overlaps=[];
for(let i=0;i<selected.length;i++)for(let j=i+1;j<selected.length;j++){const a=selected[i],b=selected[j],urls=new Set(a.documents.map(d=>d.url));const overlap=b.documents.filter(d=>urls.has(d.url)).length/Math.max(1,Math.min(a.documents.length,b.documents.length));if(overlap>=.3)overlaps.push({a:a.slug,b:b.slug,overlap,decision:overlap>=.6?'manual-review-required':'Distinct task may coexist; review outline'});}
await writeJSON('seo/reports/selected-overlap.json',overlaps);
