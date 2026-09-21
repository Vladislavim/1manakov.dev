'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRef,type CSSProperties} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {contact} from '@/data/projects';
import {seoTools,seoProof} from '@/data/seo-ecosystem';

gsap.registerPlugin(useGSAP,ScrollTrigger);
export function SeoServices(){
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{
  const host=root.current!;
  const ecosystem=host.querySelector<HTMLElement>('.seo-flow-ecosystem')!;
  const nodes=seoTools.map(tool=>({
   tool,mark:host.querySelector<HTMLElement>(`[data-seo-logo="${tool.id}"] .seo-flow-mark`)!,
   logo:host.querySelector<HTMLElement>(`[data-seo-logo="${tool.id}"] .seo-flow-logo`)!,
   path:host.querySelector<SVGPathElement>(`[data-seo-line="${tool.id}"]`)!,
   baseX:0,baseY:0,x:0,y:0,hoverX:0,hoverY:0,targetX:0,targetY:0,settle:0,
  }));
  let width=1,height=1;
  function draw(){
   nodes.forEach(n=>{
    const x=(n.baseX+n.x)/width*1000,y=(n.baseY+n.y)/height*620;
    // A dedicated cubic curve starts at the moving mark and shares a fixed outlet.
    n.path.setAttribute('d',`M${x} ${y} C${x+(910-x)*.42} ${y} 790 300 910 300`);
   });
  }
  function measure(){
   const bounds=ecosystem.getBoundingClientRect();width=bounds.width||1;height=bounds.height||1;
   nodes.forEach(n=>{const r=n.logo.getBoundingClientRect();n.baseX=r.left+r.width/2-bounds.left-n.x;n.baseY=r.top+r.height/2-bounds.top-n.y;});
   draw();
  }
  measure();
  const resize=new ResizeObserver(measure);resize.observe(ecosystem);nodes.forEach(n=>resize.observe(n.logo));
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   let visible=false,entered=false,running=false,time=0;
   const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
   const render=(_time:number,delta:number)=>{
    const dt=Math.min(delta,50)/1000;
    if(entered)time+=dt;
    const ease=1-Math.exp(-dt*8);
    nodes.forEach((n,i)=>{
     n.hoverX+=(n.targetX-n.hoverX)*ease;n.hoverY+=(n.targetY-n.hoverY)*ease;
     // Different periods and phases prevent a synchronized bobbing effect.
     const ramp=Math.min(time/1.5,1);
     n.x=n.hoverX+Math.sin(time/(2.8+i*.11)+i*1.7)*n.tool.amplitude*.65*ramp;
     n.y=n.settle+n.hoverY+Math.sin(time/(3.5+i*.13)+i*2.1)*n.tool.amplitude*ramp;
     n.mark.style.transform=`translate3d(${n.x}px,${n.y}px,0)`;
    });
    draw();
   };
   const intro=gsap.timeline({paused:true,onComplete:()=>{entered=true;}});
   const sync=()=>{
    const active=visible&&!document.hidden;
    if(active&&!running){gsap.ticker.add(render);running=true;if(!entered)intro.resume();}
    else if(!active&&running){gsap.ticker.remove(render);running=false;if(!entered)intro.pause();}
   };
   intro.fromTo(host.querySelectorAll('.flow-line'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.8,stagger:.035,ease:'power2.inOut'},0);
   nodes.forEach(n=>{
    intro.fromTo(host.querySelector(`[data-seo-logo="${n.tool.id}"]`),{opacity:0},{opacity:1,duration:1.05,ease:'power2.out'},.5+n.tool.delay*1.6);
    intro.fromTo(n,{settle:8},{settle:0,duration:1.05,ease:'power2.out'},.5+n.tool.delay*1.6);
   });
   intro.fromTo(host.querySelector('.flow-arrow'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.7},1.55)
    .fromTo(host.querySelectorAll('.seo-flow-heading,.seo-flow-proof,.seo-flow-client,.seo-flow-cta'),{opacity:0,y:12},{opacity:1,y:0,duration:.9,stagger:.18,ease:'power3.out'},1.35);
   let triggered=false;
   ScrollTrigger.create({trigger:host,start:'top 70%',once:true,onEnter:()=>{triggered=true;visible=true;sync();}});
   ScrollTrigger.create({trigger:host,start:'top bottom',end:'bottom top',onToggle:self=>{visible=self.isActive&&triggered;sync();}});
   const reset=()=>nodes.forEach(n=>{n.targetX=0;n.targetY=0;});
   const move=(event:PointerEvent)=>{
    if(!fine.matches||event.pointerType==='touch'||!entered)return;
    const r=ecosystem.getBoundingClientRect();
    const px=event.clientX-r.left,py=event.clientY-r.top;
    nodes.forEach(n=>{const dx=px-n.baseX,dy=py-n.baseY;const influence=Math.max(0,1-Math.hypot(dx,dy)/140);n.targetX=dx*influence*.22;n.targetY=dy*influence*.22;});
   };
   ecosystem.addEventListener('pointermove',move);ecosystem.addEventListener('pointerleave',reset);
   const visibility=()=>{if(document.hidden)reset();sync();};
   document.addEventListener('visibilitychange',visibility);
   return()=>{
    gsap.ticker.remove(render);ecosystem.removeEventListener('pointermove',move);ecosystem.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',visibility);
    nodes.forEach(n=>{n.x=0;n.y=0;n.mark.style.removeProperty('transform');});draw();
   };
  });
  return()=>{resize.disconnect();mm.revert();};
 },{scope:root});
 return <section ref={root} id="seo" className="seo-services seo-flow-scene" aria-labelledby="seo-services-title">
  <div className="seo-flow-stage">
   <div className="seo-flow-ecosystem">
    <svg className="seo-flow-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">{seoTools.map(tool=><path className="flow-line" data-seo-line={tool.id} key={tool.id} d={`M${tool.x*10} ${tool.y*6.2} C600 ${tool.y*6.2} 790 300 910 300`} pathLength="1"/>)}<path className="flow-arrow" d="M910 300H985m-10-9 10 9-10 9" pathLength="1"/></svg>
    <ul aria-label="Search and analytics tools">{seoTools.map(tool=><li key={tool.id} data-seo-logo={tool.id} data-path-group={tool.group} style={{'--tool-x':`${tool.x}%`,'--tool-y':`${tool.y}%`} as CSSProperties}><div className="seo-flow-mark"><span className={`seo-flow-logo logo-${tool.id}`} aria-hidden="true">{tool.id==='gsc'?<svg viewBox="0 0 40 40"><image href="/images/seo-tools/gsc.svg" width="278" height="40"/></svg>:<Image src={`/images/seo-tools/${tool.asset}`} alt="" width={140} height={70} unoptimized/>}</span><span className="seo-flow-tool-name">{tool.label}</span></div></li>)}</ul>
   </div>
   <div className="seo-flow-result"><h2 id="seo-services-title" className="seo-flow-heading">Made to be found.</h2><p className="seo-flow-proof"><strong>{seoProof.share}%</strong><span>ORGANIC</span></p><Link className="seo-flow-client" href="/work/allnrg">Alliance Energy</Link><a className="seo-flow-cta" href={`mailto:${contact.email}?subject=${encodeURIComponent('Website audit')}`}>Discuss audit <span aria-hidden="true">↗</span></a><a className="seo-flow-source" href={seoProof.source} target="_blank" rel="noreferrer">{seoProof.organicVisits} / {seoProof.visits.toLocaleString('en-US')} visits · rounded to {seoProof.share}%<br/>{seoProof.period} · Metrica source ↗</a></div>
  </div>
  <footer className="seo-flow-bottom"><span>SEO<br/>DEVELOPER</span><span className="seo-flow-scroll"><i aria-hidden="true"/>SCROLL</span></footer>
 </section>;
}
