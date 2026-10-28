// The Budg V11 — network-first for live financial data; safe offline shell fallback.
const CACHE='the-budg-v11-20261028';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(SHELL.map(async path=>{try{const response=await fetch(path,{cache:'no-store'});if(response.ok)await cache.put(path,response);}catch(_){/* optional assets */}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE&&/^budg-|^the-budg-/.test(k)).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);cache.put(req,response.clone()).catch(()=>{});}return response;}catch(_){return await caches.match(req)||Response.error();}})());
});
