import type { Country } from "../types"

export interface LocationDetectionResult {
  country: Country | null
  timezone: string
  isDetected: boolean
  error?: string
}

// Enhanced timezone mapping for better detection
const timezoneAliases: Record<string, string[]> = {
  "America/New_York": [
    "America/New_York",
    "America/Detroit",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Indiana/Indianapolis",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Vevay",
  ],
  "America/Los_Angeles": ["America/Los_Angeles", "America/Tijuana", "US/Pacific"],
  "America/Chicago": [
    "America/Chicago",
    "America/Indiana/Knox",
    "America/Indiana/Tell_City",
    "America/Menominee",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "US/Central",
  ],
  "Europe/London": ["Europe/London", "GB", "GB-Eire"],
  "Europe/Berlin": [
    "Europe/Berlin",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Vienna",
    "Europe/Zurich",
    "Europe/Rome",
    "Europe/Madrid",
    "Europe/Paris",
    "Europe/Brussels",
    "Europe/Prague",
    "Europe/Budapest",
    "Europe/Warsaw",
  ],
  "Asia/Tokyo": ["Asia/Tokyo", "Japan"],
  "Asia/Shanghai": ["Asia/Shanghai", "Asia/Chongqing", "Asia/Harbin", "Asia/Kashgar", "Asia/Urumqi", "PRC"],
  "Asia/Kolkata": ["Asia/Kolkata", "Asia/Calcutta", "IST"],
  "Australia/Sydney": [
    "Australia/Sydney",
    "Australia/Melbourne",
    "Australia/Brisbane",
    "Australia/Lindeman",
    "Australia/Currie",
  ],
}

export function detectUserTimezone(countries: Country[]): LocationDetectionResult {
  try {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (!userTimezone) {
      return {
        country: null,
        timezone: userTimezone || "UTC",
        isDetected: false,
        error: "Could not detect timezone",
      }
    }

    // First, try exact match
    let matchedCountry = countries.find((country) => country.timezone === userTimezone)

    // If no exact match, try timezone aliases
    if (!matchedCountry) {
      for (const [mainTimezone, aliases] of Object.entries(timezoneAliases)) {
        if (aliases.includes(userTimezone)) {
          matchedCountry = countries.find((country) => country.timezone === mainTimezone)
          if (matchedCountry) break
        }
      }
    }

    // If still no match, try to find by timezone region (e.g., America/*, Europe/*, etc.)
    if (!matchedCountry) {
      const [region] = userTimezone.split("/")
      matchedCountry = countries.find((country) => country.timezone.startsWith(region + "/"))
    }

    return {
      country: matchedCountry,
      timezone: userTimezone,
      isDetected: !!matchedCountry,
      error: matchedCountry ? undefined : `No matching location found for timezone: ${userTimezone}`,
    }
  } catch (error) {
    return {
      country: null,
      timezone: "UTC",
      isDetected: false,
      error: `Timezone detection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export function getCurrentLocationInfo(detectionResult: LocationDetectionResult) {
  if (detectionResult.isDetected && detectionResult.country) {
    return {
      displayName: `${detectionResult.country.flag} ${detectionResult.country.name} (Your Location)`,
      isCurrentLocation: true,
      timezone: detectionResult.timezone,
    }
  }

  return {
    displayName: `🌍 ${detectionResult.timezone} (Detected Timezone)`,
    isCurrentLocation: false,
    timezone: detectionResult.timezone,
  }
}
