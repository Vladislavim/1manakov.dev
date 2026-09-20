'use client';
import { useEffect } from 'react';
export type GuideEventContext={slug:string;clusterId:string;intent:string;topic:string;primaryKeyword:string};
export function GuideTracking({context}:{context:GuideEventContext}){
 useEffect(()=>{
  const emit=(event:string,extra:Record<string,string>={})=>{
   const detail={event,...context,ctaType:'none',ctaPlacement:'page',...extra};
   window.dispatchEvent(new CustomEvent('imanakov:analytics',{detail}));
   // A host may attach its consent-aware analytics adapter. No third-party request is made here.
   const host=window as Window & {dataLayer?:Record<string,unknown>[]};
   if(Array.isArray(host.dataLayer))host.dataLayer.push(detail);
  };
  emit('seo_page_view');
  const root=document.querySelector('[data-guide-page]');
  const seen=new Set<Element>();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&!seen.has(entry.target)){seen.add(entry.target);const el=entry.target as HTMLElement;emit('seo_cta_view',{ctaType:'email',ctaPlacement:el.dataset.ctaPlacement||'final'});}}),{threshold:.5});
  root?.querySelectorAll('[data-cta-placement]').forEach(el=>observer.observe(el));
  const click=(event:MouseEvent)=>{const el=(event.target as Element)?.closest<HTMLElement>('[data-seo-event]');if(!el||!root?.contains(el))return;const extra={ctaType:el.dataset.ctaType||'link',ctaPlacement:el.dataset.placement||'body'};emit(el.dataset.seoEvent!,extra);if(el.dataset.seoEvent==='seo_cta_click')emit('seo_contact_click',extra);};
  document.addEventListener('click',click);
  return()=>{observer.disconnect();document.removeEventListener('click',click);};
 },[context]);
 return null;
}
