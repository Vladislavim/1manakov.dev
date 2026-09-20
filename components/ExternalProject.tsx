import type {Project} from '@/data/projects';
import {DevicePresentation} from './DevicePresentation';
export function ExternalProject({project:p}:{project:Project}){
 if(p.externalSiteStatus==='in-development')return <div className="external-project-pending" role="group" aria-label="Live website in development"><div className="pending-preview" aria-hidden="true"><DevicePresentation slug={p.slug} src={p.cover} alt="" compact/></div><span>IN DEVELOPMENT<small>Live website coming soon</small></span></div>;
 return p.url?<a className="text-link" href={p.url} target="_blank" rel="noreferrer">VISIT PROJECT ↗</a>:null;
}
