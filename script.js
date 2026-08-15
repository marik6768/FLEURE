const products=[
 {name:'Nocturne',tag:'глубокий',desc:'Пионы, розы, ранункулюсы',price:74,img:'assets/nocturne.jpg'},
 {name:'Éclat',tag:'светлый',desc:'Розы, анемоны, эвкалипт',price:68,img:'assets/eclat.jpg'},
 {name:'Azure',tag:'холодный',desc:'Дельфиниум, белые розы, маттиола',price:72,img:'assets/azure.jpg'},
 {name:'Rosée',tag:'нежный',desc:'Садовые розы, ранункулюсы, астильба',price:65,img:'assets/rosee.jpg'},
 {name:'Soleil',tag:'солнечный',desc:'Георгины, ромашки, жёлтые розы',price:59,img:'assets/soleil.jpg'},
 {name:'Velours',tag:'бархатный',desc:'Бордовые розы, пионы, скабиоза',price:82,img:'assets/velours.jpg'},
 {name:'Lilas',tag:'дымчатый',desc:'Сирень, дельфиниум, розы',price:69,img:'assets/lilas.jpg'},
 {name:'Jardin',tag:'садовый',desc:'Сезонные садовые цветы',price:76,img:'assets/jardin.jpg'}
];

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const productsEl=$('#products'),cart=$('#cart'),overlay=$('#overlay'),cartItems=$('#cartItems'),cartTotal=$('#cartTotal'),cartCount=$('#cartCount'),toast=$('#toast');
let basket=[];

productsEl.innerHTML=products.map((p,i)=>`<article class="product-card reveal" style="transition-delay:${Math.min(i*45,260)}ms"><div class="product-image"><img src="${p.img}" alt="Букет ${p.name}" loading="lazy"></div><div class="product-info"><div class="product-top"><div class="product-name">${p.name}</div><div class="product-tag">${p.tag}</div></div><div class="product-desc">${p.desc}</div><div class="product-row"><span class="price">€${p.price}</span><button class="add" data-add="${i}" aria-label="Добавить ${p.name}">+</button></div></div></article>`).join('');

productsEl.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addToCart(+b.dataset.add)});
function addToCart(index){const item=basket.find(x=>x.index===index);if(item)item.qty++;else basket.push({index,qty:1});renderCart();openCart();showToast(`${products[index].name} добавлен в корзину`)}
function changeQty(index,delta){const item=basket.find(x=>x.index===index);if(!item)return;item.qty+=delta;if(item.qty<=0)basket=basket.filter(x=>x.index!==index);renderCart()}
function removeItem(index){basket=basket.filter(x=>x.index!==index);renderCart()}
function totals(){return{count:basket.reduce((s,x)=>s+x.qty,0),sum:basket.reduce((s,x)=>s+products[x.index].price*x.qty,0)}}
function renderCart(){cartItems.innerHTML=basket.length?basket.map(x=>{const p=products[x.index];return `<div class="cart-item"><img src="${p.img}" alt=""><div><div class="cart-item-name">${p.name}</div><div class="cart-item-price">€${p.price}</div><div class="qty"><button data-minus="${x.index}">−</button><span>${x.qty}</span><button data-plus="${x.index}">+</button></div></div><button class="remove" data-remove="${x.index}" aria-label="Удалить">×</button></div>`}).join(''):`<div class="cart-empty">В корзине пока ничего нет.<br><br>Выберите композицию из коллекции.</div>`;const t=totals();cartCount.textContent=t.count;cartTotal.textContent=`€${t.sum}`;renderCheckoutSummary()}
cartItems.addEventListener('click',e=>{const b=e.target;if(b.dataset.plus!==undefined)changeQty(+b.dataset.plus,1);if(b.dataset.minus!==undefined)changeQty(+b.dataset.minus,-1);if(b.dataset.remove!==undefined)removeItem(+b.dataset.remove)});
function openCart(){cart.classList.add('open');overlay.classList.add('active');document.body.classList.add('lock')}
function closeCart(){cart.classList.remove('open');overlay.classList.remove('active');document.body.classList.remove('lock')}
$('#cartOpen').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
$('#menuButton').addEventListener('click',()=>$('#nav').classList.toggle('open'));$$('.nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));

function openPage(id){closeCart();const el=$('#'+id);el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.classList.add('lock')}
function closePage(id){const el=$('#'+id);el.classList.remove('open');el.setAttribute('aria-hidden','true');document.body.classList.remove('lock')}
$('#checkoutOpen').addEventListener('click',()=>{if(!basket.length){showToast('Сначала добавьте букет');return}openPage('checkoutPage')});
$('#checkoutClose').addEventListener('click',()=>closePage('checkoutPage'));
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.open)));
$$('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>closePage(b.dataset.closeModal)));
$('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const method=data.get('delivery')==='courier'?'курьерская доставка':'самовывоз';showToast(`Заказ принят · ${method}`);basket=[];renderCart();e.currentTarget.reset();setTimeout(()=>closePage('checkoutPage'),500)});
function renderCheckoutSummary(){const el=$('#checkoutSummary');if(!basket.length){el.innerHTML='<p style="font-size:11px;color:#80686b">Корзина пуста.</p>';$('#checkoutTotal').textContent='€0';return}el.innerHTML=basket.map(x=>{const p=products[x.index];return `<div class="summary-item"><span>${p.name} × ${x.qty}</span><strong>€${p.price*x.qty}</strong></div>`}).join('');const t=totals();$('#checkoutTotal').textContent=`€${t.sum+7}`}
function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),1900)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closePage('checkoutPage');closePage('aboutModal')}});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});$$('.reveal').forEach(el=>observer.observe(el));
renderCart();
