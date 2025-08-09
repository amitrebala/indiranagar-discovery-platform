'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X, MapPin, Clock, Star, DollarSign, Loader2 } from 'lucide-react'
import { googlePlacesService, AutocompleteResult } from '@/lib/services/google-places'
import { placesDataService } from '@/lib/services/places-data-service'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

interface MapSearchBarProps {
  onPlaceSelect: (place: any) => void
  onSearchResults?: (places: any[]) => void
  className?: string
}

export function MapSearchBar({ onPlaceSelect, onSearchResults, className }: MapSearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [sessionToken, setSessionToken] = useState<string>('')
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Generate session token for autocomplete session
  useEffect(() => {
    setSessionToken(Math.random().toString(36).substring(7))
  }, [])

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const results = await googlePlacesService.getAutocompleteSuggestions(
          debouncedQuery,
          sessionToken,
          { lat: 12.9716, lng: 77.6411 }, // Indiranagar center
          2000 // 2km radius
        )
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery, sessionToken])

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSuggestion = async (suggestion: AutocompleteResult) => {
    setQuery(suggestion.structured_formatting.main_text)
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      // Get detailed place information
      const placeDetails = await placesDataService.getPlaceDetails(`google_${suggestion.place_id}`)
      
      if (placeDetails) {
        onPlaceSelect(placeDetails)
        
        // Generate new session token for next search
        setSessionToken(Math.random().toString(36).substring(7))
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (query.length < 2) return

    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const results = await placesDataService.searchPlaces(query, sessionToken)
      if (onSearchResults) {
        onSearchResults(results)
      }
      
      // Select first result if available
      if (results.length > 0) {
        onPlaceSelect(results[0])
      }
      
      // Generate new session token
      setSessionToken(Math.random().toString(36).substring(7))
    } catch (error) {
      console.error('Error searching places:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const getPlaceIcon = (types: string[]) => {
    if (types.includes('restaurant')) return '🍽️'
    if (types.includes('cafe')) return '☕'
    if (types.includes('bar')) return '🍺'
    if (types.includes('shopping_mall') || types.includes('store')) return '🛍️'
    if (types.includes('park')) return '🌳'
    if (types.includes('gym') || types.includes('health')) return '💪'
    return '📍'
  }

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search places in Indiranagar..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl 
                     leading-5 bg-white placeholder-gray-500 focus:outline-none 
                     focus:placeholder-gray-400 focus:ring-2 focus:ring-primary 
                     focus:border-primary sm:text-sm shadow-sm"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl 
                        border border-gray-200 max-h-96 overflow-auto">
          <ul className="py-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                className={cn(
                  'px-4 py-3 cursor-pointer transition-colors',
                  'hover:bg-gray-50 border-b border-gray-100 last:border-b-0',
                  selectedIndex === index && 'bg-gray-50'
                )}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {getPlaceIcon(suggestion.types)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.structured_formatting.main_text}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Powered by Google Places
            </p>
          </div>
        </div>
      )}
    </div>
  )
}