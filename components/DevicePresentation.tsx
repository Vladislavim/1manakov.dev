'use client';
import {useState, useRef, useEffect} from 'react';
import { ProjectImage } from './ProjectImage';
import { caseEvidence } from '@/data/case-evidence';
import Image from 'next/image';

export function DevicePresentation({slug,src,alt,priority=false,compact=false}:{slug:string;src:string;alt:string;priority?:boolean;compact?:boolean}){
 const [failed,setFailed]=useState(false);
 const macVidRef = useRef<HTMLVideoElement>(null);
 const phoneVidRef = useRef<HTMLVideoElement>(null);

 useEffect(() => {
   if (slug === 'allnrg' && !compact) {
     macVidRef.current?.play().catch(() => {});
     phoneVidRef.current?.play().catch(() => {});
   }
 }, [slug, compact]);

 const kind=caseEvidence[slug]?.presentation||'raw';
 const prepared=caseEvidence[slug]?.deviceAsset;
 if (slug === 'allnrg' && !compact) {
   return (
     <div className="device-presentation device-prepared device-live-showcase" data-device="live-allnrg">
       <div className="device-stage-relative">
         <div className="device-mac-screen">
           <video
             ref={macVidRef}
             autoPlay
             loop
             muted
             playsInline
             preload="auto"
             poster="/images/devices/allnrg-current.webp"
             className="device-video device-video--mac"
             aria-label="Alliance Energy Desktop Walkthrough"
           >
             <source src="/videos/allnrg-desktop.mp4" type="video/mp4" />
             <source src="/videos/allnrg-desktop.webm" type="video/webm" />
           </video>
         </div>
         <div className="device-phone-screen">
           <video
             ref={phoneVidRef}
             autoPlay
             loop
             muted
             playsInline
             preload="auto"
             className="device-video device-video--phone"
             aria-label="Alliance Energy Mobile Walkthrough"
           >
             <source src="/videos/allnrg-mobile.mp4" type="video/mp4" />
             <source src="/videos/allnrg-mobile.webm" type="video/webm" />
           </video>
         </div>
         <Image
           src="/images/devices/allnrg-device-frame.png"
           alt={alt}
           width={1448}
           height={1086}
           priority={priority}
           className="device-frame-img"
         />
       </div>
     </div>
   );
 }

 if(prepared)return <div className={`device-presentation device-prepared ${compact?'device-compact':''}`} data-device="prepared">{failed?<span className="image-fallback device-fallback" role="img" aria-label={alt}>IMANAKOV<span>Избранные работы</span></span>:<Image src={prepared} alt={alt} onError={()=>setFailed(true)} width={slug==='pdp'?1536:1448} height={slug==='pdp'?1024:1086} priority={priority} sizes={compact?'(max-width:767px) 80vw, 40vw':'(max-width:767px) 100vw, 90vw'}/>}</div>;
 return <div className={`device-presentation device-${kind} ${compact?'device-compact':''}`} data-device={kind}>
  <div className="device-display">{kind==='browser'&&<div className="device-toolbar" aria-hidden="true"><i/><i/><i/><span>{slug.replaceAll('-',' ')}</span></div>}
   <div className="device-screen"><ProjectImage src={src} alt={alt} priority={priority} sizes={compact?'(max-width:767px) 80vw, 40vw':'(max-width:767px) 100vw, 85vw'}/></div>
  </div>{kind==='laptop'&&<div className="device-base" aria-hidden="true"/>}
 </div>;
}
