interface GradientTextProps {
  children: React.ReactNode
  gradient?: 'hero' | 'card' | 'textAccent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest'
  className?: string
}

export const GradientText = ({ 
  children, 
  gradient = 'textAccent', 
  className = '' 
}: GradientTextProps) => {
  const gradientMap = {
    hero: 'bg-gradient-hero',
    card: 'bg-gradient-card', 
    textAccent: 'bg-gradient-text',
    warm: 'bg-gradient-warm',
    cool: 'bg-gradient-cool',
    sunset: 'bg-gradient-sunset',
    ocean: 'bg-gradient-ocean',
    forest: 'bg-gradient-forest'
  }

  const classes = [
    'bg-clip-text text-transparent',
    gradientMap[gradient],
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {children}
    </span>
  )
}