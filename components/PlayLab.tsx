'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { projects } from '@/data/projects';
import { ProjectImage } from './ProjectImage';

const studies = [
  { name: 'Cursor reveal', description: 'A window into another layer. Move across the image or use the slider.', type: 'reveal' },
  { name: 'Card physics', description: 'A flat image becomes an object. Drag the slider to change its perspective.', type: 'cards' },
  { name: 'Type mask', description: 'Typography as an image. Change the scale to explore what the letters reveal.', type: 'type' },
  { name: 'Motion study', description: 'The same distance, two different rhythms. Compare a linear movement with a controlled ease.', type: 'motion' },
  { name: 'Portal', description: 'A narrow opening becomes a whole new world. Open it, close it, look again.', type: 'portal' },
];
export function PlayLab({ teaser = false }: { teaser?: boolean }) {
  const [active, setActive] = useState(1);
  const [opened, setOpened] = useState<number | null>(null);
  const [value, setValue] = useState(50);
  const [portalOpen, setPortalOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const demo = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    if (opened !== null) dialog.current?.showModal();
    return () => { animation.current?.kill(); };
  }, [opened]);
  function open(index: number) { setActive(index); setValue(50); setPortalOpen(false); setOpened(index); }
  function close() { dialog.current?.close(); setOpened(null); }
  function motion() {
    animation.current?.kill();
    const distance = Math.max(20, (demo.current?.clientWidth || 350) - 100);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    animation.current = gsap.timeline().set('.motion-block', { x: 0 }).to('.motion-linear', { x: distance, duration: reduced ? 0 : 1.4, ease: 'none' }).to('.motion-eased', { x: distance, duration: reduced ? 0 : 1.4, ease: 'power3.inOut' }, 0);
  }
  const study = opened !== null ? studies[opened] : null;
  const Heading = teaser ? 'h2' : 'h1';
  return <>
    <section className={`play-scene scene ${teaser ? '' : 'play-full'}`} aria-labelledby="play-title">
      <span className="scene-kicker">THE INTERACTION LAB / FIVE LITTLE STUDIES</span>
      <Heading className="play-title" id="play-title">Ideas<br />into<br />products</Heading>
      <div className="folder-field" aria-label="Interaction experiments">{studies.map((s, i) => <button key={s.type} className={`folder folder-${i} ${active === i ? 'active' : ''}`} onClick={() => open(i)} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-haspopup="dialog" data-cursor="OPEN"><span className="folder-sheet" /><span className="folder-front"><span className="folder-number">0{i + 1}</span><span className="folder-name">{s.name}</span><span className="folder-plus" aria-hidden="true">↗</span></span></button>)}</div>
      <div className="scene-bottom"><p>PRODUCT<br />DESIGNER <span className="status-dot" /></p>{teaser ? <Link href="/play" className="line-link">A MORE<br />CURIOUS WORLD</Link> : <span className="line-link">OPEN A FOLDER.<br />TRY SOMETHING.</span>}</div>
      <noscript><p className="nojs-message">These five studies explore reveal, perspective, typography, easing and transitions. Enable JavaScript to interact, or <Link href="/#work">explore the projects</Link>.</p></noscript>
    </section>
    <dialog ref={dialog} className="experiment-dialog" aria-labelledby="experiment-title" onClose={() => setOpened(null)} onClick={e => { if (e.target === dialog.current) close(); }}>
      {study && <div className="experiment-content"><div className="experiment-heading"><span className="eyebrow">PLAY / 0{opened! + 1}</span><button className="circle-button" onClick={close} aria-label="Close experiment">×</button></div>
        <h2 id="experiment-title">{study.name}</h2><p>{study.description}</p>
        <div className={`experiment-demo demo-${study.type}`} ref={demo} style={{ '--value': value, '--demo-x': `${value}%` } as CSSProperties}
          onPointerMove={e => { if (study.type !== 'reveal' || e.pointerType !== 'mouse') return; const box = e.currentTarget.getBoundingClientRect(); setValue(Math.round((e.clientX - box.left) / box.width * 100)); }}>
          {study.type === 'reveal' && <><span className="demo-word">LOOK.</span><div className="demo-reveal"><ProjectImage src={projects[0].cover} alt="" sizes="650px" /></div></>}
          {study.type === 'cards' && <div className="demo-card"><ProjectImage src={projects[1].cover} alt="Legacy project image on an interactive perspective card" sizes="500px" /><span>LEGACY / 02</span></div>}
          {study.type === 'type' && <span className="demo-type">Play</span>}
          {study.type === 'motion' && <><div className="motion-track"><span>LINEAR</span><div className="motion-block motion-linear" /></div><div className="motion-track"><span>POWER 3</span><div className="motion-block motion-eased" /></div></>}
          {study.type === 'portal' && <div className={`portal-demo-window ${portalOpen ? 'is-open' : ''}`}><ProjectImage src={projects[2].cover} alt="VPN equipment project revealed through an opening" sizes="650px" /></div>}
        </div>
        {['reveal', 'cards', 'type'].includes(study.type) ? <label className="demo-control">{study.type === 'reveal' ? 'Reveal position' : study.type === 'cards' ? 'Perspective' : 'Image scale'}<input type="range" min="0" max="100" value={value} onChange={e => setValue(Number(e.target.value))} /><output>{value}%</output></label> : <button className="text-button" onClick={study.type === 'motion' ? motion : () => setPortalOpen(v => !v)}>{study.type === 'motion' ? 'PLAY BOTH →' : portalOpen ? 'CLOSE THE PORTAL −' : 'OPEN THE PORTAL +'}</button>}
      </div>}
    </dialog>
  </>;
}
