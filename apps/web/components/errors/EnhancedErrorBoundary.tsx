'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Copy, Bug, Wifi, Lock, Database } from 'lucide-react'

// Error categories for better error handling
export enum ErrorCategory {
  NETWORK = 'network',
  DATA = 'data', 
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
  RUNTIME = 'runtime',
  CHUNK_LOAD = 'chunk_load',
  TIMEOUT = 'timeout'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ErrorDetails {
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  technical: string
  userMessage: string
  recovery: RecoveryAction[]
  errorId: string
  timestamp: number
}

interface RecoveryAction {
  label: string
  action: () => void
  primary?: boolean
  icon?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorDetails: ErrorDetails | null
  showTechnicalDetails: boolean
  retryCount: number
}

interface EnhancedErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: ErrorDetails; onRetry: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo, errorDetails: ErrorDetails) => void
  maxRetries?: number
  enableErrorReporting?: boolean
  showTechnicalDetails?: boolean
  customRecoveryActions?: RecoveryAction[]
}

// Error categorization logic
function categorizeError(error: Error): { category: ErrorCategory; severity: ErrorSeverity } {
  const message = error.message.toLowerCase()
  const stack = error.stack?.toLowerCase() || ''

  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return { category: ErrorCategory.NETWORK, severity: ErrorSeverity.MEDIUM }
  }

  // Chunk loading errors (common in React apps)
  if (message.includes('loading chunk') || message.includes('loading css chunk')) {
    return { category: ErrorCategory.CHUNK_LOAD, severity: ErrorSeverity.MEDIUM }
  }

  // Permission/authentication errors
  if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('permission')) {
    return { category: ErrorCategory.PERMISSION, severity: ErrorSeverity.HIGH }
  }

  // Data/parsing errors
  if (message.includes('json') || message.includes('parse') || message.includes('invalid data')) {
    return { category: ErrorCategory.DATA, severity: ErrorSeverity.MEDIUM }
  }

  // Timeout errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return { category: ErrorCategory.TIMEOUT, severity: ErrorSeverity.MEDIUM }
  }

  // Runtime errors
  if (stack.includes('react') || message.includes('render') || message.includes('component')) {
    return { category: ErrorCategory.RUNTIME, severity: ErrorSeverity.HIGH }
  }

  // Default to unknown
  return { category: ErrorCategory.UNKNOWN, severity: ErrorSeverity.MEDIUM }
}

// Generate user-friendly messages based on error category
function getUserMessage(category: ErrorCategory, severity: ErrorSeverity): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return "We're having trouble connecting to our servers. Please check your internet connection and try again."
    case ErrorCategory.DATA:
      return "We encountered an issue loading the data. This might be a temporary problem."
    case ErrorCategory.PERMISSION:
      return "You don't have permission to access this resource. Please check your authentication status."
    case ErrorCategory.CHUNK_LOAD:
      return "We're updating the application. Please refresh the page to get the latest version."
    case ErrorCategory.TIMEOUT:
      return "The request took too long to complete. Please try again."
    case ErrorCategory.RUNTIME:
      return severity === ErrorSeverity.CRITICAL 
        ? "A critical error occurred in the application. Please refresh the page."
        : "Something went wrong while loading this content."
    default:
      return "An unexpected error occurred. We're working to fix this issue."
  }
}

// Generate error icon based on category
function getErrorIcon(category: ErrorCategory): ReactNode {
  switch (category) {
    case ErrorCategory.NETWORK:
      return <Wifi className="w-8 h-8" />
    case ErrorCategory.PERMISSION:
      return <Lock className="w-8 h-8" />
    case ErrorCategory.DATA:
      return <Database className="w-8 h-8" />
    case ErrorCategory.RUNTIME:
    case ErrorCategory.CHUNK_LOAD:
      return <Bug className="w-8 h-8" />
    default:
      return <AlertTriangle className="w-8 h-8" />
  }
}

// Generate recovery actions based on error category
function getRecoveryActions(
  category: ErrorCategory, 
  onRetry: () => void, 
  customActions: RecoveryAction[] = []
): RecoveryAction[] {
  const baseActions: RecoveryAction[] = []

  switch (category) {
    case ErrorCategory.NETWORK:
      baseActions.push(
        {
          label: 'Check Connection',
          action: () => window.location.reload(),
          icon: <Wifi className="w-4 h-4" />
        },
        {
          label: 'Try Again',
          action: onRetry,
          primary: true,
          icon: <RefreshCw className="w-4 h-4" />
        }
      )
      break
    
    case ErrorCategory.CHUNK_LOAD:
      baseActions.push(
        {
          label: 'Refresh Page',
          action: () => window.location.reload(),
          primary: true,
          icon: <RefreshCw className="w-4 h-4" />
        }
      )
      break
    
    case ErrorCategory.PERMISSION:
      baseActions.push(
        {
          label: 'Go to Login',
          action: () => window.location.href = '/login',
          primary: true,
          icon: <Lock className="w-4 h-4" />
        }
      )
      break
    
    default:
      baseActions.push(
        {
          label: 'Try Again', 
          action: onRetry,
          primary: true,
          icon: <RefreshCw className="w-4 h-4" />
        }
      )
  }

  // Always add "Go Home" as a fallback
  baseActions.push({
    label: 'Go Home',
    action: () => window.location.href = '/',
    icon: <Home className="w-4 h-4" />
  })

  return [...customActions, ...baseActions]
}

// Enhanced Error Boundary Component
export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, ErrorBoundaryState> {
  private errorId: string = ''

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorDetails: null,
      showTechnicalDetails: props.showTechnicalDetails || false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const { category, severity } = categorizeError(error)
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const errorDetails: ErrorDetails = {
      category,
      severity,
      message: error.message,
      technical: error.stack || error.toString(),
      userMessage: getUserMessage(category, severity),
      recovery: [], // Will be populated in render
      errorId,
      timestamp: Date.now()
    }

    return {
      hasError: true,
      errorDetails
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, enableErrorReporting = true } = this.props
    const { errorDetails } = this.state

    if (errorDetails) {
      // Call custom error handler
      if (onError) {
        onError(error, errorInfo, errorDetails)
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚨 Error Boundary - ${errorDetails.category.toUpperCase()}`)
        console.error('Error:', error)
        console.error('Error Info:', errorInfo)
        console.error('Error Details:', errorDetails)
        console.groupEnd()
      }

      // Report to error monitoring service
      if (enableErrorReporting && process.env.NODE_ENV === 'production') {
        this.reportError(error, errorInfo, errorDetails)
      }
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo, errorDetails: ErrorDetails) => {
    try {
      // Report to your error monitoring service (e.g., Sentry, LogRocket, etc.)
      const errorReport = {
        errorId: errorDetails.errorId,
        category: errorDetails.category,
        severity: errorDetails.severity,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: errorDetails.timestamp,
        url: window.location.href,
        userAgent: navigator.userAgent,
        retryCount: this.state.retryCount
      }

      // Example API call - replace with your error reporting service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        errorDetails: null,
        retryCount: retryCount + 1
      })
    } else {
      // Force page reload after max retries
      window.location.reload()
    }
  }

  private toggleTechnicalDetails = () => {
    this.setState(prev => ({
      showTechnicalDetails: !prev.showTechnicalDetails
    }))
  }

  private copyErrorDetails = async () => {
    const { errorDetails } = this.state
    if (!errorDetails) return

    const errorText = `
Error ID: ${errorDetails.errorId}
Category: ${errorDetails.category}
Severity: ${errorDetails.severity}
Time: ${new Date(errorDetails.timestamp).toISOString()}
Message: ${errorDetails.message}
Technical Details: ${errorDetails.technical}
URL: ${window.location.href}
    `.trim()

    try {
      await navigator.clipboard.writeText(errorText)
      // Show success feedback (you could add a toast here)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  render() {
    const { hasError, errorDetails, showTechnicalDetails } = this.state
    const { children, fallback: Fallback, customRecoveryActions } = this.props

    if (!hasError || !errorDetails) {
      return children
    }

    // Generate recovery actions
    const recoveryActions = getRecoveryActions(
      errorDetails.category, 
      this.handleRetry, 
      customRecoveryActions
    )

    // Use custom fallback if provided
    if (Fallback) {
      return <Fallback error={errorDetails} onRetry={this.handleRetry} />
    }

    const errorIcon = getErrorIcon(errorDetails.category)
    const severity = errorDetails.severity
    const isHighSeverity = severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL

    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Error Header */}
          <div className={`p-6 text-center ${
            isHighSeverity 
              ? 'bg-gradient-to-r from-error-50 to-error-100 border-b border-error-200' 
              : 'bg-gradient-to-r from-warning-50 to-warning-100 border-b border-warning-200'
          }`}>
            <div className={`${
              isHighSeverity ? 'text-error-600' : 'text-warning-600'
            } mb-4 flex justify-center`}>
              {errorIcon}
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isHighSeverity ? 'text-error-800' : 'text-warning-800'
            }`}>
              {errorDetails.category === ErrorCategory.CHUNK_LOAD ? 'Update Available' : 'Something went wrong'}
            </h1>
            <p className="text-neutral-700 text-lg leading-relaxed">
              {errorDetails.userMessage}
            </p>
          </div>

          {/* Error Actions */}
          <div className="p-6">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {recoveryActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    action.primary
                      ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-300'
                  }`}
                  aria-label={action.label}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Technical Details Toggle */}
            <div className="border-t border-neutral-200 pt-4">
              <button
                onClick={this.toggleTechnicalDetails}
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 rounded px-2 py-1"
                aria-expanded={showTechnicalDetails}
                aria-controls="technical-details"
              >
                {showTechnicalDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {showTechnicalDetails ? 'Hide' : 'Show'} technical details
              </button>

              {showTechnicalDetails && (
                <div id="technical-details" className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-neutral-700">Error Information</h3>
                    <button
                      onClick={this.copyErrorDetails}
                      className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded px-2 py-1"
                      aria-label="Copy error details to clipboard"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  
                  <div className="bg-neutral-100 rounded-lg p-4 text-xs font-mono space-y-2">
                    <div>
                      <span className="text-neutral-500">Error ID:</span>
                      <span className="ml-2 text-neutral-800">{errorDetails.errorId}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Category:</span>
                      <span className="ml-2 text-neutral-800 capitalize">{errorDetails.category}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Severity:</span>
                      <span className="ml-2 text-neutral-800 capitalize">{errorDetails.severity}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Time:</span>
                      <span className="ml-2 text-neutral-800">
                        {new Date(errorDetails.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-neutral-500">Technical Details:</span>
                      <pre className="mt-1 text-neutral-800 whitespace-pre-wrap break-all">
                        {errorDetails.technical}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Higher-order component wrapper for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<EnhancedErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// React Hook for error boundaries in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}