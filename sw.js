const staticCacheName = 's-app-v1'
const dynamicCacheName = 'd-app-v1'

const assetUrls = [
  'index.html',
  'tab.js',
  'style.css',
  'offline.html'
]

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)

  // event.waitUntil(
  //   caches.open(staticCacheName).then(cache => cache.addAll(assetUrls)))
})

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
    .filter(name => name !== staticCacheName)
    .filter(name => name !== dynamicCacheName)
    .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch',e => {
  const {request} = e
  const url = new URL(request.url)
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(e.request))
  } else {
    e.respondWith(networkFirst(request))
  }

})

async function cacheFirst(request)  {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request,response.clone())
    return response
  } catch (err) {
    const cached = await cache.match(request)
    return cached ?? await cache.match('offline.html')
  }
}