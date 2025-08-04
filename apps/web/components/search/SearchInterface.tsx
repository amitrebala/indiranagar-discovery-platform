'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, MapPin, Loader2, X, Clock } from 'lucide-react'
import { debounce } from 'lodash'
import { useSearch } from '@/hooks/useSearch'
import { useGeolocation } from '@/hooks/useGeolocation'
import { SearchFilters } from './SearchFilters'
import { SearchResults } from './SearchResults'
import { SearchSuggestions } from './SearchSuggestions'
import { NaturalLanguageProcessor } from '@/lib/search/natural-language'
import type { SearchFilters as SearchFiltersType } from '@/lib/search/search-engine'

interface SearchInterfaceProps {
  className?: string
  placeholder?: string
  onResultSelect?: (placeId: string) => void
}

export function SearchInterface({ 
  className = '', 
  placeholder = "Search places or try 'quiet morning coffee' or 'good for rainy day'",
  onResultSelect 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFiltersType>({
    categories: [],
    price_range: 'any',
    time_requirement: 'any',
    weather_suitability: [],
    crowd_level: 'any',
    accessibility_features: [],
    distance_km: undefined
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const { searchResults, isLoading, search, clearResults } = useSearch()
  const { location, requestLocation, isLocationLoading } = useGeolocation()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.warn('Failed to load recent searches:', error)
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string, searchFilters: SearchFiltersType) => {
      if (searchQuery.length > 1) {
        search(searchQuery, searchFilters, location || undefined)
        saveRecentSearch(searchQuery)
      } else {
        clearResults()
      }
    }, 300),
    [search, location, clearResults, recentSearches]
  )

  // Execute search when query or filters change
  useEffect(() => {
    debouncedSearch(query, filters)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, filters, debouncedSearch])

  // Handle natural language search queries
  const handleNaturalLanguageSearch = (naturalQuery: string) => {
    const parsedQuery = NaturalLanguageProcessor.parseQuery(naturalQuery)
    const contextualFilters = NaturalLanguageProcessor.generateSearchFilters(
      parsedQuery, 
      { 
        current_weather: undefined, // TODO: Get from weather context
        time_of_day: getCurrentTimeOfDay(),
        user_location: location || undefined,
        user_preferences: undefined,
        search_history: recentSearches.map(q => ({ query: q, timestamp: Date.now() }))
      }
    )
    
    setFilters({ ...filters, ...contextualFilters })
    setQuery(naturalQuery)
    setShowSuggestions(false)
  }

  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 1)
  }

  const handleClearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    clearResults()
  }

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery)
    setShowSuggestions(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  const quickSearchOptions = [
    { label: 'Quiet morning coffee', query: 'quiet morning coffee' },
    { label: 'Rainy day spots', query: 'good for rainy afternoon' },
    { label: 'Romantic dinner', query: 'romantic dinner place' },
    { label: 'Quick lunch', query: 'quick lunch nearby' },
    { label: 'Evening drinks', query: 'evening drinks with friends' },
    { label: 'Weekend brunch', query: 'weekend brunch spot' }
  ]

  return (
    <div className={`search-interface ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="search-input-container relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(query.length > 1 || recentSearches.length > 0)}
              placeholder={placeholder}
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`p-1 transition-colors ${
                  isFiltersOpen ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Search filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              
              <button
                onClick={requestLocation}
                disabled={isLocationLoading}
                className={`p-1 transition-colors ${
                  location ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                title={location ? 'Location enabled' : 'Enable location for nearby results'}
              >
                {isLocationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <SearchSuggestions
              query={query}
              onSuggestionClick={handleNaturalLanguageSearch}
              onClose={() => setShowSuggestions(false)}
            />
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="border-t border-gray-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.slice(0, 5).map((recentQuery, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(recentQuery)}
                      className="flex items-center w-full text-left p-2 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Clock className="w-3 h-3 mr-2 text-gray-400" />
                      {recentQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isFiltersOpen && (
        <div className="mt-3">
          <SearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setIsFiltersOpen(false)}
            userLocation={location}
          />
        </div>
      )}

      {/* Quick Search Options */}
      {!query && !isLoading && searchResults.length === 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick searches</h3>
          <div className="flex flex-wrap gap-2">
            {quickSearchOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleNaturalLanguageSearch(option.query)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-sm text-gray-600">Searching places...</span>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="mt-4">
          <SearchResults 
            results={searchResults}
            query={query}
            onResultSelect={onResultSelect}
            userLocation={location}
          />
        </div>
      )}

      {/* No Results */}
      {!isLoading && query.length > 1 && searchResults.length === 0 && (
        <div className="mt-4 text-center py-8">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
          <p className="text-sm text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setQuery('')
              setFilters({
                categories: [],
                price_range: 'any',
                time_requirement: 'any',
                weather_suitability: [],
                crowd_level: 'any',
                accessibility_features: [],
                distance_km: undefined
              })
            }}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  )
}