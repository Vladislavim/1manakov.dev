'use client';
import { useEffect, useRef, useState } from 'react';

const projects = ['Сайт мастерской', 'Запись на экскурсию', 'Каталог оборудования', 'Сервис доставки', 'Личный кабинет', 'Подбор курса', 'Бронирование номера', 'Сайт студии', 'База знаний'];

function ResultsBrowser({ mode }: { mode: number }) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const lastSelected = useRef<string | null>(null);
  useEffect(() => {
    if (selected) {
      lastSelected.current = selected;
      root.current?.querySelector<HTMLButtonElement>('.guide-demo-detail button')?.focus();
    } else if (lastSelected.current) {
      const button = [...(root.current?.querySelectorAll<HTMLButtonElement>('[data-project]') || [])].find(el=>el.dataset.project===lastSelected.current);
      button?.focus();
    }
  },[selected]);
  const start = mode === 0 ? (page - 1) * 3 : 0;
  const visible = projects.slice(start, page * 3);
  return <div className="guide-live-example" ref={root}>
    <span className="eyebrow">УЧЕБНЫЙ КАТАЛОГ / 9 ПРОЕКТОВ</span>
    <p>Откройте шестой проект, затем вернитесь. Проверьте, сохранились ли набор и выбранная позиция.</p>
    {selected ? <div className="guide-demo-detail"><button onClick={() => setSelected(null)}>← К результатам</button><h4>{selected}</h4><p>Карточка учебного проекта. При возврате список сохранит состояние этой сессии.</p></div> : <>
      <div className="guide-demo-results">{visible.map((name,i) => <button key={name} data-project={name} onClick={() => setSelected(name)}><span>{String(start+i+1).padStart(2,'0')}</span>{name}<span aria-hidden="true">↗</span></button>)}</div>
      {mode === 0 ? <nav aria-label="Страницы учебного каталога">{[1,2,3].map(n => <button key={n} aria-current={n===page?'page':undefined} onClick={() => setPage(n)}>{n}</button>)}</nav> : <button disabled={page===3} onClick={() => setPage(p=>Math.min(3,p+1))}>{page===3?'Все проекты показаны':'Показать ещё 3 проекта'}</button>}
      <p role="status">{mode===0?`Страница ${page} из 3`:`Показано ${visible.length} из 9`}. {mode===0?'Набор заменяется.':'Предыдущие результаты остаются на месте.'}</p>
    </>}
    {mode===2&&<p className="workbench-note">Для потока здесь оставлена явная кнопка продолжения: можно дойти до конца списка. Автоподгрузка без такого выхода мешала бы доступу к нижним блокам.</p>}
    <small>Это локальный пример. В продукте номер страницы и фильтры также сохраняются в URL, а возврат восстанавливает фокус и прокрутку.</small>
  </div>;
}

function Dashboard({ mode }: { mode: number }) {
  const [resolved,setResolved]=useState(false);
  const panels = [
    <section key="action" className="guide-dashboard-panel"><span>ТРЕБУЕТ ДЕЙСТВИЯ</span><h4>{resolved?'Очередь обработана':'Заявка без ответа'}</h4><p>{resolved?'Задача исчезла из активной очереди.':'Откройте обращение и зафиксируйте следующий шаг.'}</p><button onClick={()=>setResolved(v=>!v)}>{resolved?'Вернуть учебную задачу':'Отметить обработанной'}</button></section>,
    <section key="comparison" className="guide-dashboard-panel"><span>СОПОСТАВИМЫЕ ДАННЫЕ</span><h4>Обработанные заявки</h4><div className="guide-demo-bars"><div><span>Период A · 6</span><i style={{width:'60%'}}/></div><div><span>Период B · 8</span><i style={{width:'80%'}}/></div></div><small>Одна шкала: 0–10. Учебные значения, не клиентские результаты.</small></section>,
    <section key="context" className="guide-dashboard-panel"><span>КОНТЕКСТ</span><h4>Журнал действий</h4><p>{resolved?'Обращение обработано · сейчас':'Новое обращение · сегодня'}</p></section>,
  ];
  return <div className="guide-live-example"><span className="eyebrow">ОДНИ ДАННЫЕ / РАЗНЫЙ ПРИОРИТЕТ</span><div className="guide-dashboard">{(mode===1?[1,0,2]:mode===2?[0,2,1]:[0,1,2]).map(i=>panels[i])}</div><p role="status">{mode===1?'Сначала сравнение на одинаковой шкале.':'Сначала объект, требующий действия.'} Изменяется иерархия, а не набор данных.</p></div>;
}

function Tokens({ mode }: { mode: number }) {
  const [color,setColor]=useState('#275c46');
  const [linked,setLinked]=useState(true);
  return <div className="guide-live-example"><span className="eyebrow">ПРОВЕРЬТЕ СВЯЗЬ С КОДОМ</span><p>Измените токен акцента. Затем отключите связь второго компонента — так выглядит локальное переопределение, которое перестаёт получать общие изменения.</p><div className="guide-token-controls"><label>Токен accent<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label><label><input type="checkbox" checked={linked} onChange={e=>setLinked(e.target.checked)}/>Второй компонент использует токен</label></div><div className="guide-token-preview"><div style={{borderColor:color}}><span style={{color}}>Компонент A</span><i style={{background:color}}/></div><div style={{borderColor:linked?color:'#756b60'}}><span style={{color:linked?color:'#756b60'}}>Компонент B</span><i style={{background:linked?color:'#756b60'}}/></div></div><p role="status">{linked?'Оба компонента обновляются от одного значения.':'Компонент B отделён от общего токена: обновление до него не доходит.'}</p><small>{mode===0?'Для одного сайта это может быть небольшой набор переменных и компонентов.':mode===1?'Для нескольких продуктов дополнительно нужны версии, владельцы и правила внедрения.':'При аудите ищите такие переопределения и выясняйте их причину.'} Изменение цвета само по себе ещё не делает UI-kit дизайн-системой.</small></div>;
}

export function GuideDecisionPreview({slug,mode}:{slug:string;mode:number}) {
  if(slug==='pagination-or-load-more') return <ResultsBrowser key={mode} mode={mode}/>;
  if(slug==='dashboard-hierarchy-examples') return <Dashboard mode={mode}/>;
  if(slug==='design-system-vs-ui-kit') return <Tokens mode={mode}/>;
  return null;
}
