"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X, Smartphone, Monitor, Zap } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if not already installed and not dismissed
      setTimeout(() => {
        if (!isInstalled && !sessionStorage.getItem("pwa-prompt-dismissed")) {
          setShowPrompt(true)
        }
      }, 5000)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstalled(true)
      }

      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error installing PWA:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || sessionStorage.getItem("pwa-prompt-dismissed")) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install Clock Time</h3>
                <p className="text-blue-100 text-sm">Get the app for faster access</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-white hover:bg-white/20 p-1">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Zap className="w-4 h-4" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Smartphone className="w-4 h-4" />
              <span>Native app experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Monitor className="w-4 h-4" />
              <span>Instant loading</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button onClick={handleDismiss} variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
