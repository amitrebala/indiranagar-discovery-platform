'use client'

import { Search, TrendingUp, Clock } from 'lucide-react'
import { NaturalLanguageProcessor } from '@/lib/search/natural-language'

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
  onClose: () => void
}

export function SearchSuggestions({ 
  query, 
  onSuggestionClick, 
  onClose 
}: SearchSuggestionsProps) {
  const suggestions = NaturalLanguageProcessor.generateSuggestions(query)
  
  const trendingSuggestions = [
    'coffee with good wifi',
    'romantic dinner place',
    'quick lunch nearby', 
    'rainy day activities',
    'weekend brunch spot',
    'evening drinks'
  ]

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion)
    onClose()
  }

  return (
    <div className="search-suggestions">
      {/* Query-based suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 border-b border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Suggestions
          </h4>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center w-full text-left p-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-3 h-3 mr-2 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending searches when no query or query-based suggestions */}
      {(query.length < 2 || suggestions.length === 0) && (
        <div className="p-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Trending Searches
          </h4>
          <div className="space-y-1">
            {trendingSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center w-full text-left p-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="w-3 h-3 mr-2 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contextual tips */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          <div className="mb-1">💡 <strong>Try natural language:</strong></div>
          <div className="space-y-1 ml-4 text-gray-500">
            <div>&quot;quiet morning coffee&quot;</div>
            <div>&quot;good for rainy day&quot;</div>
            <div>&quot;romantic dinner place&quot;</div>
          </div>
        </div>
      </div>
    </div>
  )
}