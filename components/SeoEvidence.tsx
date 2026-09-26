'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {SeoResult} from '@/data/allnrg-seo';

gsap.registerPlugin(useGSAP,ScrollTrigger);
export function SeoEvidence({result:r}:{result:SeoResult}){
 const root=useRef<HTMLElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [zoom,setZoom]=useState(false);
 const [earlySource,setEarlySource]=useState(false);
 const activeSource=earlySource&&r.earlyStage?{...r.earlyStage,exactPeriod:r.earlyStage.period}:r;
 useGSAP(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
  const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top 75%',once:true}});
  tl.from('.seo-proof-device',{y:24,opacity:0,duration:1.1,ease:'power3.out'})
   .from('.seo-proof-report',{opacity:0,duration:.7},.16)
   .from('.seo-proof-focus',{opacity:0,duration:.8},.38)
   .from('.seo-result-number',{y:16,opacity:0,duration:.8,ease:'power3.out'},.3)
   .from('.seo-result-support',{y:8,opacity:0,duration:.7},.48);
 });return()=>media.revert();},{scope:root});
 function open(button:HTMLButtonElement,early=false){trigger.current=button;setEarlySource(early);setZoom(false);dialog.current?.showModal();}
 return <section ref={root} className="seo-evidence" aria-labelledby="seo-evidence-title">
  <header className="seo-evidence-heading"><h2 id="seo-evidence-title">SEO / ПОДТВЕРЖДЁННЫЙ РЕЗУЛЬТАТ</h2><span>{r.period.toUpperCase()}</span></header>
  <div className="seo-evidence-stage">
   <div className="seo-proof"><div className="seo-proof-device" aria-label="Оригинальный отчёт Яндекс Метрики на экране ноутбука">
    <div className="seo-proof-lid"><div className="seo-proof-screen"><Image className="seo-proof-report" src={r.sourceImages[0]} alt={`Отчёт ${r.source}: ${r.organicVisits} визитов из поисковых систем; ${r.exactPeriod}`} width={1414} height={2000} unoptimized/></div><span className="seo-proof-camera" aria-hidden="true"/></div><div className="seo-proof-base" aria-hidden="true"><span/></div>
   </div><button ref={trigger} className="seo-source-action" onClick={e=>open(e.currentTarget)}>ОТКРЫТЬ ОТЧЁТ МЕТРИКИ <span aria-hidden="true">↗</span></button><noscript><a href={r.sourcePdf}>Оригинал отчёта Метрики в PDF ↗</a></noscript></div>
   <div className="seo-result"><p className="seo-result-number">{Math.round(r.organicShare)}%</p><p className="seo-result-label">ТРАФИК<br/>ИЗ ПОИСКА</p><div className="seo-result-support"><p className="seo-result-share">{r.organicShare}% <span>ТОЧНАЯ ДОЛЯ ПОИСКОВОГО ТРАФИКА</span></p><p className="seo-result-period">ПЕРВЫЕ ПЯТЬ МЕСЯЦЕВ ПОСЛЕ ЗАПУСКА<br/>{r.period.toUpperCase()}<br/>{r.source.toUpperCase()}</p></div></div>
  </div>
  <div className="seo-evidence-context"><p>{r.copy}</p><dl><div><dt>Всего визитов</dt><dd>{r.visits.toLocaleString('ru-RU')}</dd></div><div><dt>Визиты из поиска</dt><dd>{r.organicVisits.toLocaleString('ru-RU')}</dd></div><div><dt>Доля поиска</dt><dd>{r.organicShare}%</dd></div></dl></div>
  <aside className="seo-later"><div className="seo-later-copy"><span className="eyebrow">СЛЕДУЮЩИЙ ПЕРИОД</span><h3>Сайт продолжают находить.</h3><p>В следующем периоде органический поиск оставался заметным источником посещений.</p><p className="seo-later-period">169 визитов из поиска / 1 107 всего<br/>Июнь–август 2026 · Яндекс Метрика</p><a className="text-link" href="/images/evidence/allnrg/metrica-jun-aug-2026.pdf" target="_blank" rel="noreferrer">ОТКРЫТЬ ОТЧЁТ ЗА СЛЕДУЮЩИЙ ПЕРИОД ↗</a></div><a className="seo-later-phone" href="/images/evidence/allnrg/metrica-jun-aug-2026.pdf" target="_blank" rel="noreferrer" aria-label="Открыть отчёт Яндекс Метрики за июнь–август 2026: 15,3% трафика из поиска"><div className="seo-phone-screen"><span className="seo-phone-island" aria-hidden="true"/><div className="seo-phone-summary"><span>ALLIANCE ENERGY</span><p>15.3<span>%</span></p><span>ТРАФИК ИЗ ПОИСКА</span><small>ИЮНЬ — АВГУСТ 2026</small></div><div className="seo-phone-report"><span>ЯНДЕКС МЕТРИКА / ОРИГИНАЛ ОТЧЁТА</span><Image src="/images/evidence/allnrg/metrica-jun-aug-2026-1.png" alt="Отчёт Метрики: 169 визитов из поиска из 1 107 всего" width={1414} height={2000} unoptimized/></div><span className="seo-phone-home" aria-hidden="true"/></div></a></aside>
  <p className="seo-evidence-note">По информации владельца проекта, Яндекс Директ не использовался, расходы на продвижение были минимальными, а постоянное SEO-сопровождение завершилось после активного внедрения. Эти сведения предоставлены владельцем и не подтверждаются самим отчётом аналитики.</p>
  <div className="seo-page-evidence"><div><h3>Страницы для поиска.</h3><p>Июнь–август 2026 · Просмотры страниц из всех источников.<br/>Это просмотры, а не визиты из поиска.</p></div><div>{r.highlightedPages.map(p=><article key={p.title}><p><strong>{p.pageviews}</strong><span>ПРОСМОТРЫ</span></p><h4 lang="ru">{p.title}</h4></article>)}</div></div>
  <p className="seo-evidence-note">Период отчёта: {r.exactPeriod} · {r.source} · счётчик {r.counterId}. Доля поиска: {r.organicVisits} / {r.visits.toLocaleString('ru-RU')}, округлено до одного знака. Это зафиксированный результат, а не сравнение роста до и после.</p>
  {r.earlyStage&&<div className="seo-early-stage"><div><span className="eyebrow">С НУЛЯ / ПЕРВЫЙ ЭТАП</span><h3>Сайт с нуля.<br/>Первые посетители.</h3><p>Я начал проект с нуля: разработал сайт и его поисковую структуру. Отчёт Метрики за ранний период показывает аудиторию этого этапа из всех источников трафика.</p><button className="seo-source-action" onClick={e=>open(e.currentTarget,true)}>ОТКРЫТЬ РАННИЙ ОТЧЁТ ↗</button><noscript><a href={r.earlyStage.sourcePdf}>Оригинал раннего отчёта в PDF ↗</a></noscript></div><div><dl><div><dt>ПРОСМОТРЫ</dt><dd>{r.earlyStage.pageviews.toLocaleString('ru-RU')}</dd></div><div><dt>НОВЫЕ ПОСЕТИТЕЛИ</dt><dd>{r.earlyStage.newVisitors.toLocaleString('ru-RU')}</dd></div><div><dt>ВЕРНУВШИЕСЯ ПОСЕТИТЕЛИ</dt><dd>{r.earlyStage.returningVisitors.toLocaleString('ru-RU')}</dd></div></dl><p className="seo-evidence-note">{r.earlyStage.period} · Счётчик {r.earlyStage.counterId}. Данные об аудитории из всех источников за отдельный период, а не о визитах из поиска. Разные периоды не объединены в сравнение роста трафика.</p></div></div>}
  <dialog ref={dialog} className={`seo-source-viewer ${zoom?'source-zoomed':''}`} aria-labelledby="seo-source-title" data-lenis-prevent onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
   <div className="seo-source-content"><header><div><h3 id="seo-source-title">{r.source} / Оригинал отчёта</h3><p>{activeSource.exactPeriod} · Счётчик {activeSource.counterId}</p></div><div><button aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?'ПО ШИРИНЕ':'УВЕЛИЧИТЬ'}</button><button autoFocus onClick={()=>dialog.current?.close()} aria-label="Закрыть отчёт Метрики">ЗАКРЫТЬ ×</button></div></header><div className="seo-source-pages">{activeSource.sourceImages.map((src,i)=><figure key={src}><figcaption>ОРИГИНАЛ ОТЧЁТА / СТРАНИЦА {i+1} ИЗ {activeSource.sourceImages.length}</figcaption><Image src={src} alt={`${r.source} оригинальный отчёт, страница ${i+1} из ${activeSource.sourceImages.length}`} width={1414} height={2000} unoptimized/></figure>)}<a href={activeSource.sourcePdf} target="_blank" rel="noreferrer">ОТКРЫТЬ ОРИГИНАЛ PDF ↗</a></div></div>
  </dialog>
 </section>;
}
