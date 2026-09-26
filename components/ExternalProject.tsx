import type {Project} from '@/data/projects';
import {DevicePresentation} from './DevicePresentation';
export function ExternalProject({project:p}:{project:Project}){
 if(p.externalSiteStatus==='in-development')return <div className="external-project-pending" role="group" aria-label="Сайт в разработке"><div className="pending-preview" aria-hidden="true"><DevicePresentation slug={p.slug} src={p.cover} alt="" compact/></div><span>В РАЗРАБОТКЕ<small>Сайт готовится к запуску</small></span></div>;
 return p.url?<a className="text-link" href={p.url} target="_blank" rel="noreferrer">Открыть сайт ↗</a>:null;
}
