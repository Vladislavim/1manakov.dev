'use client';
import {useEffect,useRef,useState} from 'react';
import {contact} from '@/data/projects';
const KEY='imanakov-first-offer-v1';
export function ExitOffer(){
 const dialog=useRef<HTMLDialogElement>(null),previous=useRef<HTMLElement|null>(null);
 const [deadline,setDeadline]=useState(0),[expired,setExpired]=useState(false);
 useEffect(()=>{
  let shown=false;
  const preview=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='offer';
  const visitKey=KEY+'-visit-start';
  let started=Date.now();
  try{const saved=Number(sessionStorage.getItem(visitKey));if(!preview&&saved>0&&saved<=started)started=saved;else if(!preview)sessionStorage.setItem(visitKey,String(started));}catch{}
  const show=()=>{if(shown||document.hidden||document.querySelector('dialog[open]')||document.activeElement?.matches('input,textarea,select,[contenteditable="true"]'))return;
   let until=Date.now()+86400000;
   if(!preview){try{if(sessionStorage.getItem(KEY))return;const stored=localStorage.getItem(KEY);if(stored){const saved=Number(stored);if(Number.isFinite(saved)&&saved>0){if(saved<=Date.now())return;until=saved;}}}catch{/* Storage restrictions must not prevent the dialog from opening. */}}
   if(!dialog.current?.isConnected)return;
   previous.current=document.activeElement as HTMLElement;dialog.current.showModal();shown=true;setDeadline(until);
   if(!preview){try{localStorage.setItem(KEY,String(until));sessionStorage.setItem(KEY,'shown');}catch{/* Keep the in-memory once-per-mount guard. */}}
  };
  const check=()=>{if(Date.now()-started>=45000)show();};
  const timer=setInterval(check,500);
  document.addEventListener('visibilitychange',check);
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',check);};
 },[]);
 useEffect(()=>{if(!deadline)return;const timer=setInterval(()=>setExpired(Date.now()>=deadline),1000);return()=>clearInterval(timer);},[deadline]);
 function close(){dialog.current?.close();previous.current?.focus({preventScroll:true});}
 return <dialog ref={dialog} className="exit-offer" aria-labelledby="offer-dialog-title" lang="ru" data-lenis-prevent onCancel={close} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}}}>
<button className="exit-offer-close" onClick={close} aria-label="Закрыть предложение" autoFocus>×</button>
<span className="eyebrow">НОВЫМ КЛИЕНТАМ</span>
<h2 id="offer-dialog-title"><strong>{expired?'Спасибо':'−10%'}</strong><span>{expired?'за интерес к проекту':'на первый заказ'}</span></h2>
<p className="offer-short-copy">Сайт, SEO или аудит.</p>
<div className="offer-growth"><h3>Найду 3 зоны роста бесплатно</h3><p>Пришлите сайт и задачу. Посмотрю одну страницу и подскажу, что стоит улучшить.</p></div>
<a className="exit-offer-submit" href={contact.telegram} target="_blank" rel="noreferrer" data-seo-event="seo_cta_click" data-cta-type="telegram" data-placement="exit-offer">Найти точки роста моего сайта <span aria-hidden="true">↗</span></a>
<p className="offer-channel-note">В Telegram, напрямую со мной.</p>
<p className="offer-validity">{expired?'Срок скидки истёк. Бесплатный разбор доступен.':`Скидка при обращении до ${deadline?new Date(deadline).toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}):'—'}.`}</p>
<div className="offer-bottom"><a href={`mailto:${contact.email}?subject=${encodeURIComponent('Хочу найти 3 зоны роста сайта')}`} data-seo-event="seo_cta_click" data-cta-type="email" data-placement="exit-offer">Удобнее почтой ↗</a><details><summary>Условия</summary><p>Скидка 10% на мои услуги для новых клиентов при обращении в течение 24 часов после первого показа. Объём и стоимость согласуем до начала. Рекламный бюджет, хостинг и сторонние сервисы не входят. Бесплатный разбор включает три рекомендации по одной странице. Подробный аудит и внедрение оцениваются отдельно.</p></details></div>
</dialog>;
}
