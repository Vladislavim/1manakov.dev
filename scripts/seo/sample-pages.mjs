import {readJSON,writeJSON} from './api.mjs';
import {createHash} from 'node:crypto';
const rows=await readJSON('seo/data/selected-serp.json',[]);
const clean=s=>s.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
const reports=[];
for(const row of rows){
 const docs=[];
 for(const result of row.documents.slice(0,2)){
  const url=new URL(result.url);if(url.protocol!=='https:'||/localhost|^127\.|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^\[/.test(url.hostname))continue;
  const file=`seo/cache/page-samples/${createHash('sha256').update(url.href).digest('hex')}.json`;
  let sample=await readJSON(file);
  if(!sample){try{const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Mozilla/5.0 (compatible; PortfolioResearch/1.0)'},redirect:'error'});const html=(await response.text()).slice(0,2000000),body=clean(html);sample={url:url.href,status:response.status,checkedAt:new Date().toISOString(),h1:[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>clean(m[1])).slice(0,3),h2:[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>clean(m[1])).slice(0,12),approximateWords:body.split(/\s+/).length,tables:(html.match(/<table\b/gi)||[]).length,lists:(html.match(/<(?:ul|ol)\b/gi)||[]).length,images:(html.match(/<img\b/gi)||[]).length,video: /<video|youtube\.com\/embed|rutube\.ru\/play\/embed/i.test(html),forms:(html.match(/<form\b/gi)||[]).length,limitation:'HTML sample only; counts include navigation and do not prove content quality. Redirects are recorded as unavailable.'};}catch{sample={url:url.href,status:'unavailable',checkedAt:new Date().toISOString()};}await writeJSON(file,sample);}
  docs.push(sample);
 }
 reports.push({slug:row.slug,query:row.query,samples:docs});await writeJSON('seo/reports/serp-page-samples.json',reports);console.log(`Page samples ${reports.length}/${rows.length}`);
}
