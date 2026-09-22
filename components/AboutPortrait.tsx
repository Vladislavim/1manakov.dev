'use client';
import {useEffect,useRef} from 'react';
export function AboutPortrait(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const image=new window.Image();let disposed=false;
  image.onload=()=>{
   if(disposed||!canvas.current)return;
   const out=canvas.current,ctx=out.getContext('2d');if(!ctx)return;
   const sample=document.createElement('canvas');sample.width=480;sample.height=818;
   const source=sample.getContext('2d',{willReadFrequently:true});if(!source)return;
   // Crop the original photograph, never redraw or regenerate facial features.
   source.drawImage(image,540,460,310,528,0,0,480,818);
   const pixels=source.getImageData(0,0,480,818).data;
   out.width=960;out.height=1636;ctx.scale(2,2);ctx.clearRect(0,0,480,818);ctx.fillStyle='#111310';
   for(let y=3;y<818;y+=5){for(let x=3;x<480;x+=5){
    const i=(y*480+x)*4,luma=(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255;
    const edge=Math.min(1,x/28,(480-x)/28,(818-y)/65);
    const alpha=pixels[i+3]/255;
    const radius=Math.sqrt((1-luma)*alpha)*2.5*Math.max(0,edge);
    if(radius<.25)continue;
    ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
   }}
  };image.src='/images/about/portrait-itmo.png';return()=>{disposed=true;};
 },[]);
 return <figure className="about-portrait portrait-halftone" tabIndex={0} aria-label="Vladislav Imanakov. Halftone from the original photograph; focus or hover to reveal the photo."><svg viewBox="540 460 310 528" role="img" aria-labelledby="portrait-title" preserveAspectRatio="xMidYMid meet"><title id="portrait-title">Vladislav Imanakov — original photograph</title><image href="/images/about/portrait-itmo.png" width="1280" height="988"/></svg><canvas ref={canvas} aria-hidden="true"/><figcaption>ORIGINAL / HALFTONE</figcaption></figure>;
}
