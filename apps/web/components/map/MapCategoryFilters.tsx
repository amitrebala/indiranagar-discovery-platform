'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Coffee, 
  Utensils, 
  Beer, 
  ShoppingBag, 
  Trees, 
  Dumbbell,
  Heart,
  MapPin,
  X
} from 'lucide-react'

export interface PlaceCategory {
  id: string
  name: string
  icon: React.ReactNode
  googleTypes: string[]
  color: string
}

const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: 'restaurant',
    name: 'Restaurants',
    icon: <Utensils className="w-4 h-4" />,
    googleTypes: ['restaurant', 'food'],
    color: 'bg-red-500'
  },
  {
    id: 'cafe',
    name: 'Cafes',
    icon: <Coffee className="w-4 h-4" />,
    googleTypes: ['cafe', 'coffee_shop', 'bakery'],
    color: 'bg-amber-600'
  },
  {
    id: 'bar',
    name: 'Bars',
    icon: <Beer className="w-4 h-4" />,
    googleTypes: ['bar', 'night_club', 'pub'],
    color: 'bg-purple-500'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingBag className="w-4 h-4" />,
    googleTypes: ['shopping_mall', 'clothing_store', 'store', 'supermarket'],
    color: 'bg-blue-500'
  },
  {
    id: 'outdoor',
    name: 'Parks',
    icon: <Trees className="w-4 h-4" />,
    googleTypes: ['park', 'garden'],
    color: 'bg-green-500'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: <Dumbbell className="w-4 h-4" />,
    googleTypes: ['gym', 'health', 'fitness_center'],
    color: 'bg-orange-500'
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: <Heart className="w-4 h-4" />,
    googleTypes: ['spa', 'beauty_salon', 'hair_care'],
    color: 'bg-pink-500'
  }
]

interface MapCategoryFiltersProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  showOpenNow?: boolean
  onOpenNowChange?: (openNow: boolean) => void
  minRating?: number
  onMinRatingChange?: (rating: number | undefined) => void
  className?: string
}

export function MapCategoryFilters({
  selectedCategories,
  onCategoryChange,
  showOpenNow = false,
  onOpenNowChange,
  minRating,
  onMinRatingChange,
  className
}: MapCategoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId))
    } else {
      onCategoryChange([...selectedCategories, categoryId])
    }
  }

  const clearFilters = () => {
    onCategoryChange([])
    onOpenNowChange?.(false)
    onMinRatingChange?.(undefined)
  }

  const hasActiveFilters = selectedCategories.length > 0 || showOpenNow || minRating

  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-3', className)}>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full sm:hidden"
      >
        <span className="text-sm font-medium text-gray-700">
          Filters {hasActiveFilters && `(${selectedCategories.length})`}
        </span>
        <MapPin className={cn(
          'w-4 h-4 transition-transform',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Filter content */}
      <div className={cn(
        'space-y-3',
        !isExpanded && 'hidden sm:block'
      )}>
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {PLACE_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  'flex items-center gap-1.5 border',
                  isSelected ? [
                    'text-white shadow-md scale-105',
                    category.color
                  ] : [
                    'bg-white text-gray-700 border-gray-200',
                    'hover:bg-gray-50 hover:border-gray-300'
                  ]
                )}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Additional filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          {/* Open Now filter */}
          {onOpenNowChange && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOpenNow}
                onChange={(e) => onOpenNowChange(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-xs font-medium text-gray-700">Open Now</span>
            </label>
          )}

          {/* Rating filter */}
          {onMinRatingChange && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-700">Min Rating:</label>
              <select
                value={minRating || ''}
                onChange={(e) => onMinRatingChange(e.target.value ? Number(e.target.value) : undefined)}
                className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Any</option>
                <option value="3">3+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>
          )}

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Active filter count */}
        {hasActiveFilters && (
          <div className="text-xs text-gray-500">
            {selectedCategories.length > 0 && (
              <span>{selectedCategories.length} categories</span>
            )}
            {showOpenNow && (
              <span className="ml-2">• Open now</span>
            )}
            {minRating && (
              <span className="ml-2">• {minRating}+ stars</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function getCategoryColor(category: string): string {
  const cat = PLACE_CATEGORIES.find(c => 
    c.id === category.toLowerCase() || 
    c.googleTypes.includes(category.toLowerCase())
  )
  return cat?.color || 'bg-gray-500'
}

export function getCategoryIcon(category: string): React.ReactNode {
  const cat = PLACE_CATEGORIES.find(c => 
    c.id === category.toLowerCase() || 
    c.googleTypes.includes(category.toLowerCase())
  )
  return cat?.icon || <MapPin className="w-4 h-4" />
}