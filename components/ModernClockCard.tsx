"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Calendar } from "lucide-react"
import type { Country } from "../types"

interface ModernClockCardProps {
  country: Country
  currentTime: Date
  is24Hour: boolean
  clockType: "digital" | "analog"
  isSaved: boolean
  isSelected: boolean
  onSelect: () => void
  onToggleSave: () => void
}

export function ModernClockCard({
  country,
  currentTime,
  is24Hour,
  clockType,
  isSaved,
  isSelected,
  onSelect,
  onToggleSave,
}: ModernClockCardProps) {
  const formatTime = (date: Date, timezone: string, format24Hour: boolean) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !format24Hour,
      }).format(date)
    } catch {
      return "Invalid Time"
    }
  }

  const formatDate = (date: Date, timezone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch {
      return "Invalid Date"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50" : "hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">{country.name.split("(")[0].trim()}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {country.timezone.split("/")[1]?.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave()
            }}
            className={`${
              isSaved
                ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(currentTime, country.timezone, is24Hour)}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(currentTime, country.timezone)}
            </div>
          </div>

          {isSelected && (
            <div className="pt-3 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium">
                <Clock className="w-4 h-4" />
                Currently Selected
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
