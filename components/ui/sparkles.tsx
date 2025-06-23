"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  className?: string
  size?: number
  minSize?: number
  density?: number
  speed?: number
  minSpeed?: number
  opacity?: number
  direction?: "up" | "down" | "left" | "right"
  opacitySpeed?: number
  minOpacity?: number
  color?: string
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  opacitySpeed: number
}

export function Sparkles({
  className,
  size = 1.2,
  minSize = 0.4,
  density = 800,
  speed = 1.5,
  minSpeed = 0.5,
  opacity = 1,
  direction = "up",
  opacitySpeed = 3,
  minOpacity = 0.1,
  color = "#ffffff",
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      const numSparkles = Math.floor(density / 100)

      for (let i = 0; i < numSparkles; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (size - minSize) + minSize,
          speedX: (Math.random() - 0.5) * speed,
          speedY: direction === "up" ? -(Math.random() * speed + minSpeed) : Math.random() * speed + minSpeed,
          opacity: Math.random() * (opacity - minOpacity) + minOpacity,
          opacitySpeed: (Math.random() - 0.5) * opacitySpeed,
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((sparkle) => ({
          ...sparkle,
          x: (sparkle.x + sparkle.speedX + 100) % 100,
          y: (sparkle.y + sparkle.speedY + 100) % 100,
          opacity: Math.max(minOpacity, Math.min(opacity, sparkle.opacity + sparkle.opacitySpeed * 0.01)),
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [density, size, minSize, speed, minSpeed, opacity, direction, opacitySpeed, minOpacity])

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: color,
            borderRadius: "50%",
            opacity: sparkle.opacity,
            boxShadow: `0 0 ${sparkle.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}
