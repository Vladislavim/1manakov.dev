import type { Guide } from './guides';
import { contact } from '@/data/projects';
export function generateContextualCTA(page:Guide,placement:'inline'|'final'){
 const context={sourcePage:page.canonical,clusterId:page.clusterId,intent:page.intent,topic:page.topic,ctaType:'email',ctaPlacement:placement};
 const subject=`Разбор интерфейса: ${page.h1}`;
 const body=`Здравствуйте, Владислав!\n\n${page.cta.briefPrompt}\n\nМой сайт (если уже есть):\nЧто хочу изменить:\n\nПрочитал материал: ${page.canonical}`;
 return{headline:page.cta.headline,text:page.cta.text,buttonLabel:page.cta.buttonLabel,destination:`mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,secondaryAction:page.relatedCases[0]?`/work/${page.relatedCases[0]}`:'/about',context};
}
