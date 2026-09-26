'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects } from '@/data/projects';
import { captureOutgoing, portalPath } from '@/lib/portal-transition';

gsap.registerPlugin(useGSAP, ScrollTrigger);
type Navigation = { navigate: (href: string, image?: string, origin?: {x:number;y:number}) => void };
const NavigationContext = createContext<Navigation | null>(null);

export function RouteLink({ href, children, image, className, ...props }: {
  href: string; children: ReactNode; image?: string; className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const context = useContext(NavigationContext);
  function click(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented || !context || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const box=event.currentTarget.getBoundingClientRect();
    context.navigate(href, image, {x:event.detail?event.clientX:box.left+box.width/2,y:event.detail?event.clientY:box.top+box.height/2});
  }
  return <Link {...props} data-route-transition="true" href={href} className={className} onClick={click}>{children}</Link>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const shell = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const outgoing = useRef<HTMLDivElement>(null);
  const aperture = useRef<SVGPathElement>(null);
  const origin = useRef({x:0,y:0});
  const veil = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const destination = useRef('');
  const hrefHash = useRef('');
  const previousPath = useRef(path);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const revealFrame = useRef<number | undefined>(undefined);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cancelCaseIntro = useRef<(() => void) | null>(null);
  const [progress, setProgress] = useState(0);

  const release = useCallback(() => {
    const introduceCase = destination.current.startsWith('/work/') && hrefHash.current === 'decision';
    if (revealFrame.current !== undefined) cancelAnimationFrame(revealFrame.current);
    if (timeout.current) clearTimeout(timeout.current);
    if (portal.current) gsap.set(portal.current, { autoAlpha: 0 });
    outgoing.current?.replaceChildren();
    aperture.current?.setAttribute('d','M0,0 Z');
    if (veil.current) gsap.set(veil.current, { autoAlpha: 0 });
    locked.current = false;
    hrefHash.current = '';
    lenisRef.current?.start();
    if (introduceCase && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelCaseIntro.current?.();
      const position = { y: window.scrollY };
      const cancel = () => {
        tween.kill();
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        window.removeEventListener('keydown', cancel);
        window.removeEventListener('pointerdown', cancel);
        window.removeEventListener('popstate', cancel);
        cancelCaseIntro.current = null;
      };
      const tween = gsap.to(position, {
        y: 0, delay: .65, duration: 2.4, ease: 'power2.inOut',
        onUpdate: () => {
          if (document.querySelector('dialog[open]')) { cancel(); return; }
          if (lenisRef.current) lenisRef.current.scrollTo(position.y, { immediate: true, force: true });
          else window.scrollTo(0, position.y);
        },
        onComplete: () => {
          window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
          cancel();
        },
      });
      cancelCaseIntro.current = cancel;
      window.addEventListener('wheel', cancel, { passive: true });
      window.addEventListener('touchstart', cancel, { passive: true });
      window.addEventListener('keydown', cancel);
      window.addEventListener('pointerdown', cancel);
      window.addEventListener('popstate', cancel);
    }
  }, []);
  useEffect(() => () => cancelCaseIntro.current?.(), []);

  const navigate = useCallback((href: string, image?: string, point?: {x:number;y:number}) => {
    cancelCaseIntro.current?.();
    if (path === '/' && href.startsWith('/work/') && !href.includes('#') && !matchMedia('(prefers-reduced-motion: reduce)').matches) href += '#decision';
    const targetPath = href.split('#')[0];
    const hash = href.split('#')[1] || '';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (locked.current) return;
    if (targetPath === path) {
      const target = hash ? document.getElementById(hash) : 0;
      if (lenisRef.current) {
        // Native anchor/focus scrolling can precede Lenis' next frame.
        // Synchronize its position before asking it to return to zero.
        lenisRef.current.scrollTo(window.scrollY, { immediate: true, force: true });
        lenisRef.current.scrollTo(target || 0, { immediate: reduced, force: true });
      }
      else if (target instanceof HTMLElement) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      if (hash) window.history.pushState({ ...window.history.state }, '', href);
      return;
    }
    hrefHash.current = hash;
    router.prefetch(href);
    if (reduced) { router.push(href); return; }
    if (!image) {
      const layer = veil.current;
      if (!layer) { router.push(href); return; }
      locked.current = true;
      destination.current = targetPath;
      lenisRef.current?.stop();
      gsap.set(layer, { autoAlpha: 1, opacity: 0 });
      timeline.current?.kill();
      timeline.current = gsap.timeline().to(layer, { opacity: 1, duration: .42, ease: 'sine.inOut' }).call(() => router.push(href, { scroll: !href.includes('#') }));
      timeout.current = setTimeout(release, 5000);
      return;
    }
    const layer = portal.current;
    if (!layer) { router.push(href); return; }
    locked.current = true;
    destination.current = targetPath;
    lenisRef.current?.stop();
    origin.current=matchMedia('(pointer:coarse)').matches?{x:innerWidth*.5,y:innerHeight*.45}:(point||{x:innerWidth*.7,y:innerHeight*.49});
    if(outgoing.current)captureOutgoing(outgoing.current);
    aperture.current?.setAttribute('d','M0,0 Z');
    gsap.set(layer, { autoAlpha: 1 });
    timeline.current?.kill();
    router.push(href, { scroll: false });
    timeout.current = setTimeout(release, 5000);
  }, [path, router, release]);

  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    if (revealFrame.current !== undefined) cancelAnimationFrame(revealFrame.current);
    if (locked.current && destination.current === path) {
      const saved = 0;
      if (lenisRef.current) lenisRef.current.scrollTo(saved, { immediate: true, force: true });
      else window.scrollTo(0, saved);
      revealFrame.current = requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
        if (hrefHash.current) {
          const target = document.getElementById(hrefHash.current);
          if (target && lenisRef.current) lenisRef.current.scrollTo(target, { immediate: true, force: true });
          else target?.scrollIntoView({ behavior: 'auto' });
        }
        if (portal.current?.style.visibility === 'visible' || portal.current?.style.opacity === '1') {
          const {x,y}=origin.current;
          const mobile=matchMedia('(pointer:coarse)').matches;
          timeline.current = gsap.timeline({ onComplete: release })
            .set(aperture.current,{attr:{d:portalPath(x,y,0,0)}})
            .to(aperture.current,{attr:{d:portalPath(x,y,mobile?90:65,innerHeight*1.6)},duration:.55,ease:'sine.inOut'})
            .to(aperture.current,{attr:{d:portalPath(innerWidth*.5,innerHeight*.5,innerWidth*4,innerHeight*4)},duration:mobile?1.05:1.25,ease:'sine.inOut'});
        } else {
          timeline.current = gsap.timeline({ onComplete: release }).to(veil.current, { opacity: 0, duration: .65, ease: 'sine.inOut' });
        }
      });
    } else if (locked.current) { timeline.current?.kill(); release(); }
    ScrollTrigger.refresh();
    return () => { if (revealFrame.current !== undefined) cancelAnimationFrame(revealFrame.current); };
  }, [path, release]);

  useEffect(() => {
    const history = () => { if (locked.current) { timeline.current?.kill(); release(); } };
    window.addEventListener('popstate', history);
    return () => window.removeEventListener('popstate', history);
  }, [release]);

  useEffect(() => {
    let cancelled = false;
    const count = { value: 0 };
    const ready = () => { if (!cancelled) setProgress(Math.round(++count.value / 2 * 100)); };
    const img = new window.Image();
    img.src = projects[0].images[2].src;
    img.decode().catch(() => {}).then(ready);
    document.fonts.ready.then(ready);
    const finish = () => {
      if (cancelled || !loader.current) return;
      setProgress(100);
      gsap.to(loader.current, { opacity: 0, duration: .18, onComplete: () => { if (loader.current) loader.current.style.visibility = 'hidden'; } });
    };
    Promise.allSettled([img.decode(), document.fonts.ready]).then(finish);
    const fallback = setTimeout(finish, 1200);
    return () => { cancelled = true; clearTimeout(fallback); if (timeout.current) clearTimeout(timeout.current); timeline.current?.kill(); };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const lenis = new Lenis({ lerp: .09, smoothWheel: true, syncTouch: false, anchors: true });
      lenisRef.current = lenis;
      let offerPaused = false;
      const update = (time: number) => {
        const offerOpen = Boolean(document.querySelector('.exit-offer[open]'));
        if (offerOpen && !offerPaused && !lenis.isStopped) {
          lenis.stop();
          offerPaused = true;
        } else if (!offerOpen && offerPaused) {
          lenis.start();
          offerPaused = false;
        }
        lenis.raf(time * 1000);
      };
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      const visibility = () => { if (document.hidden) gsap.ticker.remove(update); else gsap.ticker.add(update); };
      document.addEventListener('visibilitychange', visibility);
      return () => { lenis.destroy(); lenisRef.current = null; gsap.ticker.remove(update); document.removeEventListener('visibilitychange', visibility); };
    });
    mm.add('(pointer: fine)', () => {
      const dot = cursor.current;
      if (!dot) return;
      const x = gsap.quickTo(dot, 'x', { duration: .04, ease: 'power2.out' });
      const y = gsap.quickTo(dot, 'y', { duration: .04, ease: 'power2.out' });
      const move = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        x(e.clientX); y(e.clientY);
        const target = e.target as HTMLElement;
        const isInput = Boolean(target.closest('input:not([type=button]):not([type=submit]), textarea, select, [contenteditable=true], .exit-offer'));
        if (isInput) {
          dot.style.opacity = '0';
          return;
        }
        const active = target.closest<HTMLElement>('[data-cursor]');
        const isLink = Boolean(target.closest('a, button, [role=button], .image-letter'));
        dot.dataset.active = active ? 'true' : 'false';
        dot.dataset.link = isLink ? 'true' : 'false';
        dot.dataset.hidden = 'false';
        const label = active?.dataset.cursor || '';
        const badge = dot.querySelector('span');
        if (badge) badge.textContent = label === 'DRAG' ? '↔' : label === 'BACK' ? '←' : label;
        dot.style.opacity = '1';
      };
      const leave = () => { dot.style.opacity = '0'; };
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
      return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); x.tween.kill(); y.tween.kill(); };
    });
    return () => mm.revert();
  }, { scope: shell });

  function routeClick(event: MouseEvent<HTMLDivElement>) {
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const anchor=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if(!anchor||anchor.hasAttribute('data-route-transition')||anchor.target||anchor.hasAttribute('download'))return;
    const url=new URL(anchor.href,window.location.href);
    if(url.origin!==window.location.origin||url.pathname===path||/\.[a-z0-9]+$/i.test(url.pathname))return;
    event.preventDefault();navigate(url.pathname+url.search+url.hash);
  }

  return <NavigationContext.Provider value={{ navigate }}><div ref={shell} onClickCapture={routeClick}>
    <a className="skip-link" href="#main" tabIndex={0}>Skip to content</a>
    <header className="site-header">
      <RouteLink href="/" className="brand" image={path.startsWith('/work/') ? projects.find(p => path.endsWith(p.slug))?.cover : undefined} aria-label="Imanakov — home">IMANAKOV</RouteLink>
      <nav aria-label="Main navigation"><RouteLink href="/#work">WORK</RouteLink><RouteLink href="/about" aria-current={path === '/about' ? 'page' : undefined}>ABOUT</RouteLink><RouteLink href="/lab" aria-current={path === '/lab' ? 'page' : undefined}>LAB</RouteLink></nav>
    </header>
    {children}
    <div className="readiness" ref={loader} aria-hidden="true"><span>IMANAKOV</span><span>{String(progress).padStart(2, '0')}</span></div>
    <div className="custom-cursor" ref={cursor} aria-hidden="true">
      <svg className="cursor-arrow-svg" width="36" height="36" viewBox="0 0 34 34" fill="none">
        <path d="M4 3.5v25.2l7.1-7.1 4.9 8.1 2.7-1.6-4.9-8.1h10.1L4 3.5Z" fill="#0c0d0d" stroke="#f4f2ed" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
      <span />
    </div>
    <div className="route-veil" ref={veil} aria-hidden="true" />
    <div className="route-portal signature-portal" ref={portal} aria-hidden="true"><svg className="portal-mask-defs"><defs><mask id="imanakov-portal-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="white"/><path ref={aperture} fill="black" d="M0,0 Z"/></mask></defs></svg><div className="portal-outgoing" ref={outgoing}/></div>
  </div></NavigationContext.Provider>;
}
