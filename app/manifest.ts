import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clock Time - Real-Time World Clock & Time Zone Converter",
    short_name: "Clock Time",
    description:
      "Free online clock time display with automatic location detection. Works offline with PWA capabilities.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["utilities", "productivity", "lifestyle"],
    screenshots: [
      {
        src: "/screenshots/desktop-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Clock Time Desktop View",
      },
      {
        src: "/screenshots/mobile-narrow.png",
        sizes: "375x812",
        type: "image/png",
        form_factor: "narrow",
        label: "Clock Time Mobile View",
      },
    ],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
    shortcuts: [
      {
        name: "Current Time",
        short_name: "Time",
        description: "View your current local time",
        url: "/?shortcut=current-time",
        icons: [
          {
            src: "/icons/shortcut-time.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "World Clock",
        short_name: "World",
        description: "View world clock for multiple time zones",
        url: "/?shortcut=world-clock",
        icons: [
          {
            src: "/icons/shortcut-world.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Time Converter",
        short_name: "Convert",
        description: "Convert time between time zones",
        url: "/?shortcut=converter",
        icons: [
          {
            src: "/icons/shortcut-converter.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Alarms",
        short_name: "Alarms",
        description: "Manage your time zone alarms",
        url: "/?shortcut=alarms",
        icons: [
          {
            src: "/icons/shortcut-alarms.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400,
    },
  }
}
