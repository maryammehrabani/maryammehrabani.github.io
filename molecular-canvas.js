/* Interactive 3D projection of actual PDB coordinates for browsers without WebGL. */
window.startCanvasMolecule = function(pdb,reduced){
  'use strict';
  const chains={A:[],B:[]},atoms=[],serials=new Map(),connections=[];
  const lines=pdb.split('\n');
  for(const line of lines){
    if(!/^ATOM  |^HETATM/.test(line))continue;
    const atom={x:+line.slice(30,38),y:+line.slice(38,46),z:+line.slice(46,54),element:line.slice(76,78).trim(),serial:+line.slice(6,11)};
    if(line.startsWith('ATOM')&&line.slice(12,16).trim()==='CA'&&chains[line[21]])chains[line[21]].push(atom);
    if(line.slice(17,20)==='MK1'){serials.set(atom.serial,atoms.length);atoms.push(atom);}
  }
  const seen=new Set();
  for(const line of lines.filter(line=>line.startsWith('CONECT'))){
    const from=+line.slice(6,11);if(!serials.has(from))continue;
    for(let i=11;i+5<=line.length;i+=5){const to=+line.slice(i,i+5);if(!serials.has(to)||to===from)continue;const key=[from,to].sort((a,b)=>a-b).join('-');if(seen.has(key))continue;seen.add(key);connections.push([serials.get(from),serials.get(to)]);}
  }
  if(chains.A.length!==99||chains.B.length!==99||atoms.length!==45||!connections.length)throw new Error('Unexpected PDB atom counts');
  function catmull(a,b,c,d,t){return ['x','y','z'].reduce((o,k)=>{o[k]=.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t);return o;},{});}
  const traces=Object.entries(chains).map(([name,points])=>({name,points:points.flatMap((p,i)=>i===points.length-1?[p]:Array.from({length:6},(_,j)=>catmull(points[Math.max(i-1,0)],p,points[i+1],points[Math.min(i+2,points.length-1)],j/6)))}));
  const colours={A:[120,76,194],B:[35,151,180],C:[211,139,61],N:[72,108,175],O:[194,74,66]};
  function centerOf(points){return ['x','y','z'].reduce((c,k)=>{c[k]=(Math.min(...points.map(p=>p[k]))+Math.max(...points.map(p=>p[k])))/2;return c;},{});}
  const allCA=[...chains.A,...chains.B],proteinCenter=centerOf(allCA),ligandCenter=centerOf(atoms);
  let rotationX=-.35,rotationY=-.25,mode='complex',zoom=1,spinning=!reduced,visible=true,dirty=true;
  const main=document.getElementById('protein-viewer'),small=document.getElementById('ligand-viewer');
  main.replaceChildren();small.replaceChildren();
  const canvas=document.createElement('canvas'),inset=document.createElement('canvas');main.append(canvas);small.append(inset);
  canvas.setAttribute('aria-hidden','true');inset.setAttribute('aria-hidden','true');canvas.style.cssText='display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab';inset.style.cssText='display:block;width:100%;height:100%;pointer-events:none';
  const ctx=canvas.getContext('2d'),mini=inset.getContext('2d');if(!ctx||!mini)throw new Error('Canvas unavailable');
  let dimensions={};
  function resize(){for(const [key,c,node] of [['main',canvas,main],['small',inset,small]]){const ratio=Math.min(window.devicePixelRatio||1,2);const w=node.clientWidth,h=node.clientHeight;c.width=w*ratio;c.height=h*ratio;dimensions[key]={w,h,ratio};}dirty=true;}
  function rgb(base,light){return 'rgb('+base.map(c=>Math.round(Math.max(0,Math.min(255,c*light)))).join(',')+')';}
  function render(context,dim,isInset){
    const {w,h,ratio}=dim;context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,w,h);
    const ligandOnly=isInset||mode==='ligand',center=ligandOnly?ligandCenter:proteinCenter;
    const scale=(ligandOnly?Math.min(w/27,h/23):Math.min(w/68,h/70))*(isInset?1.05:zoom);
    const ax=rotationX+(isInset?.3:0),ay=rotationY*(isInset?1.35:1);
    const project=p=>{const x=p.x-center.x,y=p.y-center.y,z=p.z-center.z;const x1=x*Math.cos(ay)+z*Math.sin(ay),z1=z*Math.cos(ay)-x*Math.sin(ay);const y1=y*Math.cos(ax)-z1*Math.sin(ax),z2=y*Math.sin(ax)+z1*Math.cos(ax);const perspective=120/(120-z2);return{x:w*.48+x1*scale*perspective,y:h*.47-y1*scale*perspective,z:z2,s:scale*perspective};};
    const drawables=[];
    if(!ligandOnly)for(const trace of traces){const projected=trace.points.map(project);for(let i=1;i<projected.length;i++){const a=projected[i-1],b=projected[i];drawables.push({kind:'tube',a,b,z:(a.z+b.z)/2,colour:colours[trace.name]});}}
    const projected=atoms.map(project);
    for(const [i,j] of connections){const a=projected[i],b=projected[j],middle={x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2,s:(a.s+b.s)/2};drawables.push({kind:'bond',a,b:middle,z:(a.z+middle.z)/2,colour:colours[atoms[i].element]||colours.C},{kind:'bond',a:middle,b,z:(b.z+middle.z)/2,colour:colours[atoms[j].element]||colours.C});}
    for(let i=0;i<atoms.length;i++)drawables.push({kind:'atom',p:projected[i],z:projected[i].z,colour:colours[atoms[i].element]||colours.C});
    drawables.sort((a,b)=>a.z-b.z);context.lineCap='round';context.lineJoin='round';
    for(const item of drawables){const light=.88+Math.max(0,Math.min(1,(item.z+23)/46))*.32;
      if(item.kind==='atom'){const p=item.p,r=Math.max(1.5,p.s*(ligandOnly?.42:.34));const gradient=context.createRadialGradient(p.x-r*.3,p.y-r*.35,r*.05,p.x,p.y,r);gradient.addColorStop(0,rgb(item.colour,1.5));gradient.addColorStop(.45,rgb(item.colour,light));gradient.addColorStop(1,rgb(item.colour,.57));context.fillStyle=gradient;context.beginPath();context.arc(p.x,p.y,r,0,Math.PI*2);context.fill();}
      else{const {a,b}=item,width=(a.s+b.s)/2*(item.kind==='tube'?.73:.25);context.strokeStyle=rgb(item.colour,light*.78);context.lineWidth=width;context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();if(item.kind==='tube'){context.strokeStyle=rgb(item.colour,light*1.18);context.lineWidth=width*.53;context.beginPath();context.moveTo(a.x-width*.13,a.y-width*.14);context.lineTo(b.x-width*.13,b.y-width*.14);context.stroke();}}
    }
  }
  function draw(){render(ctx,dimensions.main,false);render(mini,dimensions.small,true);dirty=false;}
  const controls=[...document.querySelectorAll('.molecule-controls button')];controls.forEach(button=>{button.disabled=false;});
  const spinButton=document.getElementById('protein-spin');
  function sync(){spinButton.textContent=spinning?'Pause':'Rotate';spinButton.setAttribute('aria-label',spinning?'Pause molecular rotation':'Start molecular rotation');spinButton.setAttribute('aria-pressed',String(spinning));for(const key of ['complex','ligand']){const button=document.getElementById('protein-'+key);button.classList.toggle('active',mode===key);button.setAttribute('aria-pressed',String(mode===key));}main.dataset.mode=mode;}
  function setMode(value){mode=value;zoom=1;dirty=true;sync();}
  document.getElementById('protein-complex').addEventListener('click',()=>setMode('complex'));
  document.getElementById('protein-ligand').addEventListener('click',()=>setMode('ligand'));
  spinButton.addEventListener('click',()=>{spinning=!spinning;sync();});
  document.getElementById('protein-reset').addEventListener('click',()=>{rotationX=-.35;rotationY=-.25;zoom=1;dirty=true;});
  function changeZoom(factor){zoom=Math.max(.45,Math.min(3.5,zoom*factor));dirty=true;}
  document.getElementById('protein-in').addEventListener('click',()=>changeZoom(1.2));document.getElementById('protein-out').addEventListener('click',()=>changeZoom(1/1.2));
  let dragging=false,lastX=0,lastY=0;
  canvas.addEventListener('pointerdown',event=>{dragging=true;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture(event.pointerId);spinning=false;sync();canvas.style.cursor='grabbing';});
  canvas.addEventListener('pointermove',event=>{if(!dragging)return;rotationY+=(event.clientX-lastX)*.011;rotationX+=(event.clientY-lastY)*.011;lastX=event.clientX;lastY=event.clientY;dirty=true;});
  function endDrag(){dragging=false;canvas.style.cursor='grab';}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  canvas.addEventListener('wheel',event=>{event.preventDefault();changeZoom(Math.exp(-event.deltaY*.001));},{passive:false});
  main.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(event.key))return;event.preventDefault();spinning=false;sync();if(event.key==='ArrowLeft')rotationY-=.2;if(event.key==='ArrowRight')rotationY+=.2;if(event.key==='ArrowUp')rotationX-=.2;if(event.key==='ArrowDown')rotationX+=.2;if(event.key==='+'||event.key==='=')changeZoom(1.2);if(event.key==='-')changeZoom(1/1.2);dirty=true;});
  main.dataset.loaded='true';main.dataset.renderer='canvas';main.dataset.atomCount=String(allCA.length+atoms.length);
  document.querySelector('.molecule-callout small').textContent='198 Cα atoms · two chains';
  document.querySelector('.structure-note span').textContent='Cα backbone + ligand · experimental PDB coordinates.';
  document.querySelector('.ligand-card').hidden=false;
  resize();sync();draw();
  new ResizeObserver(resize).observe(main);new ResizeObserver(resize).observe(small);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.05}).observe(main);
  let previous=0;
  function frame(now){if(now-previous>30){const dt=Math.min(now-previous,60);previous=now;if(visible&&!document.hidden){if(spinning){rotationY+=dt*.00023;dirty=true;}if(dirty)draw();}}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
};
