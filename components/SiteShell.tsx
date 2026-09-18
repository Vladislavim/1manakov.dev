'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects } from '@/data/projects';

gsap.registerPlugin(useGSAP, ScrollTrigger);
type Navigation = { navigate: (href: string, image?: string) => void };
const NavigationContext = createContext<Navigation | null>(null);

export function RouteLink({ href, children, image, className, ...props }: {
  href: string; children: ReactNode; image?: string; className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const context = useContext(NavigationContext);
  function click(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented || !context || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (image) { event.preventDefault(); context.navigate(href, image); }
  }
  return <Link {...props} href={href} className={className} onClick={click}>{children}</Link>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const shell = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const destination = useRef('');
  const scrollPositions = useRef(new Map<string, number>());
  const previousPath = useRef(path);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [progress, setProgress] = useState(0);

  const release = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    if (portal.current) gsap.set(portal.current, { autoAlpha: 0 });
    locked.current = false;
    lenisRef.current?.start();
  }, []);

  const navigate = useCallback((href: string, image?: string) => {
    if (locked.current || href === path) return;
    scrollPositions.current.set(path, window.scrollY);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push(href); return; }
    const layer = portal.current;
    if (!layer) { router.push(href); return; }
    locked.current = true;
    destination.current = href.split('#')[0];
    lenisRef.current?.stop();
    const opening = layer.querySelector<HTMLElement>('.portal-opening')!;
    opening.style.backgroundImage = `url("${image || projects[0].cover}")`;
    gsap.set(layer, { autoAlpha: 1 });
    gsap.set(opening, { clipPath: 'polygon(49% 0,51% 0,54% 100%,46% 100%)', scale: 1.12 });
    timeline.current?.kill();
    timeline.current = gsap.timeline().fromTo(layer, { opacity: 0 }, { opacity: 1, duration: .2 })
      .to(opening, { clipPath: 'polygon(36% 0,72% 0,80% 100%,29% 100%)', scale: 1, duration: .32, ease: 'power3.inOut' }, .08)
      .call(() => router.push(href, { scroll: false }));
    timeout.current = setTimeout(release, 5000);
  }, [path, router, release]);

  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;
    if (locked.current && destination.current === path && portal.current) {
      const saved = path === '/' ? (scrollPositions.current.get('/') ?? 0) : 0;
      window.scrollTo(0, saved);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
        timeline.current = gsap.timeline({ onComplete: release })
          .to('.portal-opening', { clipPath: 'polygon(0% 0,100% 0,100% 100%,0% 100%)', duration: .3, ease: 'power3.inOut' })
          .to(portal.current, { opacity: 0, duration: .2 });
      });
    } else if (locked.current) { timeline.current?.kill(); release(); }
    ScrollTrigger.refresh();
  }, [path, release]);

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
      const update = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      const visibility = () => { if (document.hidden) gsap.ticker.remove(update); else gsap.ticker.add(update); };
      document.addEventListener('visibilitychange', visibility);
      const dot = cursor.current!;
      const x = gsap.quickTo(dot, 'x', { duration: .16, ease: 'power3.out' });
      const y = gsap.quickTo(dot, 'y', { duration: .16, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        x(e.clientX); y(e.clientY);
        const target = e.target as HTMLElement;
        const active = target.closest<HTMLElement>('[data-cursor]');
        dot.dataset.active = active ? 'true' : 'false';
        dot.dataset.hidden = target.closest('.hero') ? 'true' : 'false';
        dot.textContent = active?.dataset.cursor || '';
        dot.style.opacity = '1';
      };
      const leave = () => { dot.style.opacity = '0'; };
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
      const history = () => { if (locked.current) { timeline.current?.kill(); release(); } };
      window.addEventListener('popstate', history);
      return () => { lenis.destroy(); lenisRef.current = null; gsap.ticker.remove(update); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); window.removeEventListener('popstate', history); x.tween.kill(); y.tween.kill(); };
    });
    return () => mm.revert();
  }, { scope: shell });

  return <NavigationContext.Provider value={{ navigate }}><div ref={shell}>
    <a className="skip-link" href="#main" tabIndex={0}>Skip to content</a>
    <header className="site-header">
      <RouteLink href="/" className="brand" image={path.startsWith('/work/') ? projects.find(p => path.endsWith(p.slug))?.cover : undefined} aria-label="Imanakov — home">IMANAKOV</RouteLink>
      <nav aria-label="Main navigation"><Link href="/#work">WORK</Link><Link href="/about" aria-current={path === '/about' ? 'page' : undefined}>ABOUT</Link><Link href="/play" aria-current={path === '/play' ? 'page' : undefined}>PLAY</Link></nav>
    </header>
    {children}
    <div className="readiness" ref={loader} aria-hidden="true"><span>IMANAKOV</span><span>{String(progress).padStart(2, '0')}</span></div>
    <div className="custom-cursor" ref={cursor} aria-hidden="true" />
    <div className="route-portal" ref={portal} aria-hidden="true"><div className="portal-copy">Enter<br />the<br />work</div><div className="portal-opening" /><span className="portal-plus">+</span><span className="portal-caption">A closer look.</span></div>
  </div></NavigationContext.Provider>;
}
