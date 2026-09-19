import { Fragment } from 'react';

function inline(text: string) {
  return text.split(/(\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(part);
    if (link && /^(https:\/\/|\/(?!\/)|#)/.test(link[2])) return <a key={i} href={link[2]}>{link[1]}</a>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1,-1)}</code>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
export function ArticleBody({ body }: { body: string }) {
  return <div className="article-prose">{body.split(/\r?\n\s*\r?\n/).map((block, i) => {
    if (block.startsWith('### ')) return <h3 key={i}>{inline(block.slice(4))}</h3>;
    if (block.startsWith('## ')) return <h2 key={i}>{inline(block.slice(3))}</h2>;
    const lines = block.split(/\r?\n/);
    if (lines.every(line => /^- /.test(line))) return <ul key={i}>{lines.map((line,j) => <li key={j}>{inline(line.slice(2))}</li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={i}>{lines.map((line,j) => <li key={j}>{inline(line.replace(/^\d+\. /,''))}</li>)}</ol>;
    return <p key={i}>{inline(block.replace(/\r?\n/g,' '))}</p>;
  })}</div>;
}
