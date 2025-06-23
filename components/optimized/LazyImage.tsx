"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  placeholder?: string
}

export function LazyImage({ src, alt, className, width, height, placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      {/* Placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Actual Image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  )
}
