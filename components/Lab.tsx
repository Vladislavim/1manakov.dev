'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import {RouteLink} from './SiteShell';
const Experiment=dynamic(()=>import('./LabExperiments'),{ssr:false});
const names=['Cursor reveal','Card physics','Type morph','Portal','Grid shift'];
const full='polygon(0% 0%,34% 0%,42% 0%,100% 0%,100% 100%,0% 100%)';
function folderMask(rect:DOMRect){const x=rect.x/innerWidth*100,y=rect.y/innerHeight*100,w=rect.width/innerWidth*100,h=rect.height/innerHeight*100;return `polygon(${x}% ${y}%,${x+w*.34}% ${y}%,${x+w*.42}% ${y+h*.12}%,${x+w}% ${y+h*.12}%,${x+w}% ${y+h}%,${x}% ${y+h}%)`;}
export function Lab({teaser=false}:{teaser?:boolean}){
 const [active,setActive]=useState(0),[opened,setOpened]=useState<number|null>(null);
 const dialog=useRef<HTMLDialogElement>(null),buttons=useRef<(HTMLButtonElement|null)[]>([]),closing=useRef(false);
 const animation=useRef<gsap.core.Timeline|null>(null);
 useEffect(()=>{
  if(opened===null)return;
  const host=dialog.current!,button=buttons.current[opened]!;
  const old=document.body.style.overflow;document.body.style.overflow='hidden';host.showModal();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  host.dataset.state='opening';
  if(reduced){gsap.set(host,{clipPath:full});gsap.set(host.querySelector('.lab-interior'),{opacity:1,y:0});host.dataset.state='open';}
  else{gsap.set(host,{clipPath:folderMask(button.getBoundingClientRect())});
   animation.current=gsap.timeline({onComplete:()=>{host.dataset.state='open';}}).to(host,{clipPath:full,duration:.65,ease:'power3.inOut'}).fromTo(host.querySelector('.lab-interior'),{opacity:0,y:18},{opacity:1,y:0,duration:.3},.36);
  }
  host.querySelector<HTMLButtonElement>('.lab-close')?.focus({preventScroll:true});
  return()=>{animation.current?.kill();host.close();document.body.style.overflow=old;button.focus({preventScroll:true});};
 },[opened]);
 function close(){if(opened===null||closing.current)return;closing.current=true;animation.current?.kill();const host=dialog.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  host.dataset.state='closing';
  if(reduced){closing.current=false;setOpened(null);return;}
  animation.current=gsap.timeline({onComplete:()=>{closing.current=false;setOpened(null);}}).to(host.querySelector('.lab-interior'),{opacity:0,duration:.14}).to(host,{clipPath:folderMask(buttons.current[opened]!.getBoundingClientRect()),duration:.5,ease:'power3.inOut'},0);
 }
 const Heading=teaser?'h2':'h1';
 return <><section className={`play-scene scene lab-overview ${teaser?'':'play-full'}`} aria-labelledby="play-title"><span className="scene-kicker">INTERACTION LAB / FIVE EXPERIMENTS</span><Heading className="play-title" id="play-title">Built to<br/>be touched.</Heading><div className="play-folders-reveal"><div className="folder-field" aria-label="Interaction experiments">{names.map((name,i)=><button ref={el=>{buttons.current[i]=el;}} key={name} className={`folder folder-${i} ${active===i?'active':''}`} onClick={()=>{setActive(i);setOpened(i);}} onPointerEnter={()=>setActive(i)} onFocus={()=>setActive(i)} aria-haspopup="dialog" data-cursor="OPEN"><span className="folder-sheet"/><span className="folder-front"><span className="folder-number">0{i+1}</span><span className="folder-name">{name}</span><span className="folder-plus" aria-hidden="true">↗</span></span></button>)}</div></div><div className="scene-bottom"><p>PRODUCT<br/>DESIGNER <span className="status-dot"/></p>{teaser?<RouteLink href="/lab" className="line-link">ENTER<br/>THE LAB</RouteLink>:<span className="line-link">A STUDY<br/>IN RESPONSE.</span>}</div><noscript><p className="nojs-message">Включите JavaScript для интерактивных экспериментов.</p></noscript></section><dialog ref={dialog} className="lab-scene" aria-labelledby="lab-name" data-lenis-prevent onCancel={e=>{e.preventDefault();close();}}><div className="lab-interior">{opened!==null&&<><header className="lab-bar"><h2 id="lab-name"><span>0{opened+1} /</span> {names[opened]}</h2><button className="lab-close" onPointerUp={e=>{if(e.pointerType==='touch'){e.preventDefault();const x=e.clientX,y=e.clientY;const guard=(click:MouseEvent)=>{if(Math.abs(click.clientX-x)<24&&Math.abs(click.clientY-y)<24){click.preventDefault();click.stopImmediatePropagation();document.removeEventListener('click',guard,true);}};document.addEventListener('click',guard,true);setTimeout(()=>document.removeEventListener('click',guard,true),450);close();}}} onClick={close} aria-label="Close experiment">BACK TO FOLDERS <span aria-hidden="true">↙</span></button></header><Experiment key={opened} kind={opened}/></>}</div></dialog></>;
}
