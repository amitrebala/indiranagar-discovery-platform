'use client'

import { useEffect } from 'react'
import { ErrorCategory, ErrorSeverity } from '@/components/errors/EnhancedErrorBoundary'
import { Home, RefreshCw } from 'lucide-react'

// Error fallback component that matches Next.js error page interface
function ErrorFallback({ error, onRetry }: { error: { category: ErrorCategory; severity: ErrorSeverity; userMessage: string; errorId: string; timestamp: number }; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-error-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-error-800 mb-2">
          Something went wrong
        </h2>
        
        <p className="text-neutral-700 mb-6 leading-relaxed">
          {error.userMessage}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Error ID: {error.errorId}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Enhanced error logging
    console.group('🚨 Application Error')
    console.error('Error:', error)
    console.error('Digest:', error.digest)
    console.error('Stack:', error.stack)
    console.groupEnd()
    
    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with your error monitoring service
      // e.g., Sentry, LogRocket, etc.
    }
  }, [error])

  // Create a synthetic error details object for the enhanced error boundary
  const errorDetails = {
    category: ErrorCategory.RUNTIME,
    severity: ErrorSeverity.HIGH,
    userMessage: "An unexpected error occurred while loading this page. Please try refreshing or go back to the homepage.",
    errorId: error.digest || `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  }

  return (
    <ErrorFallback 
      error={errorDetails}
      onRetry={() => {
        // Add haptic feedback for retry action on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(50)
        }
        reset()
      }}
    />
  )
}