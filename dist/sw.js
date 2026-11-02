/* Lomo: service worker. Guarda la app para abrirla sin internet y avisa cuando hay versión nueva. */
const V='lomo-1.7.0-df8fe21cf8';
const CORE=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "icons/icon-180.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "assets/figure.png",
 "assets/logo.png",
 "vendor/fonts.js",
 "vendor/jszip.min.js",
 "vendor/epub.min.js",
 "vendor/pdf.min.js",
 "vendor/pdf.worker.min.js"
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('lomo-')&&k!==V)await caches.delete(k);
  await self.clients.claim();
})())});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(V);
    const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;
    try{return await fetch(r)}
    catch(err){if(r.mode==='navigate'){const i=await c.match('index.html');if(i)return i}throw err}
  })());
});
