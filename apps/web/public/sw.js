// Service Worker for Performance Optimization and Offline Capability
// Version 1.0.0

const CACHE_NAME = 'indiranagar-discovery-v1'
const STATIC_CACHE = 'static-assets-v1'
const API_CACHE = 'api-responses-v1'
const IMAGE_CACHE = 'optimized-images-v1'

// Cache version management
const CACHE_VERSION = '1.0.0'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/offline',
  '/_next/static/css/',
  '/_next/static/js/',
  '/images/placeholder-place.jpg',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
]

// API endpoints that should be cached
const CACHEABLE_API_ROUTES = [
  '/api/places',
  '/api/weather',
  '/api/health'
]

// Network-first strategy routes (always try network first)
const NETWORK_FIRST_ROUTES = [
  '/api/analytics',
  '/api/events',
  '/api/community-suggestions'
]

// Installation event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_RESOURCES.filter(resource => 
          !resource.includes('_next') // Skip Next.js build files during install
        ))
      }),
      
      // Set cache metadata
      caches.open(CACHE_NAME).then((cache) => {
        return cache.put('__cache_metadata__', new Response(JSON.stringify({
          version: CACHE_VERSION,
          timestamp: Date.now(),
          expiry: Date.now() + CACHE_EXPIRY
        })))
      })
    ]).then(() => {
      console.log('Service Worker installed successfully')
      return self.skipWaiting()
    })
  )
})

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('indiranagar-discovery') && 
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE &&
                cacheName !== API_CACHE &&
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated successfully')
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip external domains (except for allowed image sources)
  if (url.origin !== self.location.origin && !isAllowedImageSource(url)) {
    return
  }

  event.respondWith(handleFetchRequest(request, url))
})

// Main fetch handler with different strategies
async function handleFetchRequest(request, url) {
  try {
    // Handle different types of requests with appropriate strategies
    
    if (isStaticAsset(url)) {
      return handleStaticAsset(request)
    }
    
    if (isAPIRequest(url)) {
      return handleAPIRequest(request, url)
    }
    
    if (isImageRequest(url)) {
      return handleImageRequest(request)
    }
    
    if (isPageRequest(url)) {
      return handlePageRequest(request)
    }
    
    // Default: network-first
    return handleNetworkFirst(request)
    
  } catch (error) {
    console.error('Fetch error:', error)
    return handleOfflineFallback(request, url)
  }
}

// Static assets: Cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Static asset fetch failed:', error)
    throw error
  }
}

// API requests: Network-first with intelligent caching
async function handleAPIRequest(request, url) {
  const cache = await caches.open(API_CACHE)
  const pathname = url.pathname
  
  // Network-first routes (analytics, real-time data)
  if (NETWORK_FIRST_ROUTES.some(route => pathname.startsWith(route))) {
    return handleNetworkFirst(request, cache)
  }
  
  // Cacheable API routes with stale-while-revalidate
  if (CACHEABLE_API_ROUTES.some(route => pathname.startsWith(route))) {
    return handleStaleWhileRevalidate(request, cache)
  }
  
  // Default API handling: network-first
  return handleNetworkFirst(request, cache)
}

// Images: Cache-first with optimization
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Return cached image if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful image responses
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Image fetch failed:', error)
    // Return placeholder image for failed image requests
    return getPlaceholderImage()
  }
}

// Pages: Network-first with offline support
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Try to serve from cache
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Serve offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline')
    }
    
    throw error
  }
}

// Network-first strategy
async function handleNetworkFirst(request, cache = null) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok && cache) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    if (cache) {
      const cachedResponse = await cache.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
    }
    throw error
  }
}

// Stale-while-revalidate strategy
async function handleStaleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request)
  
  // Always try to update the cache in the background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Silently fail background updates
  })
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Don't await the network promise to avoid blocking
    networkPromise
    return cachedResponse
  }
  
  // If no cached response, wait for network
  try {
    return await networkPromise
  } catch (error) {
    throw error
  }
}

// Offline fallback handler
async function handleOfflineFallback(request, url) {
  // For navigation requests, serve offline page
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/offline')
    if (offlinePage) {
      return offlinePage
    }
  }
  
  // For images, serve placeholder
  if (isImageRequest(url)) {
    return getPlaceholderImage()
  }
  
  // For API requests, return offline response
  if (isAPIRequest(url)) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This request requires an internet connection',
      timestamp: Date.now()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Generic offline response
  return new Response('Offline', { status: 503 })
}

// Utility functions
function isStaticAsset(url) {
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff')
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/')
}

function isImageRequest(url) {
  return url.pathname.startsWith('/images/') ||
         url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i) ||
         isAllowedImageSource(url)
}

function isPageRequest(url) {
  return url.origin === self.location.origin &&
         !isStaticAsset(url) &&
         !isAPIRequest(url) &&
         !isImageRequest(url)
}

function isAllowedImageSource(url) {
  const allowedHosts = [
    'images.unsplash.com',
    'supabase.co'
  ]
  
  return allowedHosts.some(host => url.hostname.includes(host))
}

async function getPlaceholderImage() {
  const cache = await caches.open(IMAGE_CACHE)
  return cache.match('/images/placeholder-place.jpg') ||
         new Response('', { status: 404 })
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncAnalytics() {
  try {
    // Sync any queued analytics events
    const cache = await caches.open('analytics-queue')
    const requests = await cache.keys()
    
    for (const request of requests) {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.log('Analytics sync failed for:', request.url)
      }
    }
  } catch (error) {
    console.error('Analytics sync error:', error)
  }
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/icons/explore-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/icons/close-icon.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Indiranagar Discovery', options)
  )
})

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches())
  }
  
  if (event.data && event.data.type === 'CACHE_ANALYTICS') {
    event.waitUntil(cacheAnalyticsEvent(event.data.payload))
  }
})

async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
  console.log('All caches cleared')
}

async function cacheAnalyticsEvent(payload) {
  const cache = await caches.open('analytics-queue')
  const request = new Request('/api/analytics/events', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
  await cache.put(request, new Response())
}

console.log('Service Worker loaded successfully')