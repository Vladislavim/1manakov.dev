'use client';
import Image from 'next/image';
import { useState } from 'react';

export function ProjectImage({ src, alt, sizes = '100vw', priority = false, className = '' }: {
  src: string; alt: string; sizes?: string; priority?: boolean; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return <span className={`project-image ${className}`}>
    {failed ? <span className="image-fallback" role={alt ? 'img' : undefined} aria-label={alt || undefined}>IMANAKOV<span>Selected work</span></span>
      : <Image src={src} alt={alt} fill sizes={sizes} priority={priority} draggable={false} onError={() => setFailed(true)} />}
  </span>;
}
