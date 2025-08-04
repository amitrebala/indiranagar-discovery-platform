'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the critical error for monitoring
    console.error('Critical application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-error">
              Application Error
            </h2>
            <p className="mb-6 text-neutral-600">
              A critical error occurred. Please refresh the page or contact support.
            </p>
            <button
              onClick={reset}
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}