// Original geometry: the outgoing viewport becomes a physical mask over the
// actual mounted destination. No screenshot proxy or competitor assets.
export function portalPath(x:number,y:number,width:number,height:number){
 const points=[[-.38,-.5],[.16,-.49],[.42,-.3],[.5,.08],[.34,.5],[-.18,.48],[-.47,.23],[-.5,-.15]];
 const vertices=points.map(([px,py])=>[x+px*width,y+py*height]);
 const midpoint=(a:number[],b:number[])=>`${(a[0]+b[0])/2},${(a[1]+b[1])/2}`;
 return `M${midpoint(vertices[7],vertices[0])} `+vertices.map((v,i)=>`Q${v[0]},${v[1]} ${midpoint(v,vertices[(i+1)%8])}`).join(' ')+' Z';
}
export function captureOutgoing(container:HTMLElement){
 container.replaceChildren();
 const surface=document.createElement('div');
 surface.className='portal-outgoing-surface';
 const main=document.querySelector('main');
 if(main){const clone=main.cloneNode(true) as HTMLElement;clone.style.marginTop=`-${window.scrollY}px`;// cloneNode does not copy Canvas pixels (portrait, interactive diagrams).
 const originals=main.querySelectorAll('canvas');
 clone.querySelectorAll('canvas').forEach((canvas,i)=>{const source=originals[i];if(source){canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d')?.drawImage(source,0,0);}});
 surface.append(clone);}
 const header=document.querySelector('.site-header');
 if(header)surface.append(header.cloneNode(true));
 surface.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 surface.querySelectorAll('script,iframe,video').forEach(el=>el.remove());
 surface.inert=true;
 container.append(surface);
}
