(function(){
  'use strict';
  const services={
    docking:{number:'01 / STRUCTURE-BASED RESEARCH',title:'Molecular docking',description:'Explore how candidate molecules fit a target binding site, with careful structure preparation and interpretable interaction analysis.',metrics:['Pose geometry','Interaction contacts','Score ranking'],deliverables:['Prepared structures and a documented protocol','Ranked poses with clear interaction figures','A methods summary and limitations'],tools:'Structure preparation · Pose inspection · Interaction mapping',cta:'Discuss a docking project ↗',topic:'Molecular docking'},
    deep:{number:'02 / BIOMEDICAL INTELLIGENCE',title:'Deep learning',description:'Build models that connect molecular, omics or image representations to a well-defined research question, with validation designed around the intended use.',metrics:['Held-out evaluation','Data leakage checks','Baseline comparisons'],deliverables:['A documented training and evaluation workflow','Performance figures, error analysis and baselines','Reusable model code and an interpretation report'],tools:'Neural networks · Graph learning · Multimodal representations',cta:'Discuss a modelling project ↗',topic:'Deep learning'},
    modelling:{number:'03 / MOLECULAR STRUCTURE',title:'Molecular modelling',description:'Prepare, inspect and compare molecular structures to support a structural hypothesis and guide the next computational or experimental step.',metrics:['Structural quality','Geometry checks','Model uncertainty'],deliverables:['Prepared and annotated molecular structures','Structural comparisons and publication-ready views','A clear record of assumptions and model limits'],tools:'Protein structures · Molecular geometry · Structural comparison',cta:'Discuss a structure project ↗',topic:'Molecular modelling'},
    discovery:{number:'04 / TARGETS & CANDIDATES',title:'Drug discovery',description:'Connect biological evidence, public data and computational methods to prioritise targets and candidate compounds for further investigation.',metrics:['Evidence quality','Candidate ranking','Validation strategy'],deliverables:['A focused evidence and target landscape','An auditable candidate prioritisation workflow','A shortlist with rationale and next-step recommendations'],tools:'Target evidence · Public datasets · Computational screening',cta:'Explore a discovery project ↗',topic:'Drug discovery'},
    design:{number:'05 / STRUCTURE & PROPERTIES',title:'Drug design',description:'Evaluate how molecular structure and predicted properties inform candidate design, with transparent comparisons that support medicinal-chemistry decisions.',metrics:['Structure–activity patterns','Property profiles','Design rationale'],deliverables:['Comparative structure and property analyses','Clearly justified candidate design hypotheses','An analysis report and reproducible workflow'],tools:'Structure–activity analysis · Molecular properties · Candidate comparison',cta:'Discuss a design question ↗',topic:'Drug design'},
    synergy:{number:'06 / DRUG-COMBINATION RESEARCH',title:'Drug synergy',description:'Model combination response in biological context using molecular features, gene expression and graph representations. Informed by my first-author SynergyGraph and SynergyImage research.',metrics:['Synergy definition','Cell-line-aware validation','PCC · RMSE · error analysis'],deliverables:['Curated combination data and a defined modelling task','Predictive models with transparent benchmarks','Ranked combinations and an interpretation report'],tools:'Knowledge graphs · Hypergraph learning · Multimodal drug representations',cta:'Discuss a synergy project ↗',topic:'Drug synergy'},
    histology:{number:'07 / COMPUTATIONAL PATHOLOGY',title:'Histopathology',description:'Analyse research tissue images while accounting for staining variation, data quality and the distinction between model performance and biological meaning.',metrics:['Stain consistency','Patient-level splits','Image quality & robustness'],deliverables:['Image quality control and a documented preprocessing pipeline','Stain-normalisation or model comparison figures','Reproducible research code and a methods report'],tools:'H&E images · Stain normalisation · Deep-learning evaluation',cta:'Discuss an imaging project ↗',topic:'Histopathology image analysis'},
    omics:{number:'08 / TRANSCRIPTOMICS & OMICS',title:'RNA-seq & omics',description:'Turn expression data into interpretable biological comparisons, with study design, sample quality and multiple-testing control built into the analysis.',metrics:['Sample QC','Effect sizes & BH FDR','Design-aware inference'],deliverables:['Quality-control, PCA and differential-expression results','Clear figures, result tables and biological interpretation','Documented R or Python code with source provenance'],tools:'R / Bioconductor · Python · Public-data reanalysis',cta:'Discuss an omics project ↗',topic:'RNA-seq & omics'}
,
    singlecell:{number:'09 / SINGLE-CELL TRANSCRIPTOMICS',title:'Single-cell analysis',description:'Resolve cellular diversity and compare cell states with a workflow that keeps sample quality, biological replication and annotation evidence in view.',metrics:['Cell & doublet QC','Annotation confidence','Donor-aware comparisons'],deliverables:['A documented quality-control and preprocessing workflow','UMAP views, cell-type annotations and marker tables','Pseudobulk comparisons where appropriate, with reusable code and a methods report'],tools:'Single-cell RNA-seq · Cell-type annotation · Pseudobulk analysis',cta:'Discuss a single-cell project ↗',topic:'Single-cell RNA-seq analysis'},
    medicalimaging:{number:'10 / MRI & CT RESEARCH',title:'Medical image analysis',description:'Analyse MRI and CT datasets for research, from image quality checks and preprocessing to segmentation, quantitative measurements and model evaluation.',metrics:['Image quality & consistency','Segmentation accuracy','Patient-level validation'],deliverables:['A documented MRI/CT preprocessing and quality-control workflow','Segmentation masks, quantitative measurements and radiomics features matched to the project','Reproducible Python code, evaluation figures and a research report'],tools:'MRI · CT · Segmentation · Radiomics · Research model evaluation',cta:'Discuss an MRI / CT project ↗',topic:'Medical image analysis (MRI / CT)'}
  };
  const stage=document.getElementById('skills-stage');
  const nodes=[...document.querySelectorAll('.skill-node')];
  const select=document.getElementById('service-select');
  const keys=Object.keys(services);
  let angle=0,running=!window.matchMedia('(prefers-reduced-motion: reduce)').matches,visible=false,hover=false,focused=false,previous=0;
  function draw(){
    nodes.forEach((node,i)=>{
      const phase=angle+i*.65;
      node.style.setProperty('--float-y',(Math.sin(phase)*2.2).toFixed(2)+'px');
      node.style.setProperty('--tilt-y',(-3+Math.sin(phase)*1.5).toFixed(2)+'deg');
    });
  }
  function choose(key){
    const s=services[key];if(!s)return;
    const text={number:s.number,title:s.title,description:s.description,tools:s.tools,cta:s.cta};
    Object.entries(text).forEach(([id,value])=>{document.getElementById('service-'+id).textContent=value;});
    document.getElementById('service-metrics').replaceChildren(...s.metrics.map(value=>{const item=document.createElement('b');item.textContent=value;return item;}));
    document.getElementById('service-deliverables').replaceChildren(...s.deliverables.map(value=>{const item=document.createElement('li');item.textContent=value;return item;}));
    nodes.forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.service===key)));
    select.value=key;const detail=document.getElementById('service-detail');detail.dataset.service=key;const selected=nodes.find(node=>node.dataset.service===key);detail.style.setProperty('--detail-accent',getComputedStyle(selected).getPropertyValue('--card-accent'));
    stage.dataset.selected=key;
    document.getElementById('service-cta').onclick=()=>{document.getElementById('contact-topic').value=s.topic;};
  }
  nodes.forEach((node,i)=>{
    node.addEventListener('click',()=>{choose(node.dataset.service);if(window.matchMedia('(max-width: 760px)').matches){document.getElementById('service-title').focus({preventScroll:true});document.getElementById('service-detail').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}});
    node.addEventListener('keydown',event=>{if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(event.key)){event.preventDefault();const columns=window.matchMedia('(max-width: 450px)').matches?2:3;const step={ArrowRight:1,ArrowLeft:-1,ArrowUp:-columns,ArrowDown:columns}[event.key];const next=nodes[event.key==='Home'?0:event.key==='End'?nodes.length-1:(i+step+nodes.length)%nodes.length];choose(next.dataset.service);next.focus();}});
  });
  select.addEventListener('change',()=>choose(select.value));
  const toggle=document.getElementById('skills-motion');
  function syncToggle(){toggle.textContent=running?'Pause motion':'Animate cards';toggle.setAttribute('aria-pressed',String(running));}
  toggle.addEventListener('click',()=>{running=!running;syncToggle();});
  stage.addEventListener('pointerenter',()=>{hover=true;});stage.addEventListener('pointerleave',()=>{hover=false;});
  stage.addEventListener('focusin',()=>{focused=true;});stage.addEventListener('focusout',event=>{focused=stage.contains(event.relatedTarget);});
  stage.dataset.ready='true';choose(keys[0]);draw();syncToggle();
  new ResizeObserver(draw).observe(stage);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.05}).observe(stage);
  function frame(now){const dt=Math.min(now-previous,50);previous=now;if(running&&visible&&!document.hidden&&!hover&&!focused){angle+=dt*.00012;draw();}requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();
