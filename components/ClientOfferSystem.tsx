'use client';

import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

type Offer={name:string;subtitle:string;text:string;items:string[];result:string};
const situations=['Сайт есть. Что мешает?','Проблема ясна. Что дальше?','Нужен новый сайт. С чего начать?'];
const nodes=[...Array.from({length:3},(_,i)=>({x:170,y:95+i*155,w:300,h:100})),...Array.from({length:3},(_,i)=>({x:1030,y:95+i*155,w:300,h:100})),{x:600,y:250,w:184,h:184}];
function connection(i:number,p:{x:number;y:number}[]){
 const left=i<3,n=p[i],hub=p[6],sx=left?n.x+150:hub.x+92,sy=left?n.y:hub.y,ex=left?hub.x-92:n.x-150,ey=left?hub.y:n.y;
 return `M${sx},${sy} C${sx+(ex-sx)*.55},${sy} ${ex-(ex-sx)*.55},${ey} ${ex},${ey}`;
}
gsap.registerPlugin(useGSAP,ScrollTrigger);
export function ClientOfferSystem({offers}:{offers:Offer[]}){
 const root=useRef<HTMLDivElement>(null),selected=useRef(0);
 const [active,setActive]=useState(0);
 const choose=(i:number)=>{selected.current=i;setActive(i);};
 useGSAP(()=>{
  const host=root.current!,stage=host.querySelector<HTMLElement>('.offer-network')!;
  const paths=Array.from(stage.querySelectorAll<SVGPathElement>('.offer-wire'));
  const elements=Array.from(stage.querySelectorAll<HTMLElement>('.offer-node'));
  const dot=stage.querySelector<SVGCircleElement>('.offer-signal')!;
  const mm=gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)',()=>{
   const states=nodes.map(n=>({...n,vx:0,vy:0,tx:0,ty:0}));
   let visible=false,time=0,ready=false;
   const tick=(_:number,delta:number)=>{
    const dt=Math.min(delta,32)/1000;time+=dt;
    states.forEach((s,i)=>{
     const x=nodes[i].x+s.tx+Math.sin(time*.38+i*1.7)*1.5,y=nodes[i].y+s.ty+Math.sin(time*.31+i*2.2)*2;
     s.vx+=(65*(x-s.x)-17*s.vx)*dt;s.vy+=(65*(y-s.y)-17*s.vy)*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
     elements[i].style.transform=`translate(${(s.x-nodes[i].x)/s.w*100}%,${(s.y-nodes[i].y)/s.h*100}%)`;
    });
    paths.forEach((p,i)=>p.setAttribute('d',connection(i,states)));
    if(!ready)return;
    const phase=time%6,leg=phase<1.7?0:3,progress=leg===0?phase/1.7:(phase-2)/1.7;
    if(progress>=0&&progress<=1){const path=paths[selected.current+leg],point=path.getPointAtLength(path.getTotalLength()*progress);dot.setAttribute('cx',`${point.x}`);dot.setAttribute('cy',`${point.y}`);dot.style.opacity='.65';}else dot.style.opacity='0';
   };
   const sync=()=>{gsap.ticker.remove(tick);if(visible&&!document.hidden)gsap.ticker.add(tick);};
   const intro=gsap.timeline({scrollTrigger:{trigger:stage,start:'top 80%',once:true},onComplete:()=>{ready=true;time=0;}});
   intro.fromTo(paths,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.5,ease:'none'}).fromTo(elements,{opacity:0},{opacity:1,duration:.8,stagger:.05,ease:'sine.out'},.5);
   ScrollTrigger.create({trigger:stage,start:'top bottom',end:'bottom top',onToggle:s=>{visible=s.isActive;sync();}});
   const move=(e:PointerEvent)=>{if(e.pointerType==='touch'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*1200,y=(e.clientY-r.top)/r.height*500;states.forEach((s,i)=>{const dx=x-nodes[i].x,dy=y-nodes[i].y,k=Math.max(0,1-Math.hypot(dx,dy)/180)*.045;s.tx=dx*k;s.ty=dy*k;});};
   const reset=()=>states.forEach(s=>{s.tx=0;s.ty=0;});
   stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',reset);document.addEventListener('visibilitychange',sync);
   return()=>{gsap.ticker.remove(tick);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',sync);elements.forEach(e=>e.style.removeProperty('transform'));paths.forEach((p,i)=>p.setAttribute('d',connection(i,nodes)));dot.style.opacity='0';};
  });
  return()=>mm.revert();
 },{scope:root});
 return <div className="offer-system" ref={root}>
  <div className="offer-network" aria-label="Выберите ситуацию и направление работы">
   <svg viewBox="0 0 1200 500" aria-hidden="true">{nodes.slice(0,6).map((_,i)=><path key={i} className={`offer-wire ${i%3===active?'is-active':''}`} d={connection(i,nodes)} pathLength="1"/>)}<circle className="offer-signal" r="3" opacity="0"/></svg>
   {nodes.map((n,i)=>{const index=i%3;return i===6?<div key={i} className="offer-node offer-hub" style={{left:`${(n.x-n.w/2)/12}%`,top:`${(n.y-n.h/2)/5}%`,width:`${n.w/12}%`,height:`${n.h/5}%`}}><span>ВАШ САЙТ</span><small>Задача → решение<br/>→ результат</small></div>:<button key={i} type="button" className={`offer-node ${i>2?'offer-destination':'offer-situation'} ${index===active?'is-active':''}`} style={{left:`${(n.x-n.w/2)/12}%`,top:`${(n.y-n.h/2)/5}%`,width:`${n.w/12}%`,height:`${n.h/5}%`}} aria-pressed={index===active} onClick={()=>choose(index)} onFocus={()=>choose(index)} onPointerEnter={e=>{if(e.pointerType==='mouse')choose(index);}}><small>0{index+1}{i>2?' / РЕШЕНИЕ':' / СИТУАЦИЯ'}</small><span>{i>2?offers[index].name:situations[index]}</span>{i>2&&<b aria-hidden="true">↗</b>}</button>;})}
  </div>
  <div className="offer-mobile-routes" aria-label="Выберите направление работы">{offers.map((o,i)=><button type="button" key={o.name} aria-pressed={active===i} onClick={()=>choose(i)}><small>0{i+1} / {situations[i]}</small><span>{o.name}<b aria-hidden="true">↗</b></span></button>)}</div>
 </div>;
}
