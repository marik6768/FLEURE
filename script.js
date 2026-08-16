const products=[
["Nocturne","Пионовидные розы, розы, лизиантусы",74,"bouquet-1.webp"],
["Éclat","Пионы, розы, ранункулюсы",68,"bouquet-2.webp"],
["Rosée","Розовые розы, пионы, гвоздики",72,"bouquet-3.webp"],
["Jardin","Розы, ранункулюсы, сезонные цветы",65,"bouquet-4.webp"],
["Velours","Красные розы",82,"bouquet-5.webp"],
["Blush","Нежные розы и пионовидные цветы",59,"bouquet-6.webp"],
["Lilas","Сирень, розы, лавандовые оттенки",69,"bouquet-7.webp"],
["Azure","Гортензия голубого оттенка",76,"bouquet-8.webp"]];

const $=s=>document.querySelector(s), productsEl=$("#products"), drawer=$("#drawer"), backdrop=$("#backdrop");
let basket=[];
productsEl.innerHTML=products.map((p,i)=>`<article class="product reveal"><div class="product-img"><img loading="lazy" src="assets/${p[3]}" alt="${p[0]}"></div><div class="product-body"><div class="product-name">${p[0]}</div><div class="product-desc">${p[1]}</div><div class="product-row"><span class="price">€${p[2]}</span><button class="add" data-i="${i}" aria-label="Добавить ${p[0]}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div></div></article>`).join("");

productsEl.addEventListener("click",e=>{const b=e.target.closest(".add");if(!b)return;add(+b.dataset.i)});
function add(i){const x=basket.find(v=>v.i===i);x?x.q++:basket.push({i,q:1});render();openDrawer();toast(`${products[i][0]} добавлен в корзину`)}
function render(){let count=basket.reduce((s,x)=>s+x.q,0), total=basket.reduce((s,x)=>s+products[x.i][2]*x.q,0);$("#count").textContent=count;$("#total").textContent=`€${total}`;$("#cartList").innerHTML=basket.length?basket.map(x=>{const p=products[x.i];return `<div class="cart-item"><img src="assets/${p[3]}" alt=""><div><strong>${p[0]}</strong><small>€${p[2]}</small><div class="qty"><button data-i="${x.i}" data-d="-1">−</button>${x.q}<button data-i="${x.i}" data-d="1">+</button></div></div><button class="remove" data-r="${x.i}" aria-label="Удалить"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg></button></div>`}).join(""):`<p style="font-size:12px;color:#80666a">В корзине пока пусто.</p>`}
$("#cartList").addEventListener("click",e=>{const q=e.target.closest("[data-d]"),r=e.target.closest("[data-r]");if(q){const x=basket.find(v=>v.i===+q.dataset.i);x.q+=+q.dataset.d;if(x.q<=0)basket=basket.filter(v=>v!==x);render()}if(r){basket=basket.filter(v=>v.i!==+r.dataset.r);render()}});
function openDrawer(){drawer.classList.add("on");backdrop.classList.add("on");document.body.classList.add("lock")}
function closeDrawer(){drawer.classList.remove("on");backdrop.classList.remove("on");document.body.classList.remove("lock")}
$("#openCart").onclick=openDrawer;$("#closeCart").onclick=closeDrawer;backdrop.onclick=closeDrawer;
$("#checkout").onclick=()=>{if(!basket.length)return toast("Сначала добавьте букет");$("#checkoutModal").classList.add("on");closeDrawer()};
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("on");
$("#orderForm").onsubmit=e=>{e.preventDefault();$("#checkoutModal").classList.remove("on");basket=[];render();toast("Заказ принят · демонстрационная версия")};
$("#deliveryBtn").onclick=()=>toast("Доставка по городу и за его пределы · от €8");
$("#menu").onclick=()=>$("#nav").classList.toggle("mobile");
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("mobile"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawer();$("#checkoutModal").classList.remove("on");$("#nav").classList.remove("mobile")}});
let t;function toast(s){$("#toast").textContent=s;$("#toast").classList.add("on");clearTimeout(t);t=setTimeout(()=>$("#toast").classList.remove("on"),1800)}
document.querySelectorAll('.social a').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(x=>io.observe(x));render();