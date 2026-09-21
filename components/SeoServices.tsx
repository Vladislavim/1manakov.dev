'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRef,type CSSProperties} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {contact} from '@/data/projects';
import {seoTools,seoFlowPaths,seoProof} from '@/data/seo-ecosystem';

gsap.registerPlugin(useGSAP,ScrollTrigger);
export function SeoServices(){
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const host=root.current!;
   let visible=false,entered=false;
   const floats=seoTools.map((tool,i)=>gsap.to(host.querySelector(`[data-seo-logo="${tool.id}"] .seo-flow-mark`),{y:tool.amplitude,x:i%2?2:-2,duration:3.4+i*.17,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true}));
   const sync=()=>floats.forEach(t=>{if(visible&&entered&&!document.hidden)t.resume();else t.pause();});
   const intro=gsap.timeline({paused:true,onComplete:()=>{entered=true;sync();}});
   intro.fromTo(host.querySelectorAll('.seo-flow-lines .flow-line'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.1,stagger:.07,ease:'power2.inOut'},0);
   seoTools.forEach(tool=>intro.fromTo(host.querySelector(`[data-seo-logo="${tool.id}"]`),{opacity:0,x:-10,y:8},{opacity:1,x:0,y:0,duration:.55,ease:'power2.out'},.3+tool.delay));
   intro.fromTo(host.querySelector('.flow-arrow'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.4},.9)
    .fromTo(host.querySelectorAll('.seo-flow-heading,.seo-flow-proof,.seo-flow-client,.seo-flow-cta'),{opacity:0,y:12},{opacity:1,y:0,duration:.5,stagger:.12,ease:'power3.out'},.85);
   ScrollTrigger.create({trigger:host,start:'top 70%',once:true,onEnter:()=>intro.play()});
   ScrollTrigger.create({trigger:host,start:'top bottom',end:'bottom top',onToggle:self=>{visible=self.isActive;sync();}});
   document.addEventListener('visibilitychange',sync);
   return()=>{document.removeEventListener('visibilitychange',sync);floats.forEach(t=>t.kill());};
  });
  return()=>mm.revert();
 },{scope:root});
 return <section ref={root} id="seo" className="seo-services seo-flow-scene" aria-labelledby="seo-services-title">
  <div className="seo-flow-stage">
   <div className="seo-flow-ecosystem">
    <svg className="seo-flow-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">{seoFlowPaths.map((d,i)=><path className="flow-line" key={i} d={d} pathLength="1"/>)}<path className="flow-arrow" d="M910 300H985m-10-9 10 9-10 9" pathLength="1"/></svg>
    <ul aria-label="Search and analytics tools">{seoTools.map(tool=><li key={tool.id} data-seo-logo={tool.id} data-path-group={tool.group} style={{'--tool-x':`${tool.x}%`,'--tool-y':`${tool.y}%`} as CSSProperties}><div className="seo-flow-mark"><span className={`seo-flow-logo logo-${tool.id}`} aria-hidden="true">{tool.id==='gsc'?<svg viewBox="0 0 40 40"><image href="/images/seo-tools/gsc.svg" width="278" height="40"/></svg>:<Image src={`/images/seo-tools/${tool.asset}`} alt="" width={140} height={70} unoptimized/>}</span><span className="seo-flow-tool-name">{tool.label}</span></div></li>)}</ul>
   </div>
   <div className="seo-flow-result"><h2 id="seo-services-title" className="seo-flow-heading">Made to be found.</h2><p className="seo-flow-proof"><strong>{seoProof.share}%</strong><span>ORGANIC</span></p><Link className="seo-flow-client" href="/work/allnrg">Alliance Energy</Link><a className="seo-flow-cta" href={`mailto:${contact.email}?subject=${encodeURIComponent('Website audit')}`}>Discuss audit <span aria-hidden="true">↗</span></a><a className="seo-flow-source" href={seoProof.source} target="_blank" rel="noreferrer">{seoProof.organicVisits} / {seoProof.visits.toLocaleString('en-US')} visits · rounded to {seoProof.share}%<br/>{seoProof.period} · Metrica source ↗</a></div>
  </div>
  <footer className="seo-flow-bottom"><span>SEO<br/>DEVELOPER</span><span className="seo-flow-scroll"><i aria-hidden="true"/>SCROLL</span></footer>
 </section>;
}
