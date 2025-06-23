"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar, Heart } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"
import { Meteors } from "@/components/ui/meteors"
import type { Country } from "../types"

interface EnhancedClockDisplayProps {
  country: Country | null
  timezone: string
  currentTime: Date
  is24Hour: boolean
  isDetected: boolean
  onToggleSave?: () => void
  isSaved?: boolean
}

export function EnhancedClockDisplay({
  country,
  timezone,
  currentTime,
  is24Hour,
  isDetected,
  onToggleSave,
  isSaved = false,
}: EnhancedClockDisplayProps) {
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
    const parts = timezone.split("/")
    return parts[parts.length - 1].replace("_", " ")
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-0 shadow-2xl">
      {/* Animated Background Effects */}
      <Sparkles className="absolute inset-0" density={300} speed={0.5} size={1} color="#8b5cf6" opacity={0.6} />
      <Meteors number={10} />

      <CardContent className="relative z-10 p-8">
        <div className="text-center space-y-6">
          {/* Location Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <MapPin className="w-8 h-8 text-purple-300" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                {country ? country.flag : "🌍"} {getLocationName()}
                {onToggleSave && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onToggleSave}
                    className={`${
                      isSaved
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                )}
              </h2>
              <Badge variant="secondary" className="bg-white/10 text-purple-200 border-white/20 mt-2">
                {isDetected ? "Your Current Location" : "Detected Timezone"}
              </Badge>
            </div>
          </div>

          {/* Enhanced Time Display */}
          <div className="space-y-6">
            <div className="relative">
              <div className="text-7xl md:text-8xl font-mono font-bold tracking-wider bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                {formatTime(currentTime, timezone, is24Hour)}
              </div>
              <div className="absolute inset-0 text-7xl md:text-8xl font-mono font-bold tracking-wider text-white/5 blur-sm">
                {formatTime(currentTime, timezone, is24Hour)}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-lg text-purple-200">
              <Calendar className="w-6 h-6" />
              <time dateTime={currentTime.toISOString()}>{formatDate(currentTime, timezone)}</time>
            </div>
          </div>

          {/* Timezone Info */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
              <Clock className="w-4 h-4" />
              <span>{timezone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
