import type { Guide } from '@/lib/guides';
export function GuideVisual({guide}:{guide:Guide}){
 if(!guide.visual)return null;
 const v=guide.visual;
 const cards=guide.pageType==='examples'||guide.pageType==='how-to'||guide.pageType==='checklist';
 return <figure className={`guide-visual guide-visual-${guide.pageType}`}>
  <figcaption><strong>{v.title}</strong><span>{v.caption}</span></figcaption>
  {cards?<ol className="guide-example-grid">{v.rows.map((row,i)=><li key={i}><span className="guide-example-number">{String(i+1).padStart(2,'0')}</span><h3>{row[0]}</h3><dl>{row.slice(1).map((cell,j)=><div key={j}><dt>{v.columns[j+1]}</dt><dd>{cell}</dd></div>)}</dl></li>)}</ol>:<div className="guide-table-scroll" tabIndex={0} role="region" aria-label={v.title}><table><thead><tr>{v.columns.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{v.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}>{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
 </figure>;
}
