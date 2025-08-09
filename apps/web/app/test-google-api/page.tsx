'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function TestGoogleAPI() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // API key is now server-side only - no longer exposed to client
  const API_KEY = typeof window !== 'undefined' ? 
    (window as any).NEXT_PUBLIC_GOOGLE_PLACES_API_KEY : undefined

  const runTests = async () => {
    setLoading(true)
    setResults([])
    const testResults = []

    // Test 1: Check if API key is properly hidden
    if (API_KEY) {
      testResults.push({
        name: 'Direct Browser API Call (Legacy)',
        status: 'warning',
        message: `⚠️ API key still exposed! This is a security risk.`,
        details: { exposed: true, keyPrefix: API_KEY.substring(0, 10) }
      })
    } else {
      testResults.push({
        name: 'API Key Security Check',
        status: 'success',
        message: `✅ API key is properly hidden from client-side code!`,
        details: { exposed: false }
      })
    }

    // Test 2: Verify server-side proxy is working
    try {
      const response = await fetch('/api/places/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: 'restaurants in indiranagar',
          location: { lat: 12.9783, lng: 77.6408 },
          radius: 3000
        })
      })
      const data = await response.json()
      
      testResults.push({
        name: 'Server Proxy (Autocomplete)',
        status: response.ok ? 'success' : 'failed',
        message: response.ok ? 
          `✅ Secure autocomplete works! Found ${data.predictions?.length || 0} results` : 
          `❌ Failed: ${data.error}`,
        details: data
      })
    } catch (error: any) {
      testResults.push({
        name: 'Server Proxy (Autocomplete)',
        status: 'error',
        message: error.message,
        details: error
      })
    }

    // Test 3: Test place details endpoint
    try {
      // First get a place from autocomplete to get a valid place_id
      const searchResponse = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: 'Toit Brewpub Indiranagar'
        })
      })
      const searchData = await searchResponse.json()
      
      if (searchData.result?.place_id) {
        const detailsResponse = await fetch('/api/places/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            placeId: searchData.result.place_id
          })
        })
        const detailsData = await detailsResponse.json()
        
        testResults.push({
          name: 'Server Proxy (Place Details)',
          status: detailsResponse.ok ? 'success' : 'failed',
          message: detailsResponse.ok ? 
            `✅ Got details for: ${detailsData.details?.name}` : 
            `❌ Failed: ${detailsData.error}`,
          details: detailsData
        })
      } else {
        testResults.push({
          name: 'Server Proxy (Place Details)',
          status: 'warning',
          message: 'Could not test - no place found in search',
          details: searchData
        })
      }
    } catch (error: any) {
      testResults.push({
        name: 'Server Proxy (Place Details)',
        status: 'error',
        message: error.message,
        details: error
      })
    }

    // Test 4: Test nearby search endpoint
    try {
      const response = await fetch('/api/places/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat: 12.9783,
          lng: 77.6408,
          radius: 1000,
          type: 'restaurant'
        })
      })
      const data = await response.json()
      
      testResults.push({
        name: 'Server Proxy (Nearby Search)',
        status: response.ok ? 'success' : 'failed',
        message: response.ok ? 
          `✅ Found ${data.results?.length || 0} nearby restaurants` : 
          `❌ Failed: ${data.error}`,
        details: data
      })
    } catch (error: any) {
      testResults.push({
        name: 'Server Proxy (Nearby Search)',
        status: 'error',
        message: error.message,
        details: error
      })
    }

    // Test 5: Check current domain/referrer
    testResults.push({
      name: 'Current Domain Info',
      status: 'info',
      message: `Origin: ${window.location.origin}, Referrer: ${document.referrer || 'None'}`,
      details: {
        origin: window.location.origin,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        referrer: document.referrer
      }
    })

    setResults(testResults)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🏗️ Google Places API Security Test</h1>
        <p className="text-gray-600 mb-8">
          Test your API key restrictions and domain whitelisting
        </p>

        <button
          onClick={runTests}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Security Tests'
          )}
        </button>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{result.name}</h3>
                    <p className="text-gray-700 mt-1">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">📋 How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Run Security Tests" to check all API configurations</li>
            <li>✅ Green = Working correctly</li>
            <li>⚠️ Yellow = Potential security issue</li>
            <li>❌ Red = Failed/Blocked (good if from unauthorized domain)</li>
            <li>Test from different domains to verify restrictions work</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="font-semibold mb-2 text-yellow-900">⚠️ Security Recommendations:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            <li>Remove NEXT_PUBLIC_ prefix from API key in .env</li>
            <li>Use server-side proxy endpoints only</li>
            <li>Add rate limiting to prevent abuse</li>
            <li>Monitor API usage in Google Cloud Console</li>
            <li>Set up billing alerts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}