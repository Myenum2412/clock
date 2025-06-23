// Clock Time PWA Service Worker v1.2.0
const CACHE_NAME = "clock-time-v1.2.0"
const STATIC_CACHE = "clock-time-static-v1.2.0"
const DYNAMIC_CACHE = "clock-time-dynamic-v1.2.0"

// Critical files to cache immediately
const STATIC_FILES = ["/", "/offline", "/manifest.json", "/favicon.ico"]

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static files")
        return cache.addAll(STATIC_FILES)
      }),
      caches.open(DYNAMIC_CACHE).then(() => {
        console.log("Service Worker: Dynamic cache created")
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete")
      return self.skipWaiting()
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activation complete")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline")
          })
        }),
    )
    return
  }

  // Handle all other requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          if (response.status === 200 && request.method === "GET") {
            const responseClone = response.clone()
            const cacheToUse = STATIC_FILES.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE

            caches.open(cacheToUse).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          if (request.destination === "document") {
            return caches.match("/offline")
          }
          throw new Error("Network request failed and no cache available")
        })
    }),
  )
})

// Background sync
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag)

  if (event.tag === "sync-user-data") {
    event.waitUntil(syncUserData())
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")

  const options = {
    body: event.data ? event.data.text() : "Clock Time notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Clock",
        icon: "/icons/action-view.png",
      },
      {
        action: "close",
        title: "Dismiss",
        icon: "/icons/action-close.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Clock Time", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Message handling
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "SYNC_DATA") {
    syncUserData(event.data.key, event.data.data)
  }
})

// Utility functions
async function syncUserData(key, data) {
  try {
    console.log("Service Worker: Syncing user data")

    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_SUCCESS",
        key: key,
      })
    })
  } catch (error) {
    console.error("Service Worker: Sync failed", error)
  }
}
