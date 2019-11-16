const staticCacheName = 'site-static-v2';
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
    'images/doctor.jpg'
] 

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
             keys.filter( key =>  key !== staticCacheName)
             .map( key =>  caches.delete(key) )
         )
     }
       
     )
 )
});

self.addEventListener('fetch', evt => {
  evt.respondWith( 
    caches.match(evt.request).then(
        cacheRes => {
            return cacheRes || fetch(evt.request);
        }
    )
  );
})