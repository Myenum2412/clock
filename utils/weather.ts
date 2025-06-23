import type { WeatherData } from "../types"

// Simulated weather data - in a real app, this would fetch from a weather API
export const getWeatherData = async (countryCode: string): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const weatherOptions = [
    { description: "Sunny", icon: "☀️", temp: 25 },
    { description: "Partly Cloudy", icon: "⛅", temp: 22 },
    { description: "Cloudy", icon: "☁️", temp: 18 },
    { description: "Rainy", icon: "🌧️", temp: 15 },
    { description: "Snowy", icon: "❄️", temp: -2 },
    { description: "Thunderstorm", icon: "⛈️", temp: 20 },
  ]

  const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)]

  return {
    temperature: randomWeather.temp + Math.floor(Math.random() * 10) - 5,
    description: randomWeather.description,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    icon: randomWeather.icon,
  }
}
