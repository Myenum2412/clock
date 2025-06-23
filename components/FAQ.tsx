"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle, Clock, Globe, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
  category: "general" | "technical" | "features"
  icon: React.ReactNode
}

const faqData: FAQItem[] = [
  {
    question: "How accurate is the clock time displayed on this website?",
    answer:
      "Our clock time is extremely accurate as it uses your device's system time and automatically detects your timezone. The time updates every second and is synchronized with your device's internal clock, which is typically accurate to within milliseconds.",
    category: "general",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    question: "Does the website require location permissions to show my current time?",
    answer:
      "No, our website does not require location permissions. We use your browser's built-in timezone detection (Intl.DateTimeFormat API) which automatically identifies your timezone without accessing your precise location. This ensures privacy while providing accurate local time.",
    category: "technical",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    question: "Can I view multiple time zones simultaneously?",
    answer:
      "Yes! Our world clock feature allows you to view time for over 30 major cities worldwide simultaneously. You can also save your favorite locations for quick access and use our time zone converter to compare times between different regions.",
    category: "features",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    question: "Why is my detected location different from where I actually am?",
    answer:
      "The timezone detection is based on your device's timezone setting, not your physical location. If you're using a VPN, have manually changed your timezone, or your device's time settings are incorrect, the detected location might differ from your actual location.",
    category: "technical",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    question: "Does the clock work offline?",
    answer:
      "The basic clock functionality works offline as it uses your device's system time. However, features like weather information, timezone updates, and some advanced features require an internet connection to function properly.",
    category: "technical",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    question: "Can I set alarms using this clock?",
    answer:
      "Yes, our clock includes a comprehensive alarm system. You can set multiple alarms for different time zones, customize alarm labels, and enable/disable alarms as needed. Alarms are saved locally on your device.",
    category: "features",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    question: "Is the website free to use?",
    answer:
      "Yes, our clock time website is completely free to use. There are no hidden fees, subscriptions, or premium features. All functionality including world clock, time converter, weather, and alarms are available at no cost.",
    category: "general",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    question: "How do I convert time between different time zones?",
    answer:
      "Use our Time Zone Converter tab. Select the 'from' and 'to' locations, enter the time you want to convert, and the result will be displayed instantly. This is perfect for scheduling international meetings or coordinating with people in different time zones.",
    category: "features",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    question: "Does the clock automatically adjust for Daylight Saving Time?",
    answer:
      "Yes, our clock automatically handles Daylight Saving Time (DST) changes. Since we use your device's timezone information and the browser's built-in date/time functions, DST transitions are handled automatically without any manual adjustment needed.",
    category: "technical",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    question: "Can I customize the appearance of the clock?",
    answer:
      "Yes, we offer several customization options including digital or analog clock display, 12-hour or 24-hour time format, and multiple color themes (Default, Dark, Sunset, Ocean, Forest). You can also save your preferred locations for quick access.",
    category: "features",
    icon: <Smartphone className="w-5 h-5" />,
  },
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<"all" | "general" | "technical" | "features">("all")

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  const filteredFAQ = faqData.filter((item) => selectedCategory === "all" || item.category === selectedCategory)

  const categories = [
    { id: "all", label: "All Questions", count: faqData.length },
    { id: "general", label: "General", count: faqData.filter((item) => item.category === "general").length },
    { id: "technical", label: "Technical", count: faqData.filter((item) => item.category === "technical").length },
    { id: "features", label: "Features", count: faqData.filter((item) => item.category === "features").length },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our clock time service, features, and functionality.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id as any)}
              className={cn(
                "transition-all duration-200",
                selectedCategory === category.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "hover:bg-blue-50 hover:border-blue-200",
              )}
            >
              {category.label}
              <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{category.count}</span>
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all duration-200 hover:shadow-md border-l-4",
                item.category === "general" && "border-l-blue-500",
                item.category === "technical" && "border-l-green-500",
                item.category === "features" && "border-l-purple-500",
                openItems.includes(index) && "shadow-lg",
              )}
            >
              <CardHeader className="pb-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        item.category === "general" && "bg-blue-100 text-blue-600",
                        item.category === "technical" && "bg-green-100 text-green-600",
                        item.category === "features" && "bg-purple-100 text-purple-600",
                      )}
                    >
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 text-left">{item.question}</CardTitle>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </Button>
              </CardHeader>

              {openItems.includes(index) && (
                <CardContent className="pt-0">
                  <div className="pl-14">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our clock time service is designed to be intuitive and
                user-friendly. Most features work automatically without any setup required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  View More Help Topics
                </Button>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <Clock className="w-4 h-4 mr-2" />
                  Try the Clock Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
