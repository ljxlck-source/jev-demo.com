'use strict';
const config = JSON.parse(document.getElementById('site-data').textContent);
const { labels: L, categories, items, language } = config;
let category = 'All', generation = 0, widgetsPromise;
const $ = id => document.getElementById(id);
const text = (tag, value, cls) => { const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el; };
const safeUrl = value => {try {const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch{return '';}};
function applyLocale() {
 document.documentElement.lang=L.html_lang||language;
 if(language==='ar')document.documentElement.dir='rtl';
 const set=(selector,value)=>{const node=document.querySelector(selector);if(node&&value)node.textContent=value;};
 set('.intro h1',L.h1);set('.side-heading',L.category_heading);set('.side-note',L.independent);
 set('.header-nav a[href="/calculator/"]',L.calculator_label);set('.header-nav a[href="/how-to-use-jev/"]',L.guide_label);
 const results=document.querySelector('.results');if(results&&L.results_label)results.setAttribute('aria-label',L.results_label);
 const search=$('search');if(search){search.placeholder=L.search;search.setAttribute('aria-label',L.search);}
 const categoriesLabel=$('categories');if(categoriesLabel&&L.category_label)categoriesLabel.setAttribute('aria-label',L.category_label);
 $('categories')?.querySelectorAll('[data-category]').forEach(button=>{button.textContent=categories[button.dataset.category]||button.textContent;});
 const filters=document.querySelectorAll('.filter');
 if(filters[0])filters[0].firstChild.textContent=L.views_label+' ';
 if(filters[1])filters[1].firstChild.textContent=L.sort_label+' ';
 const min=$('minimum');if(min){const values=[L.all_views,L.views_10k,L.views_100k,L.views_1m];min.querySelectorAll('option').forEach((o,i)=>{if(values[i])o.textContent=values[i];});}
 const sort=$('sort');if(sort){const values=[L.sort_popular,L.sort_ascending,L.sort_original];sort.querySelectorAll('option').forEach((o,i)=>{if(values[i])o.textContent=values[i];});}
 set('#empty h2',L.empty_title);set('#empty p',L.empty_text);set('#reset',L.reset);
 set('footer span',L.footer_note);const source=document.querySelector('footer .source');if(source)source.textContent=L.source_label+' ↗';
 $('close')?.setAttribute('aria-label',L.close);set('#original',L.original_link+' ↗');set('#case-source',L.case_link+' ↗');
}
applyLocale();
function formatViews(value) {
 if(value==null)return L.unknown;
 if(language==='zh'&&value>=10000)return `${new Intl.NumberFormat('zh-CN',{maximumFractionDigits:1}).format(value/10000)} 万`;
 const locale={en:'en',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR',ar:'ar',es:'es-ES',ru:'ru-RU'}[language]||'en';
 if(value>=1000)return new Intl.NumberFormat(locale,{notation:'compact',maximumFractionDigits:1}).format(value);
 return new Intl.NumberFormat(locale).format(value);
}
function selectCases(list,cat,minimum,order,query) {
 const q=query.trim().toLowerCase();
 const result=list.filter(a=>(cat==='All'||a.category===cat)&&(minimum===0||(a.xViews!=null&&a.xViews>=minimum))&&`${a.name} ${a.title} ${a.author} ${a.summary} ${categories[a.category]}`.toLowerCase().includes(q));
 if(order!=='original')result.sort((a,b)=>a.xViews==null?(b.xViews==null?0:1):b.xViews==null?-1:order==='popular'?b.xViews-a.xViews:a.xViews-b.xViews);
 return result;
}
function bindCards() {
 $('grid').querySelectorAll('[data-preview]').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const item=items.find(a=>a.id===link.dataset.preview);if(!item)return;
  event.preventDefault();openPlayer(item);
 }));
 $('grid').querySelectorAll('.poster img').forEach(img=>{
  const fallback=()=>{const parent=img.parentElement;if(!parent)return;const item=items.find(a=>a.id===parent.dataset.preview);img.remove();parent.prepend(text('span',categories[item?.category]||'JEV Demo','poster-fallback'));};
  img.addEventListener('error',fallback,{once:true});if(img.complete&&!img.naturalWidth)fallback();
 });
}
function renderCategories() {
 $('categories').querySelectorAll('[data-category]').forEach(button=>{const active=button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
function render() {
 const result=selectCases(items,category,Number($('minimum').value),$('sort').value,$('search').value);
 $('count').textContent=category==='All'?L.all_cases:categories[category];$('grid').replaceChildren();$('empty').hidden=result.length>0;
 result.forEach((item,index)=>{
  const card=text('article','','card');const poster=text('a','','poster');poster.href=safeUrl(item.caseUrl);poster.dataset.preview=item.id;poster.setAttribute('aria-label',`${item.videoUrl?L.watch:L.view_post}: ${item.title}`);
  if(safeUrl(item.posterUrl)){const img=document.createElement('img');img.src=safeUrl(item.posterUrl);img.alt='';img.width=640;img.height=400;img.loading=index<3?'eager':'lazy';img.referrerPolicy='no-referrer';poster.append(img);}else poster.append(text('span',categories[item.category],'poster-fallback'));
  const play=text('span','▶','play');play.setAttribute('aria-hidden','true');poster.append(play,text('span',item.videoUrl?L.watch:L.view_post,'watch-label'));
  const body=text('div','','card-body');body.append(text('span',categories[item.category],'tag'));const heading=document.createElement('h2');const link=text('a',item.title,'title');link.href=safeUrl(item.caseUrl);link.dataset.preview=item.id;heading.append(link);body.append(heading,text('p',item.summary,'summary'));
  const meta=text('div','','card-meta');meta.append(text('span',item.author,'author'));const views=text('span','','views');views.append(text('b',formatViews(item.xViews)),document.createTextNode(' '+L.views));meta.append(views);card.append(poster,body,meta);$('grid').append(card);
 });bindCards();
}
function loadWidgets() {
 if(window.twttr?.widgets)return Promise.resolve(window.twttr);
 if(widgetsPromise)return widgetsPromise;
 widgetsPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;
  const timer=setTimeout(()=>reject(new Error('X timeout')),15000);
  script.onload=()=>{clearTimeout(timer);window.twttr?.widgets?resolve(window.twttr):reject(new Error('X unavailable'));};script.onerror=()=>{clearTimeout(timer);reject(new Error('X unavailable'));};document.head.append(script);
 }).catch(error=>{widgetsPromise=null;throw error;});return widgetsPromise;
}
function showUnavailable(container,item,message) {
 const state=text('div','','load-state');state.append(text('p',message));const link=text('a',(item.sourceUrl?L.original_link:L.case_link)+' ↗');link.href=safeUrl(item.sourceUrl||item.caseUrl);link.target='_blank';link.rel='noopener noreferrer';state.append(link);container.replaceChildren(state);
}
async function openPlayer(item) {
 const token=++generation;const media=$('media');media.replaceChildren();
 $('player-title').textContent=item.title;$('player-summary').textContent=item.summary;$('player-category').textContent=categories[item.category];$('player-author').textContent=item.author;
 $('player-views').textContent=item.xViews==null?L.metadata_missing:`${formatViews(item.xViews)} ${L.views} · ${L.snapshot}`;
 $('original').hidden=!safeUrl(item.sourceUrl);$('original').href=safeUrl(item.sourceUrl);$('case-source').href=safeUrl(item.caseUrl);$('player').showModal();document.body.style.overflow='hidden';
 if(safeUrl(item.videoUrl)){
  const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=safeUrl(item.videoUrl);if(safeUrl(item.posterUrl))video.poster=safeUrl(item.posterUrl);
  video.addEventListener('error',()=>{if(token===generation)showUnavailable(media,item,L.video_error);},{once:true});media.append(video);$('media-note').textContent=L.media_note;
  // Start within the thumbnail click gesture; keep controls if playback is blocked.
  video.play().catch(()=>{});
 }else if(safeUrl(item.sourceUrl)){
  $('media-note').textContent=L.embed_note;media.append(text('div',L.loading,'load-state'));
  try{const twttr=await loadWidgets();if(token!==generation)return;const id=new URL(item.sourceUrl).pathname.match(/\/status\/(\d+)/)?.[1];if(!id)throw new Error('Invalid post');const host=text('div');media.replaceChildren(host);
   let timer;const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('X timeout')),15000);});let result;
   try{result=await Promise.race([twttr.widgets.createTweet(id,host,{theme:'dark',dnt:true,conversation:'none',width:550,lang:language==='zh'?'zh-cn':'en'}),timeout]);}finally{clearTimeout(timer);}
   if(token===generation&&!result)showUnavailable(media,item,L.embed_error);
  }catch{if(token===generation)showUnavailable(media,item,L.embed_error);}
 }else{$('media-note').textContent='';showUnavailable(media,item,L.unavailable);}
}
$('close').addEventListener('click',()=>$('player').close());
$('player').addEventListener('close',()=>{++generation;$('media').querySelector('video')?.pause();$('media').replaceChildren();document.body.style.overflow='';});
$('player').addEventListener('click',event=>{if(event.target===$('player')){const r=$('player').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('player').close();}});
$('categories').querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;renderCategories();render();}));
['search','minimum','sort'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
$('reset').addEventListener('click',()=>{category='All';$('search').value='';$('minimum').value='0';$('sort').value='popular';renderCategories();render();});
bindCards();
