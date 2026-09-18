const WHATSAPP='5512999999999';
const cars=[
{id:1,brand:'BMW',model:'BMW X1 sDrive20i',year:2023,km:21000,gear:'Automático',price:239900,badge:'Destaque',img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85'},
{id:2,brand:'Toyota',model:'Toyota Corolla Altis',year:2022,km:38000,gear:'Automático',price:149900,badge:'Excelente opção',img:'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1200&q=85'},
{id:3,brand:'Audi',model:'Audi A3 Sedan',year:2021,km:42000,gear:'Automático',price:169900,badge:'Premium',img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85'},
{id:4,brand:'Jeep',model:'Jeep Compass Limited',year:2022,km:33000,gear:'Automático',price:159900,badge:'SUV',img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85'},
{id:5,brand:'Honda',model:'Honda Civic Touring',year:2021,km:47000,gear:'Automático',price:154900,badge:'Completo',img:'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85'},
{id:6,brand:'Volkswagen',model:'Volkswagen T-Cross Highline',year:2023,km:26000,gear:'Automático',price:142900,badge:'Baixa km',img:'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85'}
];
let filtered=[...cars],deferredPrompt=null;
const $=s=>document.querySelector(s);
const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
function wa(msg){window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg),'_blank')}
function render(){
 const grid=$('#carGrid'); grid.innerHTML='';
 filtered.forEach(c=>{const el=document.createElement('article');el.className='car-card';el.innerHTML=`<div class="car-img"><img src="${c.img}" alt="${c.model}" loading="lazy"><span class="pill">${c.badge}</span><button class="fav" data-fav="${c.id}" aria-label="Favoritar">♡</button></div><div class="car-body"><h3>${c.model}</h3><div class="specs"><span>${c.year}</span><span>${c.km.toLocaleString('pt-BR')} km</span><span>${c.gear}</span></div><div class="price-row"><div class="price">${money(c.price)}</div><button class="link-btn" data-detail="${c.id}">Ver detalhes →</button></div></div>`;grid.appendChild(el)});
 $('#countLabel').textContent=filtered.length+' veículos';
 document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>openDetail(+b.dataset.detail));
 document.querySelectorAll('[data-fav]').forEach(b=>{if(localStorage.getItem('fav-'+b.dataset.fav))b.classList.add('active');b.onclick=()=>{b.classList.toggle('active');localStorage.setItem('fav-'+b.dataset.fav,b.classList.contains('active')?'1':'')}});
}
function applyFilters(){
 const q=$('#searchInput').value.toLowerCase().trim(),brand=$('#brandFilter').value,max=+$(' #priceFilter'.trim()).value||Infinity;
 filtered=cars.filter(c=>(!q||(c.model+' '+c.brand).toLowerCase().includes(q))&&(!brand||c.brand===brand)&&c.price<=max);
 sortCars();render();
}
function sortCars(){const s=$('#sortSelect').value;if(s==='priceAsc')filtered.sort((a,b)=>a.price-b.price);if(s==='priceDesc')filtered.sort((a,b)=>b.price-a.price);if(s==='yearDesc')filtered.sort((a,b)=>b.year-a.year)}
function openDetail(id){const c=cars.find(x=>x.id===id);$('#modalContent').innerHTML=`<img class="detail-image" src="${c.img}" alt="${c.model}"><div class="detail-body"><span class="eyebrow">${c.brand}</span><h2>${c.model}</h2><div class="specs"><span>Ano ${c.year}</span><span>${c.km.toLocaleString('pt-BR')} km</span><span>${c.gear}</span></div><div class="price">${money(c.price)}</div><p style="color:#a6adb8;line-height:1.7">Entre em contato para consultar disponibilidade, condições de pagamento, avaliação do seu usado e mais informações deste veículo.</p><div class="detail-actions"><button class="btn whatsapp" onclick="wa('Olá! Tenho interesse no ${c.model} anunciado na ADRON MOTORS.')">Tenho interesse</button><button class="btn secondary" onclick="wa('Olá! Quero simular financiamento do ${c.model}.')">Simular financiamento</button><button class="btn secondary" onclick="navigator.share?navigator.share({title:'${c.model}',url:location.href}):navigator.clipboard.writeText(location.href)">Compartilhar</button></div></div>`;$('#detailModal').classList.remove('hidden')}
[...new Set(cars.map(c=>c.brand))].sort().forEach(b=>$('#brandFilter').insertAdjacentHTML('beforeend',`<option>${b}</option>`));
$('#filterBtn').onclick=applyFilters;$('#searchInput').addEventListener('input',applyFilters);$('#brandFilter').onchange=applyFilters;$('#priceFilter').onchange=applyFilters;$('#sortSelect').onchange=()=>{sortCars();render()};$('#modalClose').onclick=()=>$('#detailModal').classList.add('hidden');$('#detailModal').onclick=e=>{if(e.target.id==='detailModal')$('#detailModal').classList.add('hidden')};$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');document.querySelectorAll('[data-whatsapp]').forEach(b=>b.onclick=()=>wa(b.dataset.whatsapp));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden')}};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
render();