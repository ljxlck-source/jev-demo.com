'use strict';
(() => {
 const root=document.querySelector('.skills-page');
 if(!root)return;
 const grid=document.getElementById('skills-grid');
 const cards=[...grid.children];
 const search=document.getElementById('skills-search');
 const kind=document.getElementById('skills-kind');
 const sort=document.getElementById('skills-sort');
 const buttons=[...document.querySelectorAll('[data-skill-category]')];
 const status=document.getElementById('skills-status');
 const empty=document.getElementById('skills-empty');
 let category='all';
 const corpus=new Map(cards.map(card=>[card,card.textContent.toLocaleLowerCase()+' '+card.querySelector('a').href.toLocaleLowerCase()]));
 function render(){
  const query=search.value.trim().toLocaleLowerCase();
  let visible=0;
  const ordered=sort.value==='name'?[...cards].sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,document.documentElement.lang)):cards;
  for(const card of ordered){
   card.hidden=!(category==='all'||category===card.dataset.category)||!(kind.value==='all'||kind.value===card.dataset.kind)||!corpus.get(card).includes(query);
   if(!card.hidden)visible++;
   grid.append(card);
  }
  buttons.forEach(button=>{const selected=button.dataset.skillCategory===category;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
  empty.hidden=visible>0;
  status.textContent=visible===0?root.dataset.empty:(category==='all'&&kind.value==='all'&&!query?root.dataset.all:root.dataset.filtered);
 }
 function reset(){category='all';search.value='';kind.value='all';sort.value='source';render();}
 buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.skillCategory;render();}));
 search.addEventListener('input',render);
 kind.addEventListener('change',render);sort.addEventListener('change',render);
 document.querySelectorAll('[data-skills-reset]').forEach(button=>button.addEventListener('click',reset));
 document.querySelectorAll('[data-skills-controls]').forEach(control=>{control.hidden=false;});
 render();
})();
