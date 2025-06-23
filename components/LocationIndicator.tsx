"use client"
import { MapPin, Globe, AlertTriangle } from "lucide-react"

interface LocationIndicatorProps {
  isDetected: boolean
  timezone: string
  countryName?: string
  error?: string
}

export function LocationIndicator({ isDetected, timezone, countryName, error }: LocationIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-full">
        <AlertTriangle className="w-4 h-4" />
        <span>Location detection limited</span>
      </div>
    )
  }

  if (isDetected && countryName) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-full">
        <MapPin className="w-4 h-4" />
        <span>Showing your local time: {countryName}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
      <Globe className="w-4 h-4" />
      <span>Timezone detected: {timezone}</span>
    </div>
  )
}
