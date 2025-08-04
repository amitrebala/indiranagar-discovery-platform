import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article' | 'aside'
  background?: 'default' | 'muted' | 'primary' | 'secondary'
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
}

const backgroundClasses = {
  default: 'bg-white',
  muted: 'bg-neutral-50',
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white'
}

const paddingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12', 
  lg: 'py-16',
  xl: 'py-24'
}

export function Section({ 
  children, 
  className = '', 
  as: Component = 'section',
  background = 'default',
  padding = 'md'
}: SectionProps) {
  return (
    <Component className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </Component>
  )
}