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
 const [earlySource,setEarlySource]=useState(false);
 const activeSource=earlySource&&r.earlyStage?{...r.earlyStage,exactPeriod:r.earlyStage.period}:r;
 useGSAP(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
  const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top 75%',once:true}});
  tl.from('.seo-proof-device',{y:24,opacity:0,duration:1.1,ease:'power3.out'})
   .from('.seo-proof-report',{opacity:0,duration:.7},.16)
   .from('.seo-proof-focus',{opacity:0,duration:.8},.38)
   .from('.seo-result-number',{y:16,opacity:0,duration:.8,ease:'power3.out'},.3)
   .from('.seo-result-support',{y:8,opacity:0,duration:.7},.48);
 });return()=>media.revert();},{scope:root});
 function open(button:HTMLButtonElement,early=false){trigger.current=button;setEarlySource(early);setZoom(false);dialog.current?.showModal();}
 return <section ref={root} className="seo-evidence" aria-labelledby="seo-evidence-title">
  <header className="seo-evidence-heading"><h2 id="seo-evidence-title">SEO / VERIFIED RESULT</h2><span>{r.period.toUpperCase()}</span></header>
  <div className="seo-evidence-stage">
   <div className="seo-proof"><div className="seo-proof-device" aria-label="MacBook presentation of the original Yandex Metrica report">
    <div className="seo-proof-lid"><div className="seo-proof-screen"><Image className="seo-proof-report" src={r.sourceImages[0]} alt={`Original ${r.source} report: ${r.organicVisits} visits from search engines; ${r.exactPeriod}`} width={1414} height={2000} unoptimized/></div><span className="seo-proof-camera" aria-hidden="true"/></div><div className="seo-proof-base" aria-hidden="true"><span/></div>
   </div><button ref={trigger} className="seo-source-action" onClick={e=>open(e.currentTarget)}>VIEW METRICA SOURCE <span aria-hidden="true">↗</span></button><noscript><a href={r.sourcePdf}>View original Metrica PDF ↗</a></noscript></div>
   <div className="seo-result"><p className="seo-result-number">{Math.round(r.organicShare)}%</p><p className="seo-result-label">ORGANIC<br/>TRAFFIC</p><div className="seo-result-support"><p className="seo-result-share">{r.organicShare}% <span>EXACT ORGANIC SHARE</span></p><p className="seo-result-period">FIRST FIVE MONTHS AFTER LAUNCH<br/>{r.period.toUpperCase()}<br/>{r.source.toUpperCase()}</p></div></div>
  </div>
  <div className="seo-evidence-context"><p>{r.copy}</p><dl><div><dt>Total visits</dt><dd>{r.visits.toLocaleString('en-US')}</dd></div><div><dt>Organic visits</dt><dd>{r.organicVisits.toLocaleString('en-US')}</dd></div><div><dt>Organic share</dt><dd>{r.organicShare}%</dd></div></dl></div>
  <aside className="seo-later"><div className="seo-later-copy"><span className="eyebrow">LATER MEASUREMENT</span><h3>Still being found.</h3><p>Organic search remained a meaningful acquisition channel in a later measurement period.</p><p className="seo-later-period">169 search visits / 1,107 total visits<br/>Jun–Aug 2026 · Yandex Metrica</p><a className="text-link" href="/images/evidence/allnrg/metrica-jun-aug-2026.pdf" target="_blank" rel="noreferrer">VIEW LATER REPORT ↗</a></div><a className="seo-later-phone" href="/images/evidence/allnrg/metrica-jun-aug-2026.pdf" target="_blank" rel="noreferrer" aria-label="Open original Yandex Metrica report, June–August 2026, 15.3 percent organic traffic"><div className="seo-phone-screen"><span className="seo-phone-island" aria-hidden="true"/><div className="seo-phone-summary"><span>ALLIANCE ENERGY</span><p>15.3<span>%</span></p><span>ORGANIC TRAFFIC</span><small>JUN — AUG 2026</small></div><div className="seo-phone-report"><span>YANDEX METRICA / ORIGINAL REPORT</span><Image src="/images/evidence/allnrg/metrica-jun-aug-2026-1.png" alt="Original Metrica report showing 169 search visits out of 1,107 total visits" width={1414} height={2000} unoptimized/></div><span className="seo-phone-home" aria-hidden="true"/></div></a></aside>
  <p className="seo-evidence-note">Project-owner context: no Yandex Direct was used, promotional spend was minimal, and continuous SEO management ended after the active implementation phase. These contextual facts are supplied by the project owner; they are not established by the analytics report.</p>
  <div className="seo-page-evidence"><div><h3>Search-oriented pages.</h3><p>Jun–Aug 2026 · Pageviews across all traffic sources.<br/>These are not organic visits.</p></div><div>{r.highlightedPages.map(p=><article key={p.title}><p><strong>{p.pageviews}</strong><span>PAGEVIEWS</span></p><h4 lang="ru">{p.title}</h4></article>)}</div></div>
  <p className="seo-evidence-note">Report period: {r.exactPeriod} · {r.source} counter {r.counterId}. Search share: {r.organicVisits} / {r.visits.toLocaleString('en-US')}, rounded to one decimal. This is a recorded result, not a before/after growth claim.</p>
  {r.earlyStage&&<div className="seo-early-stage"><div><span className="eyebrow">FROM ZERO / EARLY STAGE</span><h3>Built from scratch.<br/>A measurable audience.</h3><p>I started this project from zero, building the website and its search structure. The earlier Metrica report documents the audience reached during this stage across all traffic sources.</p><button className="seo-source-action" onClick={e=>open(e.currentTarget,true)}>VIEW EARLIER REPORT ↗</button><noscript><a href={r.earlyStage.sourcePdf}>Original earlier PDF ↗</a></noscript></div><div><dl><div><dt>PAGEVIEWS</dt><dd>{r.earlyStage.pageviews.toLocaleString('en-US')}</dd></div><div><dt>NEW VISITORS</dt><dd>{r.earlyStage.newVisitors.toLocaleString('en-US')}</dd></div><div><dt>RETURNING VISITORS</dt><dd>{r.earlyStage.returningVisitors.toLocaleString('en-US')}</dd></div></dl><p className="seo-evidence-note">{r.earlyStage.period} · Counter {r.earlyStage.counterId}. All-source audience figures for this separate period; not organic visits. Different periods are not combined into a traffic-growth comparison.</p></div></div>}
  <dialog ref={dialog} className={`seo-source-viewer ${zoom?'source-zoomed':''}`} aria-labelledby="seo-source-title" data-lenis-prevent onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
   <div className="seo-source-content"><header><div><h3 id="seo-source-title">{r.source} / Original report</h3><p>{activeSource.exactPeriod} · Counter {activeSource.counterId}</p></div><div><button aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?'FIT WIDTH':'ZOOM IN'}</button><button autoFocus onClick={()=>dialog.current?.close()} aria-label="Close Metrica source">CLOSE ×</button></div></header><div className="seo-source-pages">{activeSource.sourceImages.map((src,i)=><figure key={src}><figcaption>ORIGINAL REPORT / PAGE {i+1} OF {activeSource.sourceImages.length}</figcaption><Image src={src} alt={`${r.source} original unedited report, page ${i+1} of ${activeSource.sourceImages.length}`} width={1414} height={2000} unoptimized/></figure>)}<a href={activeSource.sourcePdf} target="_blank" rel="noreferrer">OPEN ORIGINAL PDF ↗</a></div></div>
  </dialog>
 </section>;
}
