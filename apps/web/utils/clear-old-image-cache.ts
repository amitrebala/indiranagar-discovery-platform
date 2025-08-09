// Clear old image cache entries that are not from Google Places
export function clearNonGooglePlacesCache() {
  if (typeof window === 'undefined') return
  
  const keysToRemove: string[] = []
  
  // Find all place-image cache entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('place-image-')) {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          const cached = JSON.parse(value)
          // Remove if it's not from Google Places
          if (!cached.attribution || cached.attribution.source !== 'Google Places') {
            keysToRemove.push(key)
          }
        }
      } catch {
        // Invalid JSON, remove it
        keysToRemove.push(key)
      }
    }
  }
  
  // Remove all non-Google Places cached images
  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
    console.log('Cleared old cache for:', key)
  })
  
  if (keysToRemove.length > 0) {
    console.log(`Cleared ${keysToRemove.length} old image cache entries`)
  }
}