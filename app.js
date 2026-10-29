'use strict';
const $ = selector => document.querySelector(selector);
const nav = $('#main-nav');
const menu = $('.menu-toggle');
function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menu.focus();}});

const dialog=$('#image-dialog');
let previousFocus;
function openFigure(src,caption,alt){
  previousFocus=document.activeElement;
  $('#dialog-image').src=src;$('#dialog-image').alt=alt||caption;$('#dialog-caption').textContent=caption;
  dialog.showModal();document.body.classList.add('modal-open');
}
document.querySelectorAll('.image-open').forEach(button=>button.addEventListener('click',()=>openFigure(button.dataset.image,button.dataset.caption,button.querySelector('img').alt)));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus();});

const plots=window.portfolioCase.plots;
const plotButtons=[...document.querySelectorAll('[data-plot]')];
let activePlot='pca';
function choosePlot(key){
  const plot=plots[key];if(!plot)return;activePlot=key;
  $('#case-image').src=plot.src;$('#case-image').alt=plot.alt;
  $('#plot-kicker').textContent=plot.kicker;$('#plot-title').textContent=plot.title;$('#case-caption').textContent=plot.caption;
  $('#download-plot').href=plot.src;
  plotButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.plot===key)));
}
plotButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>choosePlot(button.dataset.plot));
  button.addEventListener('keydown',event=>{
    let i;if(event.key==='ArrowRight')i=(index+1)%plotButtons.length;if(event.key==='ArrowLeft')i=(index+plotButtons.length-1)%plotButtons.length;if(event.key==='Home')i=0;if(event.key==='End')i=plotButtons.length-1;
    if(i!==undefined){event.preventDefault();choosePlot(plotButtons[i].dataset.plot);plotButtons[i].focus();}
  });
});
$('#enlarge-case').addEventListener('click',()=>{const plot=plots[activePlot];openFigure(plot.src,plot.caption,plot.alt);});

const form=$('#contact-form'),status=$('#form-status');
function composeMessage(){
  return {subject:'Project enquiry: '+$('#contact-topic').value,body:'Hello Maryam,\n\nName: '+$('#contact-name').value.trim()+'\nReply email: '+$('#contact-email').value.trim()+'\nOrganisation: '+($('#contact-organisation').value.trim()||'Not specified')+'\nArea of interest: '+$('#contact-topic').value+'\nDesired timeline: '+$('#contact-timeline').value+'\n\n'+$('#contact-message').value.trim()+'\n'};
}
function validForm(){
  const name=$('#contact-name'),message=$('#contact-message');
  name.setCustomValidity(name.value.trim()?'':'Please enter your name.');
  message.setCustomValidity(message.value.trim().length>=10?'':'Please add at least 10 characters about your project.');
  return form.reportValidity();
}
form.addEventListener('input',()=>{$('#contact-name').setCustomValidity('');$('#contact-message').setCustomValidity('');status.textContent='';$('#copy-fallback').hidden=true;});
form.addEventListener('submit',event=>{
  event.preventDefault();if(!validForm())return;
  const message=composeMessage(),a=document.createElement('a');
  a.href='mailto:mmehrabani634@gmail.com?subject='+encodeURIComponent(message.subject)+'&body='+encodeURIComponent(message.body);document.body.appendChild(a);a.click();a.remove();
  status.textContent='Email draft requested. Review and send it in your email app. If it did not open, use Copy message and email Maryam directly.';
});
$('#copy-message').addEventListener('click',async()=>{
  if(!validForm())return;
  const message=composeMessage(),value='To: mmehrabani634@gmail.com\nSubject: '+message.subject+'\n\n'+message.body;
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(value);status.textContent='Message copied. Paste it into your email app or LinkedIn. Nothing has been sent.';}
  catch{const fallback=$('#copy-fallback');fallback.value=value;fallback.hidden=false;fallback.focus();fallback.select();status.textContent='Select and copy the prepared message below. Nothing has been sent.';}
});
