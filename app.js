const WHATSAPP='5512999999999';
const cars=[];
let deferredPrompt=null;
const $=s=>document.querySelector(s);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn')?.classList.remove('hidden')});
$('#installBtn')?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn')?.classList.add('hidden')});
if('serviceWorker' in navigator){window.addEventListener('load',async()=>{try{const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});await registration.update();}catch(error){console.error('Service worker registration failed',error)}})}