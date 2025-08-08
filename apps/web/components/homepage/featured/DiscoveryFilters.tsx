'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Utensils, Wine, ShoppingBag, Activity, Grid3x3 } from 'lucide-react'

interface DiscoveryFiltersProps {
  currentFilter: string | null
  onFilterChange: (filter: string | null) => void
  placeCounts: {
    all: number
    restaurants: number
    cafes: number
    bars: number
    shopping: number
    activities: number
  }
}

const filters = [
  { id: null, label: 'All', icon: Grid3x3, key: 'all' },
  { id: 'Restaurant', label: 'Restaurants', icon: Utensils, key: 'restaurants' },
  { id: 'Cafe', label: 'Cafes', icon: Coffee, key: 'cafes' },
  { id: 'Bar', label: 'Bars', icon: Wine, key: 'bars' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, key: 'shopping' },
  { id: 'Activity', label: 'Activities', icon: Activity, key: 'activities' }
]

export function DiscoveryFilters({ currentFilter, onFilterChange, placeCounts }: DiscoveryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon
        const count = placeCounts[filter.key as keyof typeof placeCounts]
        const isActive = currentFilter === filter.id
        
        return (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.id)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.1 }}
            className={`
              relative inline-flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-150 font-medium text-sm border
              ${isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary' 
                : 'bg-white/80 backdrop-blur-sm text-neutral-700 hover:bg-white border-neutral-200'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            
            {/* Count Badge */}
            {count > 0 && (
              <span className={`
                inline-flex items-center justify-center min-w-[20px] h-5 px-1 
                rounded-full text-xs font-bold
                ${isActive 
                  ? 'bg-white text-primary' 
                  : 'bg-primary/10 text-primary'
                }
              `}>
                {count}
              </span>
            )}
            
            {/* Active Indicator Animation */}
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}