'use client'

import { useState } from 'react'
import { Mail, Check, Star, Calendar, MapPin, Bell } from 'lucide-react'
import { NewsletterPreferences } from '@/lib/types/blog'

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar'
  showPreferences?: boolean
  onSubscribe?: (email: string, preferences?: NewsletterPreferences) => Promise<boolean>
  className?: string
}

export default function NewsletterSignup({
  variant = 'inline',
  showPreferences = false,
  onSubscribe,
  className = ''
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState<NewsletterPreferences>({
    categories: ['neighborhood', 'business'],
    frequency: 'weekly',
    topics: ['food', 'events'],
    place_updates: true,
    new_posts: true,
    curator_picks: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    try {
      const success = await onSubscribe?.(email, showPreferences ? preferences : undefined)
      if (success) {
        setIsSubscribed(true)
        setEmail('')
      } else {
        setError('Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { id: 'neighborhood', name: 'Neighborhood Updates', icon: '🏘️' },
    { id: 'business', name: 'Business News', icon: '🏪' },
    { id: 'cultural', name: 'Cultural Events', icon: '🎭' },
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'events', name: 'Local Events', icon: '📅' },
    { id: 'personal', name: 'Personal Insights', icon: '💭' }
  ]

  const topics = [
    { id: 'food', name: 'Food & Restaurants' },
    { id: 'events', name: 'Events & Happenings' },
    { id: 'business', name: 'Local Business' },
    { id: 'culture', name: 'Arts & Culture' },
    { id: 'photography', name: 'Photography Tips' },
    { id: 'neighborhood', name: 'Neighborhood Life' }
  ]

  if (isSubscribed) {
    return (
      <div className={`newsletter-success text-center p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Welcome to the community! 🎉
        </h3>
        <p className="text-green-800 mb-4">
          You've successfully subscribed to Indiranagar Discovery insights. 
          Check your email for a confirmation message.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-green-700">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            Weekly updates
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Curator picks
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Place updates
          </span>
        </div>
      </div>
    )
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'modal':
        return 'bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto'
      case 'sidebar':
        return 'bg-gray-50 p-4 rounded-lg border border-gray-200'
      case 'inline':
      default:
        return 'bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200'
    }
  }

  return (
    <div className={`newsletter-signup ${getVariantStyles()} ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Stay in the Loop
        </h3>
        <p className="text-gray-700">
          Get curated insights about Indiranagar's best places, hidden gems, 
          and local happenings delivered to your inbox.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Preferences */}
        {showPreferences && (
          <div className="space-y-4">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                How often would you like to hear from us?
              </label>
              <select
                value={preferences.frequency}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  frequency: e.target.value as NewsletterPreferences['frequency']
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily updates</option>
                <option value="weekly">Weekly digest</option>
                <option value="monthly">Monthly roundup</option>
                <option value="immediate">Only for special updates</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                What interests you most?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.categories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...preferences.categories, category.id]
                          : preferences.categories.filter(c => c !== category.id)
                        setPreferences(prev => ({ ...prev, categories: newCategories }))
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{category.icon} {category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Content preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.new_posts}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      new_posts: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    New blog posts
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.place_updates}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      place_updates: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    New place discoveries
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.curator_picks}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      curator_picks: e.target.checked 
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Amit's curator picks
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!email.trim() || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-600 text-center">
          We respect your privacy. Unsubscribe at any time. 
          <br />
          No spam, just genuine local insights.
        </p>
      </form>

      {/* Benefits */}
      {variant === 'inline' && (
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="font-medium text-gray-900 mb-3">What you'll get:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Weekly insights</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>New discoveries</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-4 h-4 text-purple-600" />
              <span>Insider tips</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}