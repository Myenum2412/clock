"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Wind, Loader2 } from "lucide-react"
import type { Country, WeatherData } from "../types"
import { getWeatherData } from "../utils/weather"

interface WeatherWidgetProps {
  country: Country
}

export function WeatherWidget({ country }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeatherData(country.code)
        setWeather(data)
      } catch (err) {
        setError("Failed to fetch weather data")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [country.code])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading weather...</span>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">Weather data unavailable</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{weather.icon}</span>
          Weather in {country.name.split("(")[0].trim()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <Badge variant="secondary">{weather.description}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Wind: {weather.windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
