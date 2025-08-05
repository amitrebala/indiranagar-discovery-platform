# Story: Home Page Redesign - Dynamic Gateway to Indiranagar

**Story ID**: UX-001  
**Epic**: UX Excellence & User Experience Enhancement  
**Priority**: High  
**Estimated Effort**: 4 weeks  

## Problem Statement

The current home page, while functional, lacks the dynamic engagement and personality that would truly showcase Amit's deep knowledge of Indiranagar. It needs to transform from a static introduction to a living, breathing portal that makes visitors excited to explore and positions Amit as the neighborhood's digital chronicler.

## Acceptance Criteria

- [ ] Dynamic hero section with time/weather-aware gradients and live neighborhood data
- [ ] Interactive journey selector replacing generic CTAs with intelligent, curated paths
- [ ] Amit's live dashboard showcasing real-time picks and neighborhood insights
- [ ] Smart content blocks that adapt to context (weather, time, user behavior)
- [ ] Modern visual language with gradient meshes, glassmorphism, and micro-interactions
- [ ] Performance targets met: FCP < 1.2s, TTI < 2.5s, Lighthouse > 95
- [ ] Mobile-first responsive design (320px+) with touch-friendly interactions
- [ ] WCAG AA accessibility compliance
- [ ] A/B testing infrastructure for progressive rollout
- [ ] Return visitor rate increased from 30% to 55%
- [ ] Map exploration clicks increased from 40% to 65%

## Technical Requirements

### Feature Flag System
- [ ] Create feature flag infrastructure for progressive rollout
- [ ] Implement flags for: dynamicHero, journeySelector, amitDashboard, liveActivity
- [ ] Set up A/B testing framework with variant tracking

### Database Schema
- [ ] Create journeys table for curated exploration paths
- [ ] Create journey_places junction table
- [ ] Add activity_feed table for real-time updates
- [ ] Add amit_status table for dashboard data

### Component Architecture
- [ ] Create new component structure under /components/homepage/
- [ ] Implement shared UI components in /components/ui/
- [ ] Create custom hooks for time, weather, and live data
- [ ] Set up animation system with Framer Motion

### Performance Optimization
- [ ] Implement progressive loading strategy
- [ ] Add service worker for offline support
- [ ] Optimize bundle size with code splitting
- [ ] Add skeleton screens with shimmer effects

## Implementation Tasks

### Phase 1: Core Visual & Layout (Week 1)

#### Task 1.1: Set Up Foundation
```bash
# Install dependencies
npm install framer-motion @react-spring/web lucide-react
npm install -D @types/node

# Create feature flags
# lib/features.ts
export const features = {
  dynamicHero: process.env.NEXT_PUBLIC_FEATURE_DYNAMIC_HERO === 'true',
  journeySelector: process.env.NEXT_PUBLIC_FEATURE_JOURNEY_SELECTOR === 'true',
  amitDashboard: process.env.NEXT_PUBLIC_FEATURE_AMIT_DASHBOARD === 'true',
  liveActivity: process.env.NEXT_PUBLIC_FEATURE_LIVE_ACTIVITY === 'true'
}
```

#### Task 1.2: Create GradientMesh Component
```typescript
// components/ui/GradientMesh.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface GradientMeshProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  weather?: 'sunny' | 'rainy' | 'cloudy'
}

export function GradientMesh({ timeOfDay, weather }: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const gradientConfigs = {
    morning: {
      colors: ['#FF6B6B', '#FFE66D', '#FF8CC8'],
      positions: [[0.2, 0.3], [0.8, 0.2], [0.5, 0.8]]
    },
    afternoon: {
      colors: ['#4ECDC4', '#44A6C6', '#87E0E0'],
      positions: [[0.1, 0.4], [0.9, 0.6], [0.4, 0.1]]
    },
    evening: {
      colors: ['#9B59B6', '#FF6B6B', '#FFB347'],
      positions: [[0.3, 0.7], [0.7, 0.3], [0.5, 0.5]]
    },
    night: {
      colors: ['#2C3E50', '#34495E', '#1A252F'],
      positions: [[0.2, 0.2], [0.8, 0.8], [0.5, 0.5]]
    }
  }
  
  // Animated gradient implementation
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: weather === 'rainy' ? 'blur(2px)' : 'none' }}
    />
  )
}
```

#### Task 1.3: Update Typography System
```scss
// styles/typography.scss
.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 0.9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 35%, #f093fb 70%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

#### Task 1.4: Extend Tailwind Configuration
```javascript
// tailwind.config.js updates
module.exports = {
  theme: {
    extend: {
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%)',
      },
    },
  },
}
```

### Phase 2: Dynamic Content (Week 2)

#### Task 2.1: Create Custom Hooks
```typescript
// hooks/useTimeOfDay.ts
export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon')
  const [greeting, setGreeting] = useState('')
  
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning')
        setGreeting('Good morning! Perfect time for filter coffee ☕')
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon')
        setGreeting('Good afternoon! Beat the heat with some fresh juice 🥤')
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening')
        setGreeting('Good evening! Time for some street food? 🍜')
      } else {
        setTimeOfDay('night')
        setGreeting('Good night! Looking for late-night options? 🌙')
      }
    }
    
    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  return { timeOfDay, greeting }
}
```

#### Task 2.2: Implement DynamicHeroSection
```typescript
// components/homepage/DynamicHeroSection.tsx
'use client'

import { useWeather } from '@/hooks/useWeather'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'
import { useLiveActivity } from '@/hooks/useLiveActivity'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { LiveActivity } from '@/components/ui/LiveActivity'

export function DynamicHeroSection() {
  const { weather, isLoading: weatherLoading } = useWeather()
  const { timeOfDay, greeting } = useTimeOfDay()
  const { openPlaces, recentActivity } = useLiveActivity()
  
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <GradientMesh timeOfDay={timeOfDay} weather={weather?.condition} />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title mb-6">
            Indiranagar Discovery
          </h1>
          
          <p className="text-2xl text-white/90 mb-8">
            {greeting}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <WeatherWidget weather={weather} loading={weatherLoading} />
            <LiveActivity data={{ openPlaces, recentActivity }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

#### Task 2.3: Create Journey Selector System
```sql
-- Database migration: 004_add_journey_system.sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  gradient TEXT NOT NULL,
  icon TEXT NOT NULL,
  estimated_time TEXT,
  vibe_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE journey_places (
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  PRIMARY KEY (journey_id, place_id)
);

-- Seed data
INSERT INTO journeys (title, description, gradient, icon, estimated_time, vibe_tags) VALUES
('First Timer''s Perfect Day', 'Amit''s curated 6-hour journey through must-visit spots', 'from-amber-500 to-orange-600', 'map', '6 hours', ARRAY['curious', 'explorer', 'foodie']),
('Local''s Secret Circuit', 'Hidden gems only 2% of visitors know about', 'from-purple-600 to-pink-600', 'compass', '4 hours', ARRAY['adventurous', 'offbeat', 'insider']),
('Live Like a Resident', 'Experience Amit''s actual weekly routine', 'from-teal-500 to-cyan-600', 'home', '3 hours', ARRAY['authentic', 'slow', 'mindful']);
```

#### Task 2.4: Implement JourneyCard Component
```typescript
// components/homepage/JourneyCard.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JourneyCardProps {
  journey: Journey
  onSelect: (journey: Journey) => void
}

export function JourneyCard({ journey, onSelect }: JourneyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleClick = async () => {
    setIsLoading(true)
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    // Preload journey data
    await preloadJourneyData(journey.id)
    
    // Navigate to map with journey
    router.push(`/map?journey=${journey.id}`)
  }
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      onClick={handleClick}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${journey.gradient}`} />
      
      {/* Content */}
      <div className="relative p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{journey.title}</h3>
        <p className="text-white/80 mb-4">{journey.description}</p>
        
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} />
          {journey.estimatedTime}
        </div>
      </div>
    </motion.div>
  )
}
```

### Phase 3: Personality & Polish (Week 3)

#### Task 3.1: Create Amit's Dashboard
```typescript
// components/homepage/AmitDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, MessageCircle, TrendingUp, Clock } from 'lucide-react'
import { useAmitStatus } from '@/hooks/useAmitStatus'

export function AmitDashboard() {
  const { status, todaysPick, weeklyInsight } = useAmitStatus()
  const [showAskAmit, setShowAskAmit] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Amit's Live Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Your neighborhood oracle</p>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-800">
            {status?.location || 'Active'}
          </span>
        </div>
      </div>
      
      {/* Dashboard content implementation */}
    </motion.div>
  )
}
```

#### Task 3.2: Add Micro-interactions
```typescript
// components/ui/MagneticButton.tsx
'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function MagneticButton({ children, className, ...props }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

#### Task 3.3: Create Loading States
```typescript
// components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
    />
  )
}

// components/homepage/HeroSkeleton.tsx
export function HeroSkeleton() {
  return (
    <div className="min-h-[80vh] relative">
      <Skeleton className="absolute inset-0" />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <Skeleton className="h-20 w-3/4 mb-6" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Performance & Testing (Week 4)

#### Task 4.1: Implement Progressive Loading
```typescript
// lib/progressive-enhance.ts
export function withProgressiveEnhancement<T extends {}>(
  BaseComponent: React.ComponentType<T>,
  EnhancedComponent: React.ComponentType<T>
) {
  return (props: T) => {
    const [isEnhanced, setIsEnhanced] = useState(false)
    
    useEffect(() => {
      // Check for required features
      if ('IntersectionObserver' in window && 
          'requestIdleCallback' in window) {
        setIsEnhanced(true)
      }
    }, [])
    
    return isEnhanced ? 
      <EnhancedComponent {...props} /> : 
      <BaseComponent {...props} />
  }
}
```

#### Task 4.2: Add Performance Monitoring
```typescript
// lib/performance.ts
export function trackHeroPerformance() {
  if (typeof window !== 'undefined') {
    // Core Web Vitals tracking
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        analytics.track('hero_performance', {
          metric: entry.name,
          value: entry.startTime,
          variant: experiments.heroVariant
        })
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
}
```

#### Task 4.3: Create Tests
```typescript
// tests/components/homepage/DynamicHeroSection.test.tsx
import { render, screen } from '@testing-library/react'
import { DynamicHeroSection } from '@/components/homepage/DynamicHeroSection'

describe('DynamicHeroSection', () => {
  it('renders greeting based on time of day', () => {
    // Mock date to morning time
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(8)
    
    render(<DynamicHeroSection />)
    
    expect(screen.getByText(/Good morning/)).toBeInTheDocument()
    expect(screen.getByText(/filter coffee/)).toBeInTheDocument()
  })
  
  it('shows live activity data', async () => {
    render(<DynamicHeroSection />)
    
    await waitFor(() => {
      expect(screen.getByText(/Places open now/)).toBeInTheDocument()
    })
  })
})
```

## Dev Notes

### Key Files to Create/Modify
1. `/components/homepage/` - New component directory structure
2. `/components/ui/` - Shared UI components (GradientMesh, Skeleton, etc.)
3. `/hooks/` - Custom hooks for time, weather, live data
4. `/lib/features.ts` - Feature flag system
5. `/app/page.tsx` - Update to use new components with feature flags
6. `/tailwind.config.js` - Extended theme configuration
7. `/supabase/migrations/` - Journey system database schema

### Testing Approach
1. Unit tests for all new components
2. Integration tests for data flows
3. Performance testing with Lighthouse
4. A/B testing with 10% initial rollout
5. Mobile device testing on real devices
6. Accessibility audit with axe-core

### Performance Considerations
- Use dynamic imports for non-critical components
- Implement intersection observer for lazy loading
- Optimize images with next/image
- Use CSS containment for better paint performance
- Monitor bundle size with webpack-bundle-analyzer

### Debugging Tips
- Use React DevTools Profiler for performance issues
- Enable `NEXT_PUBLIC_DEBUG_ANIMATIONS=true` for animation debugging
- Check feature flags in browser console with `window.__FEATURES__`
- Use Chrome DevTools Performance tab for runtime analysis

## Example Usage After Implementation

```typescript
// Before: Static hero section
<HeroSection />

// After: Dynamic, context-aware hero
{features.dynamicHero ? (
  <DynamicHeroSection />
) : (
  <HeroSection />
)}

// Journey selection replaces generic CTAs
{features.journeySelector && (
  <JourneySelector 
    onSelect={(journey) => router.push(`/map?journey=${journey.id}`)}
  />
)}

// Amit's dashboard adds personality
{features.amitDashboard && (
  <AmitDashboard />
)}
```

## Success Metrics
- Time on page increased from 45s to 2min
- Journey selector clicks > 60% of visitors
- Map exploration rate increased from 40% to 65%
- Return visitor rate increased from 30% to 55%
- Lighthouse score > 95
- Zero accessibility violations

## Rollback Plan
```bash
# Disable features via environment variables
NEXT_PUBLIC_FEATURE_DYNAMIC_HERO=false
NEXT_PUBLIC_FEATURE_JOURNEY_SELECTOR=false
NEXT_PUBLIC_FEATURE_AMIT_DASHBOARD=false

# Database rollback if needed
npm run supabase:rollback
```

---

**Status**: In Progress  
**Assigned**: Dev Agent  
**Start Date**: 2025-08-05  
**Completion Date**: TBD  

### File List

**Created:**
- `/apps/web/components/homepage/hero/DynamicHeroSection.tsx`
- `/apps/web/components/weather/WeatherWidget.tsx`
- `/apps/web/components/ui/LiveActivity.tsx`
- `/apps/web/components/homepage/journey/JourneySelector.tsx`
- `/apps/web/components/homepage/journey/JourneyCard.tsx`
- `/apps/web/components/ui/GradientMesh.tsx`
- `/apps/web/components/ui/Skeleton.tsx`
- `/apps/web/hooks/useTimeOfDay.ts`
- `/apps/web/hooks/useLiveActivity.ts`
- `/apps/web/hooks/useAmitStatus.ts`
- `/apps/web/hooks/useWeather.ts`
- `/apps/web/lib/features.ts`
- `/apps/web/supabase/migrations/007_add_journey_system.sql`

**Modified:**
- `/apps/web/app/page.tsx` - Integrated new components with feature flags
- `/apps/web/tailwind.config.js` - Added extended theme configuration for gradients and animations
- `/apps/web/lib/supabase/types.ts` - Added Journey types and database interface
- `/apps/web/.env.local` - Added feature flags enabled
- `/apps/web/.env.local.example` - Added feature flag examples

**To Create:**
- `/apps/web/components/homepage/dashboard/AmitDashboard.tsx`
- `/apps/web/components/ui/MagneticButton.tsx`
- `/apps/web/lib/performance.ts`

### Agent Model Used
Claude Opus 4 (claude-opus-4-20250514)

### Debug Log References
- Feature flags enabled in .env.local for testing
- GradientMesh component uses canvas for smooth animated gradients
- Custom hooks manage time-based greetings and live activity data
- Journey system uses Supabase with fallback to mock data
- WeatherWidget integrates with existing weather API endpoint

### Completion Notes List
- ✓ Phase 1 (Core Visual & Layout) completed
- ✓ Phase 2 (Dynamic Content) partially completed - journey system and hooks implemented
- ✓ Feature flags enable progressive rollout
- ✓ Mobile-friendly with haptic feedback support
- ✓ Accessibility considered with proper contrast and animations
- ⚠️ Database migration needs manual application
- ⚠️ Amit's dashboard and micro-interactions still pending

### Change Log
- Added comprehensive feature flag system for safe rollout
- Created animated GradientMesh component with time/weather awareness
- Implemented custom hooks for dynamic content
- Built Journey selector system with database schema
- Integrated DynamicHeroSection with live data widgets
- Extended Tailwind config with new animations and gradients
- Fixed linting issues for better code quality

## Dev Agent Record

### Checklist
- [x] Feature flag system implemented
- [x] Database migrations created
- [x] GradientMesh component working
- [x] Typography system updated
- [x] DynamicHeroSection integrated
- [x] Custom hooks created
- [x] Journey selector functional
- [ ] Amit's dashboard complete
- [ ] Micro-interactions added
- [ ] Loading states implemented
- [ ] Performance targets met
- [ ] Tests passing
- [ ] Accessibility compliant
- [ ] A/B testing configured

### Implementation Notes

1. **Progressive Enhancement**: The redesign uses feature flags to enable gradual rollout and easy rollback if issues arise.

2. **Performance First**: Every component is designed with performance in mind, using lazy loading, skeleton screens, and optimized animations.

3. **Data-Driven Design**: The dynamic content adapts based on real data - weather, time, user behavior - making each visit unique.

4. **Personality Integration**: Amit's presence is woven throughout with his dashboard, personal picks, and contextual recommendations.

5. **Mobile Excellence**: All interactions are optimized for touch with haptic feedback and gesture support.

### Issues Encountered
TBD
