'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, type ReactNode } from 'react';
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function CaseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.current?.querySelectorAll<HTMLElement>('[data-case-reveal]').forEach(item => {
        const image=item.querySelector<HTMLElement>('[data-case-image]');
        const caption=item.querySelector<HTMLElement>('[data-case-caption]');
        const timeline=gsap.timeline({scrollTrigger:{trigger:item,start:'top 90%',once:true}});
        if(!image&&!caption)timeline.fromTo(item,{y:12,opacity:0},{y:0,opacity:1,duration:.42,ease:'power3.out'});
        if(image)timeline.fromTo(image,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.62,ease:'power3.out'});
        if(caption)timeline.fromTo(caption,{y:10,opacity:0},{y:0,opacity:1,duration:.24,ease:'power3.out'},'-=.18');
      });
    });
    return ()=>media.revert();
  },{scope:root});
  return <div ref={root} className="case-motion-root">{children}</div>;
}
