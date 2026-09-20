import { createHash,randomUUID } from 'node:crypto';
import { mkdir,readFile,writeFile,rename } from 'node:fs/promises';
import { join } from 'node:path';
export const readJSON=async(path,fallback=null)=>{for(let attempt=0;attempt<5;attempt++){try{return JSON.parse(await readFile(path,'utf8'));}catch(error){if(error.code==='ENOENT')return fallback;if(attempt===4)throw error;await new Promise(r=>setTimeout(r,250*2**attempt));}}};
export const writeJSON=async(path,value)=>{await mkdir(join(path,'..'),{recursive:true});const temporary=path+'.tmp';for(let attempt=0;attempt<5;attempt++){try{await writeFile(temporary,JSON.stringify(value,null,2)+'\n');await rename(temporary,path);return;}catch(error){if(attempt===4)throw error;await new Promise(r=>setTimeout(r,250*2**attempt));}}};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function requestYandex(kind,parameters,{force=false}={}){
 const key=process.env.YANDEX_API_KEY||process.env.WORDSTAT_API_KEY,folder=process.env.YANDEX_FOLDER_ID;
 const hash=createHash('sha256').update(JSON.stringify(parameters)).digest('hex');
 const path=`seo/data/raw/${kind}/${hash}.json`;
 const previous=await readJSON(path);
 if(previous&&!force)return{...previous,cacheHit:true};
 if(!key||!folder)throw new Error('Missing YANDEX_API_KEY (or WORDSTAT_API_KEY) / YANDEX_FOLDER_ID');
 for(let attempt=0;attempt<5;attempt++){
  const ledgerPath=`seo/cache/${kind}-requests.json`;
  const ledger=(await readJSON(ledgerPath,[])).filter(t=>Date.now()-t<3600000);
  if(kind==='wordstat'&&ledger.length>=85)throw new Error('WORDSTAT_HOURLY_BUDGET: resume after quota window; completed cache is retained');
  await sleep(Math.max(0,1100-(Date.now()-(ledger.at(-1)||0))));
  ledger.push(Date.now());await writeJSON(ledgerPath,ledger);
  let response;
  try{response=await fetch(`https://searchapi.api.cloud.yandex.net/v2/${kind==='wordstat'?'wordstat/topRequests':'web/search'}`,{method:'POST',headers:{Authorization:`Api-Key ${key}`,'Content-Type':'application/json','x-client-request-id':randomUUID()},body:JSON.stringify({...parameters,folderId:folder}),signal:AbortSignal.timeout(45000)});}catch{if(attempt===4)throw new Error('Yandex network unavailable; resume safely');await sleep(1000*2**attempt);continue;}
  if((response.status===429||response.status>=500)&&attempt<4){await sleep(Math.min(60000,Math.max(1500*2**attempt,Number(response.headers.get('retry-after')||0)*1000)));continue;}
  if(!response.ok)throw new Error(`Yandex ${kind} HTTP ${response.status}; response content omitted for credential safety`);
  const data=await response.json();
  const record={source:kind,parameters,retrievedAt:new Date().toISOString(),data};
  await writeJSON(path,record);return record;
 }
}
