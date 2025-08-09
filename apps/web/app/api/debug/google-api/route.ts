import { NextResponse } from 'next/server'

export async function GET() {
  // Only show debug info in development or with a secret query param
  const isDev = process.env.NODE_ENV === 'development'
  
  const hasPublicKey = !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  const hasServerKey = !!process.env.GOOGLE_PLACES_API_KEY
  const keyToUse = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  
  // Test the API key by making a simple request
  let apiStatus = 'unknown'
  let apiError = null
  
  if (keyToUse) {
    try {
      // Test with a simple nearby search
      const testUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=12.9716,77.5946&radius=100&key=${keyToUse}`
      const response = await fetch(testUrl)
      const data = await response.json()
      apiStatus = data.status
      if (data.error_message) {
        apiError = data.error_message
      }
    } catch (error) {
      apiStatus = 'FETCH_ERROR'
      apiError = error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasPublicKey,
    hasServerKey,
    apiKeyConfigured: !!(keyToUse),
    apiStatus,
    apiError,
    // Only show key prefix in development
    keyPrefix: isDev && keyToUse ? keyToUse.substring(0, 10) + '...' : undefined,
    recommendation: !keyToUse 
      ? 'Please add GOOGLE_PLACES_API_KEY or NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to environment variables'
      : apiStatus === 'REQUEST_DENIED'
      ? 'API key exists but is not authorized for Places API. Check Google Cloud Console.'
      : apiStatus === 'OK'
      ? 'API is working correctly'
      : 'Unknown issue with API configuration'
  })
}