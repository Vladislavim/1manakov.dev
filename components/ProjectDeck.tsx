'use client';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects } from '@/data/projects';
import { ProjectImage } from './ProjectImage';
import { RouteLink } from './SiteShell';

export function ProjectDeck() {
  const root = useRef<HTMLElement>(null);
  const fan = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const start = useRef<{ x: number; y: number; time: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);
  const settle = useRef<gsap.core.Tween | null>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
      gsap.fromTo('.card-space', { rotateY: -8 }, { rotateY: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => { mm.revert(); settle.current?.kill(); };
  }, { scope: root });
  function cycle(direction: number) { setActive(a => (a + direction + projects.length) % projects.length); }
  function move(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (!start.current.dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { start.current = null; return; }
    if (Math.abs(dx) > 9) {
      start.current.dragging = true;
      suppressClick.current = true;
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
      gsap.set(fan.current, { x: dx * .3, rotation: dx * .012 });
    }
  }
  function end(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const velocity = dx / Math.max(1, performance.now() - start.current.time);
    if (start.current.dragging && (Math.abs(dx) > 38 || Math.abs(velocity) > .35)) cycle(dx < 0 ? 1 : -1);
    start.current = null;
    settle.current?.kill();
    settle.current = gsap.to(fan.current, { x: 0, rotation: 0, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .5, ease: 'power3.out' });
  }
  return <section id="work" className="work scene" ref={root} aria-labelledby="work-title">
    <span className="scene-kicker">SELECTED WORK / 01—{String(projects.length).padStart(2, '0')}</span>
    <h2 id="work-title" className="work-title">PRODUCT<br />DESIGNER</h2>
    <div className="card-space"><div className="card-fan" ref={fan} data-cursor="DRAG"
      onPointerDown={e => { if (e.button !== 0) return; start.current = { x: e.clientX, y: e.clientY, time: performance.now(), dragging: false }; suppressClick.current = false; settle.current?.kill(); }}
      onPointerMove={move} onPointerUp={end} onPointerCancel={() => { start.current = null; gsap.set(fan.current, { x: 0, rotation: 0 }); }}>
      {projects.map((p, i) => {
        const order = (i - active + projects.length) % projects.length;
        return <RouteLink key={p.slug} href={`/work/${p.slug}`} image={p.cover} className={`project-card position-${order}`} style={{ '--card-color': p.color, '--card-ink': p.ink, zIndex: projects.length - order } as CSSProperties} data-cursor={order === 0 ? 'VIEW' : 'DRAG'}
          onFocus={() => setActive(i)} data-project={p.slug}
          onClick={e => { if (suppressClick.current) { e.preventDefault(); suppressClick.current = false; } else if (order !== 0) { e.preventDefault(); setActive(i); } }} onDragStart={e => e.preventDefault()}>
          <span className="card-number">{p.number} / {String(projects.length).padStart(2, '0')}</span><div className="card-art"><ProjectImage src={p.cover} alt="" sizes="(max-width: 767px) 80vw, 40vw" /></div>
          <span className="card-meta"><span className="card-name">{p.shortName}</span><span className="card-category">{p.category}</span><span className="card-arrow" aria-hidden="true">↗</span></span>
        </RouteLink>;
      })}
    </div></div>
    <div className="scene-bottom"><span className="drag-caption"><span aria-hidden="true">⟷</span> DRAG<br />TO EXPLORE</span><div className="deck-controls"><button onClick={() => cycle(-1)} aria-label="Previous project">←</button><span aria-live="polite">0{active + 1}<span className="muted"> / {String(projects.length).padStart(2, '0')}</span></span><button onClick={() => cycle(1)} aria-label="Next project">→</button></div></div>
    <noscript><div className="nojs-work">{projects.map(p => <a key={p.slug} href={`/work/${p.slug}`}>{p.name} ↗</a>)}</div></noscript>
  </section>;
}
