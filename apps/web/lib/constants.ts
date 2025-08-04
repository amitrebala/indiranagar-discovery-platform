// App-wide constants
export const APP_NAME = 'Discovery Platform'
export const APP_DESCRIPTION = 'Explore places and discover your journey'

// API endpoints
export const API_ROUTES = {
  PLACES: '/api/places',
  WEATHER: '/api/weather',
  COMMUNITY: '/api/community',
} as const

// External links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com',
  SUPPORT: 'mailto:support@example.com',
} as const

// Map configuration constants
export const MAP_CONFIG = {
  // Indiranagar center coordinates
  CENTER: {
    lat: 12.9716,
    lng: 77.5946
  },
  
  // Map bounds for Indiranagar area
  BOUNDS: {
    north: 13.0000,
    south: 12.9500,
    east: 77.6500,
    west: 77.5800
  },
  
  // Zoom levels
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 13,
  MAX_ZOOM: 18,
  
  // Tile configuration
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  
  // Marker clustering
  CLUSTER_CONFIG: {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 16
  }
} as const