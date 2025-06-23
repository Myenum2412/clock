"use client"

import { useState, useEffect, useCallback } from "react"

interface OfflineData {
  timestamp: number
  data: any
}

export function useOfflineStorage<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [isOffline, setIsOffline] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // Initialize data from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed: OfflineData = JSON.parse(stored)
        setData(parsed.data)
        setLastSync(new Date(parsed.timestamp))
      }
    } catch (error) {
      console.error("Error loading offline data:", error)
    }

    // Monitor online status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [key])

  // Save data to offline storage
  const saveData = useCallback(
    (newData: T) => {
      try {
        const offlineData: OfflineData = {
          timestamp: Date.now(),
          data: newData,
        }
        localStorage.setItem(key, JSON.stringify(offlineData))
        setData(newData)
        setLastSync(new Date())
      } catch (error) {
        console.error("Error saving offline data:", error)
      }
    },
    [key],
  )

  // Sync data when coming back online
  const syncData = useCallback(async () => {
    if (navigator.onLine && lastSync) {
      try {
        // Trigger sync event for service worker
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SYNC_DATA",
            key,
            data,
          })
        }
      } catch (error) {
        console.error("Error syncing data:", error)
      }
    }
  }, [key, data, lastSync])

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && lastSync) {
      syncData()
    }
  }, [isOffline, syncData, lastSync])

  return {
    data,
    saveData,
    syncData,
    isOffline,
    lastSync,
  }
}
