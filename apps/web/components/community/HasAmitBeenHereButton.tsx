'use client'

import { useState } from 'react'
import { Search, X, MapPin, MessageCircle, Star } from 'lucide-react'
import { amitActualVisitedPlaces, type AmitPlace } from '@/data/amit-actual-visited-places'

interface AmitSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function PlaceResult({ place, onClick }: { place: AmitPlace; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.notes}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
              {place.category}
            </span>
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-700">{place.rating}</span>
              </div>
            )}
            {place.priceRange && (
              <span className="text-xs text-gray-500">{place.priceRange}</span>
            )}
          </div>
        </div>
        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}

function SuggestPlaceForm({ onClose }: { onClose: () => void }) {
  const [placeName, setPlaceName] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!placeName.trim()) return

    setIsSubmitting(true)
    
    try {
      // In a real app, this would submit to your API
      console.log('Suggesting place:', { placeName, comment })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success and close
      alert('Thanks for the suggestion! I\'ll check it out.')
      onClose()
    } catch (error) {
      console.error('Error suggesting place:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Suggest a Place to Amit</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="place-name" className="block text-sm font-medium text-gray-700 mb-1">
            Place Name *
          </label>
          <input
            id="place-name"
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="e.g., Corner House, Brigade Road"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Why should I visit? (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell me what makes this place special..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !placeName.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Suggesting...' : 'Suggest Place'}
          </button>
        </div>
      </div>
    </form>
  )
}

function AmitSearchModal({ isOpen, onClose }: AmitSearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AmitPlace[]>([])
  const [showSuggestForm, setShowSuggestForm] = useState(false)
  const [noResults, setNoResults] = useState(false)

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (searchQuery.trim().length < 2) {
      setResults([])
      setNoResults(false)
      setShowSuggestForm(false)
      return
    }

    const searchResults = amitActualVisitedPlaces.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setResults(searchResults)
    setNoResults(searchResults.length === 0)
    setShowSuggestForm(searchResults.length === 0)
  }

  const handlePlaceClick = (place: AmitPlace) => {
    // In a real app, this would navigate to the place page
    alert(`Opening ${place.name}:\n\n${place.notes}\n\nRating: ${place.rating || 'Not rated'}\nCategory: ${place.category}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Has Amit Been Here?</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a place..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {results.length > 0 && (
            <div>
              {results.map((place, index) => (
                <PlaceResult
                  key={index}
                  place={place}
                  onClick={() => handlePlaceClick(place)}
                />
              ))}
            </div>
          )}

          {noResults && query.trim().length >= 2 && (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Haven't been there yet!</h3>
              <p className="text-sm text-gray-600 mb-4">
                I haven't visited "{query}" yet. Want to suggest it?
              </p>
            </div>
          )}

          {query.trim().length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Search Places</h3>
              <p className="text-sm text-gray-600">
                Type to search through all the places I've visited in Indiranagar
              </p>
            </div>
          )}
        </div>

        {/* Suggest Form */}
        {showSuggestForm && <SuggestPlaceForm onClose={onClose} />}
      </div>
    </div>
  )
}

export default function HasAmitBeenHereButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
        aria-label="Search places Amit has visited"
      >
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          <span className="hidden sm:block font-medium whitespace-nowrap">
            Has Amit been here?
          </span>
        </div>
        
        {/* Tooltip for mobile */}
        <div className="sm:hidden absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Has Amit been here?
        </div>
      </button>

      {/* Modal */}
      <AmitSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}