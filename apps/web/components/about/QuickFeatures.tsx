'use client'

import { 
  Zap, 
  Shield, 
  Globe, 
  Smartphone,
  Moon,
  Accessibility
} from 'lucide-react'

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Lightning Fast',
    description: 'Optimized for speed with instant search and filtering'
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: '100% Verified',
    description: 'Every single place personally visited and reviewed'
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Works Offline',
    description: 'Save your favorite places for offline access'
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Mobile First',
    description: 'Perfect on your phone while exploring the neighborhood'
  },
  {
    icon: <Moon className="w-5 h-5" />,
    title: 'Dark Mode',
    description: 'Easy on the eyes during late-night planning'
  },
  {
    icon: <Accessibility className="w-5 h-5" />,
    title: 'Accessible',
    description: 'WCAG compliant with full keyboard navigation'
  }
]

export function QuickFeatures() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Built for Real-World Use
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 shadow-sm">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}