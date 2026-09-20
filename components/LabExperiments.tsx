'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import gsap from 'gsap';
import {projects} from '@/data/projects';
import {caseEvidence} from '@/data/case-evidence';
import {ProjectImage} from './ProjectImage';

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
function World({index=0,label=true}:{index?:number;label?:boolean}){const p=projects[index%projects.length];return <div className="lab-world" style={{background:p.color,color:p.ink}}><span className="world-number">SELECTED WORK / {p.number}</span><ProjectImage src={caseEvidence[p.slug]?.deviceAsset||p.cover} alt="" eager unoptimized/>{label&&<strong>{p.shortName}</strong>}</div>;}
function Hint({children}:{children:React.ReactNode}){return <p className="lab-hint">{children}</p>;}

// One active ticker per mounted study. No scene logic is loaded on the overview.
function Surface({kind}:{kind:number}){
 const root=useRef<HTMLDivElement>(null),layer=useRef<HTMLDivElement>(null),cursor=useRef<HTMLDivElement>(null);
 const [world,setWorld]=useState(0),[locked,setLocked]=useState(false),[mode,setMode]=useState(0);
 const state=useRef({x:.5,y:.5,tx:.5,ty:.5,value:.2,target:.2,down:false,startX:0,startValue:0,distance:0,locked:false,mode:0});
 useEffect(()=>{state.current.locked=locked;},[locked]);
 useEffect(()=>{state.current.mode=mode;state.current.target=kind===2?0:mode===0?.2:mode===1?.015:.88;},[mode,kind]);
 useEffect(()=>{
  const host=root.current!,reveal=layer.current!,mark=cursor.current!,s=state.current;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const letters=[...host.querySelectorAll<HTMLElement>('.morph-letter')];
  const tick=()=>{
   if(document.hidden)return;
   const dx=s.tx-s.x,dy=s.ty-s.y,speed=Math.min(.2,Math.hypot(dx,dy));
   const ease=reduced.matches?1:.13;s.x+=dx*ease;s.y+=dy*ease;s.value+=(s.target-s.value)*(reduced.matches?1:.11);
   const w=host.clientWidth,h=host.clientHeight;
   if(kind===0){const radius=Math.min(w,h)*.235,stretch=reduced.matches?0:speed*radius*2;
    reveal.style.clipPath=`ellipse(${radius+stretch}px ${Math.max(radius*.78,radius-stretch*.4)}px at ${s.x*w}px ${s.y*h}px)`;
    mark.style.transform=`translate(${s.x*w}px,${s.y*h}px) translate(-50%,-50%)`;mark.style.width=`${(radius+stretch)*2}px`;mark.style.height=`${(radius-stretch*.4)*2}px`;
   }else if(kind===3){
    const cx=s.x*100,cy=s.y*100,half=4+s.value*52;
    reveal.style.clipPath=s.mode===0?`ellipse(${half*.8}% ${Math.min(49,half*1.15)}% at ${cx}% ${cy}%)`:`polygon(${cx-half*.65}% 0%,${cx+half*.5}% 0%,${cx+half}% ${cy-14}%,${cx+half*.72}% 100%,${cx-half}% 100%,${cx-half*.8}% ${cy+12}%)`;
    mark.style.transform=`translate(${clamp(cx+half*.6,8,92)*w/100}px,${cy*h/100}px) translate(-50%,-50%)`;
   }else if(kind===2){
    const t=clamp(s.value,0,1);
    letters.forEach((el,i)=>{const d=i-2;el.style.transform=`translate(${d*t*w*.023}px,${Math.sin(i*1.8)*t*h*.09}px) rotate(${d*t*6}deg) scale(${1+t*.1},${1-t*.26})`;el.style.opacity=String(1-clamp((t-.55)/.25,0,1));el.style.color=t<.2?`rgba(242,240,231,${1-t*5})`:'transparent';});
    reveal.style.clipPath=`inset(${(1-t)*42}% ${(1-t)*44}% round ${(1-t)*100}px)`;
    reveal.style.opacity=String(clamp((t-.42)*2.2,0,1));
    mark.style.transform=`scaleX(${t})`;
   }
  };
  gsap.ticker.add(tick);tick();return()=>gsap.ticker.remove(tick);
 },[kind]);
 const changeWorld=()=>setWorld(v=>(v+1)%projects.length);
 return <><div ref={root} className={`lab-surface study-${kind}`} tabIndex={0} role="group" aria-label={kind===0?'Reveal surface':kind===2?'Type morph surface':'Portal surface'}
  onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);const s=state.current;s.down=true;s.startX=e.clientX;s.startValue=s.target;s.distance=0;}}
  onPointerMove={e=>{const s=state.current,r=e.currentTarget.getBoundingClientRect();if(s.locked&&kind===0)return;s.tx=clamp((e.clientX-r.left)/r.width,.08,.92);s.ty=clamp((e.clientY-r.top)/r.height,.1,.9);if(s.down){s.distance=Math.max(s.distance,Math.abs(e.clientX-s.startX));if(kind!==0)s.target=clamp(s.startValue+(e.clientX-s.startX)/r.width*1.7,0,1);}else if(kind===2&&e.pointerType==='mouse')s.target=s.tx;}}
  onPointerUp={()=>{const s=state.current;s.down=false;if(s.distance<6){if(kind===0)setLocked(v=>!v);if(kind===3)changeWorld();if(kind===2)s.target=s.target>.5?0:1;}}}
  onPointerCancel={()=>{state.current.down=false;}}
  onKeyDown={e=>{const s=state.current;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'){s.tx=clamp(s.tx-.08,.08,.92);s.target=clamp(s.target-.1,0,1);}if(e.key==='ArrowRight'){s.tx=clamp(s.tx+.08,.08,.92);s.target=clamp(s.target+.1,0,1);}if(e.key==='ArrowUp')s.ty=clamp(s.ty-.08,.1,.9);if(e.key==='ArrowDown')s.ty=clamp(s.ty+.08,.1,.9);if(e.key===' '){if(kind===0)setLocked(v=>!v);else if(kind===3)changeWorld();else s.target=s.target>.5?0:1;}}}>
  {kind===2?<><div className="morph-word" aria-label="TOUCH">{'TOUCH'.split('').map((c,i)=><span className="morph-letter" key={i} style={{backgroundImage:`url(${projects[world].cover})`}}>{c}</span>)}</div><div ref={layer} className="lab-reveal morph-window"><World index={world}/></div><div ref={cursor} className="morph-progress"/></>:<><World index={world}/><div ref={layer} className="lab-reveal"><World index={(world+1)%projects.length}/></div><div ref={cursor} className={kind===0?`reveal-rim ${locked?'locked':''}`:'portal-handle'} aria-hidden="true">{kind===3?'↔':locked?'↗':''}</div></>}
 </div><div className="lab-tools"><Hint>{kind===0?'MOVE / DRAG TO REVEAL · TAP TO HOLD':kind===2?'DRAG TO TRANSFORM · TAP TO REFORM':'DRAG TO OPEN · TAP TO CHANGE WORLD'}</Hint><div>{kind===0?<button aria-pressed={locked} onClick={()=>setLocked(v=>!v)}>{locked?'Release lens':'Hold lens'}</button>:kind===3?<button onClick={()=>setMode(v=>(v+1)%3)}>{['Lens → slit','Slit → portal','Portal → lens'][mode]}</button>:<button onClick={()=>{state.current.target=state.current.target>.5?0:1;}}>Transform ↔</button>}<button onClick={changeWorld}>Next world ↗</button></div></div></>;
}

type Body={x:number;y:number;vx:number;vy:number;angle:number;z:number;target?:{x:number;y:number;angle:number}};
function CardPhysics(){
 const root=useRef<HTMLDivElement>(null),cards=useRef<(HTMLButtonElement|null)[]>([]),bodies=useRef<Body[]>([]),grab=useRef<{index:number;x:number;y:number;time:number}|null>(null),top=useRef(10);
 const [arranged,setArranged]=useState(false);
 const organize=(stack=false)=>{const host=root.current!;bodies.current.forEach((b,i)=>{const node=cards.current[i]!,cw=node.offsetWidth,ch=node.offsetHeight;const cols=host.clientWidth<650?2:3;const rows=Math.ceil(6/cols);b.target=stack?{x:(host.clientWidth-cw)/2+i*3,y:(host.clientHeight-ch)/2+i*3,angle:(i-2)*2}:{x:(i%cols+.5)*host.clientWidth/cols-cw/2,y:(Math.floor(i/cols)+.5)*host.clientHeight/rows-ch/2,angle:0};b.vx=b.vy=0;});setArranged(!stack);};
 useEffect(()=>{
  const host=root.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const initialize=()=>{const w=host.clientWidth,h=host.clientHeight;bodies.current=projects.map((_,i)=>({x:clamp(w*.5+(i-2.5)*w*.095-cards.current[i]!.offsetWidth/2,0,w-cards.current[i]!.offsetWidth),y:clamp(h*.38+Math.sin(i*2)*h*.15,0,h-cards.current[i]!.offsetHeight),vx:0,vy:0,angle:(i-2.5)*7,z:i+1}));};initialize();
  const resize=new ResizeObserver(initialize);resize.observe(host);
  const tick=()=>{if(document.hidden)return;const w=host.clientWidth,h=host.clientHeight;
   bodies.current.forEach((b,i)=>{const node=cards.current[i]!,cw=node.offsetWidth,ch=node.offsetHeight;
    if(grab.current?.index!==i){if(b.target){const dx=b.target.x-b.x,dy=b.target.y-b.y;if(reduced.matches){b.x=b.target.x;b.y=b.target.y;b.angle=b.target.angle;delete b.target;}else{b.vx=(b.vx+dx*.06)*.75;b.vy=(b.vy+dy*.06)*.75;b.angle+=(b.target.angle-b.angle)*.14;if(Math.abs(dx)+Math.abs(dy)+Math.abs(b.vx)+Math.abs(b.vy)<.2)delete b.target;}}else{b.vx*=.94;b.vy*=.94;b.angle*=.993;}b.x+=b.vx;b.y+=b.vy;
     if(b.x<0||b.x>w-cw){b.x=clamp(b.x,0,w-cw);b.vx*=-.5;}if(b.y<0||b.y>h-ch){b.y=clamp(b.y,0,h-ch);b.vy*=-.5;}
    }node.style.transform=`translate(${b.x}px,${b.y}px) rotate(${b.angle}deg)`;node.style.zIndex=String(b.z);
   });
  };gsap.ticker.add(tick);return()=>{resize.disconnect();gsap.ticker.remove(tick);};
 },[]);
 function release(){const g=grab.current;if(!g)return;const b=bodies.current[g.index];grab.current=null;if(matchMedia('(prefers-reduced-motion: reduce)').matches)b.vx=b.vy=0;
  const other=bodies.current.find((v,i)=>i!==g.index&&Math.hypot(v.x-b.x,v.y-b.y)<50);if(other){b.target={x:other.x+12,y:other.y+12,angle:other.angle+3};b.vx=b.vy=0;}
 }
 return <><div className="physics-field lab-surface" ref={root} onDoubleClick={()=>organize()}>{projects.map((p,i)=><button className="physics-card" ref={el=>{cards.current[i]=el;}} key={p.slug} aria-label={`Move ${p.shortName} card`} style={{background:p.color,color:p.ink} as CSSProperties}
  onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);const b=bodies.current[i];delete b.target;b.z=++top.current;b.vx=b.vy=0;grab.current={index:i,x:e.clientX,y:e.clientY,time:performance.now()};setArranged(false);}}
  onPointerMove={e=>{const g=grab.current;if(!g||g.index!==i)return;const b=bodies.current[i],dx=e.clientX-g.x,dy=e.clientY-g.y,dt=Math.max(8,performance.now()-g.time);b.x+=dx;b.y+=dy;b.vx=clamp(dx*16/dt,-32,32);b.vy=clamp(dy*16/dt,-32,32);b.angle=clamp(b.vx*.6,-18,18);g.x=e.clientX;g.y=e.clientY;g.time=performance.now();}}
  onPointerUp={release} onPointerCancel={release}
  onKeyDown={e=>{const b=bodies.current[i];if(e.key.startsWith('Arrow')){e.preventDefault();delete b.target;b.z=++top.current;b.x+=e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0;b.y+=e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0;}if(e.key==='Enter')organize(!arranged);}}><span>{p.number}</span><ProjectImage src={caseEvidence[p.slug]?.deviceAsset||p.cover} alt="" eager unoptimized/><strong>{p.shortName}</strong><i aria-hidden="true">↗</i></button>)}</div><div className="lab-tools"><Hint>DRAG / THROW / STACK · DOUBLE TAP TO ALIGN</Hint><div><button onClick={()=>organize()}>Arrange grid ↗</button><button onClick={()=>organize(true)}>Make a stack</button></div></div></>;
}

function GridShift(){
 const root=useRef<HTMLDivElement>(null),handle=useRef<HTMLButtonElement>(null),split=useRef({x:57,y:54}),[order,setOrder]=useState(0);
 const set=(x:number,y:number)=>{const s=split.current;s.x=clamp(x,28,72);s.y=clamp(y,28,72);root.current!.style.gridTemplateColumns=`${s.x}fr ${100-s.x}fr`;root.current!.style.gridTemplateRows=`${s.y}fr ${100-s.y}fr`;handle.current!.style.left=`${s.x}%`;handle.current!.style.top=`${s.y}%`;};
 const settle=()=>{const s=split.current,target={x:Math.round(s.x/5)*5,y:Math.round(s.y/5)*5};gsap.to(s,{...target,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:.35,ease:'power3.out',onUpdate:()=>set(s.x,s.y)});};
 useEffect(()=>{const s=split.current;return()=>{gsap.killTweensOf(s);};},[]);
 return <><div className="lab-grid lab-surface" ref={root}>{[0,1,2,3].map((v)=><div className={`grid-module module-${v}`} key={v}>{v===0?<><span>FORM / FUNCTION</span><strong>Space<br/>is a<br/>material.</strong><small>MOVE THE INTERSECTION ↘</small></>:v===3?<><span>LAYOUT STUDY / 05</span><strong>Less fixed.<br/>More fluid.</strong><button onClick={()=>setOrder(v=>(v+1)%6)}>Trade places ↗</button></>:<World index={(v+order)%6}/>}</div>)}<button ref={handle} className="grid-handle" aria-label="Resize grid intersection with arrow keys" onPointerDown={e=>{gsap.killTweensOf(split.current);e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;const r=root.current!.getBoundingClientRect();set((e.clientX-r.x)/r.width*100,(e.clientY-r.y)/r.height*100);}} onPointerUp={settle} onPointerCancel={settle} onKeyDown={e=>{if(e.key.startsWith('Arrow')){e.preventDefault();gsap.killTweensOf(split.current);set(split.current.x+(e.key==='ArrowLeft'?-5:e.key==='ArrowRight'?5:0),split.current.y+(e.key==='ArrowUp'?-5:e.key==='ArrowDown'?5:0));}}}>↔<span>↕</span></button></div><div className="lab-tools"><Hint>DRAG THE INTERSECTION · ARROW KEYS TO ADJUST</Hint><div><button onClick={()=>setOrder(v=>(v+1)%6)}>Trade places ↗</button><button onClick={()=>{gsap.killTweensOf(split.current);set(50,50);}}>Reset grid</button></div></div></>;
}
export default function LabExperiments({kind}:{kind:number}){return kind===1?<CardPhysics/>:kind===4?<GridShift/>:<Surface kind={kind}/>;}
