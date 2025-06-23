"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Globe,
  AlertCircle,
  Palette,
  Calculator,
  CloudSun,
  AlarmClock,
  Settings,
  RefreshCw,
  Zap,
  Star,
  Users,
} from "lucide-react"

import { countries } from "../data/countries"
import { themes } from "../data/themes"
import type { Country, SavedCountry, Alarm } from "../types"
import { useServiceWorker } from "../hooks/useServiceWorker"
import { useOfflineStorage } from "../hooks/useOfflineStorage"
import { LocationIndicator } from "../components/LocationIndicator"
import { EnhancedClockDisplay } from "../components/EnhancedClockDisplay"
import { SEOContent } from "../components/SEOContent"
import { StructuredData } from "../components/StructuredData"
import { PWAInstallPrompt } from "../components/PWAInstallPrompt"
import { OfflineIndicator } from "../components/OfflineIndicator"
import { UpdatePrompt } from "../components/UpdatePrompt"
import { detectUserTimezone, type LocationDetectionResult } from "../utils/timezoneDetection"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { FloatingDock } from "@/components/ui/floating-dock"
import { FAQ } from "../components/FAQ"

// Lazy load heavy components for better performance
const TimeZoneConverter = lazy(() =>
  import("../components/TimeZoneConverter").then((m) => ({ default: m.TimeZoneConverter })),
)
const WeatherWidget = lazy(() => import("../components/WeatherWidget").then((m) => ({ default: m.WeatherWidget })))
const AlarmManager = lazy(() => import("../components/AlarmManager").then((m) => ({ default: m.AlarmManager })))
const ModernClockCard = lazy(() =>
  import("../components/ModernClockCard").then((m) => ({ default: m.ModernClockCard })),
)

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

export default function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [is24Hour, setIs24Hour] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clockType, setClockType] = useState<"digital" | "analog">("digital")
  const [activeTab, setActiveTab] = useState("clock")

  // PWA and offline functionality
  const { isUpdateAvailable, updateServiceWorker, isOffline } = useServiceWorker()
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  // Location detection state
  const [locationDetection, setLocationDetection] = useState<LocationDetectionResult>({
    country: null,
    timezone: "UTC",
    isDetected: false,
  })
  const [isDetecting, setIsDetecting] = useState(true)

  // Persistent state with offline support
  const { data: savedCountries, saveData: setSavedCountries } = useOfflineStorage<SavedCountry[]>("savedCountries", [])
  const { data: alarms, saveData: setAlarms } = useOfflineStorage<Alarm[]>("alarms", [])
  const { data: selectedTheme, saveData: setSelectedTheme } = useOfflineStorage<string>("selectedTheme", "default")

  const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[0]

  // Handle URL shortcuts from PWA
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shortcut = urlParams.get("shortcut")

    if (shortcut) {
      switch (shortcut) {
        case "current-time":
          setActiveTab("clock")
          break
        case "world-clock":
          setActiveTab("clock")
          break
        case "converter":
          setActiveTab("converter")
          break
        case "alarms":
          setActiveTab("alarms")
          break
      }
    }
  }, [])

  // Show update prompt when available
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true)
    }
  }, [isUpdateAvailable])

  // Enhanced location detection on component mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetecting(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 100))

        const detection = detectUserTimezone(countries)
        setLocationDetection(detection)

        if (detection.isDetected && detection.country) {
          setSelectedCountry(detection.country)
          setError(null)
        } else if (detection.error) {
          setError(detection.error)
        }
      } catch (err) {
        setError("Failed to detect location")
        setLocationDetection({
          country: null,
          timezone: "UTC",
          isDetected: false,
          error: "Detection failed",
        })
      } finally {
        setIsDetecting(false)
      }
    }

    detectLocation()
  }, [])

  // Optimized real-time clock updates
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setCurrentTime(new Date())
      } catch (err) {
        setError("Failed to update time")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update document title with current time for SEO
  useEffect(() => {
    const timeString = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !is24Hour,
    })
    const locationName = locationDetection.country?.name.split("(")[0].trim() || "Your Location"
    document.title = `${timeString} - Clock Time in ${locationName} | Real-Time World Clock`
  }, [currentTime, is24Hour, locationDetection.country])

  const formatTime = (date: Date, timezone: string, format24Hour: boolean) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !format24Hour,
      }).format(date)
    } catch (err) {
      return "Invalid Time"
    }
  }

  const formatDate = (date: Date, timezone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (err) {
      return "Invalid Date"
    }
  }

  const toggleSavedCountry = (country: Country) => {
    const isAlreadySaved = savedCountries.some((saved) => saved.country.code === country.code)

    if (isAlreadySaved) {
      setSavedCountries(savedCountries.filter((saved) => saved.country.code !== country.code))
    } else {
      setSavedCountries([...savedCountries, { country }])
    }
  }

  const retryLocationDetection = () => {
    setIsDetecting(true)
    setError(null)

    setTimeout(() => {
      const detection = detectUserTimezone(countries)
      setLocationDetection(detection)

      if (detection.isDetected && detection.country) {
        setSelectedCountry(detection.country)
        setError(null)
      } else if (detection.error) {
        setError(detection.error)
      }

      setIsDetecting(false)
    }, 500)
  }

  const currentLocationName = locationDetection.country?.name.split("(")[0].trim() || "Your Location"

  // Floating dock items
  const dockItems = [
    {
      title: "Clock Time",
      icon: <Clock className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#clock",
    },
    {
      title: "Time Converter",
      icon: <Calculator className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#converter",
    },
    {
      title: "Weather",
      icon: <CloudSun className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#weather",
    },
    {
      title: "Alarms",
      icon: <AlarmClock className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#alarms",
    },
    {
      title: "FAQ",
      icon: <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#faq",
    },
  ]

  return (
    <>
      {/* SEO Content */}
      <SEOContent />

      {/* Dynamic Structured Data */}
      <StructuredData
        currentTime={currentTime}
        timezone={locationDetection.timezone}
        locationName={currentLocationName}
      />

      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />

      {/* Update Prompt */}
      {showUpdatePrompt && <UpdatePrompt onUpdate={updateServiceWorker} onDismiss={() => setShowUpdatePrompt(false)} />}

      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
        {/* Hero Section with Enhanced Design */}
        <section className="relative overflow-hidden py-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Animated Header */}
            <div className="text-center space-y-8 mb-16">
              <AnimatedGradientText>
                <Zap className="mr-2 h-4 w-4" />
                <span className="inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                  {isOffline ? "Offline Ready" : "Lightning Fast"} Clock Time
                </span>
              </AnimatedGradientText>

              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Clock Time
              </h1>

              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The world's most accurate and beautiful online clock with automatic location detection, offline support,
                and PWA capabilities.
              </p>

              {/* Current Time Display for SEO */}
              <div className="inline-block">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-sm text-gray-600 mb-2 flex items-center justify-center gap-2">
                      Your Current Time
                      {isOffline && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          Offline
                        </Badge>
                      )}
                    </div>
                    <div className="text-4xl md:text-5xl font-mono font-bold text-gray-900 mb-2">
                      {formatTime(currentTime, locationDetection.timezone, is24Hour)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentLocationName} ({locationDetection.timezone})
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Detection Status */}
              <div className="flex flex-col items-center gap-4">
                {isDetecting ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Detecting your location...</span>
                  </div>
                ) : (
                  <LocationIndicator
                    isDetected={locationDetection.isDetected}
                    timezone={locationDetection.timezone}
                    countryName={locationDetection.country?.name}
                    error={locationDetection.error}
                  />
                )}

                {!isDetecting && locationDetection.error && (
                  <Button size="sm" variant="outline" onClick={retryLocationDetection}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry Detection
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Current Location Clock */}
            <div className="mb-16">
              <EnhancedClockDisplay
                country={locationDetection.country}
                timezone={locationDetection.timezone}
                currentTime={currentTime}
                is24Hour={is24Hour}
                isDetected={locationDetection.isDetected}
                onToggleSave={() => locationDetection.country && toggleSavedCountry(locationDetection.country)}
                isSaved={
                  locationDetection.country
                    ? savedCountries.some((saved) => saved.country.code === locationDetection.country!.code)
                    : false
                }
              />
            </div>

            {/* Feature Highlights with Bento Grid */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                PWA Features
              </h2>
              <BentoGrid className="max-w-4xl mx-auto">
                <BentoGridItem
                  title="Offline Support"
                  description="Works completely offline with cached data and local time calculations."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                      <Clock className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<Zap className="h-4 w-4 text-blue-500" />}
                />
                <BentoGridItem
                  title="Install as App"
                  description="Install on your device for native app experience with home screen icon."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500 to-teal-600 items-center justify-center">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<Globe className="h-4 w-4 text-green-500" />}
                />
                <BentoGridItem
                  title="Background Sync"
                  description="Automatically syncs your data when connection is restored."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500 to-red-600 items-center justify-center">
                      <Calculator className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<Calculator className="h-4 w-4 text-orange-500" />}
                />
                <BentoGridItem
                  title="Push Notifications"
                  description="Receive alarm notifications even when the app is closed."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center">
                      <AlarmClock className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<AlarmClock className="h-4 w-4 text-purple-500" />}
                />
                <BentoGridItem
                  title="Fast Loading"
                  description="Instant loading with service worker caching and optimized performance."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 items-center justify-center">
                      <CloudSun className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<CloudSun className="h-4 w-4 text-cyan-500" />}
                />
                <BentoGridItem
                  title="Auto Updates"
                  description="Seamless updates with version management and rollback support."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 items-center justify-center">
                      <Palette className="w-12 h-12 text-white" />
                    </div>
                  }
                  icon={<Palette className="h-4 w-4 text-pink-500" />}
                />
              </BentoGrid>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">{countries.length}+</div>
                <div className="text-gray-600">Global Locations</div>
              </Card>
              <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Offline Ready</div>
              </Card>
              <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="text-4xl font-bold text-purple-600 mb-2">0ms</div>
                <div className="text-gray-600">Setup Time</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="max-w-6xl mx-auto px-6 mb-8">
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 pb-16">
          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8" role="tablist">
              <TabsTrigger value="clock" className="flex items-center gap-2" role="tab">
                <Clock className="w-4 h-4" aria-hidden="true" />
                Clock Time
              </TabsTrigger>
              <TabsTrigger value="converter" className="flex items-center gap-2" role="tab">
                <Calculator className="w-4 h-4" aria-hidden="true" />
                Time Converter
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2" role="tab">
                <CloudSun className="w-4 h-4" aria-hidden="true" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="alarms" className="flex items-center gap-2" role="tab">
                <AlarmClock className="w-4 h-4" aria-hidden="true" />
                Alarms
              </TabsTrigger>
            </TabsList>

            {/* Clock Tab */}
            <TabsContent value="clock" className="space-y-8" role="tabpanel">
              {/* Enhanced Controls */}
              <Card className="bg-gradient-to-r from-gray-50 to-white border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    Clock Time Preferences
                    {isOffline && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Offline Mode
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Country Selection */}
                    <div className="space-y-3">
                      <label htmlFor="location-select" className="text-sm font-semibold text-gray-700">
                        Select Location for Clock Time
                      </label>
                      <Select
                        value={selectedCountry.code}
                        onValueChange={(value) => {
                          const country = countries.find((c) => c.code === value)
                          if (country) {
                            setSelectedCountry(country)
                            setError(null)
                          }
                        }}
                      >
                        <SelectTrigger className="h-12" id="location-select">
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
                    </div>

                    {/* Time Format Toggle */}
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-gray-700">Clock Time Format</legend>
                      <div className="flex gap-2" role="radiogroup">
                        <Button
                          variant={!is24Hour ? "default" : "outline"}
                          size="lg"
                          onClick={() => setIs24Hour(false)}
                          className={`flex-1 h-12 ${!is24Hour ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          role="radio"
                          aria-checked={!is24Hour}
                        >
                          12 Hour
                        </Button>
                        <Button
                          variant={is24Hour ? "default" : "outline"}
                          size="lg"
                          onClick={() => setIs24Hour(true)}
                          className={`flex-1 h-12 ${is24Hour ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          role="radio"
                          aria-checked={is24Hour}
                        >
                          24 Hour
                        </Button>
                      </div>
                    </fieldset>

                    {/* Clock Type Toggle */}
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-gray-700">Clock Display Style</legend>
                      <div className="flex gap-2" role="radiogroup">
                        <Button
                          variant={clockType === "digital" ? "default" : "outline"}
                          size="lg"
                          onClick={() => setClockType("digital")}
                          className={`flex-1 h-12 ${clockType === "digital" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          role="radio"
                          aria-checked={clockType === "digital"}
                        >
                          Digital Clock
                        </Button>
                        <Button
                          variant={clockType === "analog" ? "default" : "outline"}
                          size="lg"
                          onClick={() => setClockType("analog")}
                          className={`flex-1 h-12 ${clockType === "analog" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          role="radio"
                          aria-checked={clockType === "analog"}
                        >
                          Analog Clock
                        </Button>
                      </div>
                    </fieldset>

                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <label htmlFor="theme-select" className="text-sm font-semibold text-gray-700">
                        Clock Theme
                      </label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger className="h-12" id="theme-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {themes.map((theme) => (
                            <SelectItem key={theme.id} value={theme.id}>
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4" aria-hidden="true" />
                                {theme.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* World Clock Grid */}
              <section aria-labelledby="world-clock-heading">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between" id="world-clock-heading">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5" aria-hidden="true" />
                        World Clock Time - All Locations
                      </div>
                      <Badge variant="outline">{countries.length} cities</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {countries.map((country) => (
                          <ModernClockCard
                            key={country.code}
                            country={country}
                            currentTime={currentTime}
                            is24Hour={is24Hour}
                            clockType={clockType}
                            isSaved={savedCountries.some((saved) => saved.country.code === country.code)}
                            isSelected={selectedCountry.code === country.code}
                            onSelect={() => setSelectedCountry(country)}
                            onToggleSave={() => toggleSavedCountry(country)}
                          />
                        ))}
                      </div>
                    </Suspense>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            {/* Time Zone Converter Tab */}
            <TabsContent value="converter" className="space-y-6" role="tabpanel">
              <section aria-labelledby="converter-heading">
                <h2 id="converter-heading" className="sr-only">
                  Time Zone Converter
                </h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <TimeZoneConverter countries={countries} currentTime={currentTime} />
                </Suspense>
              </section>
            </TabsContent>

            {/* Weather Tab */}
            <TabsContent value="weather" className="space-y-6" role="tabpanel">
              <section aria-labelledby="weather-heading">
                <h2 id="weather-heading" className="sr-only">
                  Weather Information
                </h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <WeatherWidget country={selectedCountry} />
                </Suspense>
              </section>
            </TabsContent>

            {/* Alarms Tab */}
            <TabsContent value="alarms" className="space-y-6" role="tabpanel">
              <section aria-labelledby="alarms-heading">
                <h2 id="alarms-heading" className="sr-only">
                  Clock Alarms
                </h2>
                <Suspense fallback={<LoadingSpinner />}>
                  <AlarmManager countries={countries} alarms={alarms} onAlarmsChange={setAlarms} />
                </Suspense>
              </section>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ Section */}
        <FAQ />

        {/* Floating Dock */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <FloatingDock items={dockItems} />
        </div>

        {/* SEO Footer Content */}
        <footer className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Progressive Web App Features</h2>
              <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                Our clock time PWA provides a native app experience with offline functionality, push notifications, and
                automatic updates. Install it on your device for instant access to accurate time information anywhere,
                anytime - even without an internet connection.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Offline Ready</h3>
                  <p className="text-gray-600">Works completely offline with cached data and local calculations.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Native Experience</h3>
                  <p className="text-gray-600">Install as an app with home screen icon and full-screen mode.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Always Updated</h3>
                  <p className="text-gray-600">Automatic updates ensure you always have the latest features.</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
