import type { Theme } from "../types"

export const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    text: "text-gray-900",
  },
  {
    id: "dark",
    name: "Dark",
    primary: "bg-gray-800",
    secondary: "bg-gray-700",
    background: "bg-gradient-to-br from-gray-900 to-black",
    text: "text-white",
  },
  {
    id: "sunset",
    name: "Sunset",
    primary: "bg-orange-600",
    secondary: "bg-orange-100",
    background: "bg-gradient-to-br from-orange-100 to-red-200",
    text: "text-gray-900",
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "bg-teal-600",
    secondary: "bg-teal-100",
    background: "bg-gradient-to-br from-teal-50 to-cyan-100",
    text: "text-gray-900",
  },
  {
    id: "forest",
    name: "Forest",
    primary: "bg-green-600",
    secondary: "bg-green-100",
    background: "bg-gradient-to-br from-green-50 to-emerald-100",
    text: "text-gray-900",
  },
]
