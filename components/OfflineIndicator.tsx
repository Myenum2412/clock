"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const offline = !navigator.onLine
      setIsOffline(offline)

      if (!offline) {
        setLastSync(new Date())
      }
    }

    // Initial check
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  if (!isOffline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-in slide-in-from-top-4">
      <Card className="bg-amber-50 border-amber-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-900">Offline Mode</span>
                  <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Still Working
                  </Badge>
                </div>
                <p className="text-sm text-amber-700">Clock continues to work offline with cached data</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              {showDetails ? "Hide" : "Details"}
            </Button>
          </div>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-700 font-medium">Available Features:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Current Time
                  </div>
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    World Clock
                  </div>
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Time Converter
                  </div>
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Saved Locations
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="w-3 h-3" />
                    Weather (Limited)
                  </div>
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Alarms
                  </div>
                </div>

                {lastSync && <div className="text-xs text-amber-600">Last synced: {lastSync.toLocaleTimeString()}</div>}

                <Button size="sm" onClick={handleRetry} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Connection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
