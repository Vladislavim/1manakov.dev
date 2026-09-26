'use client';
import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const nodes=[
 {name:'Offer',copy:'Понятная ценность для вашей аудитории.',x:120,y:90,w:190,h:145},
 {name:'Navigation',copy:'Структура, в которой легко найти нужное.',x:520,y:90,w:190,h:145},
 {name:'Content',copy:'Тексты, которые объясняют и вызывают доверие.',x:120,y:550,w:190,h:145},
 {name:'Performance',copy:'Быстрая загрузка и удобное взаимодействие.',x:520,y:550,w:190,h:145},
 {name:'Audience',copy:'',x:80,y:320,w:120,h:40},
 {name:'Action',copy:'',x:560,y:320,w:120,h:40},
 {name:'Website system',copy:'Задача. Структура. Результат.',x:320,y:320,w:190,h:190},
];
const pairs=[1,0,3,2,5,4];
function curve(i:number,positions:{x:number;y:number}[]){
 const n=positions[i],h=positions[6];
 const dx=h.x-n.x,dy=h.y-n.y;
 const factor=1/Math.max(Math.abs(dx)/(nodes[i].w/2),Math.abs(dy)/(nodes[i].h/2));
 const sx=n.x+dx*factor,sy=n.y+dy*factor;
 const length=Math.hypot(dx,dy),ex=h.x-dx/length*95,ey=h.y-dy/length*95;
 return Math.abs(dy)<50?`M${sx} ${sy} L${ex} ${ey}`:`M${sx} ${sy} C${sx} ${(sy+ey)/2} ${ex} ${(sy+ey)/2} ${ex} ${ey}`;
}
gsap.registerPlugin(useGSAP,ScrollTrigger);
export function WebsiteSystem(){
 const root=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  const host=root.current!,svg=host.querySelector('svg')!;
  const buttons=[...host.querySelectorAll<HTMLButtonElement>('.system-node')];
  const paths=[...host.querySelectorAll<SVGPathElement>('.system-path')];
  const signal=host.querySelector<SVGCircleElement>('.system-signal')!;
  const states=nodes.map(n=>({x:n.x,y:n.y,vx:0,vy:0,tx:0,ty:0}));
  let selected=-1;
  function highlight(index:number){selected=index;paths.forEach((p,i)=>p.classList.toggle('is-active',index===6||i===index||i===pairs[index]));buttons.forEach((b,i)=>b.classList.toggle('is-active',i===index||index>=0&&i===6));}
  const enter=buttons.map((button,i)=>{const on=()=>highlight(i),off=()=>highlight(-1);button.addEventListener('pointerenter',on);button.addEventListener('pointerleave',off);button.addEventListener('focus',on);button.addEventListener('blur',off);return()=>{button.removeEventListener('pointerenter',on);button.removeEventListener('pointerleave',off);button.removeEventListener('focus',on);button.removeEventListener('blur',off);};});
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   let time=0,active=false,ready=false;
   const fine=matchMedia('(hover:hover) and (pointer:fine)');
   const tick=(_t:number,delta:number)=>{
    const dt=Math.min(delta,32)/1000;time+=dt;
    states.forEach((s,i)=>{
     const tx=nodes[i].x+s.tx+Math.sin(time*.38+i*1.7)*(i===6?1:2.5);
     const ty=nodes[i].y+s.ty+Math.sin(time*.31+i*2.2)*(i===6?1:3);
     // Damped springs, integrated in SVG coordinates: geometry and nodes share one state.
     s.vx+=(65*(tx-s.x)-17*s.vx)*dt;s.vy+=(65*(ty-s.y)-17*s.vy)*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
     buttons[i].style.transform=`translate(${(s.x-nodes[i].x)/nodes[i].w*100}%,${(s.y-nodes[i].y)/nodes[i].h*100}%)`;
    });
    paths.forEach((p,i)=>p.setAttribute('d',curve(i,states)));
    if(!ready)return;
    const cycle=time%7,origin=selected>=0&&selected<6?selected:Math.floor(time/7)%6;
    // One quiet signal travels into the hub, then out along the paired complete route.
    if(cycle<3.6){const first=cycle<1.8,index=first?origin:pairs[origin],progress=first?cycle/1.8:1-(cycle-1.8)/1.8;const p=paths[index],point=p.getPointAtLength(p.getTotalLength()*progress);signal.setAttribute('cx',String(point.x));signal.setAttribute('cy',String(point.y));signal.style.opacity='.6';}else signal.style.opacity='0';
   };
   const sync=()=>{gsap.ticker.remove(tick);if(active&&!document.hidden)gsap.ticker.add(tick);};
   const intro=gsap.timeline({scrollTrigger:{trigger:host,start:'top 75%',once:true},onComplete:()=>{ready=true;time=0;}});
   intro.fromTo(paths,{strokeDasharray:1,strokeDashoffset:1},{autoRound:false,strokeDashoffset:0,duration:1.7,ease:'none'}).fromTo(buttons,{opacity:0},{opacity:1,duration:.8,stagger:.07,ease:'sine.out'},.6);
   ScrollTrigger.create({trigger:host,start:'top bottom',end:'bottom top',onToggle:s=>{active=s.isActive;sync();}});
   const move=(e:PointerEvent)=>{if(!fine.matches||e.pointerType==='touch')return;const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*640,y=(e.clientY-r.top)/r.height*640;states.forEach((s,i)=>{const dx=x-nodes[i].x,dy=y-nodes[i].y,k=Math.max(0,1-Math.hypot(dx,dy)/160)*.14;s.tx=dx*k;s.ty=dy*k;});};
   const reset=()=>states.forEach(s=>{s.tx=0;s.ty=0;});
   host.addEventListener('pointermove',move);host.addEventListener('pointerleave',reset);document.addEventListener('visibilitychange',sync);
   return()=>{gsap.ticker.remove(tick);host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',sync);buttons.forEach(b=>b.style.removeProperty('transform'));paths.forEach((p,i)=>p.setAttribute('d',curve(i,nodes)));signal.style.opacity='0';};
  });
  return()=>{mm.revert();enter.forEach(off=>off());};
 },{scope:root});
 return <div className="website-system" ref={root} aria-label="Website system: connected strategy, structure and results"><svg viewBox="0 0 640 640" aria-hidden="true">{nodes.slice(0,6).map((n,i)=><path key={n.name} className="system-path" d={curve(i,nodes)} pathLength="1"/>)}<circle className="system-signal" r="2.7" opacity="0"/></svg>{nodes.map((n,i)=><button type="button" key={n.name} className={`system-node ${i===6?'system-hub':i>3?'system-pill':''}`} style={{left:`${(n.x-n.w/2)/640*100}%`,top:`${(n.y-n.h/2)/640*100}%`,width:`${n.w/640*100}%`,height:`${n.h/640*100}%`}} aria-label={`${n.name}${n.copy?': '+n.copy:''}. Connected through Website System.`}>{i<4&&<small>0{i+1}</small>}<strong>{n.name}</strong>{n.copy&&<span>{n.copy}</span>}</button>)}</div>;
}
