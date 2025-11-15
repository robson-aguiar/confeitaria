// Service Worker - Vera Lúcia Confeitaria PWA
const CACHE_NAME = 'veralucia-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/mobile.css',
    '/js/script.js',
    '/js/price-calculator.js',
    '/js/reviews.js',
    '/js/gallery-filters.js',
    '/js/visual-configurator.js',
    '/favicon.svg',
    '/manifest.json',
    // Cache algumas imagens principais
    '/images/optimized/downloadgram.org_461696459_1165667781194474_2951026535375491126_n.webp',
    '/images/optimized/downloadgram.org_491441920_17941518353989810_7528810505330933416_n.webp'
];

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
