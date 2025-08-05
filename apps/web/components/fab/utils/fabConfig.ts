import { Search, Filter, MessageCircle, Heart, MapPin, Camera, Coffee } from 'lucide-react'

export interface RadialMenuOption {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  action: string
  color: string
  animation: 'slide' | 'scale' | 'rotate'
  position: { angle: number; distance: number }
}

export const fabOptions: RadialMenuOption[] = [
  {
    id: 'search',
    icon: Search,
    label: 'Search Places',
    action: 'open-search',
    color: 'from-blue-500 to-blue-600',
    animation: 'slide',
    position: { angle: 315, distance: 80 }
  },
  {
    id: 'filter',
    icon: Filter,
    label: 'Filter Map',
    action: 'toggle-filter',
    color: 'from-purple-500 to-purple-600',
    animation: 'scale',
    position: { angle: 270, distance: 80 }
  },
  {
    id: 'suggest',
    icon: MessageCircle,
    label: 'Suggest Place',
    action: 'open-suggest',
    color: 'from-green-500 to-green-600',
    animation: 'rotate',
    position: { angle: 225, distance: 80 }
  },
  {
    id: 'favorites',
    icon: Heart,
    label: "Amit's Favorites",
    action: 'show-favorites',
    color: 'from-pink-500 to-pink-600',
    animation: 'slide',
    position: { angle: 180, distance: 80 }
  }
]

export const contextualOptions: Record<string, RadialMenuOption[]> = {
  map: [
    ...fabOptions,
    {
      id: 'nearby',
      icon: MapPin,
      label: 'Nearby Places',
      action: 'show-nearby',
      color: 'from-orange-500 to-orange-600',
      animation: 'scale',
      position: { angle: 135, distance: 80 }
    }
  ],
  place: [
    {
      id: 'photo',
      icon: Camera,
      label: 'View Photos',
      action: 'view-photos',
      color: 'from-indigo-500 to-indigo-600',
      animation: 'slide',
      position: { angle: 315, distance: 80 }
    },
    {
      id: 'similar',
      icon: Coffee,
      label: 'Similar Places',
      action: 'show-similar',
      color: 'from-amber-500 to-amber-600',
      animation: 'scale',
      position: { angle: 270, distance: 80 }
    },
    ...fabOptions.filter(opt => opt.id !== 'filter')
  ]
}

export const FAB_STATES = {
  collapsed: {
    size: 64,
    showAvatar: true,
    showOptions: false,
    scale: 1
  },
  expanded: {
    size: 72,
    showAvatar: true,
    showOptions: true,
    backdrop: 'blur-sm',
    scale: 1.1
  },
  interacting: {
    size: 80,
    showAvatar: true,
    showOptions: true,
    backdrop: 'blur-md',
    scale: 1.2,
    glow: true
  }
} as const

export const SMART_POSITIONING = {
  base: { bottom: 24, right: 24 },
  responsive: {
    mobile: { bottom: 16, right: 16 },
    tablet: { bottom: 20, right: 20 },
    desktop: { bottom: 24, right: 24 }
  },
  contentAware: {
    detectOverlap: true,
    adjustmentStrategy: 'slide-up' as const,
    animationDuration: 300
  }
}

export const MICRO_INTERACTIONS = {
  onboarding: {
    firstClick: "Tap to explore Amit's journey!",
    firstExpand: "Try these quick actions",
    discoverEasterEgg: "You found a secret!"
  },
  placeVisited: {
    celebration: 'confetti-burst',
    sound: 'success-chime',
    haptic: 'success' as const
  },
  asyncActions: {
    search: 'pulse-ring',
    suggest: 'send-animation',
    loading: 'shimmer-effect'
  }
}

export const MOBILE_ENHANCEMENTS = {
  touchTargets: {
    minSize: 48,
    optimalSize: 56,
    spacing: 8
  },
  gestures: {
    tap: 'expand',
    swipeUp: 'quick-search',
    swipeDown: 'collapse',
    pinch: 'show-all-options',
    drag: 'reposition-temporarily'
  },
  boundaryAwareness: {
    detectThumbReach: true,
    avoidSystemUI: true,
    respectSafeAreas: true
  }
}