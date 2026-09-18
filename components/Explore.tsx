'use client';
import { useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { featuredProjects } from '@/data/projects';
import { RouteLink } from './SiteShell';

export function Explore() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      gsap.fromTo('.explore-inner', { clipPath: 'circle(12% at 70% 0%)' }, { clipPath: 'circle(145% at 70% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: true } });
      gsap.to('.image-letter', { backgroundPosition: '65% 70%', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top center', end: 'bottom center', scrub: true, onUpdate: self => setActive(Math.min(2, Math.floor(self.progress * 3))) } });
    });
    return () => mm.revert();
  }, { scope: root });
  const p = featuredProjects[active];
  const style = { '--letter-image': `url("${p.cover}")` } as CSSProperties;
  return <section id="explore" ref={root} className="explore scene" aria-labelledby="explore-title">
    <div className="explore-inner">
      <span className="scene-kicker">A DIFFERENT WAY TO LOOK.</span>
      <h2 id="explore-title" className="explore-type" aria-label="Design to explore"><span className="type-line" aria-hidden="true"><span className="image-letter" style={{ '--letter-image': `url("${featuredProjects[0].cover}")` } as CSSProperties}>D</span>esi<span className="image-letter" style={style}>g</span>n</span><span className="type-line" aria-hidden="true">to expl<span className="image-letter" style={{ '--letter-image': `url("${featuredProjects[2].cover}")` } as CSSProperties}>o</span>re</span></h2>
      <div className="scene-index" aria-label="Explore featured work">{featuredProjects.map((project, i) => <button key={project.slug} aria-label={`0${i + 1} — Preview ${project.name}`} aria-pressed={active === i} onClick={() => setActive(i)}>0{i + 1}<span /></button>)}</div>
      <div className="scene-bottom"><p>PRODUCT<br />DESIGNER</p><RouteLink href={`/work/${p.slug}`} image={p.cover} className="line-link" data-cursor="VIEW">{p.shortName} ↗</RouteLink></div>
    </div>
  </section>;
}
