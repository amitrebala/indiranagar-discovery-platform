import { useCallback, useEffect } from 'react'
import { useAmitFABStore } from '@/stores/amitFABStore'
import { usePathname } from 'next/navigation'
import { amitRealVisitedPlaces } from '@/data/amit-real-visited-places'

export function useAmitFABState() {
  const pathname = usePathname()
  const store = useAmitFABStore()
  
  // Check if current page is a place Amit has visited
  const currentPlaceId = pathname.includes('/places/') ? pathname.split('/').pop() : null
  const hasAmitVisited = currentPlaceId ? amitRealVisitedPlaces.some(
    place => place.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === currentPlaceId
  ) : false
  
  // Get context for current page
  const pageContext = useCallback(() => {
    if (pathname === '/' || pathname.includes('/map')) return 'map'
    if (pathname.includes('/places/')) return 'place'
    if (pathname.includes('/community')) return 'community'
    if (pathname.includes('/blog')) return 'blog'
    return 'default'
  }, [pathname])
  
  // Handle option selection with context-aware actions
  const handleOptionSelect = useCallback((optionId: string, action: string) => {
    store.selectOption(optionId)
    store.recordInteraction(action)
    
    // Handle action based on type
    switch (action) {
      case 'open-search':
        // Will be handled by parent component
        break
      case 'toggle-filter':
        // Will be handled by parent component
        break
      case 'open-suggest':
        // Will be handled by parent component
        break
      case 'show-favorites':
        // Will be handled by parent component
        break
      default:
        console.log('Unknown action:', action)
    }
  }, [store])
  
  // Auto-show tooltip for first-time users
  useEffect(() => {
    if (store.analytics.totalInteractions === 0 && !store.showTooltip) {
      setTimeout(() => {
        store.showTooltipMessage("Tap to explore Amit's journey!", 5000)
      }, 2000)
    }
  }, [store])
  
  // Update state based on page context
  useEffect(() => {
    if (hasAmitVisited && store.currentState === 'collapsed') {
      store.showTooltipMessage("Yes! Amit loves this place!", 3000)
    }
  }, [hasAmitVisited, pathname, store])
  
  return {
    ...store,
    hasAmitVisited,
    pageContext: pageContext(),
    handleOptionSelect
  }
}