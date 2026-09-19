import { writeFile } from 'node:fs/promises';
import { getArticles, contentHash } from '../../lib/editorial.ts';
const [role,reviewer,...slugs]=process.argv.slice(2);
if(!['seo','human'].includes(role)||!reviewer||!slugs.length)throw new Error('Usage: node scripts/seo/review.mjs seo|human reviewer-id slug [...slug]');
for(const slug of slugs){const article=getArticles().find(a=>a.slug===slug);if(!article)throw new Error('Unknown article');const review={passed:true,reviewedAt:new Date().toISOString(),contentHash:contentHash(article),reviewer};const {body,...metadata}=article;void body;metadata.reviews={...metadata.reviews,[role]:review};await writeFile(`content/articles/${slug}.json`,JSON.stringify(metadata,null,2)+'\n');console.log(`${slug}: ${role} review recorded`);}
