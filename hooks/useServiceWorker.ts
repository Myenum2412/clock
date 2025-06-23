"use client"

import { useEffect, useState } from "react"

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isUpdateAvailable: boolean
  isOffline: boolean
  registration: ServiceWorkerRegistration | null
}

export function useServiceWorker() {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    isOffline: false,
    registration: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if service workers are supported
    const isSupported = "serviceWorker" in navigator
    setSwState((prev) => ({ ...prev, isSupported }))

    if (!isSupported) return

    // Register service worker with fallback
    const registerSW = async () => {
      try {
        // Try the route-based service worker first
        let registration: ServiceWorkerRegistration

        try {
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })
        } catch (routeError) {
          console.warn("Route-based SW failed, trying static file:", routeError)
          // Fallback to static file
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          })
        }

        setSwState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }))

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setSwState((prev) => ({ ...prev, isUpdateAvailable: true }))
              }
            })
          }
        })

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "CACHE_UPDATED") {
            setSwState((prev) => ({ ...prev, isUpdateAvailable: true }))
          }
        })

        console.log("Service Worker registered successfully")
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }

    registerSW()

    // Monitor online/offline status
    const updateOnlineStatus = () => {
      setSwState((prev) => ({ ...prev, isOffline: !navigator.onLine }))
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  const updateServiceWorker = () => {
    if (swState.registration?.waiting) {
      swState.registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  return {
    ...swState,
    updateServiceWorker,
  }
}

// Default export for backward compatibility
export default useServiceWorker
