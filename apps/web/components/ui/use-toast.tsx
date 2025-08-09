'use client'

import * as React from 'react'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextType {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = React.useCallback((props: ToastProps) => {
    // Simple console log for now - in production this would show actual toast notifications
    console.log('Toast:', props)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  // Return a default implementation if context is not available
  if (!context) {
    return {
      toast: (props: ToastProps) => {
        console.log('Toast (no provider):', props)
      }
    }
  }
  
  return context
}