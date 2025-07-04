import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Clock Time - Real-Time World Clock & Time Zone Converter | Free Online Clock",
  description:
    "Free online clock time display with automatic location detection. View current time, world clock, time zone converter, and accurate local time for any location worldwide. No downloads required.",
  keywords: [
    "clock time",
    "current time",
    "world clock",
    "time zone",
    "local time",
    "online clock",
    "digital clock",
    "time converter",
    "real time clock",
    "accurate time",
    "time display",
    "clock online",
    "time now",
    "world time",
    "timezone converter",
  ],
  authors: [{ name: "TimeZone Master" }],
  creator: "TimeZone Master",
  publisher: "TimeZone Master",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clock.myenum.in",
    title: "Clock Time - Real-Time World Clock & Time Zone Converter",
    description:
      "Free online clock time display with automatic location detection. View current time, world clock, and accurate local time for any location worldwide.",
    siteName: "Clock Time",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clock Time - Real-Time World Clock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clock Time - Real-Time World Clock & Time Zone Converter",
    description:
      "Free online clock time display with automatic location detection. View current time and world clock for any location.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://clock.myenum.in",
  },
  category: "utility",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href="https://clock.myenum.in" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Preload Inter font */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5714264985066358"
     crossorigin="anonymous"></script>

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VGDKSE11VG"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VGDKSE11VG');
            `,
          }}
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Clock Time - Real-Time World Clock",
              description:
                "Free online clock time display with automatic location detection. View current time, world clock, and time zone converter.",
              url: "https://clock.myenum.in",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Real-time clock display",
                "Automatic location detection",
                "World clock for multiple time zones",
                "Time zone converter",
                "Digital and analog clock views",
                "Weather information",
                "Alarm functionality",
              ],
              screenshot: "https://clock.myenum.in/screenshot.png",
              author: {
                "@type": "Organization",
                name: "TimeZone Master",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
