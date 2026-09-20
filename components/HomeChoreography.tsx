'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const scenes = ['HERO', 'LOOK', 'WORK', 'SEO', 'LAB', 'CONTACT'];

export function HomeChoreography({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cueVisible, setCueVisible] = useState(true);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = [...host.querySelectorAll<HTMLElement>('[data-home-scene]')];
      const marker = window.scrollY + window.innerHeight * 0.42;
      let next = 0;
      sections.forEach((section, index) => { if (section.getBoundingClientRect().top + window.scrollY <= marker) next = index; });
      setActive(Math.min(scenes.length - 1, next));
      setCueVisible(window.scrollY < 52);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const hero = host.querySelector<HTMLElement>('[data-home-scene="hero"]');
      const explore = host.querySelector<HTMLElement>('[data-home-scene="explore"]');
      const work = host.querySelector<HTMLElement>('[data-home-scene="work"]');
      const play = host.querySelector<HTMLElement>('[data-home-scene="play"]');
      if (hero && explore) gsap.to(hero.querySelectorAll('.hero-underworld, .lens-link, .hero-caption'), { opacity: 0.68, ease: 'none', scrollTrigger: { trigger: explore, start: 'top bottom', end: 'top 35%', scrub: true } });
      if (explore && work) {
        gsap.fromTo(explore.querySelector('.explore-inner'), { opacity: 1 }, { opacity: 0.18, ease: 'none', scrollTrigger: { trigger: work, start: 'top 90%', end: 'top 35%', scrub: true } });
        // Keep the CSS centering transform intact throughout scroll and resize.
        gsap.fromTo(explore.querySelector('.explore-type'), { opacity: 1 }, { opacity: 0.35, ease: 'power2.in', scrollTrigger: { trigger: work, start: 'top 88%', end: 'top 38%', scrub: true } });
      }
      if (work) gsap.fromTo(work.querySelector('.card-space'), { opacity: 0.72, scale: 0.97, y: 40 }, { opacity: 1, scale: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: work, start: 'top 92%', end: 'top 42%', scrub: true } });
      if (play) gsap.fromTo(play.querySelector('.play-folders-reveal'), { opacity: 0.35, y: 18 }, { opacity: 1, y: 0, ease: 'power2.out', scrollTrigger: { trigger: play, start: 'top 88%', end: 'top 38%', scrub: true } });
    }, root);
    return () => { media.revert(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div className={`home-choreography ${cueVisible ? '' : 'is-scrolled'}`} ref={root} data-home-choreography>
    <aside className={`home-progress ${active > 0 ? 'is-visible' : ''}`} aria-label="Home sections"><span className="home-progress-current">0{Math.min(active + 1, scenes.length)}</span><span className="home-progress-track" aria-hidden="true">{scenes.map((scene, index) => <i key={scene} className={index === active ? 'is-active' : ''} />)}</span><span className="home-progress-total">0{scenes.length}</span></aside>
    {children}
  </div>;
}
