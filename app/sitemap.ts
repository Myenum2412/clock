import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://clocktime.app",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: "https://clocktime.app/world-clock",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://clocktime.app/time-converter",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://clocktime.app/alarms",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ]
}
