"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  currentTime: Date
  timezone: string
  locationName: string
}

export function StructuredData({ currentTime, timezone, locationName }: StructuredDataProps) {
  useEffect(() => {
    // Dynamic structured data for current time
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Current Time in ${locationName} - Clock Time`,
      description: `Current local time in ${locationName} is ${currentTime.toLocaleTimeString()}. Free online clock with automatic time zone detection.`,
      url: window.location.href,
      mainEntity: {
        "@type": "Thing",
        name: "Current Time",
        description: `The current time in ${locationName} (${timezone})`,
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Current Time",
            value: currentTime.toLocaleTimeString(),
          },
          {
            "@type": "PropertyValue",
            name: "Time Zone",
            value: timezone,
          },
          {
            "@type": "PropertyValue",
            name: "Location",
            value: locationName,
          },
        ],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://clocktime.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Clock Time",
            item: "https://clocktime.app/clock",
          },
        ],
      },
    }

    // Update or create structured data script
    let script = document.getElementById("dynamic-structured-data")
    if (!script) {
      script = document.createElement("script")
      script.id = "dynamic-structured-data"
      script.type = "application/ld+json"
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById("dynamic-structured-data")
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [currentTime, timezone, locationName])

  return null
}
