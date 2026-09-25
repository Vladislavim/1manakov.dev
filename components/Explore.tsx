'use client';
import { useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects as featuredProjects } from '@/data/projects';
import { RouteLink } from './SiteShell';

export function Explore() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      gsap.fromTo('.explore-inner', { clipPath: 'circle(12% at 70% 0%)' }, { clipPath: 'circle(145% at 70% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });
  const p = featuredProjects[active];
  function letter(character: string, offset: number) {
    const project = featuredProjects[(active + offset) % featuredProjects.length];
    return <RouteLink href={`/work/${project.slug}`} image={project.cover} className="image-letter" data-case={project.slug} data-cursor="VIEW" aria-label={`View ${project.name}`} style={{ '--letter-color': project.color } as CSSProperties}>{character}</RouteLink>;
  }
  return <section id="explore" ref={root} className="explore scene" aria-labelledby="explore-title">
    <div className="explore-inner">
      <span className="scene-kicker">A DIFFERENT WAY TO LOOK.</span>
      <h2 id="explore-title" className="explore-type" aria-label="Design to explore"><span className="type-line">{letter('D', 0)}e{letter('s', 3)}i{letter('g', 1)}n</span><span className="type-line">to {letter('e', 4)}xpl{letter('o', 2)}r{letter('e', 5)}</span></h2>
      <div className="scene-index" aria-label="Explore featured work">{featuredProjects.map((project, i) => <button key={project.slug} aria-label={`0${i + 1} — Preview ${project.name}`} aria-pressed={active === i} onClick={() => setActive(i)}>0{i + 1}<span /></button>)}</div>
      <div className="scene-bottom"><p>PRODUCT<br />DESIGNER</p><RouteLink href={`/work/${p.slug}`} image={p.cover} className="line-link" data-cursor="VIEW">{p.shortName} ↗</RouteLink></div>
    </div>
  </section>;
}
