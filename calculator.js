function calculateBill(bill, share, saving) { const fraction=share/100*saving/100;return {saved:bill*fraction,remaining:bill*(1-fraction),percent:fraction*100}; }
function calculateUsage(tokens,calls,price){const each=tokens/1000000*price;return {each,total:each*calls};}
if(typeof document!=='undefined'){
const el=id=>document.getElementById(id),locale=document.documentElement.lang==='en'?'en-US':'zh-CN';
const fmt=(v,max=2)=>new Intl.NumberFormat(locale,{maximumFractionDigits:max}).format(v);
const money=(v,max=2)=>'USD '+fmt(v,max);
const read=id=>{const e=el(id);return e.value.trim()!==''&&e.validity.valid&&Number.isFinite(e.valueAsNumber)?e.valueAsNumber:null;};
function update(){const share=read('share'),saving=read('saving'),bill=read('bill');el('share-value').textContent=share+'%';el('saving-value').textContent=saving+'%';
const b=bill===null?null:calculateBill(bill,share,saving);for(const id of ['saved','remaining'])el(id).textContent=b?money(b[id]):'—';el('percent').textContent=b?fmt(b.percent)+'%':'—';el('formula').textContent=share+'% × '+saving+'% = '+fmt(share*saving/100)+'%';
const vals=['tokens','calls','price'].map(read),u=vals.includes(null)?null:calculateUsage(...vals);el('each').textContent=u&&Number.isFinite(u.each)?money(u.each,12):'—';el('total').textContent=u&&Number.isFinite(u.total)?money(u.total,8):'—';}
document.querySelectorAll('.calc-box input').forEach(e=>e.addEventListener('input',update));update();
}
if(typeof module!=='undefined')module.exports={calculateBill,calculateUsage};
