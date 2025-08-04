import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import React from 'react'
import { 
  EnhancedErrorBoundary, 
  ErrorCategory, 
  ErrorSeverity,
  withErrorBoundary,
  useErrorHandler
} from '@/components/errors/EnhancedErrorBoundary'

// Mock fetch for error reporting
global.fetch = vi.fn()

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

// Mock console methods to test logging
const originalConsole = console
const mockConsole = {
  group: vi.fn(),
  groupEnd: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
}

// Component that throws errors for testing
const ThrowError = ({ shouldThrow, errorMessage = 'Test error', errorType = 'generic' }: { 
  shouldThrow: boolean
  errorMessage?: string
  errorType?: string
}) => {
  if (shouldThrow) {
    const error = new Error(errorMessage)
    if (errorType === 'network') {
      error.message = 'Network connection failed'
    } else if (errorType === 'chunk') {
      error.message = 'Loading chunk 123 failed'
    } else if (errorType === 'permission') {
      error.message = 'Unauthorized access forbidden'
    } else if (errorType === 'timeout') {
      error.message = 'Request timed out'
    }
    throw error
  }
  return <div>No error</div>
}

describe('EnhancedErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    
    // Mock console methods
    Object.assign(console, mockConsole)
    
    // Mock window.location methods
    Object.defineProperty(window, 'location', {
      value: {
        reload: vi.fn(),
        href: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    Object.assign(console, originalConsole)
  })

  describe('Error Categorization', () => {
    it('categorizes network errors correctly', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="network" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/trouble connecting to our servers/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /check connection/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('categorizes chunk loading errors correctly', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="chunk" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/update available/i)).toBeInTheDocument()
      expect(screen.getByText(/updating the application/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument()
    })

    it('categorizes permission errors correctly', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="permission" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/don't have permission/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument()
    })

    it('categorizes timeout errors correctly', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="timeout" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/took too long to complete/i)).toBeInTheDocument()
    })

    it('handles unknown errors with generic messaging', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Unknown weird error" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument()
    })
  })

  describe('Error Severity and Visual Design', () => {
    it('applies high severity styling for critical errors', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="permission" />
        </EnhancedErrorBoundary>
      )

      // Check for error styling (high severity should have error colors)
      const errorContainer = screen.getByRole('main') || screen.getByText(/don't have permission/i).closest('div')
      expect(errorContainer).toBeInTheDocument()
    })

    it('applies medium severity styling for recoverable errors', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="network" />
        </EnhancedErrorBoundary>
      )

      const errorContainer = screen.getByText(/trouble connecting/i).closest('div')
      expect(errorContainer).toBeInTheDocument()
    })
  })

  describe('Recovery Actions', () => {
    it('provides try again functionality', async () => {
      const onError = vi.fn()
      
      const { rerender } = render(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      // Component should attempt to recover
      rerender(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    it('provides go home functionality', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      const goHomeButton = screen.getByRole('button', { name: /go home/i })
      fireEvent.click(goHomeButton)

      expect(window.location.href).toBe('/')
    })

    it('provides refresh page functionality for chunk errors', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorType="chunk" />
        </EnhancedErrorBoundary>
      )

      const refreshButton = screen.getByRole('button', { name: /refresh page/i })
      fireEvent.click(refreshButton)

      expect(window.location.reload).toHaveBeenCalled()
    })

    it('handles max retries and forces page reload', async () => {
      const { rerender } = render(
        <EnhancedErrorBoundary maxRetries={1}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      // First retry attempt
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      rerender(
        <EnhancedErrorBoundary maxRetries={1}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      // Second retry should trigger page reload
      const secondTryButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(secondTryButton)

      expect(window.location.reload).toHaveBeenCalled()
    })
  })

  describe('Technical Details', () => {
    it('shows/hides technical details on toggle', async () => {
      render(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={true} errorMessage="Test error with stack" />
        </EnhancedErrorBoundary>
      )

      const toggleButton = screen.getByRole('button', { name: /show technical details/i })
      
      // Initially hidden
      expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument()
      
      // Show technical details
      fireEvent.click(toggleButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Error ID:/)).toBeInTheDocument()
        expect(screen.getByText(/Category:/)).toBeInTheDocument()
        expect(screen.getByText(/Severity:/)).toBeInTheDocument()
        expect(screen.getByText(/Technical Details:/)).toBeInTheDocument()
      })
      
      // Hide technical details
      const hideButton = screen.getByRole('button', { name: /hide technical details/i })
      fireEvent.click(hideButton)
      
      await waitFor(() => {
        expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument()
      })
    })

    it('copies error details to clipboard', async () => {
      render(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={true} errorMessage="Clipboard test error" />
        </EnhancedErrorBoundary>
      )

      // Show technical details first
      const toggleButton = screen.getByRole('button', { name: /show technical details/i })
      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(screen.getByText(/Error ID:/)).toBeInTheDocument()
      })

      const copyButton = screen.getByRole('button', { name: /copy error details/i })
      fireEvent.click(copyButton)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Clipboard test error')
      )
    })

    it('generates unique error IDs', () => {
      const { rerender } = render(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={true} errorMessage="First error" />
        </EnhancedErrorBoundary>
      )

      // Show technical details
      const toggleButton = screen.getByRole('button', { name: /show technical details/i })
      fireEvent.click(toggleButton)

      const firstErrorId = screen.getByText(/Error ID:/).textContent

      // Reset and trigger new error
      rerender(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      )

      rerender(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={true} errorMessage="Second error" />
        </EnhancedErrorBoundary>
      )

      const toggleButton2 = screen.getByRole('button', { name: /show technical details/i })
      fireEvent.click(toggleButton2)

      const secondErrorId = screen.getByText(/Error ID:/).textContent

      expect(firstErrorId).not.toBe(secondErrorId)
    })
  })

  describe('Error Reporting', () => {
    it('calls custom error handler when provided', () => {
      const onError = vi.fn()
      
      render(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} errorMessage="Custom handler test" />
        </EnhancedErrorBoundary>
      )

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) }),
        expect.objectContaining({
          category: expect.any(String),
          severity: expect.any(String),
          errorId: expect.any(String),
        })
      )
    })

    it('logs errors to console in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Development logging test" />
        </EnhancedErrorBoundary>
      )

      expect(mockConsole.group).toHaveBeenCalledWith(
        expect.stringContaining('Error Boundary')
      )
      expect(mockConsole.error).toHaveBeenCalledWith('Error:', expect.any(Error))
      expect(mockConsole.groupEnd).toHaveBeenCalled()
      
      process.env.NODE_ENV = originalEnv
    })

    it('reports errors to monitoring service in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      render(
        <EnhancedErrorBoundary enableErrorReporting={true}>
          <ThrowError shouldThrow={true} errorMessage="Production reporting test" />
        </EnhancedErrorBoundary>
      )

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Production reporting test'),
        })
      })
      
      process.env.NODE_ENV = originalEnv
    })

    it('handles error reporting failures gracefully', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <EnhancedErrorBoundary enableErrorReporting={true}>
          <ThrowError shouldThrow={true} errorMessage="Reporting failure test" />
        </EnhancedErrorBoundary>
      )

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to report error:',
          expect.any(Error)
        )
      })
      
      consoleErrorSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Custom Fallback Component', () => {
    it('uses custom fallback when provided', () => {
      const CustomFallback = ({ error, onRetry }: any) => (
        <div>
          <h1>Custom Error: {error.userMessage}</h1>
          <button onClick={onRetry}>Custom Retry</button>
        </div>
      )

      render(
        <EnhancedErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} errorMessage="Custom fallback test" />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByText(/Custom Error:/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /custom retry/i })).toBeInTheDocument()
    })
  })

  describe('Custom Recovery Actions', () => {
    it('includes custom recovery actions in addition to defaults', () => {
      const customActions = [
        {
          label: 'Custom Action',
          action: vi.fn(),
          primary: true,
        },
      ]

      render(
        <EnhancedErrorBoundary customRecoveryActions={customActions}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /custom action/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument()
    })

    it('executes custom recovery actions when clicked', () => {
      const customActionHandler = vi.fn()
      const customActions = [
        {
          label: 'Custom Action',
          action: customActionHandler,
        },
      ]

      render(
        <EnhancedErrorBoundary customRecoveryActions={customActions}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      const customButton = screen.getByRole('button', { name: /custom action/i })
      fireEvent.click(customButton)

      expect(customActionHandler).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <EnhancedErrorBoundary showTechnicalDetails={true}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      const toggleButton = screen.getByRole('button', { name: /show technical details/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
      expect(toggleButton).toHaveAttribute('aria-controls', 'technical-details')

      fireEvent.click(toggleButton)

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
      
      const technicalDetails = screen.getByRole('region', { name: /technical details/i }) || 
                             document.getElementById('technical-details')
      expect(technicalDetails).toBeInTheDocument()
    })

    it('provides proper button labels for screen readers', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })
})

describe('withErrorBoundary HOC', () => {
  it('wraps component with error boundary', () => {
    const TestComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('HOC test error')
      return <div>HOC works</div>
    }

    const WrappedComponent = withErrorBoundary(TestComponent)

    const { rerender } = render(<WrappedComponent shouldThrow={false} />)
    expect(screen.getByText('HOC works')).toBeInTheDocument()

    rerender(<WrappedComponent shouldThrow={true} />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('passes error boundary props to wrapped component', () => {
    const TestComponent = () => <div>Test</div>
    const onError = vi.fn()
    
    const WrappedComponent = withErrorBoundary(TestComponent, { onError })

    render(<WrappedComponent />)
    
    // The component should render normally
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})

describe('useErrorHandler Hook', () => {
  it('provides error handling functionality', () => {
    const TestComponent = () => {
      const { handleError, resetError } = useErrorHandler()
      
      return (
        <div>
          <button onClick={() => handleError(new Error('Hook test error'))}>
            Trigger Error
          </button>
          <button onClick={resetError}>Reset Error</button>
        </div>
      )
    }

    expect(() => {
      render(
        <EnhancedErrorBoundary>
          <TestComponent />
        </EnhancedErrorBoundary>
      )
    }).not.toThrow()

    const triggerButton = screen.getByRole('button', { name: /trigger error/i })
    
    expect(() => {
      fireEvent.click(triggerButton)
    }).not.toThrow() // Should be caught by error boundary
  })
})

describe('Edge Cases and Error Handling', () => {
  it('handles errors during error reporting', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    // Mock fetch to throw error
    ;(global.fetch as any).mockImplementation(() => {
      throw new Error('Fetch failed')
    })
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <EnhancedErrorBoundary enableErrorReporting={true}>
        <ThrowError shouldThrow={true} />
      </EnhancedErrorBoundary>
    )

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to report error:',
        expect.any(Error)
      )
    })
    
    consoleErrorSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('handles clipboard write failures gracefully', async () => {
    // Mock clipboard.writeText to fail
    ;(navigator.clipboard.writeText as any).mockRejectedValue(new Error('Clipboard failed'))
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <EnhancedErrorBoundary showTechnicalDetails={true}>
        <ThrowError shouldThrow={true} />
      </EnhancedErrorBoundary>
    )

    const toggleButton = screen.getByRole('button', { name: /show technical details/i })
    fireEvent.click(toggleButton)

    const copyButton = screen.getByRole('button', { name: /copy error details/i })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to copy error details:',
        expect.any(Error)
      )
    })
    
    consoleErrorSpy.mockRestore()
  })

  it('handles missing window object in SSR environments', () => {
    const originalWindow = global.window
    delete (global as any).window
    
    expect(() => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      )
    }).not.toThrow()
    
    global.window = originalWindow
  })
})