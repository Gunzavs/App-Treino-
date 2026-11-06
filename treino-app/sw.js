var C="treino-v9";
var F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(F.map(function(u){
      return fetch(new Request(u,{cache:"reload"})).then(function(r){return c.put(u,r)});
    }));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(
    fetch(new Request(e.request.url,{cache:"no-cache"})).then(function(r){
      var cp=r.clone();
      caches.open(C).then(function(c){c.put(e.request,cp)});
      return r;
    }).catch(function(){return caches.match(e.request)})
  );
});
