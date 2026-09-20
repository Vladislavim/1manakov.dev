import { requestYandex,readJSON,writeJSON } from './api.mjs';
const force=process.argv.includes('--force-refresh');
const seeds=await readJSON('seo/data/seeds.json',[]);
const summary=[];
for(const [topic,query]of seeds){
 try{const result=await requestYandex('wordstat',{phrase:query,numPhrases:'500',regions:['225']},{force});summary.push({topic,query,record:result});console.log(`${topic}: ${result.cacheHit?'cached':'collected'} (${result.data.results?.length||0})`);}
 catch(error){await writeJSON('seo/reports/collection-state.json',{complete:false,completed:summary.length,total:seeds.length,error:error.message});console.error(error.message);process.exitCode=1;break;}
}
await writeJSON('seo/data/collection.json',summary);
if(summary.length===seeds.length)await writeJSON('seo/reports/collection-state.json',{complete:true,completed:summary.length,total:seeds.length,completedAt:new Date().toISOString()});
