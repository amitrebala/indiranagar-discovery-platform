'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo, useReducer } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Search, Filter, MapPin, Camera, Heart, Sparkles, MessageCircle, LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAmitButtonStore } from '@/stores/amitButtonStore'
import { useMapStore } from '@/stores/mapStore'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'
import { cn } from '@/lib/utils'
import FloatingEmojis from '@/components/ui/FloatingEmojis'
import CelebrationOverlay from '@/components/ui/CelebrationOverlay'
import { amitRealVisitedPlaces } from '@/data/amit-real-visited-places'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Dynamically import modals to reduce initial bundle size
const AmitSearchModal = dynamic(() => import('@/components/community/AmitSearchModal'), {
  ssr: false,
  loading: () => null
})

const SuggestPlaceModal = dynamic(() => import('@/components/community/SuggestPlaceModal'), {
  ssr: false,
  loading: () => null
})

// Types
interface MenuOption {
  id: string
  Icon: LucideIcon
  label: string
  action: string
  colorClass: string
  available: boolean
  ariaLabel: string
}

type PageContext = 'place' | 'map' | 'general'

interface FABState {
  isExpanded: boolean
  isHovered: boolean
  clickCount: number
  showCelebration: boolean
  isDancing: boolean
  showSearchModal: boolean
  showSuggestModal: boolean
  showFavoritesOnly: boolean
  tooltipText: string
  showTooltip: boolean
}

type FABAction = 
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_HOVER'; payload: boolean }
  | { type: 'INCREMENT_CLICKS' }
  | { type: 'RESET_CLICKS' }
  | { type: 'SET_DANCING'; payload: boolean }
  | { type: 'SET_CELEBRATION'; payload: boolean }
  | { type: 'SHOW_SEARCH_MODAL'; payload?: boolean }
  | { type: 'SHOW_SUGGEST_MODAL'; payload: boolean }
  | { type: 'SET_FAVORITES_ONLY'; payload: boolean }
  | { type: 'SHOW_TOOLTIP'; payload: { text: string; show: boolean } }
  | { type: 'CLOSE_ALL_MODALS' }

// Animation variants
const menuItemVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: custom * 0.05,
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }),
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } }
}

const buttonVariants: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

// Reducer for state management
function fabReducer(state: FABState, action: FABAction): FABState {
  switch (action.type) {
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded }
    case 'SET_HOVER':
      return { ...state, isHovered: action.payload }
    case 'INCREMENT_CLICKS':
      return { ...state, clickCount: state.clickCount + 1 }
    case 'RESET_CLICKS':
      return { ...state, clickCount: 0 }
    case 'SET_DANCING':
      return { ...state, isDancing: action.payload }
    case 'SET_CELEBRATION':
      return { ...state, showCelebration: action.payload }
    case 'SHOW_SEARCH_MODAL':
      return { 
        ...state, 
        showSearchModal: action.payload ?? true,
        isExpanded: false,
        showFavoritesOnly: false 
      }
    case 'SHOW_SUGGEST_MODAL':
      return { ...state, showSuggestModal: action.payload, isExpanded: false }
    case 'SET_FAVORITES_ONLY':
      return { ...state, showFavoritesOnly: action.payload }
    case 'SHOW_TOOLTIP':
      return { 
        ...state, 
        tooltipText: action.payload.text, 
        showTooltip: action.payload.show 
      }
    case 'CLOSE_ALL_MODALS':
      return { 
        ...state, 
        showSearchModal: false, 
        showSuggestModal: false,
        showFavoritesOnly: false 
      }
    default:
      return state
  }
}

// Initial state
const initialState: FABState = {
  isExpanded: false,
  isHovered: false,
  clickCount: 0,
  showCelebration: false,
  isDancing: false,
  showSearchModal: false,
  showSuggestModal: false,
  showFavoritesOnly: false,
  tooltipText: '',
  showTooltip: false
}

function UnifiedAmitFABInner() {
  const pathname = usePathname()
  const router = useRouter()
  const { filterActive, toggleFilter } = useAmitButtonStore()
  const { setMapView } = useMapStore()
  const { triggerHaptic } = useHapticFeedback()
  const isMobile = useMediaQuery('(max-width: 640px)')
  
  // State management with reducer
  const [state, dispatch] = useReducer(fabReducer, initialState)
  
  // Refs
  const buttonRef = useRef<HTMLDivElement>(null)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Memoized values
  const currentPlaceId = useMemo(() => 
    pathname.includes('/places/') ? pathname.split('/').pop() : null,
    [pathname]
  )
  
  const hasAmitVisited = useMemo(() => 
    currentPlaceId && amitRealVisitedPlaces.some(
      place => place.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === currentPlaceId
    ),
    [currentPlaceId]
  )
  
  const pageContext: PageContext = useMemo(() => {
    if (pathname.includes('/places/')) return 'place'
    if (pathname === '/' || pathname.includes('/map')) return 'map'
    return 'general'
  }, [pathname])
  
  // Show tooltip with animation
  const showTooltipMessage = useCallback((message: string, duration = 2000) => {
    dispatch({ type: 'SHOW_TOOLTIP', payload: { text: message, show: true } })
    
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
    }
    
    tooltipTimerRef.current = setTimeout(() => {
      dispatch({ type: 'SHOW_TOOLTIP', payload: { text: '', show: false } })
    }, duration)
  }, [])
  
  // Action handlers
  const handleSearch = useCallback(() => {
    dispatch({ type: 'SHOW_SEARCH_MODAL' })
  }, [])
  
  const handleFilter = useCallback(() => {
    toggleFilter()
    if (!pathname.includes('/map') && pathname !== '/') {
      router.push('/')
    }
    dispatch({ type: 'TOGGLE_EXPANDED' })
    showTooltipMessage(filterActive ? "Showing all places" : "Showing only Amit's places", 2000)
  }, [toggleFilter, pathname, router, filterActive, showTooltipMessage])
  
  const handleFavorites = useCallback(() => {
    dispatch({ type: 'SET_FAVORITES_ONLY', payload: true })
    dispatch({ type: 'SHOW_SEARCH_MODAL' })
  }, [])
  
  const handleNearby = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapView({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }, 16)
          router.push('/')
          showTooltipMessage("Showing places near you", 2000)
        },
        () => {
          showTooltipMessage("Location access denied", 2000)
        }
      )
    }
    dispatch({ type: 'TOGGLE_EXPANDED' })
  }, [setMapView, router, showTooltipMessage])
  
  const handlePhotos = useCallback(() => {
    const photosSection = document.getElementById('place-photos')
    if (photosSection) {
      photosSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    dispatch({ type: 'TOGGLE_EXPANDED' })
  }, [])
  
  const handleSuggest = useCallback(() => {
    dispatch({ type: 'SHOW_SUGGEST_MODAL', payload: true })
  }, [])
  
  // Menu options configuration
  const menuOptions = useMemo<MenuOption[]>(() => {
    const actionMap: Record<string, () => void> = {
      search: handleSearch,
      filter: handleFilter,
      favorites: handleFavorites,
      nearby: handleNearby,
      photos: handlePhotos,
      suggest: handleSuggest
    }
    
    return [
      {
        id: 'search',
        Icon: Search,
        label: 'Search Places',
        action: 'search',
        colorClass: 'from-blue-600 to-blue-700',
        available: true,
        ariaLabel: 'Search for places Amit has visited'
      },
      {
        id: 'filter',
        Icon: Filter,
        label: filterActive ? "Show All" : "Amit's Places",
        action: 'filter',
        colorClass: 'from-purple-600 to-purple-700',
        available: pageContext === 'map',
        ariaLabel: filterActive ? 'Show all places on map' : 'Filter to show only places Amit visited'
      },
      {
        id: 'favorites',
        Icon: Heart,
        label: "Amit's Favorites",
        action: 'favorites',
        colorClass: 'from-pink-600 to-pink-700',
        available: true,
        ariaLabel: "View Amit's favorite places"
      },
      {
        id: 'nearby',
        Icon: MapPin,
        label: 'Near Me',
        action: 'nearby',
        colorClass: 'from-green-600 to-green-700',
        available: true,
        ariaLabel: 'Find places near your current location'
      },
      {
        id: 'photos',
        Icon: Camera,
        label: 'View Photos',
        action: 'photos',
        colorClass: 'from-amber-600 to-amber-700',
        available: pageContext === 'place',
        ariaLabel: 'View photos of this place'
      },
      {
        id: 'suggest',
        Icon: MessageCircle,
        label: 'Suggest Place',
        action: 'suggest',
        colorClass: 'from-teal-600 to-teal-700',
        available: true,
        ariaLabel: 'Suggest a place for Amit to visit'
      }
    ].filter(option => option.available)
    .map(option => ({
      ...option,
      action: option.action as keyof typeof actionMap
    }))
  }, [pageContext, filterActive, handleSearch, handleFilter, handleFavorites, handleNearby, handlePhotos, handleSuggest])
  
  // Handle main button click
  const handleMainClick = useCallback(() => {
    triggerHaptic(HapticPattern.LIGHT)
    dispatch({ type: 'INCREMENT_CLICKS' })
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }
    
    clickTimerRef.current = setTimeout(() => {
      dispatch({ type: 'RESET_CLICKS' })
    }, 500)
    
    // Triple click easter egg
    if (state.clickCount === 2) {
      dispatch({ type: 'SET_DANCING', payload: true })
      showTooltipMessage("Dance mode activated! 🕺", 3000)
      triggerHaptic(HapticPattern.IMPACT)
      setTimeout(() => dispatch({ type: 'SET_DANCING', payload: false }), 3000)
      return
    }
    
    // Show celebration on visited places
    if (hasAmitVisited && pageContext === 'place' && !state.isExpanded) {
      dispatch({ type: 'SET_CELEBRATION', payload: true })
      showTooltipMessage("Yes! Amit loves this place! 🎉", 3000)
      triggerHaptic(HapticPattern.SUCCESS)
      return
    }
    
    // Toggle menu
    dispatch({ type: 'TOGGLE_EXPANDED' })
  }, [state.clickCount, state.isExpanded, hasAmitVisited, pageContext, triggerHaptic, showTooltipMessage])
  
  // Handle long press
  const handleMouseDown = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      handleFavorites()
      showTooltipMessage("Showing Amit's favorites! ❤️", 2000)
      triggerHaptic(HapticPattern.IMPACT)
    }, 1000)
  }, [handleFavorites, showTooltipMessage, triggerHaptic])
  
  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }, [])
  
  // Cleanup timers
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
    }
  }, [])
  
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isExpanded) {
        dispatch({ type: 'TOGGLE_EXPANDED' })
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [state.isExpanded])
  
  // Get button label
  const buttonLabel = useMemo(() => {
    if (hasAmitVisited) return isMobile ? "Amit ❤️" : "Amit was here!"
    return isMobile ? "Ask Amit" : "Has Amit Been Here?"
  }, [hasAmitVisited, isMobile])
  
  // Calculate menu item positions
  const getMenuItemStyle = useCallback((index: number, total: number) => {
    const angle = (Math.PI / (total - 1)) * index + Math.PI
    const radius = isMobile ? 70 : 80
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return {
      transform: `translate(${x}px, ${y}px)`,
    }
  }, [isMobile])
  
  return (
    <>
      <motion.div
        ref={buttonRef}
        className="fixed bottom-6 right-6 z-[9999]"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Menu Options */}
        <AnimatePresence>
          {state.isExpanded && (
            <div className="absolute bottom-0 right-0" role="menu" aria-label="Amit menu options">
              {menuOptions.map((option, index) => {
                const { Icon, action } = option
                const actionHandler = action === 'search' ? handleSearch :
                                    action === 'filter' ? handleFilter :
                                    action === 'favorites' ? handleFavorites :
                                    action === 'nearby' ? handleNearby :
                                    action === 'photos' ? handlePhotos :
                                    handleSuggest
                
                return (
                  <motion.button
                    key={option.id}
                    className={cn(
                      "absolute min-w-[48px] min-h-[48px] w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white font-semibold",
                      `bg-gradient-to-br ${option.colorClass}`
                    )}
                    style={{
                      ...getMenuItemStyle(index, menuOptions.length),
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    variants={menuItemVariants}
                    custom={index}
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={actionHandler}
                    aria-label={option.ariaLabel}
                    role="menuitem"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </motion.button>
                )
              })}
            </div>
          )}
        </AnimatePresence>
        
        {/* Main Button */}
        <motion.button
          className={cn(
            "relative bg-gradient-to-r text-white rounded-full shadow-lg transition-all duration-300",
            hasAmitVisited ? "from-[#d946ef] to-[#dc2626]" : "from-[#5a3f8f] to-[#6b4298]",
            state.isExpanded ? "w-auto px-6 min-h-[56px] h-14" : "min-w-[64px] min-h-[64px] w-16 h-16 sm:w-auto sm:px-6 sm:min-h-[56px] sm:h-14",
            state.isDancing && "animate-bounce"
          )}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onHoverStart={() => {
            dispatch({ type: 'SET_HOVER', payload: true })
            triggerHaptic(HapticPattern.SELECTION)
          }}
          onHoverEnd={() => dispatch({ type: 'SET_HOVER', payload: false })}
          onClick={handleMainClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          style={{
            boxShadow: state.isHovered 
              ? '0 15px 50px rgba(102, 126, 234, 0.6)' 
              : '0 10px 40px rgba(102, 126, 234, 0.4)'
          }}
          aria-label={state.isExpanded ? "Close Amit menu" : buttonLabel}
          aria-expanded={state.isExpanded}
          aria-haspopup="true"
        >
          <AnimatePresence mode="wait">
            {!state.isExpanded ? (
              <motion.div
                key="collapsed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/amit-avatar.svg" 
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-white"
                    aria-hidden="true"
                  />
                  {hasAmitVisited && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-white text-pink-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      aria-label="Amit has visited this place"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium whitespace-nowrap">
                  {buttonLabel}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Explore</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Floating emojis on hover */}
          {state.isHovered && !state.isExpanded && (
            <FloatingEmojis 
              emojis={['🚶', '📸', '✨', '🗺️']}
              trigger={state.isHovered}
            />
          )}
        </motion.button>
        
        {/* Tooltip */}
        <AnimatePresence>
          {state.showTooltip && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="status"
              aria-live="polite"
            >
              {state.tooltipText}
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Celebration overlay */}
      {state.showCelebration && (
        <CelebrationOverlay 
          onComplete={() => dispatch({ type: 'SET_CELEBRATION', payload: false })}
        />
      )}
      
      {/* Search Modal */}
      <AmitSearchModal 
        isOpen={state.showSearchModal}
        onClose={() => dispatch({ type: 'CLOSE_ALL_MODALS' })}
        showFavoritesOnly={state.showFavoritesOnly}
      />
      
      {/* Suggest Modal */}
      {state.showSuggestModal && (
        <SuggestPlaceModal
          isOpen={state.showSuggestModal}
          onClose={() => dispatch({ type: 'SHOW_SUGGEST_MODAL', payload: false })}
        />
      )}
    </>
  )
}

export default function UnifiedAmitFAB() {
  useEffect(() => {
    // Create a portal container for the FAB
    const portalId = 'amit-fab-portal'
    let portal = document.getElementById(portalId)
    
    if (!portal) {
      portal = document.createElement('div')
      portal.id = portalId
      portal.style.position = 'fixed'
      portal.style.bottom = '0'
      portal.style.right = '0'
      portal.style.width = '100%'
      portal.style.height = '100%'
      portal.style.pointerEvents = 'none'
      portal.style.zIndex = '9999'
      document.body.appendChild(portal)
    }
    
    return () => {
      // Cleanup on unmount
      const portalElement = document.getElementById(portalId)
      if (portalElement && portalElement.childNodes.length === 0) {
        document.body.removeChild(portalElement)
      }
    }
  }, [])
  
  return <UnifiedAmitFABInner />
}