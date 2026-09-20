'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {SeoResult} from '@/data/allnrg-seo';

gsap.registerPlugin(useGSAP,ScrollTrigger);
export function SeoEvidence({result:r}:{result:SeoResult}){
 const root=useRef<HTMLElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [zoom,setZoom]=useState(false);
 useGSAP(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
  const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top 75%',once:true}});
  tl.from('.seo-proof-device',{y:24,opacity:0,duration:.55,ease:'power3.out'})
   .from('.seo-proof-report',{opacity:0,duration:.3},.16)
   .from('.seo-proof-focus',{opacity:0,duration:.4},.38)
   .from('.seo-result-number',{y:16,opacity:0,duration:.4,ease:'power3.out'},.3)
   .from('.seo-result-support',{y:8,opacity:0,duration:.3},.48);
 });return()=>media.revert();},{scope:root});
 function open(){setZoom(false);dialog.current?.showModal();}
 return <section ref={root} className="seo-evidence" aria-labelledby="seo-evidence-title">
  <header className="seo-evidence-heading"><h2 id="seo-evidence-title">SEO / VERIFIED RESULT</h2><span>{r.period.toUpperCase()}</span></header>
  <div className="seo-evidence-stage">
   <div className="seo-proof"><div className="seo-proof-device" aria-label="MacBook presentation of the original Yandex Metrica report">
    <div className="seo-proof-lid"><div className="seo-proof-screen"><Image className="seo-proof-report" src={r.sourceImages[0]} alt={`Original ${r.source} report: ${r.organicVisits} visits from search engines; ${r.exactPeriod}`} width={1414} height={2000} unoptimized/><span className="seo-proof-focus" aria-hidden="true"/></div><span className="seo-proof-camera" aria-hidden="true"/></div><div className="seo-proof-base" aria-hidden="true"><span/></div>
   </div><button ref={trigger} className="seo-source-action" onClick={open}>VIEW METRICA SOURCE <span aria-hidden="true">↗</span></button><noscript><a href={r.sourcePdf}>View original Metrica PDF ↗</a></noscript></div>
   <div className="seo-result"><p className="seo-result-number">{r.organicVisits}</p><p className="seo-result-label">ORGANIC<br/>SEARCH VISITS</p><div className="seo-result-support"><p className="seo-result-share">{r.organicShare}% <span>OF ALL VISITS</span></p><p className="seo-result-period">{r.period.toUpperCase()}<br/>{r.source.toUpperCase()}</p></div></div>
  </div>
  <div className="seo-evidence-context"><p>{r.copy}</p><dl><div><dt>Total visits</dt><dd>{r.visits.toLocaleString('en-US')}</dd></div><div><dt>Visitors</dt><dd>{r.visitors.toLocaleString('en-US')}</dd></div><div><dt>Pageviews</dt><dd>{r.pageviews.toLocaleString('en-US')}</dd></div></dl></div>
  <div className="seo-page-evidence"><div><h3>Search-oriented pages.</h3><p>Pageviews across all traffic sources.<br/>These are not organic visits.</p></div><div>{r.highlightedPages.map(p=><article key={p.title}><p><strong>{p.pageviews}</strong><span>PAGEVIEWS</span></p><h4 lang="ru">{p.title}</h4></article>)}</div></div>
  <p className="seo-evidence-note">Report period: {r.exactPeriod} · {r.source} counter {r.counterId}. Search share: {r.organicVisits} / {r.visits.toLocaleString('en-US')}, rounded to one decimal. This is a recorded result, not a before/after growth claim.</p>
  <dialog ref={dialog} className={`seo-source-viewer ${zoom?'source-zoomed':''}`} aria-labelledby="seo-source-title" data-lenis-prevent onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
   <div className="seo-source-content"><header><div><h3 id="seo-source-title">{r.source} / Original report</h3><p>{r.exactPeriod} · Counter {r.counterId}</p></div><div><button aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?'FIT WIDTH':'ZOOM IN'}</button><button autoFocus onClick={()=>dialog.current?.close()} aria-label="Close Metrica source">CLOSE ×</button></div></header><div className="seo-source-pages">{r.sourceImages.map((src,i)=><figure key={src}><figcaption>ORIGINAL REPORT / PAGE {i+1} OF {r.sourceImages.length}</figcaption><Image src={src} alt={`${r.source} original unedited report, page ${i+1} of ${r.sourceImages.length}`} width={1414} height={2000} unoptimized/></figure>)}<a href={r.sourcePdf} target="_blank" rel="noreferrer">OPEN ORIGINAL PDF ↗</a></div></div>
  </dialog>
 </section>;
}
