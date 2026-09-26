'use client';
import { useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects as featuredProjects } from '@/data/projects';
import { RouteLink } from './SiteShell';

gsap.registerPlugin(ScrollTrigger);

export function Explore() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const chars = root.current?.querySelectorAll('.type-char');
      if (chars && chars.length > 0) {
        // Bidirectional scrub: typing on scroll down, erasing in reverse on scroll up
        gsap.fromTo(chars,
          { opacity: 0, y: 14, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 70%',
              end: 'top 12%',
              scrub: 1.2
            }
          }
        );
      }
    });
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      gsap.fromTo('.explore-inner', { clipPath: 'circle(12% at 70% 0%)' }, { clipPath: 'circle(145% at 70% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 40%', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });
  const p = featuredProjects[active];
  function letter(character: string, offset: number) {
    const project = featuredProjects[(active + offset) % featuredProjects.length];
    return <RouteLink href={`/work/${project.slug}`} image={project.cover} className="image-letter type-char" data-case={project.slug} data-cursor="VIEW" aria-label={`View ${project.name}`} style={{ '--letter-color': project.color } as CSSProperties}>{character}</RouteLink>;
  }
  return <section id="explore" ref={root} className="explore scene" aria-labelledby="explore-title">
    <div className="explore-inner">
      <span className="scene-kicker">ПРОЕКТЫ В СЕТИ / 01–06.</span>
      <h2 id="explore-title" className="explore-type" aria-label="Design to explore">
        <span className="type-line">
          {letter('D', 0)}
          <span className="type-char">e</span>
          {letter('s', 3)}
          <span className="type-char">i</span>
          {letter('g', 1)}
          <span className="type-char">n</span>
        </span>
        <span className="type-line">
          <span className="type-char">t</span>
          <span className="type-char">o</span>
          <span className="type-space">&nbsp;</span>
          {letter('e', 4)}
          <span className="type-char">x</span>
          <span className="type-char">p</span>
          <span className="type-char">l</span>
          {letter('o', 2)}
          <span className="type-char">r</span>
          {letter('e', 5)}
        </span>
      </h2>
      <div className="scene-index" aria-label="Explore featured work">{featuredProjects.map((project, i) => <button key={project.slug} aria-label={`0${i + 1} — Preview ${project.name}`} aria-pressed={active === i} onClick={() => setActive(i)}>0{i + 1}<span /></button>)}</div>
      <div className="scene-bottom"><p>ENGINEERED TO SHIP.<br />BUILT TO PERFORM.</p><RouteLink href={`/work/${p.slug}`} image={p.cover} className="line-link" data-cursor="VIEW">{p.shortName} ↗</RouteLink></div>
    </div>
  </section>;
}
