const CACHE = 'adron-motors-v2-safe-shell';
const SHELL = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon.svg'];
const PRIVATE_HINTS = ['/api/','/auth/','/login','/logout','/session','token','password','senha'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function isPrivateRequest(request) {
  const url = new URL(request.url);
  const path = (url.pathname + url.search).toLowerCase();
  return request.method !== 'GET' || request.headers.has('authorization') || request.headers.has('cookie') || request.headers.has('range') || request.headers.has('if-range') || PRIVATE_HINTS.some(hint => path.includes(hint));
}

function isCacheable(response) {
  if (!response || !response.ok || response.type === 'opaque') return false;
  const cc = (response.headers.get('cache-control') || '').toLowerCase();
  const vary = (response.headers.get('vary') || '').toLowerCase();
  return !cc.includes('private') && !cc.includes('no-store') && !response.headers.has('set-cookie') && !response.headers.has('content-range') && !vary.includes('authorization') && !vary.includes('cookie');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (isPrivateRequest(request) || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (isCacheable(response)) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
    }
    return response;
  })));
});
