'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Metrica = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
type AnalyticsWindow = Window & { ym?: Metrica; imanakovCounter?: number; imanakovLastPath?: string };
const id = Number(process.env.NEXT_PUBLIC_METRICA_ID);
const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
const allowedGoals = new Set(['seo_cta_view', 'seo_cta_click', 'seo_contact_click', 'seo_case_click', 'seo_related_page_click']);

// Opt-in at deployment; never send local or preview traffic to the production counter.
export function SiteAnalytics({ hostname, production }: { hostname: string; production: boolean }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!enabled || !production || !Number.isSafeInteger(id) || id <= 0 || location.hostname !== hostname) return;
    const host = window as AnalyticsWindow;
    if (!host.ym) {
      const queue: Metrica = (...args: unknown[]) => { (queue.a ||= []).push(args); };
      queue.l = Date.now(); host.ym = queue;
      const script = document.createElement('script');
      script.async = true; script.src = 'https://mc.yandex.ru/metrika/tag.js';
      document.head.append(script);
    }
    if (host.imanakovCounter !== id) {
      host.ym(id, 'init', { defer: true, accurateTrackBounce: true, webvisor: false, clickmap: false, trackLinks: false });
      host.imanakovCounter = id;
    }
    const url = location.origin + pathname;
    if (host.imanakovLastPath !== url) {
      host.ym(id, 'hit', url, { title: document.title, referer: host.imanakovLastPath || document.referrer });
      host.imanakovLastPath = url;
    }
    const goal = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail || !allowedGoals.has(detail.event)) return;
      // Only editorial context; no user input, mailto bodies, query strings or form values.
      const params: Record<string, string> = {};
      for (const key of ['slug', 'clusterId', 'topic', 'intent', 'ctaType', 'ctaPlacement']) {
        if (typeof detail[key] === 'string') params[key] = detail[key].slice(0,160);
      }
      host.ym?.(id, 'reachGoal', detail.event, params);
    };
    const click = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.closest('[data-seo-event]')) return;
      if (link.protocol === 'mailto:') host.ym?.(id, 'reachGoal', 'contact_email');
      else if (link.hostname === 't.me') host.ym?.(id, 'reachGoal', 'contact_telegram');
    };
    window.addEventListener('imanakov:analytics', goal);
    document.addEventListener('click', click);
    return () => { window.removeEventListener('imanakov:analytics', goal); document.removeEventListener('click', click); };
  }, [pathname, hostname, production]);
  return null;
}
