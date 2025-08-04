import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock CSS imports
vi.mock('leaflet/dist/leaflet.css', () => ({}))

// Mock Leaflet entirely to avoid CSS loading issues
vi.mock('leaflet', () => ({
  icon: vi.fn(() => ({ options: {} })),
  divIcon: vi.fn(() => ({ options: {} })),
  LatLng: vi.fn((lat: number, lng: number) => ({ lat, lng })),
  Map: vi.fn(),
  TileLayer: vi.fn(),
  Marker: vi.fn(),
  Popup: vi.fn(),
}))

// Mock react-leaflet
vi.mock('react-leaflet', () => {
  const React = require('react')
  return {
    MapContainer: ({ children, ...props }: any) => 
      React.createElement('div', { 'data-testid': 'map-container', ...props }, children),
    TileLayer: (props: any) => 
      React.createElement('div', { 'data-testid': 'tile-layer', ...props }),
    Marker: ({ children, eventHandlers, ...props }: any) => 
      React.createElement('div', { 
        'data-testid': 'marker', 
        onClick: eventHandlers?.click,
        ...props 
      }, children),
    Popup: ({ children, ...props }: any) => 
      React.createElement('div', { 'data-testid': 'popup', ...props }, children),
    useMap: vi.fn(() => ({
      getCenter: vi.fn(() => ({ lat: 12.9719, lng: 77.6412 })),
      getZoom: vi.fn(() => 15),
      setView: vi.fn(),
    })),
    useMapEvents: vi.fn(),
  }
})

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: any) => {
    const Component = fn().then((mod: any) => mod.default || mod)
    return Component
  },
}))

// Setup DOM globals
Object.defineProperty(window, 'L', {
  value: {
    icon: vi.fn(() => ({ options: {} })),
    divIcon: vi.fn(() => ({ options: {} })),
  },
  writable: true,
})