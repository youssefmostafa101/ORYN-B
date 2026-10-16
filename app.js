/* ORYN B — founding-drop storefront
 * Static GitHub Pages build: product selection is a local preview, not an order.
 * When ready, replace the early-access preview with an Omnisend embedded/hosted form.
 * Never put a private Omnisend API key in client-side JavaScript.
 */
(() => {
  'use strict';
  const PRODUCTS = Object.freeze({
    output: {name:'OUTPUT',caption:'Creatine Hydration Powder',image:'assets/output-front.webp'},
    deep: {name:'DEEP STATE',caption:'Ashwagandha Plus',image:'assets/deep-closed.webp'},
    bundle: {name:'THE DUAL',caption:'OUTPUT + DEEP STATE / founding pair',image:'assets/output-front.webp'}
  });
  const STORAGE_KEY = 'orynb-preview-bag-v2';
  const SEEN_KEY = 'orynb-offer-seen';
  const $ = (selector,root=document) => root.querySelector(selector);
  const $$ = (selector,root=document) => Array.from(root.querySelectorAll(selector));
  const safeJSON = (s) => {try{return JSON.parse(s);}catch{return {};}};
  const loadBag = () => {
    let stored={};try{stored=safeJSON(localStorage.getItem(STORAGE_KEY));}catch{}
    if (!stored || typeof stored!=='object' || Array.isArray(stored)) return {};
    return Object.fromEntries(Object.keys(PRODUCTS).map(id=>[id, Math.min(20,Math.max(0,Math.floor(Number(stored[id])||0)))]).filter(([,q])=>q>0));
  };
  let bag=loadBag();
  const saveBag=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(bag));}catch{}};
  let lastFocus=null;
  const updateBag=()=>{
    const total=Object.values(bag).reduce((a,b)=>a+b,0);
    $$('[data-count]').forEach(el=>el.textContent=String(total));
    const holder=$('#cart-content');
    if (!holder) return;
    if (total===0){holder.innerHTML='<p class="empty-bag">Nothing in your bag yet. Explore the two formulas, or add the founding pair to keep a preview selection on this device.</p>';return;}
    holder.innerHTML=Object.entries(bag).filter(([id,q])=>PRODUCTS[id]&&q>0).map(([id,q])=>`
      <div class="cart-entry" data-line="${id}">
        <div class="cart-entry-img"><img src="${PRODUCTS[id].image}" alt="" loading="lazy"></div>
        <div><h3>${PRODUCTS[id].name}</h3><p>${PRODUCTS[id].caption}</p><div class="qty-tools"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Remove one ${PRODUCTS[id].name}">−</button><span>${q}</span><button type="button" data-qty="${id}" data-delta="1" aria-label="Add one ${PRODUCTS[id].name}">+</button></div></div>
        <button type="button" data-remove="${id}" aria-label="Remove ${PRODUCTS[id].name} from bag">×</button>
      </div>`).join('');
  };
  const changeQty=(id,delta)=>{if(!PRODUCTS[id])return;const next=Math.max(0,Math.min(20,(bag[id]||0)+delta));if(next)bag[id]=next;else delete bag[id];saveBag();updateBag();};
  const drawer=$('#cart-drawer'),backdrop=$('#cart-overlay');
  function closeCart(returnFocus=true){if(!drawer)return;drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');backdrop.hidden=true;document.body.classList.remove('dialog-open');if(returnFocus&&lastFocus?.focus)lastFocus.focus();}
  function openCart(){if(!drawer)return;lastFocus=document.activeElement;updateBag();drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');backdrop.hidden=false;document.body.classList.add('dialog-open');drawer.focus();}
  $$('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{changeQty(btn.dataset.add,1);openCart();}));
  $$('[data-open-cart]').forEach(btn=>btn.addEventListener('click',openCart));
  $$('[data-close-cart]').forEach(btn=>btn.addEventListener('click',()=>closeCart()));
  backdrop?.addEventListener('click',()=>closeCart());
  drawer?.addEventListener('click',e=>{
    const qty=e.target.closest('[data-qty]');if(qty){changeQty(qty.dataset.qty,Number(qty.dataset.delta));return;}
    const remove=e.target.closest('[data-remove]');if(remove){delete bag[remove.dataset.remove];saveBag();updateBag();}
  });
  updateBag();

  const nav=$('#mobile-nav'),menuToggle=$('#menu-toggle');
  const closeMenu=()=>{if(!nav)return;nav.hidden=true;menuToggle?.setAttribute('aria-expanded','false');menuToggle?.setAttribute('aria-label','Open menu');};
  menuToggle?.addEventListener('click',()=>{const isOpen=nav.hidden;nav.hidden=!isOpen;menuToggle.setAttribute('aria-expanded',String(isOpen));menuToggle.setAttribute('aria-label',isOpen?'Close menu':'Open menu');});
  $$('#mobile-nav a, #mobile-nav button').forEach(el=>el.addEventListener('click',closeMenu));

  const modal=$('#offer-dialog'),canvas=$('#scratch-canvas'),revealButton=$('#reveal-offer');
  const form=$('#signup-form'),feedback=$('#signup-feedback');
  let surface=null,scratching=false,marks=0,revealed=false,modalFocus=null;
  const rememberOffer=()=>{try{sessionStorage.setItem(SEEN_KEY,'1');}catch{}};
  const hasSeenOffer=()=>{try{return sessionStorage.getItem(SEEN_KEY)==='1';}catch{return false;}};
  function setupScratch(){
    if(!canvas)return;
    revealed=false;marks=0;canvas.hidden=false;revealButton.hidden=false;revealButton.textContent='Or tap to reveal your offer →';if(form)form.hidden=true;
    const bounds=canvas.getBoundingClientRect();
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(bounds.width*ratio);canvas.height=Math.floor(bounds.height*ratio);
    surface=canvas.getContext('2d',{willReadFrequently:true});
    if(!surface)return;
    surface.setTransform(ratio,0,0,ratio,0,0);
    const w=bounds.width,h=bounds.height;
    const grad=surface.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#526d54');grad.addColorStop(.5,'#8aa185');grad.addColorStop(1,'#38523d');surface.fillStyle=grad;surface.fillRect(0,0,w,h);
    surface.fillStyle='rgba(233,217,181,.11)';for(let i=-h;i<w+h;i+=23){surface.save();surface.translate(i,0);surface.rotate(Math.PI/5);surface.fillRect(0,0,9,h*3);surface.restore();}
    surface.textAlign='center';surface.textBaseline='middle';surface.fillStyle='#fff7e7';
    surface.font='700 11px DM Sans, sans-serif';surface.fillText('YOUR FIRST-DROP REWARD',w/2,h/2-27);
    surface.font='600 27px Space Grotesk, sans-serif';surface.fillText('SCRATCH HERE',w/2,h/2+4);
    surface.font='500 11px DM Sans, sans-serif';surface.fillText('DRAG OR SWIPE TO REVEAL',w/2,h/2+31);
  }
  function revealOffer(){if(revealed)return;revealed=true;if(canvas)canvas.hidden=true;revealButton.hidden=true;if(form)form.hidden=false;rememberOffer();}
  function scratchAt(event){
    if(!surface||revealed)return;
    const rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    surface.globalCompositeOperation='destination-out';surface.beginPath();surface.arc(x,y,22,0,Math.PI*2);surface.fill();surface.globalCompositeOperation='source-over';
    if(++marks%9===0){const image=surface.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0,checked=0;for(let i=3;i<image.length;i+=4*36){checked++;if(image[i]<100)transparent++;}if(transparent/checked>.28)revealOffer();}
  }
  canvas?.addEventListener('pointerdown',e=>{scratching=true;canvas.setPointerCapture(e.pointerId);scratchAt(e);});
  canvas?.addEventListener('pointermove',e=>{if(scratching)scratchAt(e);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas?.addEventListener(type,()=>{scratching=false;}));
  revealButton?.addEventListener('click',revealOffer);
  function openOffer(){if(!modal)return;if(drawer?.classList.contains('is-open'))closeCart(false);closeMenu();modalFocus=document.activeElement;rememberOffer();if(!modal.open){modal.showModal();document.body.classList.add('dialog-open');requestAnimationFrame(setupScratch);}else{setupScratch();}}
  function closeOffer(){if(!modal?.open)return;modal.close();document.body.classList.remove('dialog-open');if(modalFocus?.focus)modalFocus.focus();}
  $$('[data-open-offer]').forEach(btn=>btn.addEventListener('click',openOffer));
  $('#close-offer')?.addEventListener('click',closeOffer);
  modal?.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeOffer();});
  modal?.addEventListener('close',()=>{document.body.classList.remove('dialog-open');rememberOffer();});
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const email=$('#signup-email'),consent=$('#email-consent');
    if(!email?.reportValidity())return;
    if(!consent.checked){consent.focus();feedback.textContent='Please confirm your email consent first.';feedback.className='signup-feedback error';return;}
    // Intentionally no backend / no pretend signup. Wire an actual Omnisend form before advertising capture.
    feedback.textContent='Email signup is not connected yet. Your address has NOT been submitted. Connect Omnisend to activate early access.';
    feedback.className='signup-feedback error';
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(drawer?.classList.contains('is-open'))closeCart();if(!nav?.hidden)closeMenu();}});

  const motionReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!motionReduced&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    $$('.reveal').forEach(el=>io.observe(el));
  }else{$$('.reveal').forEach(el=>el.classList.add('is-visible'));}
  let scheduled=false,autoOfferShown=false;
  function updateScroll(){
    scheduled=false;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    $('#scroll-progress')?.style.setProperty('transform',`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`);
    $('.site-header')?.classList.toggle('is-scrolled',scrollY>40);
    const scene=$('.capsule-scene');
    if(scene&&!motionReduced){const rect=scene.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height*.22)));scene.dataset.frame=String(progress<.38?0:progress<.67?1:2);}
    // A single, polite in-session invitation after the shopper has browsed.
    if(!autoOfferShown&&!hasSeenOffer()&&scrollY>max*.44&&scrollY>1050&&!(modal?.open)&&!drawer?.classList.contains('is-open')){autoOfferShown=true;openOffer();}
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
  window.addEventListener('resize',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
  updateScroll();
})();
