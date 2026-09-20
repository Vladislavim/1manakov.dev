'use client';
import { useRef, useState, type PointerEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects as featuredProjects } from '@/data/projects';
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
      // CSS owns centering; entrance and scroll must not rewrite its transform.
      gsap.from('.hero-wordmark', { opacity: 0, duration: .7, ease: 'power3.out' });
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
      const y = Math.max(box.height * .38, Math.min(box.height * .59, e.clientY - box.top));
      if (root.current) root.current.dataset.edge = x / box.width > .72 ? 'right' : 'center';
      moveLens.current?.(x, y);
      const next = Math.max(0, Math.min(featuredProjects.length - 1, Math.floor((e.clientX - box.left) / box.width * featuredProjects.length)));
      if (current.current !== next) select(next);
    }
  }
  function touchMove(e: PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType === 'mouse') return;
    const dx = e.clientX - gesture.current.x;
    const dy = e.clientY - gesture.current.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3 && !gesture.current.moved) {
      gesture.current.moved = true; suppressClick.current = true;
      select((current.current + (dx < 0 ? 1 : featuredProjects.length - 1)) % featuredProjects.length);
    }
  }
  return <section className="hero scene" ref={root} onPointerMove={pointerMove} aria-labelledby="hero-title">
    <div className="hero-underworld" aria-hidden="true">{featuredProjects.map((p, i) => <div key={p.slug} data-case={p.slug} className={`hero-world ${i === active ? 'is-active' : ''}`}><ProjectImage src={p.cover} alt="" sizes="(max-width: 767px) 420px, 700px" priority={i === 0} eager unoptimized /></div>)}</div>
    <h1 id="hero-title" className="hero-wordmark">IMANAKOV</h1>

    <div className="hero-type-inversion" aria-hidden="true"><span className="hero-wordmark">IMANAKOV</span></div>
    <RouteLink href={`/work/${project.slug}`} image={project.cover} className="lens-link" data-project={project.slug}
      onPointerDown={e => { gesture.current = { x: e.clientX, y: e.clientY, moved: false }; suppressClick.current = false; }} onPointerMove={touchMove}
      onPointerUp={e => {
        if (e.pointerType !== 'touch' || gesture.current.moved) return;
        if (Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) > 10) return;
        // A tap following a horizontal swipe can lose its compatibility click.
        // Activate the native link once on release; the route lock guards duplicates.
        e.preventDefault();
        e.currentTarget.click();
      }}
      onClick={e => { if (suppressClick.current) { e.preventDefault(); suppressClick.current = false; } }}>
      <span className="lens-plus" aria-hidden="true">↗</span><span className="lens-label">EXPLORE<br />PROJECTS <span className="lens-name">{project.shortName} — 0{active + 1}</span></span>
    </RouteLink>
    <div className="scene-bottom hero-caption"><p>PRODUCT<br />DESIGNER</p><div className="hero-select" aria-label="Select a featured project">{featuredProjects.map((p, i) => <button key={p.slug} onClick={() => select(i)} aria-label={`0${i + 1} — Reveal ${p.name}`} aria-pressed={i === active}>0{i + 1}</button>)}</div><a href="#explore" className="line-link home-scroll-cue-target">SCROLL</a></div>
    <p className="touch-hint">SWIPE THE LENS · TAP TO EXPLORE</p>
  </section>;
}
