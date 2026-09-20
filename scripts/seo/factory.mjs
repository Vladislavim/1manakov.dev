import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readJSON,writeJSON} from './api.mjs';
const dry=process.argv.includes('--dry-run'),force=process.argv.includes('--force-refresh'),resume=process.argv.includes('--resume');
const source=process.argv.find(a=>a.startsWith('--source='))?.slice(9);
const stages=[['collect','collect.mjs',[],['seo/data/collection.json']],['normalize','demand.mjs',['normalize'],['seo/data/keywords.jsonl']],['cluster','demand.mjs',['cluster'],['seo/data/clusters.json']],['preliminary-score','demand.mjs',['score'],['seo/data/opportunities.json']],['serp','demand.mjs',['serp'],['seo/reports/serp-state.json']],['final-score','demand.mjs',['score'],['seo/data/opportunities.json']],['briefs','briefs.mjs',source?[source]:[],['seo/reports/briefs-state.json']],['selected-serp','selected-serp.mjs',[],['seo/data/selected-serp.json']],...(!dry?(source?[['generate-source','publish-content.mjs',[source],['seo/reports/generation-state.json']],['audit','audit-guides.mjs',[],['seo/reports/content-audit.json']]]:[['generate-golden','publish-content.mjs',['seo/data/golden-content.json'],['content/guides/form-error-messages.json']],['generate-batch','publish-content.mjs',['seo/data/batch-content.json'],['content/guides/form-validation-timing.json']],['generate-final','publish-content.mjs',[source||'seo/data/final-content.json'],['content/guides/modal-dialog-design.json']],['audit','audit-guides.mjs',[],['seo/reports/content-audit.json']]]):[]),['report','report.mjs',[],['seo/reports/final-report.json']]];
const stateFile=`seo/reports/factory-state${dry?'-dry-run':''}.json`;
const state=resume&&!force?await readJSON(stateFile,{completed:[]}):{completed:[]};
const fingerprint=createHash('sha256');for(const file of ['scripts/seo/factory.mjs','scripts/seo/demand.mjs','seo/data/seeds.json','seo/data/golden-content.json','seo/data/batch-content.json',source||'seo/data/final-content.json'])fingerprint.update(await readFile(file));
const inputFingerprint=fingerprint.digest('hex');if(state.inputFingerprint!==inputFingerprint)state.completed=[];state.inputFingerprint=inputFingerprint;
Object.assign(state,{batchId:'ru-2026-09-19-01',mode:dry?'dry-run':'draft-generation',startedAt:state.startedAt||new Date().toISOString(),source:source||'curated-first-batch',concurrency:1});
for(const[name,file,args,outputs]of stages){
 if(resume&&!force&&state.completed.includes(name)&&outputs.every(existsSync)){console.log(`Resume: ${name}`);continue;}
 state.activeStage=name;await writeJSON(stateFile,state);
 const result=spawnSync(process.execPath,[`scripts/seo/${file}`,...args,...(force?['--force-refresh']:[])],{stdio:'inherit',env:process.env});
 if(result.status!==0){state.failedStage=name;await writeJSON(stateFile,state);process.exit(result.status||1);}
 state.completed=[...new Set([...state.completed,name])];state.lastCompletedStage=name;await writeJSON(stateFile,state);
}
delete state.failedStage;delete state.activeStage;state.completedAt=new Date().toISOString();await writeJSON(stateFile,state);
console.log(dry?'Dry run complete: no content files written.':'Draft pipeline complete. Review explicitly before signing; no automatic publication.');
