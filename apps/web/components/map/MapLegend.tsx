'use client'

import { CheckCircle, Star, MapPin } from 'lucide-react'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function MapLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`absolute bottom-4 left-4 bg-white rounded-lg shadow-lg transition-all duration-300 pointer-events-auto map-legend ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-1 hover:bg-gray-50 z-10"
        aria-label={isCollapsed ? 'Expand legend' : 'Collapse legend'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      {!isCollapsed && (
        <div className="p-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Map Legend</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              <span className="text-gray-600">Place marker</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={12} className="text-white" />
              </div>
              <span className="text-gray-600">Visited by Amit</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star size={8} className="text-black fill-current" />
              </div>
              <span className="text-gray-600">Highly rated (4.5+)</span>
            </div>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="font-medium text-gray-700 mb-1">Categories:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-gray-600">Restaurant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-700" />
                  <span className="text-gray-600">Cafe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-gray-600">Activity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}