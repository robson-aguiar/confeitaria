// Service Worker - Vera Lúcia Confeitaria PWA
const CACHE_NAME = 'vera-lucia-v1';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/visual-configurator.js',
    '/js/gallery-filters.js',
    '/js/loyalty-system.js',
    '/manifest.json'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE))
    );
});

// Fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});
