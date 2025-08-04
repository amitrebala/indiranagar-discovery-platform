'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

const CATEGORIES = [
  'All',
  'Cafe',
  'Restaurant',
  'Restaurant & Bar',
  'Brewery',
  'Street Food',
  'Bakery & Cafe',
  'Park',
  'Shopping Mall',
  'Art Gallery',
  'Bookstore',
  'Fitness Center',
  'Entertainment Venue'
]

interface PlacesFilterProps {
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
}

export function PlacesFilter({ onSearchChange, onCategoryChange }: PlacesFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search places by name or description..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-700 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}