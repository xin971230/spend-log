// 這裡的版本號改了，手機就會知道有新版需要下載
const CACHE_NAME = 'ledger-cache-v6.7'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-yuanbao.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 強制立刻安裝新版
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // 策略改為：先嘗試從網路抓最新的，失敗才讀取快取
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 刪除舊版快取
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // 讓更新立刻在所有開啟的畫面生效
});
