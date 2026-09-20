'use client';
import { RouteLink } from '@/components/SiteShell';
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main" className="error-page" tabIndex={-1}><span className="eyebrow">SOMETHING DIDN’T OPEN</span><h1>Let’s try<br />that again.</h1><button onClick={reset} className="text-button">TRY AGAIN →</button><RouteLink href="/">Back to home</RouteLink></main>; }
