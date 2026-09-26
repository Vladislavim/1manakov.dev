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
<span className="eyebrow">ЭКСПРЕСС-ДИАГНОСТИКА</span>
<h2 id="offer-dialog-title"><strong>Аудит</strong><span>узких мест сайта</span></h2>
<p className="offer-short-copy">Архитектура, мобильный UX и SEO.</p>
<div className="offer-growth"><h3>Вскрою 3 критических затыка</h3><p>Пришлите ссылку на сайт и задачу. Разберу одну страницу и покажу, где вы теряете мобильный трафик и заявки.</p></div>
<a className="exit-offer-submit" href={contact.telegram} target="_blank" rel="noreferrer" data-seo-event="seo_cta_click" data-cta-type="telegram" data-placement="exit-offer">Отправить сайт на диагностику <span aria-hidden="true">↗</span></a>
<p className="offer-channel-note">В Telegram, напрямую со мной.</p>
<p className="offer-validity">Разбор в течение 24 часов без воды и шаблонных отчётов.</p>
<div className="offer-bottom"><a href={`mailto:${contact.email}?subject=${encodeURIComponent('Хочу аудит узких мест сайта')}`} data-seo-event="seo_cta_click" data-cta-type="email" data-placement="exit-offer">Удобнее почтой ↗</a><details><summary>Формат</summary><p>Экспресс-разбор включает видео- или текстовый разбор одной ключевой страницы: мобильная верстка, ошибки пути пользователя к целевому действию и базовые технические препятствия для поисковиков. Без навязывания лишних работ.</p></details></div>
</dialog>;
}
