"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Clock } from "lucide-react"
import type { Country } from "../types"

interface TimeZoneConverterProps {
  countries: Country[]
  currentTime: Date
}

export function TimeZoneConverter({ countries, currentTime }: TimeZoneConverterProps) {
  const [fromCountry, setFromCountry] = useState<Country>(countries[0])
  const [toCountry, setToCountry] = useState<Country>(countries[1])
  const [inputTime, setInputTime] = useState("12:00")

  const convertTime = (time: string, fromTz: string, toTz: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number)
      const today = new Date()
      today.setHours(hours, minutes, 0, 0)

      // Create a date in the source timezone
      const sourceTime = new Date(today.toLocaleString("en-US", { timeZone: fromTz }))
      const targetTime = new Date(today.getTime() + (sourceTime.getTime() - today.getTime()))

      return new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(targetTime)
    } catch {
      return "Invalid time"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Zone Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Section */}
          <div className="space-y-3">
            <Label>From</Label>
            <Select
              value={fromCountry.code}
              onValueChange={(value) => {
                const country = countries.find((c) => c.code === value)
                if (country) setFromCountry(country)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="time" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="text-lg" />
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          {/* To Section */}
          <div className="space-y-3">
            <Label>To</Label>
            <Select
              value={toCountry.code}
              onValueChange={(value) => {
                const country = countries.find((c) => c.code === value)
                if (country) setToCountry(country)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-lg font-mono p-2 bg-gray-50 rounded border text-center">
              {convertTime(inputTime, fromCountry.timezone, toCountry.timezone)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
