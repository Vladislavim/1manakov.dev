import {createHash} from 'node:crypto';
export function similarPages(guides){
 const hashes=new Map(),postings=new Map(),sizes=[],pairs=new Map(),duplicates=[];
 guides.forEach((g,index)=>{const words=g.body.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];const hash=createHash('sha256').update(words.join(' ')).digest('hex');if(hashes.has(hash))duplicates.push({a:guides[hashes.get(hash)].slug,b:g.slug,overlap:1});else hashes.set(hash,index);
  const shingles=new Set(words.slice(0,-4).map((_,i)=>words.slice(i,i+5).join(' ')));sizes[index]=shingles.size;
  for(const shingle of shingles){if(!postings.has(shingle))postings.set(shingle,[]);postings.get(shingle).push(index);}
 });
 // Repeated site boilerplate is ignored in the near-match pass; exact copies are always caught.
 for(const indices of postings.values()){if(indices.length>80)continue;for(let i=0;i<indices.length;i++)for(let j=i+1;j<indices.length;j++){const key=`${indices[i]}:${indices[j]}`;pairs.set(key,(pairs.get(key)||0)+1);}}
 for(const[key,count]of pairs){const[i,j]=key.split(':').map(Number),overlap=count/Math.max(1,Math.min(sizes[i],sizes[j]));if(overlap>.25&&!duplicates.some(p=>p.a===guides[i].slug&&p.b===guides[j].slug))duplicates.push({a:guides[i].slug,b:guides[j].slug,overlap});}
 return duplicates;
}
export function classifyMetrics(m){
 if(!m||m.impressions==null)return{status:'UNMEASURED',actions:['Import measured search and engagement data.']};
 const actions=[];
 if(m.impressions>=100&&m.ctr!=null&&m.ctr<.01)actions.push('Test title and description against observed queries.');
 if(m.averagePosition>=10&&m.averagePosition<=30)actions.push('Improve examples and relevant internal links.');
 if(m.indexationStatus==='not-indexed')actions.push('Investigate demand, duplicates and indexability.');
 if(m.unexpectedQueries?.length)actions.push('Review unexpected intents before expanding the page.');
 const status=(m.contacts||0)>0?'WINNER':(m.clicks||0)>0||(m.caseClicks||0)>0?'PROMISING':m.indexationStatus==='not-indexed'&&m.daysSincePublication>=60?'FAIL':m.daysSincePublication>=30?'STAGNANT':'UNMEASURED';
 return{status,actions,ruleVersion:1,limitation:'Heuristic triage, not a causal estimate of design or SEO impact.'};
}
