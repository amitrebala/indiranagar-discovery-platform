'use client'

import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'
import { LoadingDots } from './SkeletonLoaders'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  hapticPattern?: HapticPattern
  spinnerType?: 'spinner' | 'dots' | 'pulse'
  children: React.ReactNode
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      loading = false,
      loadingText,
      variant = 'primary',
      size = 'md',
      hapticPattern = HapticPattern.LIGHT,
      spinnerType = 'spinner',
      className = '',
      disabled,
      onClick,
      onTouchStart,
      children,
      ...props
    },
    ref
  ) => {
    const { triggerHaptic } = useHapticFeedback({ respectReducedMotion: true })

    // Handle click with haptic feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerHaptic(hapticPattern)
      onClick?.(e)
    }

    // Handle touch start for immediate haptic feedback
    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      triggerHaptic(HapticPattern.SELECTION)
      onTouchStart?.(e)
    }

    // Variant styles
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 disabled:bg-primary-300',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-300 disabled:bg-secondary-300',
      outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-300 disabled:border-primary-300 disabled:text-primary-300',
      ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-300 disabled:text-primary-300',
      danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-300 disabled:bg-error-300'
    }

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[52px]'
    }

    // Loading spinner components
    const renderLoadingIndicator = () => {
      switch (spinnerType) {
        case 'dots':
          return <LoadingDots className="w-4 h-4" />
        case 'pulse':
          return (
            <div className="w-4 h-4 bg-current rounded-full animate-pulse" />
          )
        default:
          return <Loader2 className="w-4 h-4 animate-spin" />
      }
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 
          rounded-lg font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-60
          transform active:scale-95 motion-reduce:transform-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${loading ? 'cursor-wait' : ''}
          ${className}
        `}
        disabled={isDisabled}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        aria-busy={loading}
        aria-live="polite"
        {...props}
      >
        {loading && renderLoadingIndicator()}
        
        <span className={`transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
          {loading && loadingText ? loadingText : children}
        </span>
      </button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton, type LoadingButtonProps }

// Specialized button variants
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<LoadingButtonProps, 'variant'>>((props, ref) => (
  <LoadingButton ref={ref} variant="primary" {...props} />
))

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<LoadingButtonProps, 'variant'>>((props, ref) => (
  <LoadingButton ref={ref} variant="secondary" {...props} />
))

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<LoadingButtonProps, 'variant'>>((props, ref) => (
  <LoadingButton ref={ref} variant="outline" {...props} />
))

export const GhostButton = forwardRef<HTMLButtonElement, Omit<LoadingButtonProps, 'variant'>>((props, ref) => (
  <LoadingButton ref={ref} variant="ghost" {...props} />
))

export const DangerButton = forwardRef<HTMLButtonElement, Omit<LoadingButtonProps, 'variant'>>((props, ref) => (
  <LoadingButton ref={ref} variant="danger" {...props} />
))

// Add display names
PrimaryButton.displayName = 'PrimaryButton'
SecondaryButton.displayName = 'SecondaryButton'
OutlineButton.displayName = 'OutlineButton'
GhostButton.displayName = 'GhostButton'
DangerButton.displayName = 'DangerButton'