import { LatLng } from 'leaflet'
import type { Place } from '@/lib/validations'
import type { JourneyRoute, PlaceConnection } from '@/components/map/JourneyRouteVisualization'

// Journey difficulty levels
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging'

// Journey themes for different weather/mood contexts
export type JourneyTheme = 
  | 'morning-coffee'
  | 'rainy-day'
  | 'sunny-exploration'  
  | 'evening-food'
  | 'cultural-walk'
  | 'shopping-spree'
  | 'romantic-date'

// Journey creation utilities
export function createJourneyRoute(
  id: string,
  name: string,
  places: Place[],
  options: {
    description?: string
    difficulty?: DifficultyLevel
    weatherDependent?: boolean
    theme?: JourneyTheme
    color?: string
  } = {}
): JourneyRoute {
  const connections = createPlaceConnections(places)
  const estimatedDuration = calculateJourneyDuration(connections)
  
  return {
    id,
    name,
    description: options.description || `A journey through ${places.length} amazing places`,
    places: connections,
    estimated_duration: estimatedDuration,
    difficulty_level: options.difficulty || 'easy',
    weather_dependency: options.weatherDependent || false,
    color: options.color || getThemeColor(options.theme)
  }
}

// Create place connections with walking routes
function createPlaceConnections(places: Place[]): PlaceConnection[] {
  return places.map((place, index) => ({
    place_id: place.id,
    place,
    order: index,
    walking_time_minutes: index < places.length - 1 
      ? calculateWalkingTime(place, places[index + 1])
      : 0,
    path_coordinates: index < places.length - 1
      ? generateWalkingPath(place, places[index + 1])
      : [],
    notes: generateConnectionNotes(place, places[index + 1])
  }))
}

// Calculate walking time between two places
function calculateWalkingTime(from: Place, to: Place): number {
  if (!to) return 0
  
  const distance = getDistanceFromLatLonInKm(
    from.latitude, from.longitude,
    to.latitude, to.longitude
  )
  
  // Average walking speed: 5 km/h
  const walkingTimeHours = distance / 5
  const walkingTimeMinutes = Math.round(walkingTimeHours * 60)
  
  // Add 2-5 minutes for navigation and street crossing
  const navigationBuffer = Math.max(2, Math.min(5, walkingTimeMinutes * 0.2))
  
  return Math.round(walkingTimeMinutes + navigationBuffer)
}

// Generate walking path between two places
function generateWalkingPath(from: Place, to: Place): LatLng[] {
  if (!to) return []
  
  const fromLatLng = new LatLng(from.latitude, from.longitude)
  const toLatLng = new LatLng(to.latitude, to.longitude)
  
  // For now, create a simple direct path
  // In a real implementation, this could use routing APIs like OpenRouteService
  const path = [fromLatLng, toLatLng]
  
  // Add intermediate points for longer distances to create more natural curves
  const distance = getDistanceFromLatLonInKm(
    from.latitude, from.longitude,
    to.latitude, to.longitude
  )
  
  if (distance > 0.5) { // More than 500m
    const midLat = (from.latitude + to.latitude) / 2
    const midLng = (from.longitude + to.longitude) / 2
    
    // Add slight curve to make path more natural
    const offset = 0.0005 // Small offset for curve
    const midPoint = new LatLng(midLat + offset, midLng + offset)
    
    path.splice(1, 0, midPoint)
  }
  
  return path
}

// Generate connection notes between places
function generateConnectionNotes(from: Place, to?: Place): string | undefined {
  if (!to) return undefined
  
  const distance = getDistanceFromLatLonInKm(
    from.latitude, from.longitude,
    to.latitude, to.longitude
  )
  
  if (distance < 0.2) {
    return "Very close - easy walk"
  } else if (distance < 0.5) {
    return "Short pleasant walk"
  } else if (distance < 1.0) {
    return "Moderate walk through the neighborhood"
  } else {
    return "Longer walk - consider the weather"
  }
}

// Calculate total journey duration including stops
function calculateJourneyDuration(connections: PlaceConnection[]): number {
  const walkingTime = connections.reduce((total, conn) => 
    total + conn.walking_time_minutes, 0
  )
  
  // Estimate 15-30 minutes per stop depending on place type
  const stopTime = connections.length * 20 // Average 20 minutes per stop
  
  return walkingTime + stopTime
}

// Get theme-based color
function getThemeColor(theme?: JourneyTheme): string {
  const themeColors: Record<JourneyTheme, string> = {
    'morning-coffee': '#8B4513', // Brown
    'rainy-day': '#4682B4', // Steel blue
    'sunny-exploration': '#FFD700', // Gold
    'evening-food': '#DC143C', // Crimson
    'cultural-walk': '#9370DB', // Medium purple
    'shopping-spree': '#FF69B4', // Hot pink
    'romantic-date': '#FF1493' // Deep pink
  }
  
  return theme ? themeColors[theme] : '#2D5016' // Default green
}

// Distance calculation utility
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Predefined journey templates
export const SAMPLE_JOURNEYS: Partial<JourneyRoute>[] = [
  {
    id: 'morning-coffee-crawl',
    name: 'Morning Coffee Crawl',
    description: 'Start your day with the best coffee spots in Indiranagar',
    difficulty_level: 'easy',
    weather_dependency: false,
    color: '#8B4513'
  },
  {
    id: 'rainy-day-indoor',
    name: 'Rainy Day Refuge',
    description: 'Perfect spots to wait out the rain with good food and atmosphere',
    difficulty_level: 'easy',
    weather_dependency: true,
    color: '#4682B4'
  },
  {
    id: 'sunset-food-walk',
    name: 'Sunset Food Walk',
    description: 'Evening exploration of Indiranagar culinary delights',
    difficulty_level: 'moderate',
    weather_dependency: false,
    color: '#DC143C'
  }
]

// Journey filtering and search
export function filterJourneysByWeather(
  journeys: JourneyRoute[],
  weatherCondition: string
): JourneyRoute[] {
  return journeys.filter(journey => {
    if (weatherCondition === 'rainy') {
      // Prefer indoor or covered routes for rain
      return journey.weather_dependency || journey.name.toLowerCase().includes('indoor')
    }
    
    if (weatherCondition === 'sunny') {
      // Any journey is good for sunny weather, prefer outdoor ones
      return !journey.weather_dependency || journey.name.toLowerCase().includes('walk')
    }
    
    return true // Default: show all journeys
  })
}

export function filterJourneysByDifficulty(
  journeys: JourneyRoute[],
  maxDifficulty: DifficultyLevel
): JourneyRoute[] {
  const difficultyOrder = ['easy', 'moderate', 'challenging']
  const maxIndex = difficultyOrder.indexOf(maxDifficulty)
  
  return journeys.filter(journey => {
    const journeyIndex = difficultyOrder.indexOf(journey.difficulty_level)
    return journeyIndex <= maxIndex
  })
}

export function filterJourneysByDuration(
  journeys: JourneyRoute[],
  maxDurationMinutes: number
): JourneyRoute[] {
  return journeys.filter(journey => journey.estimated_duration <= maxDurationMinutes)
}

// Journey optimization
export function optimizeJourneyOrder(places: Place[]): Place[] {
  if (places.length <= 2) return places
  
  // Simple nearest neighbor optimization
  const optimized = [places[0]]
  const remaining = places.slice(1)
  
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1]
    let nearestIndex = 0
    let nearestDistance = Infinity
    
    remaining.forEach((place, index) => {
      const distance = getDistanceFromLatLonInKm(
        current.latitude, current.longitude,
        place.latitude, place.longitude
      )
      
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })
    
    optimized.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }
  
  return optimized
}

// Journey validation
export function validateJourney(journey: JourneyRoute): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!journey.name || journey.name.trim().length === 0) {
    errors.push('Journey name is required')
  }
  
  if (!journey.places || journey.places.length < 2) {
    errors.push('Journey must have at least 2 places')
  }
  
  if (journey.estimated_duration <= 0) {
    errors.push('Journey duration must be positive')
  }
  
  // Check for valid coordinates
  journey.places.forEach((connection, index) => {
    const place = connection.place
    if (!place.latitude || !place.longitude) {
      errors.push(`Place ${index + 1} has invalid coordinates`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}