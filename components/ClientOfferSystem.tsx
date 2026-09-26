'use client';

import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {contact} from '@/data/projects';
const mailSubjects=['Нужен аудит сайта','Нужна доработка сайта','Нужно создать сайт'];
const mailLink=(i:number)=>`mailto:${contact.email}?subject=${encodeURIComponent(mailSubjects[i])}&body=${encodeURIComponent('Здравствуйте, Владислав!\n\n'+mailSubjects[i]+'.\n\nМоя задача: \nСсылка на сайт (если есть): \n')}`;

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
   let visible=false,time=0,ready=false,route=selected.current,travel=0,signalOpacity=0;
   const tick=(_:number,delta:number)=>{
    const dt=Math.min(delta,32)/1000;time+=dt;
    states.forEach((s,i)=>{
     const x=nodes[i].x+s.tx+Math.sin(time*.38+i*1.7)*1.5,y=nodes[i].y+s.ty+Math.sin(time*.31+i*2.2)*2;
     s.vx+=(65*(x-s.x)-17*s.vx)*dt;s.vy+=(65*(y-s.y)-17*s.vy)*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
     elements[i].style.transform=`translate(${(s.x-nodes[i].x)/s.w*100}%,${(s.y-nodes[i].y)/s.h*100}%)`;
    });
    paths.forEach((p,i)=>p.setAttribute('d',connection(i,states)));
    if(!ready)return;
    const switching=route!==selected.current;
    if(switching){signalOpacity=Math.max(0,signalOpacity-dt*4);if(signalOpacity===0){route=selected.current;travel=0;}}
    else travel=(travel+dt)%7.2;
    const phase=travel,leg=phase<2.4?0:3;
    const progress=leg===0?phase/2.4:(phase-3.2)/2.4;
    const onLine=progress>=0&&progress<=1;
    const target=onLine?Math.min(1,progress*10,(1-progress)*10)*.75:0;
    if(!switching)signalOpacity+=(target-signalOpacity)*Math.min(1,dt*8);
    if(onLine){const path=paths[route+leg],point=path.getPointAtLength(path.getTotalLength()*progress);dot.setAttribute('cx',`${point.x}`);dot.setAttribute('cy',`${point.y}`);}
    dot.style.opacity=`${signalOpacity}`;
    elements.forEach((el,i)=>{const energized=!switching&&(i===6?phase>=2.1&&phase<3.5:i===route?phase<2.4:i===route+3?phase>=5.2&&phase<6.6:false);el.classList.toggle('is-flowing',energized);});
   };
   const sync=()=>{gsap.ticker.remove(tick);if(visible&&!document.hidden)gsap.ticker.add(tick);};
   const intro=gsap.timeline({scrollTrigger:{trigger:stage,start:'top 80%',once:true},onComplete:()=>{ready=true;time=0;}});
   gsap.set(elements,{autoAlpha:0});
   gsap.set(paths,{strokeDasharray:'1 1',strokeDashoffset:1});
   intro.to(elements[6],{autoAlpha:1,duration:1.1,ease:'sine.inOut'});
   for(let i=0;i<3;i++){
    intro.to(elements[i],{autoAlpha:1,duration:.85,ease:'sine.inOut'},'+=.12')
     .to(elements[i+3],{autoAlpha:1,duration:.85,ease:'sine.inOut'})
     .to(paths[i],{strokeDashoffset:0,autoRound:false,duration:1.25,ease:'none'})
     .to(paths[i+3],{strokeDashoffset:0,autoRound:false,duration:1.25,ease:'none'});
   }
   const visibility=ScrollTrigger.create({trigger:stage,start:'top bottom',end:'bottom top',onToggle:s=>{visible=s.isActive;sync();}});
   visible=visibility.isActive;sync();
   const move=(e:PointerEvent)=>{if(e.pointerType==='touch'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*1200,y=(e.clientY-r.top)/r.height*500;states.forEach((s,i)=>{const dx=x-nodes[i].x,dy=y-nodes[i].y,k=Math.max(0,1-Math.hypot(dx,dy)/180)*.045;s.tx=dx*k;s.ty=dy*k;});};
   const reset=()=>states.forEach(s=>{s.tx=0;s.ty=0;});
   stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',reset);document.addEventListener('visibilitychange',sync);
   return()=>{gsap.ticker.remove(tick);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',sync);elements.forEach(e=>{e.style.removeProperty('transform');e.classList.remove('is-flowing');});paths.forEach((p,i)=>p.setAttribute('d',connection(i,nodes)));dot.style.opacity='0';};
  });
  return()=>mm.revert();
 },{scope:root});
 return <div className="offer-system" ref={root}>
  <div className="offer-network" aria-label="Выберите ситуацию и направление работы">
   <svg viewBox="0 0 1200 500" aria-hidden="true">{nodes.slice(0,6).map((_,i)=><path key={i} className={`offer-wire ${i%3===active?'is-active':''}`} d={connection(i,nodes)} pathLength="1"/>)}<circle className="offer-signal" r="3" opacity="0"/></svg>
   {nodes.map((n,i)=>{const index=i%3;return i===6?<div key={i} className="offer-node offer-hub" style={{left:`${(n.x-n.w/2)/12}%`,top:`${(n.y-n.h/2)/5}%`,width:`${n.w/12}%`,height:`${n.h/5}%`}}><span>ВАШ САЙТ</span><small>Задача → решение<br/>→ результат</small></div>:<a key={i} href={mailLink(index)} title={`Написать письмо: ${mailSubjects[index]}`} className={`offer-node ${i>2?'offer-destination':'offer-situation'} ${index===active?'is-active':''}`} style={{left:`${(n.x-n.w/2)/12}%`,top:`${(n.y-n.h/2)/5}%`,width:`${n.w/12}%`,height:`${n.h/5}%`}} onFocus={()=>choose(index)} onPointerEnter={e=>{if(e.pointerType==='mouse')choose(index);}}><small>0{index+1}{i>2?' / РЕШЕНИЕ':' / СИТУАЦИЯ'}</small><span>{i>2?offers[index].name:situations[index]}</span><em className="offer-mail-hint">Написать письмо ↗</em></a>;})}
  </div>
  <div className="offer-mobile-routes" aria-label="Выберите направление работы">{offers.map((o,i)=><a key={o.name} href={mailLink(i)}><small>0{i+1} / {situations[i]}</small><span>{o.name}<b aria-hidden="true">↗</b></span><em>Написать письмо ↗</em></a>)}</div>
  <div className="offer-disclosures">
   <details><summary>Что вы получите после аудита <span>+</span></summary><p>Конкретные замечания, их приоритет и способ проверки исправлений. Для каждой проблемы — что происходит, почему это важно и что изменить.</p></details>
   <details><summary>Как строится работа <span>+</span></summary><p>Сначала разбираем задачу, исходную ситуацию и ограничения. До начала согласуем объём, стоимость, сроки и критерии готовности. Затем вносим изменения и показываем промежуточный результат. В конце проверяем основные сценарии и передаём результат и необходимые доступы.</p></details>
   <details><summary>Можно доработать без полного редизайна? <span>+</span></summary><p>Да, если существующая основа позволяет решить задачу точечно. Сначала нужно посмотреть сайт: иногда достаточно исправить форму, мобильную версию или структуру страниц.</p></details>
   <details><summary>Что нужно для оценки стоимости? <span>+</span></summary><p>Ссылка на сайт, описание задачи и желаемый срок. Для нового сайта — что вы предлагаете, кому и какие действия посетителя важны. Если есть материалы или технические ограничения, приложите их.</p></details>
   <details><summary>Что останется у меня после сдачи? <span>+</span></summary><p>Согласованный результат: для аудита — замечания и порядок исправлений; для разработки — сайт и необходимые для управления доступы. Состав исходников, документации и дальнейшей поддержки фиксируем до начала.</p></details>
  </div>
 </div>;
}
