import Image from 'next/image';
import { caseEvidence } from '@/data/case-evidence';
export function CaseEvidence({slug}:{slug:string}){
 const evidence=caseEvidence[slug]?.beforeAfter;
 if(!evidence)return null;
 return <section className={`case-evidence evidence-${evidence.layout}`} aria-labelledby="evidence-heading">
  <div className="evidence-intro"><span className="eyebrow">ДО И ПОСЛЕ / 01—02</span><h2 id="evidence-heading">Было.<br/>Стало.</h2><p>{evidence.context}</p></div>
  <div className="evidence-pair">{[{src:evidence.before,label:'ПРЕДЫДУЩАЯ ВЕРСИЯ',number:'01'},{src:evidence.after,label:'НОВЫЙ ДИЗАЙН',number:'02'}].map(item=><figure key={item.number}><figcaption><span>{item.label}</span><span>{item.number}</span></figcaption><a href={item.src} target="_blank" rel="noreferrer" aria-label={`Открыть в полном размере: ${item.label.toLowerCase()}`}><Image src={item.src} alt={`${slug} — ${item.label.toLowerCase()}`} width={1600} height={900} sizes="(max-width:900px) 92vw, 44vw"/></a></figure>)}</div>
  <div className="evidence-changes"><h3>Что изменилось</h3>{evidence.changes.map((change,i)=><article key={change.title}><span className="eyebrow">0{i+1}</span><h4>{change.title}</h4><p>{change.description}</p></article>)}</div>
 </section>;
}
