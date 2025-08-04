'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-error">
          Something went wrong!
        </h2>
        <p className="mb-6 text-neutral-600">
          We apologize for the inconvenience. An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )
}