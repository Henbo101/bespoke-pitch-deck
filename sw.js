const CACHE = 'bespoke-v1';

const PRECACHE = [
  '/bespoke-pitch-deck/',
  '/bespoke-pitch-deck/index.html',
  '/bespoke-pitch-deck/css/styles.css',
  '/bespoke-pitch-deck/js/app.js',
  '/bespoke-pitch-deck/data/catalogue.js',
  '/bespoke-pitch-deck/manifest.webmanifest',
  '/bespoke-pitch-deck/assets/fonts/inter-light.woff2',
  '/bespoke-pitch-deck/assets/fonts/playfair-display-regular.woff2',
  '/bespoke-pitch-deck/assets/fonts/playfair-display-italic.woff2',
  '/bespoke-pitch-deck/assets/icon.png',
  '/bespoke-pitch-deck/assets/images/badger-lodge-playhouse-and-slide-extension.jpeg',
  '/bespoke-pitch-deck/assets/images/bespoke-castle-playcentre.jpeg',
  '/bespoke-pitch-deck/assets/images/custom-hex-tower-playcentre.jpg',
  '/bespoke-pitch-deck/assets/images/custom-playcehntre-in-london-with-damson-cottage.jpeg',
  '/bespoke-pitch-deck/assets/images/custom-playcentre-with-otter-cottage.jpg',
  '/bespoke-pitch-deck/assets/images/d2.jpg',
  '/bespoke-pitch-deck/assets/images/damson-cottage-playcentre.jpg',
  '/bespoke-pitch-deck/assets/images/damson-mega.jpg',
  '/bespoke-pitch-deck/assets/images/fantasy-castle-playcentre-with-tube-slide.jpg',
  '/bespoke-pitch-deck/assets/images/forest-combo.jpg',
  '/bespoke-pitch-deck/assets/images/forest-mega-combo-playcentre-with-turbo-tube-slide.jpg',
  '/bespoke-pitch-deck/assets/images/harvestwood-house.jpg',
  '/bespoke-pitch-deck/assets/images/large-bespoke-playcentre-with-castlke-and-2-story-playhouse.jpg',
  '/bespoke-pitch-deck/assets/images/large-bespoke-playcentre-with-custom-playhouse.jpg',
  '/bespoke-pitch-deck/assets/images/large-custom-adventure-wooden-playcentre.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-forest-combo-4.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-fullsizerender-1.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-fullsizerender.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-hart-dover-1.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-hart-dover-4.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-img-7975.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-img-7977.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-img-7978.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-img-8018.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-img-8029.jpeg',
  '/bespoke-pitch-deck/assets/images/lifestyle-imgp2584.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-imgp2586.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-imgp2591.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-playways-pics-016-2.jpg',
  '/bespoke-pitch-deck/assets/images/lifestyle-show-photo3-2-copy.jpg',
  '/bespoke-pitch-deck/assets/images/multi-tower-climbing-frame.jpg',
  '/bespoke-pitch-deck/assets/images/otter-cottage-playcentre.jpg',
  '/bespoke-pitch-deck/assets/images/otter-cottage.jpg',
  '/bespoke-pitch-deck/assets/images/otter-mega-combo-2-storey-playhouse-climbing-frame.jpg',
  '/bespoke-pitch-deck/assets/images/otter-mega-combo-playcentre-with-turbo-tube-slide.jpg',
  '/bespoke-pitch-deck/assets/images/otter-mega-combo-playcentre.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
