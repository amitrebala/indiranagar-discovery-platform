// Mobile-specific utilities for optimizing performance and UX

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  priority?: boolean
}

interface ViewportConfig {
  width: number
  height: number
  pixelRatio: number
  isRetina: boolean
}

// Get optimized image parameters based on device and network
export function getOptimizedImageParams(
  originalWidth: number,
  originalHeight: number,
  targetContainer: { width: number; height: number },
  networkType: string = '4g'
): ImageOptimizationOptions {
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1
  const isSlowNetwork = networkType === '2g' || networkType === 'slow-2g'
  
  // Calculate optimal dimensions
  const aspectRatio = originalWidth / originalHeight
  let optimalWidth = targetContainer.width * devicePixelRatio
  let optimalHeight = targetContainer.height * devicePixelRatio
  
  // Maintain aspect ratio
  if (optimalWidth / aspectRatio < optimalHeight) {
    optimalHeight = optimalWidth / aspectRatio
  } else {
    optimalWidth = optimalHeight * aspectRatio
  }
  
  // Apply network-based optimization
  const qualityMap = {
    'slow-2g': 40,
    '2g': 50,
    '3g': 70,
    '4g': 85
  }
  
  return {
    width: Math.round(optimalWidth),
    height: Math.round(optimalHeight),
    quality: qualityMap[networkType as keyof typeof qualityMap] || 85,
    format: isSlowNetwork ? 'jpeg' : 'webp'
  }
}

// Detect if device supports WebP
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// Get viewport configuration
export function getViewportConfig(): ViewportConfig {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      pixelRatio: 1,
      isRetina: false
    }
  }
  
  const width = window.innerWidth
  const height = window.innerHeight
  const pixelRatio = window.devicePixelRatio || 1
  
  return {
    width,
    height,
    pixelRatio,
    isRetina: pixelRatio > 1
  }
}

// Optimize touch target sizes for accessibility
export function getOptimalTouchTargets() {
  const viewport = getViewportConfig()
  const minTouchTarget = 44 // iOS Human Interface Guidelines minimum
  
  return {
    minSize: Math.max(minTouchTarget, minTouchTarget * viewport.pixelRatio),
    optimalSize: Math.max(48, 48 * viewport.pixelRatio), // Material Design recommendation
    spacing: Math.max(8, 8 * viewport.pixelRatio)
  }
}

// Debounce function for scroll and resize events
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle function for high-frequency events
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  })
}

// Performance optimization for animations
export function requestAnimationFrame(callback: () => void): number {
  if (typeof window === 'undefined') {
    return setTimeout(callback, 16) as unknown as number
  }
  
  return window.requestAnimationFrame(callback)
}

export function cancelAnimationFrame(id: number): void {
  if (typeof window === 'undefined') {
    clearTimeout(id)
    return
  }
  
  window.cancelAnimationFrame(id)
}

// Memory management utilities
export function cleanupImageCache(maxCacheSize: number = 50): void {
  // This would integrate with a proper image cache system
  // For now, it's a placeholder for future implementation
  console.log(`Cleaning up image cache, max size: ${maxCacheSize}`)
}

// Battery optimization
export function getBatteryInfo(): Promise<{
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
} | null> {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return Promise.resolve(null)
  }
  
  return (navigator as any).getBattery().then((battery: any) => ({
    level: battery.level,
    charging: battery.charging,
    chargingTime: battery.chargingTime,
    dischargingTime: battery.dischargingTime
  })).catch(() => null)
}

// Haptic feedback for mobile devices
export function vibrate(pattern: number | number[] = 100): boolean {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return false
  }
  
  try {
    return navigator.vibrate(pattern)
  } catch (error) {
    console.warn('Vibration failed:', error)
    return false
  }
}

// Safe area handling for devices with notches
export function getSafeAreaInsets(): {
  top: number
  right: number
  bottom: number
  left: number
} {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }
  
  const style = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0', 10)
  }
}

// Orientation detection and handling
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') {
    return 'landscape'
  }
  
  // Use screen.orientation if available
  if (screen.orientation) {
    return screen.orientation.angle === 0 || screen.orientation.angle === 180 
      ? 'portrait' 
      : 'landscape'
  }
  
  // Fallback to window dimensions
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

// PWA installation prompt handling
export function canInstallPWA(): boolean {
  return typeof window !== 'undefined' && 
         ('beforeinstallprompt' in window || 
          (window.navigator as any).standalone !== undefined)
}

export function promptPWAInstall(): Promise<boolean> {
  return new Promise((resolve) => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as any
      
      promptEvent.prompt()
      promptEvent.userChoice.then((choiceResult: any) => {
        resolve(choiceResult.outcome === 'accepted')
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      })
    }
    
    if ((window as any).deferredPrompt) {
      handleInstallPrompt((window as any).deferredPrompt)
    } else {
      window.addEventListener('beforeinstallprompt', handleInstallPrompt)
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
        resolve(false)
      }, 5000)
    }
  })
}