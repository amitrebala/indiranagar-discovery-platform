'use client'

import { useState, useEffect } from 'react'
import { PlacesGrid } from '@/components/places/PlacesGrid'
import { GooglePlacesGrid } from '@/components/places/GooglePlacesGrid'
import { PlacesFilter } from '@/components/places/PlacesFilter'
import { PlacesHeader } from '@/components/places/PlacesHeader'
import { clearNonGooglePlacesCache } from '@/utils/clear-old-image-cache'
import { MapPin, Globe } from 'lucide-react'

export default function PlacesPageClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'amit' | 'all'>('amit')
  
  useEffect(() => {
    // Clear old non-Google Places cached images on page load
    clearNonGooglePlacesCache()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <PlacesHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Two ways to explore:</span> Browse Amit's personally visited and verified places, 
                or discover all places in Indiranagar with live ratings from Google.
              </p>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('amit')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
                  ${activeTab === 'amit' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <MapPin className={`mr-2 h-5 w-5 ${activeTab === 'amit' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                Amit's Visited Places
                <span className={`ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium ${
                  activeTab === 'amit' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  186 Verified
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('all')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
                  ${activeTab === 'all' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Globe className={`mr-2 h-5 w-5 ${activeTab === 'all' ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                All Places
                <span className={`ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium ${
                  activeTab === 'all' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  Live from Google
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'amit' ? (
          <>
            <PlacesFilter 
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
            />
            <PlacesGrid 
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </>
        ) : (
          <GooglePlacesGrid />
        )}
      </div>
    </div>
  )
}