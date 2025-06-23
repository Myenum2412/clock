"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, WifiOff, RefreshCw, Home, Globe, Calculator, AlarmClock } from "lucide-react"

export default function OfflinePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  const handleGoHome = () => {
    if (isOnline) {
      window.location.href = "/"
    } else {
      alert("Still offline. Please check your internet connection.")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            {isOnline ? <Wifi className="w-12 h-12 text-green-400" /> : <WifiOff className="w-12 h-12 text-red-400" />}
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Clock Time
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="secondary"
              className={`${isOnline ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
            >
              {isOnline ? "Back Online" : "Offline Mode"}
            </Badge>
          </div>
        </div>

        {/* Current Time Display */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl font-mono font-bold tracking-wider">{formatTime(currentTime)}</div>
              <div className="text-lg text-purple-200 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                {formatDate(currentTime)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Features */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Available Offline Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-green-300">Current Time</div>
                  <div className="text-sm text-green-200">Real-time clock display</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-green-300">World Clock</div>
                  <div className="text-sm text-green-200">Cached time zones</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-green-300">Time Converter</div>
                  <div className="text-sm text-green-200">Convert between zones</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <AlarmClock className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-green-300">Alarms</div>
                  <div className="text-sm text-green-200">Saved alarms work</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            {isOnline ? "Go to App" : "Check Connection"}
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Page
          </Button>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-purple-200">
            {isOnline
              ? "🎉 You're back online! Click 'Go to App' to return to the full experience."
              : "📱 Your clock continues to work offline with cached data and local time calculations."}
          </p>
        </div>
      </div>
    </div>
  )
}
