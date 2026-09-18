'use client';
import { useRef, useState, type PointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { featuredProjects } from '@/data/projects';
import { ProjectImage } from './ProjectImage';
import { RouteLink } from './SiteShell';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const current = useRef(0);
  const gesture = useRef({ x: 0, y: 0, moved: false });
  const suppressClick = useRef(false);
  const moveLens = useRef<((x: number, y: number) => void) | null>(null);
  const project = featuredProjects[active];
  function select(index: number) { current.current = index; setActive(index); }

  useGSAP(() => {
    const element = root.current!;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-wordmark', { yPercent: 28, opacity: 0, duration: .7, ease: 'power3.out' });
      gsap.from('.lens-link, .hero-caption', { opacity: 0, duration: .55, delay: .22 });
      gsap.to('.hero-wordmark', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: element, start: 'top top', end: 'bottom top', scrub: true } });
    });
    mm.add('(pointer: fine)', () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const setPosition = () => gsap.set(element, { '--lx': `${element.clientWidth * .70}px`, '--ly': `${element.clientHeight * .49}px` });
      setPosition();
      const xTo = gsap.quickTo(element, '--lx', { duration: reduced ? 0 : .38, ease: 'power3.out' });
      const yTo = gsap.quickTo(element, '--ly', { duration: reduced ? 0 : .38, ease: 'power3.out' });
      moveLens.current = (x, y) => { xTo(x); yTo(y); };
      const observer = new ResizeObserver(setPosition); observer.observe(element);
      return () => { observer.disconnect(); moveLens.current = null; xTo.tween.kill(); yTo.tween.kill(); };
    });
    return () => mm.revert();
  }, { scope: root });

  function pointerMove(e: PointerEvent<HTMLElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    if (e.pointerType === 'mouse') {
      const x = Math.max(box.width * .12, Math.min(box.width * .87, e.clientX - box.left));
      const y = Math.max(box.height * .29, Math.min(box.height * .67, e.clientY - box.top));
      moveLens.current?.(x, y);
      const next = Math.min(2, Math.floor((e.clientX - box.left) / box.width * 3));
      if (current.current !== next) select(next);
    }
  }
  function touchMove(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === 'mouse') return;
    const dx = e.clientX - gesture.current.x;
    const dy = e.clientY - gesture.current.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3 && !gesture.current.moved) {
      gesture.current.moved = true; suppressClick.current = true;
      select((current.current + (dx < 0 ? 1 : 2)) % 3);
    }
  }
  return <section className="hero scene" ref={root} onPointerMove={pointerMove} aria-labelledby="hero-title">
    <div className="hero-underworld" aria-hidden="true">{featuredProjects.map((p, i) => <div key={p.slug} className={`hero-world ${i === active ? 'is-active' : ''}`}><ProjectImage src={i === 0 ? p.images[2].src : p.cover} alt="" sizes="100vw" priority={i === 0} /></div>)}</div>
    <h1 id="hero-title" className="hero-wordmark">IMANAKOV</h1>
    <RouteLink href={`/work/${project.slug}`} image={project.cover} className="lens-link" aria-label={`Explore ${project.name}`}
      onPointerDown={e => { gesture.current = { x: e.clientX, y: e.clientY, moved: false }; suppressClick.current = false; }} onPointerMove={touchMove}
      onClick={e => { if (suppressClick.current) { e.preventDefault(); suppressClick.current = false; } }}>
      <span className="lens-plus" aria-hidden="true">↗</span><span className="lens-label">EXPLORE<br />PROJECTS <span className="lens-name">{project.shortName} — 0{active + 1}</span></span>
    </RouteLink>
    <div className="scene-bottom hero-caption"><p>PRODUCT<br />DESIGNER</p><div className="hero-select" aria-label="Select a featured project">{featuredProjects.map((p, i) => <button key={p.slug} onClick={() => select(i)} aria-label={`Reveal ${p.name}`} aria-pressed={i === active}>0{i + 1}</button>)}</div><a href="#explore" className="line-link">SCROLL</a></div>
    <p className="touch-hint">SWIPE THE LENS · TAP TO EXPLORE</p>
  </section>;
}
