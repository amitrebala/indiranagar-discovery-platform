'use client'

import { Quote } from 'lucide-react'

const quotes = [
  {
    text: "Finally, recommendations from someone who actually lives here! Found my new favorite coffee spot on day one.",
    author: "New Resident",
    context: "Just moved to Indiranagar"
  },
  {
    text: "The weather-aware feature saved my anniversary dinner. It suggested indoor alternatives when rain started.",
    author: "Grateful Partner",
    context: "Planning special occasions"
  },
  {
    text: "As a food blogger, I thought I knew Indiranagar. Amit's hidden gems proved me wrong - in the best way!",
    author: "Food Enthusiast",
    context: "Discovering new places"
  },
  {
    text: "The 'best time to visit' feature is genius. No more showing up to crowded cafes during rush hour.",
    author: "Remote Worker",
    context: "Finding work spots"
  },
  {
    text: "Love how every place has companion activities. Turned simple coffee runs into mini adventures.",
    author: "Weekend Explorer",
    context: "Making the most of free time"
  },
  {
    text: "The photography tips at each location helped me capture Indiranagar like never before.",
    author: "Amateur Photographer",
    context: "Capturing the neighborhood"
  }
]

export function UserQuotes() {
  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What People Are Saying
          </h2>
          <p className="text-lg text-gray-600">
            Real feedback from real explorers of Indiranagar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-orange-300 mb-4" />
              <blockquote className="text-gray-700 mb-4 italic">
                "{quote.text}"
              </blockquote>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">
                  {quote.author}
                </div>
                <div className="text-sm text-gray-600">
                  {quote.context}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 italic">
            * These are illustrative examples of how people use the platform
          </p>
        </div>
      </div>
    </div>
  )
}