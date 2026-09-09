const PRODUCTS = {
  output: {
    name: 'OUTPUT',
    price: 39,
    eyebrow: '01 / HYDRATION + OUTPUT',
    title: 'OUTPUT',
    lede: 'Creatine monohydrate with electrolytes, designed as a straightforward daily performance formula.',
    micro: 'Dietary supplement · Lemon · 300 g · 30 servings',
    facts: [
      ['Creatine monohydrate', '5,000 mg'],
      ['Sodium (as sea salt)', '1,000 mg'],
      ['Potassium (as potassium chloride)', '200 mg'],
      ['Magnesium (as magnesium malate)', '60 mg']
    ],
    modalIntro: 'The current OUTPUT formulation concept per serving, shown for transparency. Final production label and Supplement Facts panel take precedence.'
  },
  deepstate: {
    name: 'DEEP STATE',
    price: 42,
    eyebrow: '02 / EVENING ROUTINE',
    title: 'DEEP STATE',
    lede: 'A focused ashwagandha-centered supplement formula with complementary nutrients and botanical actives.',
    micro: 'Dietary supplement · 60 capsules · 44 g',
    facts: [
      ['Vitamin D3', '20 mcg'],
      ['Vitamin B6', '2.5 mg'],
      ['Vitamin B12', '25 mcg'],
      ['KSM-66 Ashwagandha', '600 mg'],
      ['L-Arginine', '300 mg'],
      ['Maca', '150 mg'],
      ['Panax Ginseng', '100 mg'],
      ['Shatavari', '50 mg']
    ],
    modalIntro: 'The current DEEP STATE formulation concept per serving, shown for transparency. Final production label and Supplement Facts panel take precedence.'
  }
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

let cart = JSON.parse(localStorage.getItem('orynb-cart') || '[]');
let currentProduct = 'output';

function toast(message){
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}

function saveCart(){
  localStorage.setItem('orynb-cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(key){
  const item = cart.find(i=>i.key===key);
  if(item) item.qty += 1;
  else cart.push({key, qty:1});
  saveCart();
  toast(`${PRODUCTS[key].name} added to bag`);
  openLayer('bagDrawer');
}

function renderCart(){
  const count = cart.reduce((sum,i)=>sum+i.qty,0);
  $('#bagCount').textContent = count;
  const target = $('#bagItems');
  if(!cart.length){
    target.innerHTML = '<div class="empty-state">Your bag is empty.<br><small>Pick your supply and lock in.</small></div>';
  } else {
    target.innerHTML = cart.map(item=>{
      const p=PRODUCTS[item.key];
      return `<div class="bag-item"><div><strong>${p.name}</strong><small>${item.qty} × $${p.price}</small></div><button type="button" data-remove="${item.key}">Remove</button></div>`
    }).join('');
  }
  target.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{
    cart = cart.filter(i=>i.key!==btn.dataset.remove); saveCart(); toast('Removed from bag');
  }));
  const total=cart.reduce((sum,i)=>sum+PRODUCTS[i.key].price*i.qty,0);
  $('#bagTotal').textContent = `$${total.toFixed(0)}`;
}

function openLayer(id){
  const el=$('#'+id); el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeLayer(id){
  const el=$('#'+id); el.classList.remove('open'); el.setAttribute('aria-hidden','true');
  if(!$('.drawer.open,.modal.open,.mobile-menu.open')) document.body.style.overflow='';
}

function setProduct(key){
  currentProduct=key;
  const p=PRODUCTS[key];
  $$('.product-tab').forEach(b=>b.classList.toggle('active',b.dataset.product===key));
  $('#productEyebrow').textContent=p.eyebrow;
  $('#productTitle').textContent=p.title;
  $('#productLede').textContent=p.lede;
  $('#productArt [data-art="output"]').hidden=key!=='output';
  $('#productArt [data-art="deepstate"]').hidden=key!=='deepstate';
  const facts=$('#quickFacts');
  facts.innerHTML=p.facts.slice(0,4).map(f=>`<div><span>${f[1]}</span><small>${f[0]}</small></div>`).join('');
  $('.microcopy').textContent=p.micro;
  $$('.add-button').forEach(b=>b.textContent=`Add ${p.name} +`);
  $$('.details-button').forEach(b=>b.dataset.details=key);
  requestAnimationFrame(()=>revealVisible());
}

function openFormula(key){
  const p=PRODUCTS[key];
  $('#modalEyebrow').textContent=key==='output' ? '01 / FORMULA' : '02 / FORMULA';
  $('#modalTitle').textContent=p.name;
  $('#modalBody').textContent=p.modalIntro;
  $('#modalFacts').innerHTML=p.facts.map(f=>`<div class="modal-fact"><span>${f[0]}</span><span>${f[1]}</span></div>`).join('');
  openLayer('formulaModal');
}

function revealVisible(){
  const items=$$('.reveal');
  if(!('IntersectionObserver' in window)){items.forEach(i=>i.classList.add('visible')); return;}
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
  items.forEach(i=>{if(!i.classList.contains('visible')) obs.observe(i)});
}

$$('.product-tab').forEach(btn=>btn.addEventListener('click',()=>setProduct(btn.dataset.product)));
$$('.add-button').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.add || currentProduct)));
$$('.details-button').forEach(btn=>btn.addEventListener('click',()=>openFormula(btn.dataset.details || currentProduct)));
$('#bagOpen').addEventListener('click',()=>openLayer('bagDrawer'));
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark-mode');localStorage.setItem('orynb-theme',document.body.classList.contains('dark-mode')?'dark':'light')});
$('#checkoutButton').addEventListener('click',()=>toast('Connect your checkout provider before launch'));
$('#menuOpen').addEventListener('click',()=>openLayer('mobileMenu'));
$$('[data-close="bag"]').forEach(el=>el.addEventListener('click',()=>closeLayer('bagDrawer')));
$$('[data-close="modal"]').forEach(el=>el.addEventListener('click',()=>closeLayer('formulaModal')));
$$('[data-close="menu"]').forEach(el=>el.addEventListener('click',()=>closeLayer('mobileMenu')));
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>closeLayer('mobileMenu')));

$$('.formula-switch').forEach(btn=>btn.addEventListener('click',()=>{
  const key=btn.dataset.formula;
  $$('.formula-switch').forEach(b=>b.classList.toggle('active',b===btn));
  $$('.formula-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===key));
}));

const situations={
  train:{title:'Train with a routine you can repeat.',body:'OUTPUT is built around creatine monohydrate and electrolytes for a clean, practical addition to your training-day routine.'},
  build:{title:'Build without making the system complicated.',body:'DEEP STATE is positioned as a focused daily formula for the part of the day when you want to slow the pace and protect your routine.'},
  reset:{title:'Close the day with intention.',body:'DEEP STATE sits in the evening side of the ORYN B system, with an ashwagandha-centered formula and a quieter product experience.'}
};
$$('.situation-card').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.situation-card').forEach(b=>b.classList.toggle('active',b===btn));
  $('#situationTitle').textContent=situations[btn.dataset.situation].title;
  $('#situationBody').textContent=situations[btn.dataset.situation].body;
}));

if(localStorage.getItem('orynb-theme')==='dark') document.body.classList.add('dark-mode');
$('#year').textContent=new Date().getFullYear();
renderCart();
revealVisible();

window.addEventListener('keydown',e=>{if(e.key==='Escape'){['bagDrawer','formulaModal','mobileMenu'].forEach(id=>{if($('#'+id).classList.contains('open'))closeLayer(id)})}});
