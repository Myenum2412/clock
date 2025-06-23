"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Sparkles } from "lucide-react"

interface UpdatePromptProps {
  onUpdate: () => void
  onDismiss: () => void
}

export function UpdatePrompt({ onUpdate, onDismiss }: UpdatePromptProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Update Available</h3>
              <p className="text-green-100 text-sm">New features and improvements</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-green-100">
              <Sparkles className="w-4 h-4" />
              Enhanced performance
            </div>
            <div className="flex items-center gap-2 text-sm text-green-100">
              <RefreshCw className="w-4 h-4" />
              Bug fixes and improvements
            </div>
            <div className="flex items-center gap-2 text-sm text-green-100">
              <Download className="w-4 h-4" />
              Better offline experience
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onUpdate} className="flex-1 bg-white text-green-600 hover:bg-green-50 font-semibold">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Now
            </Button>
            <Button onClick={onDismiss} variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
