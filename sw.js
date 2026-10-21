// The Budg v9: update cached app resources without caching bank API requests.
const CACHE = 'budg-v9';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await Promise.all(ASSETS.map(path => cache.add(path).catch(() => {})));
    await self.skipWaiting();
  }));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('budg-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache => cache.put(event.request,copy)).catch(()=>{});}
    return response;
  }).catch(() => caches.match(event.request)));
});
