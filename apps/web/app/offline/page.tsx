'use client'

import Link from 'next/link'
import { WifiOff, RefreshCw, Home, Map, Search } from 'lucide-react'

// Note: metadata export not supported in client components

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Offline Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-neutral-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-neutral-600 mb-8 leading-relaxed">
          No internet connection detected. Don't worry, you can still explore some cached places and view your saved favorites.
        </p>

        {/* Available Actions */}
        <div className="space-y-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/map"
            className="flex items-center justify-center gap-3 w-full bg-neutral-600 text-white py-3 px-4 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <Map className="w-5 h-5" />
            <span>View Cached Map</span>
          </Link>

          <Link
            href="/search"
            className="flex items-center justify-center gap-3 w-full border border-neutral-300 text-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>Search Cached Places</span>
          </Link>
        </div>

        {/* Retry Connection */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 mx-auto text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        {/* Offline Features Info */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Available Offline:
          </h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Previously visited places</li>
            <li>• Cached map data</li>
            <li>• Saved favorites</li>
            <li>• Basic navigation</li>
          </ul>
        </div>

        {/* Connection Status */}
        <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Connection Status: Offline</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-accent-100 rounded-full opacity-20"></div>
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh when connection is restored
            window.addEventListener('online', function() {
              setTimeout(function() {
                window.location.href = '/';
              }, 1000);
            });

            // Update connection status
            function updateConnectionStatus() {
              const statusElement = document.querySelector('[data-connection-status]');
              if (statusElement) {
                if (navigator.onLine) {
                  statusElement.innerHTML = '<div class="w-2 h-2 bg-green-400 rounded-full"></div><span>Connection Status: Online</span>';
                  setTimeout(() => window.location.href = '/', 1000);
                } else {
                  statusElement.innerHTML = '<div class="w-2 h-2 bg-red-400 rounded-full"></div><span>Connection Status: Offline</span>';
                }
              }
            }

            window.addEventListener('load', function() {
              // Check connection status every 5 seconds
              setInterval(updateConnectionStatus, 5000);
              updateConnectionStatus();
            });
          `,
        }}
      />
    </div>
  )
}