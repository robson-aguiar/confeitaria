// Service Worker Avançado - PWA Premium
const CACHE_NAME = 'vera-lucia-v2.0';
const OFFLINE_PAGE = '/offline.html';

// Recursos para cache
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/js/visual-configurator.js',
    '/js/gallery-filters.js',
    '/js/ar-viewer.js',
    '/js/3d-configurator.js',
    '/manifest.json',
    '/favicon.svg',
    OFFLINE_PAGE
];

// Cache de imagens (estratégia diferente)
const IMAGE_CACHE = 'images-v1';
const MODELS_CACHE = 'models-v1';

// Instalação do SW
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE)),
            caches.open(IMAGE_CACHE),
            caches.open(MODELS_CACHE)
        ])
    );
    self.skipWaiting();
});

// Ativação do SW
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== IMAGE_CACHE && 
                        cacheName !== MODELS_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptação de requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Estratégias diferentes por tipo de recurso
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (url.pathname.includes('/models/')) {
        event.respondWith(handle3DModelRequest(request));
    } else if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
    } else {
        event.respondWith(handleStaticRequest(request));
    }
});

// Cache-first para imagens
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Retornar imagem placeholder se offline
        return new Response(
            '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em">Imagem indisponível</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// Cache-first para modelos 3D
async function handle3DModelRequest(request) {
    const cache = await caches.open(MODELS_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('', { status: 404 });
    }
}

// Network-first para navegação
async function handleNavigationRequest(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html');
        return cached || cache.match(OFFLINE_PAGE);
    }
}

// Cache-first para recursos estáticos
async function handleStaticRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Recurso indisponível offline', { status: 503 });
    }
}

// Background Sync para pedidos offline
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-orders') {
        event.waitUntil(syncOfflineOrders());
    }
});

async function syncOfflineOrders() {
    const orders = await getOfflineOrders();
    
    for (const order of orders) {
        try {
            await sendOrderToServer(order);
            await removeOfflineOrder(order.id);
        } catch (error) {
            console.log('Falha ao sincronizar pedido:', error);
        }
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nova promoção disponível!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Promoção',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Vera Lúcia Confeitaria', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Funções auxiliares (implementar conforme necessário)
async function getOfflineOrders() {
    // Implementar busca no IndexedDB
    return [];
}

async function sendOrderToServer(order) {
    // Implementar envio para servidor
    return fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order)
    });
}

async function removeOfflineOrder(orderId) {
    // Implementar remoção do IndexedDB
}
