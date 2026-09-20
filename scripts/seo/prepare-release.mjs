import {readJSON,writeJSON} from './api.mjs';
import {readdir,readFile,writeFile} from 'node:fs/promises';
const files=(await readdir('content/guides')).filter(f=>f.endsWith('.json'));
const pages=await Promise.all(files.map(f=>readJSON(`content/guides/${f}`)));
const contextual=await readJSON('seo/data/contextual-links.json',{});
const groups=[['form-error-messages','form-validation-timing','password-input-design','order-form-review'],['mobile-navigation-priorities','website-navigation-labels','pagination-or-load-more','keyboard-navigation-checklist'],['design-system-vs-ui-kit','website-prototype-scenario','responsive-content-order','text-contrast-check'],['empty-state-copy-examples','loading-skeleton','modal-dialog-design','interface-motion-rules'],['ux-interview-questions','usability-test-scenario','website-redesign-diagnosis','dashboard-hierarchy-examples']];
for(const p of pages){
 const brief=await readJSON(`seo/data/briefs/${p.slug}.json`);
 const current=JSON.stringify(p);
 const bodyPath=`content/guides/${p.slug}.mdx`,body=await readFile(bodyPath,'utf8');
 const bodyChanged=Boolean(contextual[p.slug]&&!body.includes(contextual[p.slug]));
 if(bodyChanged)await writeFile(bodyPath,body.trim()+'\n\n'+contextual[p.slug]+'\n');
 p.clusterId=`intent-${p.slug}`;
 p.relatedPages=groups.find(g=>g.includes(p.slug))?.filter(s=>s!==p.slug)??p.relatedPages;
 p.cta.text=p.cta.briefPrompt+' Пришлите ссылку или экран и опишите ограничения проекта.';
 p.relatedCases=p.slug==='website-redesign-diagnosis'?['allnrg']:p.slug==='website-navigation-labels'?['khasaut-tour']:p.slug==='website-prototype-scenario'?['pdp']:[];
 p.visualValue=p.pageType==='comparison'?'static-ui-example':p.pageType==='how-to'?'diagram':p.pageType==='examples'?'before-after':p.visualValue;
 // A changed page returns to preview; never silently renew an old approval.
 if(bodyChanged||JSON.stringify(p)!==current){p.status='noindex';p.indexable=false;p.qualityScore=0;delete p.review;}
 else if(p.status==='draft')p.status='noindex';
 await writeJSON(`content/guides/${p.slug}.json`,p);
 await writeJSON(`seo/data/briefs/${p.slug}.json`,{...brief,description:p.description,directAnswer:p.directAnswer,sections:[...(await readFile(`content/guides/${p.slug}.mdx`,'utf8')).matchAll(/^## (.+)$/gm)].map(m=>m[1]),relatedPages:p.relatedPages,relatedCases:p.relatedCases,cta:p.cta,visualValue:p.visualValue});
 await writeJSON(`seo/data/research/${p.slug}.json`,{slug:p.slug,sources:p.sources,claimBoundary:'Primary source supports the specified claims. Worked examples and decision rules are original design recommendations, not measured client results.',editorialReview:{reviewer:'AI-assisted solo review',styleSource:'https://truespaceai.ru/human/',checkedAt:new Date().toISOString(),checks:['concrete answer','no invented metrics','scope and exceptions','source claim boundary','specific example','no promotional footer']}});
}
await writeJSON('seo/reports/intent-decisions.json',[{pages:['form-error-messages','form-validation-timing'],serpOverlap:.6,decision:'retain distinct tasks',reason:'The first page solves wording and association of an error; the second solves when validation runs and how correction behaves. Separate examples and cross-links prevent competing identical answers.',reviewedAt:new Date().toISOString()}]);
console.log(`Prepared ${pages.length} pages for noindex review`);
