const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/bootstrap.min.js',
    '/js/jquery.mini.js',
    '/js/fontawesome.min.js',
    '/css/bootstrap.min.css',
    '/css/fontawesome.min.css',
    '/css/index.css',
    '/images/dish.png',
    '/pages/fallback.html'
] 

const limitCacheSize = (name, size)=>{
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name,size))
            }
        })
    })
}
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then( cache => {
            console.log('caching shell assets')
            cache.addAll(assets)
        })
    )
});


self.addEventListener('activate', evt => {
    //
 evt.waitUntil(
     caches.keys().then( keys => {
         return Promise.all(
             keys.filter( key =>  key !== staticCacheName && key !== dynamicCacheName)
             .map( key =>  caches.delete(key) )
         )
     })
 )
});

self.addEventListener('fetch', evt => {
  evt.respondWith( 
    caches.match(evt.request).then(
        cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchResponse =>{
              return caches.open(dynamicCacheName).then(cache =>{
                  cache.put(evt.request.url,fetchResponse.clone());
                  limitCacheSize(dynamicCacheName,1);
                  return fetchResponse;
              }); 
            });
        }).catch( () => {
            if(evt.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html'); 
            }
        })
  );
})