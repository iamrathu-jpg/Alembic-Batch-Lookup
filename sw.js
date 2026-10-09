// Network-first: always fetch the latest app and data when online, fall back to cache offline.
const CACHE='batch-lookup-v1';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','sales-data.enc'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));}return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
