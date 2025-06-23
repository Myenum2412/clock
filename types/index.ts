export interface Country {
  name: string
  timezone: string
  code: string
  coordinates: { lat: number; lng: number }
  flag: string
}

export interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export interface SavedCountry {
  country: Country
  nickname?: string
}

export interface Alarm {
  id: string
  time: string
  timezone: string
  label: string
  enabled: boolean
  days: string[]
}

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  background: string
  text: string
}
