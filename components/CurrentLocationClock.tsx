"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar } from "lucide-react"
import type { Country } from "../types"

interface CurrentLocationClockProps {
  country: Country | null
  timezone: string
  currentTime: Date
  is24Hour: boolean
  isDetected: boolean
}

export function CurrentLocationClock({
  country,
  timezone,
  currentTime,
  is24Hour,
  isDetected,
}: CurrentLocationClockProps) {
  const formatTime = (date: Date, tz: string, format24Hour: boolean) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !format24Hour,
      }).format(date)
    } catch {
      return "Invalid Time"
    }
  }

  const formatDate = (date: Date, tz: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch {
      return "Invalid Date"
    }
  }

  const getLocationName = () => {
    if (country) {
      return country.name.split("(")[0].trim()
    }
    // Extract city name from timezone if no country match
    const parts = timezone.split("/")
    return parts[parts.length - 1].replace("_", " ")
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Location Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold">
                {country ? country.flag : "🌍"} {getLocationName()}
              </h2>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mt-1">
                {isDetected ? "Your Current Location" : "Detected Timezone"}
              </Badge>
            </div>
          </div>

          {/* Time Display */}
          <div className="space-y-4">
            <div className="text-6xl md:text-7xl font-mono font-bold tracking-wider">
              {formatTime(currentTime, timezone, is24Hour)}
            </div>
            <div className="flex items-center justify-center gap-2 text-lg text-white/90">
              <Calendar className="w-5 h-5" />
              {formatDate(currentTime, timezone)}
            </div>
          </div>

          {/* Timezone Info */}
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              <span>{timezone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
