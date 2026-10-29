(async function () {
  'use strict';
  const el = document.getElementById('protein-viewer');
  const ligandEl = document.getElementById('ligand-viewer');
  const controls = [...document.querySelectorAll('.molecule-controls button')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pdb;
  controls.forEach(button => { button.disabled = true; });
  try {
    if (!window.$3Dmol) throw new Error('3D renderer unavailable');
    const response = await fetch('assets/1HSG.pdb');
    if (!response.ok) throw new Error('Coordinates unavailable');
    pdb = await response.text();
    if (!pdb.includes('ATOM') || !pdb.includes('MK1')) throw new Error('Coordinates invalid');
    const probe=document.createElement('canvas');
    if(!probe.getContext('webgl2')&&!probe.getContext('webgl')) throw new Error('Use coordinate-based canvas renderer');
    const main = $3Dmol.createViewer(el, { backgroundColor: '#ffffff', backgroundAlpha: 0, antialias: true });
    const ligand = $3Dmol.createViewer(ligandEl, { backgroundColor: '#ffffff', backgroundAlpha: 0, antialias: true });
    main.addModel(pdb, 'pdb'); ligand.addModel(pdb, 'pdb');
    const ligandStyle = {stick:{radius:0.19,colorscheme:'orangeCarbon'},sphere:{scale:0.26,colorscheme:'orangeCarbon'}};
    ligand.setStyle({}, {}); ligand.setStyle({resn:'MK1'}, ligandStyle);
    ligand.zoomTo({resn:'MK1'}); ligand.zoom(1.1); ligand.rotate(35,'x'); ligand.rotate(20,'z'); ligand.render();
    let homeView, mode='complex', spinning=!reduced, visible=true;
    const spinButton=document.getElementById('protein-spin');
    function applySpin(){
      const active=spinning && visible && !document.hidden;
      main.spin(active ? 'vy' : false,0.32,true); ligand.spin(active ? 'vy' : false,0.55,true);
      spinButton.textContent=spinning?'Pause':'Rotate';
      spinButton.setAttribute('aria-label',spinning?'Pause molecular rotation':'Start molecular rotation');
      spinButton.setAttribute('aria-pressed',String(spinning));
    }
    function setMode(value){
      mode=value;main.setStyle({},{});
      if(mode==='complex'){
        main.setStyle({chain:'A',hetflag:false},{cartoon:{color:'#7d59cb',arrows:true,thickness:0.6}});
        main.setStyle({chain:'B',hetflag:false},{cartoon:{color:'#23a6be',arrows:true,thickness:0.6}});
      }
      main.setStyle({resn:'MK1'},ligandStyle);
      main.zoomTo(mode==='complex'?{hetflag:false}:{resn:'MK1'});
      main.zoom(mode==='complex'?1.04:1.3);main.rotate(15,'x');main.rotate(-15,'z');main.render();
      homeView=main.getView();
      ['complex','ligand'].forEach(key=>{const button=document.getElementById('protein-'+key);button.classList.toggle('active',key===mode);button.setAttribute('aria-pressed',String(key===mode));});
      el.dataset.mode=mode;
    }
    setMode('complex'); applySpin();
    document.getElementById('molecule-loading')?.remove(); el.dataset.loaded='true';
    controls.forEach(button=>{button.disabled=false;});
    document.getElementById('protein-complex').addEventListener('click',()=>setMode('complex'));
    document.getElementById('protein-ligand').addEventListener('click',()=>setMode('ligand'));
    spinButton.addEventListener('click',()=>{spinning=!spinning;applySpin();});
    document.getElementById('protein-reset').addEventListener('click',()=>{main.setView(homeView);main.render();});
    document.getElementById('protein-in').addEventListener('click',()=>{main.zoom(1.2);main.render();});
    document.getElementById('protein-out').addEventListener('click',()=>{main.zoom(1/1.2);main.render();});
    el.addEventListener('pointerdown',()=>{spinning=false;applySpin();});
    el.addEventListener('keydown',event=>{
      const rotations={ArrowLeft:[-15,'y'],ArrowRight:[15,'y'],ArrowUp:[-15,'x'],ArrowDown:[15,'x']};
      if(rotations[event.key]){event.preventDefault();spinning=false;applySpin();main.rotate(...rotations[event.key]);main.render();}
      if(event.key==='+'||event.key==='='){event.preventDefault();main.zoom(1.2);main.render();}
      if(event.key==='-'){event.preventDefault();main.zoom(1/1.2);main.render();}
    });
    new ResizeObserver(()=>{main.resize();ligand.resize();}).observe(el);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;applySpin();},{threshold:0.05}).observe(el);
    document.addEventListener('visibilitychange',applySpin);
  } catch(error) {
    if(pdb && window.startCanvasMolecule){
      try{window.startCanvasMolecule(pdb,reduced);return;}catch(fallbackError){/* Keep the PDB source available if all rendering fails. */}
    }
    el.dataset.loaded='false';
    el.replaceChildren();
    const fallback=document.createElement('p');fallback.className='molecule-fallback';fallback.textContent='The interactive structure needs WebGL. You can still inspect the original PDB coordinates.';
    const link=document.createElement('a');link.href='https://www.rcsb.org/3d-view/1HSG';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open 1HSG at RCSB PDB ↗';fallback.append(link);el.append(fallback);
    document.querySelector('.ligand-card').hidden=true;
  }
})();
