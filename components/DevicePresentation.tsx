'use client';
import {useState} from 'react';
import { ProjectImage } from './ProjectImage';
import { caseEvidence } from '@/data/case-evidence';
import Image from 'next/image';
export function DevicePresentation({slug,src,alt,priority=false,compact=false}:{slug:string;src:string;alt:string;priority?:boolean;compact?:boolean}){
 const [failed,setFailed]=useState(false);
 const kind=caseEvidence[slug]?.presentation||'raw';
 const prepared=caseEvidence[slug]?.deviceAsset;
 if(prepared)return <div className={`device-presentation device-prepared ${compact?'device-compact':''}`} data-device="prepared">{failed?<span className="image-fallback device-fallback" role="img" aria-label={alt}>IMANAKOV<span>Selected work</span></span>:<Image src={prepared} alt={alt} onError={()=>setFailed(true)} width={slug==='pdp'?1536:1448} height={slug==='pdp'?1024:1086} priority={priority} sizes={compact?'(max-width:767px) 80vw, 40vw':'(max-width:767px) 100vw, 90vw'}/>}</div>;
 return <div className={`device-presentation device-${kind} ${compact?'device-compact':''}`} data-device={kind}>
  <div className="device-display">{kind==='browser'&&<div className="device-toolbar" aria-hidden="true"><i/><i/><i/><span>{slug.replaceAll('-',' ')}</span></div>}
   <div className="device-screen"><ProjectImage src={src} alt={alt} priority={priority} sizes={compact?'(max-width:767px) 80vw, 40vw':'(max-width:767px) 100vw, 85vw'}/></div>
  </div>{kind==='laptop'&&<div className="device-base" aria-hidden="true"/>}
 </div>;
}
