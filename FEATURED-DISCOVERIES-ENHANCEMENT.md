# Featured Discoveries Panel Enhancement - Development Specification

## Executive Summary
Transform the Featured Discoveries panel on the homepage from a basic card grid into a visually stunning, interactive showcase that matches the sophistication of other homepage components while significantly improving user engagement and content discovery.

## Current State Problems
1. **Visual Inconsistency**: Plain cards don't match the dynamic, gradient-rich design of DynamicHeroSection
2. **Limited Interactivity**: Static grid lacks engaging animations and interactions
3. **Poor Image Presentation**: Single image per place, no optimization or progressive loading
4. **Minimal Information**: Basic metadata compared to rich journey cards
5. **No Dynamic Content**: Missing auto-rotation, filtering, and real-time updates

## Implementation Requirements

### Phase 1: Core Visual Enhancement (Priority: HIGH)

#### 1.1 Dynamic Background System
**File to modify**: `apps/web/components/homepage/FeaturedPlaces.tsx`

**Implementation**:
```typescript
// Add these imports from existing components
import { GradientMesh } from '@/components/ui/GradientMesh'
import { FloatingOrbs } from '@/components/ui/FloatingOrbs'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'
import { useWeather } from '@/hooks/useWeather'

// Wrap the section with dynamic backgrounds similar to DynamicHeroSection
// Use subtle opacity (0.3-0.4) to maintain readability
// Add floating orbs with reduced density for background interest
```

#### 1.2 Enhanced Card Design
**New file**: `apps/web/components/homepage/featured/EnhancedDiscoveryCard.tsx`

**Requirements**:
- Multi-layer card with glass morphism effect
- Implement parallax on scroll using Framer Motion
- Add magnetic cursor effect on hover (copy from DynamicHeroSection button)
- Smooth scale and shadow transitions
- Show 3-4 thumbnail images at bottom of card
- Add subtle gradient overlay for text readability

#### 1.3 Animation System
**Technologies**: Framer Motion (already installed)

**Animations to implement**:
- Staggered entry animation for cards (delay: 0.1s between cards)
- Hover: scale(1.03) with shadow expansion
- Image hover: Ken Burns effect (slow zoom)
- Loading skeleton with shimmer effect
- Smooth filter transitions using AnimatePresence

### Phase 2: Rich Content & Images (Priority: HIGH)

#### 2.1 Enhanced Data Structure
**File to modify**: `apps/web/lib/types/place.ts`

```typescript
// Add to existing Place type or create extended type
interface EnhancedPlaceData {
  images: string[]           // Array of image URLs (min 3, max 6)
  blur_data_urls?: string[]  // Base64 blur placeholders
  visitor_metrics?: {
    daily_average: number
    peak_hours: string[]
    current_status: 'quiet' | 'moderate' | 'busy'
  }
  weather_suitable?: {
    sunny: boolean
    rainy: boolean
    evening: boolean
  }
  quick_tags?: string[]      // e.g., ["WiFi", "Pet-friendly", "Outdoor seating"]
  companion_places?: {
    id: string
    name: string
    distance: string
  }[]
}
```

#### 2.2 Image Gallery Component
**New file**: `apps/web/components/homepage/featured/MiniGallery.tsx`

**Requirements**:
- Display primary image large, 3 thumbnails below
- Click thumbnail to swap with primary
- Lazy load images with blur-up technique
- Use Next.js Image component with proper sizing
- Implement touch-friendly swipe on mobile

#### 2.3 Image Optimization Pipeline
**Implementation steps**:
1. Modify API endpoint `/api/places` to include multiple images
2. Generate blur placeholders on upload using `plaiceholder` library
3. Set up responsive image sizes:
   - Mobile: 400px
   - Tablet: 600px
   - Desktop: 800px
4. Use WebP with JPEG fallback

### Phase 3: Interactive Features (Priority: MEDIUM)

#### 3.1 Carousel Mode
**New file**: `apps/web/components/homepage/featured/DiscoveryCarousel.tsx`

**Requirements**:
- Auto-rotate every 8 seconds (pausable)
- Show 1 large card on mobile, 3 on desktop
- Smooth transitions using Framer Motion
- Progress indicators at bottom
- Pause on hover
- Touch/swipe support on mobile

#### 3.2 Category Filters
**New component**: Filter pills above the grid

**Categories to implement**:
- All (default)
- Restaurants
- Cafes
- Bars
- Shopping
- Activities

**Behavior**:
- Smooth fade transition between filtered states
- Update URL params for shareable filtered views
- Show count badge on each category

#### 3.3 Quick View Modal
**New file**: `apps/web/components/homepage/featured/QuickViewModal.tsx`

**Requirements**:
- Opens on card click (not on link click)
- Full image gallery
- Detailed information
- Map preview
- Direct actions (Navigate, Save, Share)
- Keyboard navigation (ESC to close, arrows for images)

### Phase 4: Smart Features (Priority: MEDIUM)

#### 4.1 Time-Aware Recommendations
**Logic to implement**:
```typescript
// Morning (6am-12pm): Show cafes and breakfast spots first
// Afternoon (12pm-5pm): Restaurants and shopping
// Evening (5pm-10pm): Bars and dinner places
// Late night (10pm+): Bars and late-night eateries
```

#### 4.2 Weather-Based Sorting
**Integration**:
- Use existing weather hook
- Prioritize indoor places during rain
- Highlight outdoor seating when sunny
- Show weather suitability badge on cards

#### 4.3 Live Activity Indicators
**New component**: Activity badge on cards

**Display**:
- Real-time visitor count (if available)
- "Trending" badge for rapidly increasing visits
- Peak/off-peak indicators
- Estimated wait times for restaurants

### Phase 5: Performance Optimizations (Priority: HIGH)

#### 5.1 Data Loading Strategy
```typescript
// Initial load: 6 places (SSR)
// Viewport-based loading for rest
// SWR for caching with 5-minute revalidation
// Optimistic UI for interactions
```

#### 5.2 Bundle Optimization
- Code split QuickViewModal (dynamic import)
- Lazy load Carousel component
- Tree shake unused Framer Motion features
- Optimize animation bundle size

#### 5.3 Image Performance
- Preload first 3 images
- Progressive JPEG for large images
- Serve from CDN with proper cache headers
- Implement intersection observer for lazy loading

## Technical Implementation Guide

### Component Structure
```
apps/web/components/homepage/featured/
├── EnhancedFeaturedDiscoveries.tsx  // Main container
├── EnhancedDiscoveryCard.tsx        // Individual card component
├── MiniGallery.tsx                  // Image gallery in card
├── DiscoveryCarousel.tsx            // Carousel view mode
├── DiscoveryFilters.tsx             // Category filter pills
├── QuickViewModal.tsx               // Detailed view modal
├── ActivityIndicator.tsx            // Live activity badge
└── hooks/
    ├── useEnhancedPlaces.ts         // Data fetching with images
    ├── useCarousel.ts               // Carousel logic
    └── useQuickView.ts              // Modal state management
```

### State Management
```typescript
// Create new Zustand store
// File: apps/web/stores/featuredDiscoveries.ts

interface FeaturedDiscoveriesStore {
  places: EnhancedPlaceData[]
  filteredPlaces: EnhancedPlaceData[]
  currentFilter: string | null
  viewMode: 'grid' | 'carousel'
  carouselIndex: number
  isAutoRotating: boolean
  quickViewPlace: EnhancedPlaceData | null
  
  // Actions
  setPlaces: (places: EnhancedPlaceData[]) => void
  setFilter: (filter: string | null) => void
  setViewMode: (mode: 'grid' | 'carousel') => void
  nextCarouselItem: () => void
  prevCarouselItem: () => void
  toggleAutoRotate: () => void
  openQuickView: (place: EnhancedPlaceData) => void
  closeQuickView: () => void
}
```

### API Modifications
```typescript
// Modify: apps/web/app/api/places/route.ts
// Add support for:
// - Multiple images per place
// - Blur placeholder data
// - Visitor metrics
// - Weather suitability flags
```

### Database Schema Updates
```sql
-- New table for additional place images
CREATE TABLE place_gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  blur_data_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indices for performance
CREATE INDEX idx_place_gallery_place_id ON place_gallery_images(place_id);
CREATE INDEX idx_place_gallery_order ON place_gallery_images(display_order);
```

## Styling Guidelines

### Design Tokens
```scss
// Use existing design system variables
--gradient-primary: from-purple-600 to-pink-600
--gradient-secondary: from-blue-500 to-purple-600
--glass-bg: rgba(255, 255, 255, 0.1)
--glass-border: rgba(255, 255, 255, 0.2)
--shadow-elevation-1: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-elevation-2: 0 10px 15px -3px rgba(0, 0, 0, 0.2)
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Responsive Breakpoints
```scss
// Mobile: 320px - 768px (1 column)
// Tablet: 768px - 1024px (2 columns)
// Desktop: 1024px+ (3 columns)
// Wide: 1440px+ (4 columns optional)
```

## Testing Requirements

### Unit Tests
- [ ] Card component renders with multiple images
- [ ] Filter functionality works correctly
- [ ] Carousel auto-rotation and manual controls
- [ ] Quick view modal open/close
- [ ] Image lazy loading triggers

### Integration Tests
- [ ] API returns enhanced place data
- [ ] Images load with proper optimization
- [ ] Filter state persists in URL
- [ ] Weather integration affects sorting

### Performance Tests
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total bundle size increase < 50KB
- [ ] Image loading doesn't block interactivity

## Success Metrics

### User Engagement
- **Click-through rate**: Increase from current to 15%+
- **Time on component**: Average 30+ seconds
- **Image interactions**: 40% users view multiple images
- **Filter usage**: 25% of users apply filters

### Performance
- **Load time**: < 2 seconds for initial render
- **Animation FPS**: Consistent 60fps
- **Image optimization**: 70% size reduction with blur-up

### Technical
- **TypeScript coverage**: 100%
- **Accessibility**: WCAG AA compliant
- **Mobile performance**: 90+ Lighthouse score

## Migration Plan

1. **Preparation** (Day 1)
   - Set up feature branch
   - Create component structure
   - Add database migrations

2. **Phase 1 Implementation** (Days 2-3)
   - Visual enhancements
   - Basic animations
   - Card redesign

3. **Phase 2 Implementation** (Days 4-5)
   - Multiple images support
   - Gallery component
   - Image optimization

4. **Phase 3 Implementation** (Days 6-7)
   - Carousel mode
   - Filters
   - Quick view modal

5. **Testing & Polish** (Day 8)
   - Performance optimization
   - Bug fixes
   - Final testing

6. **Deployment** (Day 9)
   - Gradual rollout
   - Monitor metrics
   - Gather feedback

## Code Examples

### Enhanced Card Component Structure
```tsx
// apps/web/components/homepage/featured/EnhancedDiscoveryCard.tsx

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { MiniGallery } from './MiniGallery'
import { ActivityIndicator } from './ActivityIndicator'

export function EnhancedDiscoveryCard({ place, index }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="group relative"
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl" />
      
      {/* Card content */}
      <div className="relative p-4">
        {/* Primary image with Ken Burns effect */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={place.images[0]}
            alt={place.name}
            fill
            className="object-cover transition-transform duration-[10s] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={place.blur_data_urls?.[0]}
          />
          
          {/* Activity indicator overlay */}
          <ActivityIndicator status={place.visitor_metrics?.current_status} />
        </div>
        
        {/* Content section */}
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold">{place.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
          
          {/* Mini gallery */}
          <MiniGallery images={place.images.slice(1, 4)} />
          
          {/* Quick tags */}
          <div className="flex gap-2 flex-wrap">
            {place.quick_tags?.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
```

## Final Notes

This comprehensive specification provides everything needed to transform the Featured Discoveries panel into a best-in-class component. The phased approach allows for incremental development while maintaining production stability.

**Key Success Factors**:
1. Maintain visual consistency with existing components
2. Prioritize performance from the start
3. Test thoroughly on mobile devices
4. Gather user feedback early and iterate
5. Monitor performance metrics post-deployment

**Developer Checklist**:
- [ ] Review existing codebase for reusable components
- [ ] Set up feature branch
- [ ] Implement Phase 1 (Visual)
- [ ] Implement Phase 2 (Images)
- [ ] Implement Phase 3 (Interactivity)
- [ ] Implement Phase 4 (Smart Features)
- [ ] Implement Phase 5 (Performance)
- [ ] Write tests
- [ ] Update documentation
- [ ] Deploy and monitor

This document provides the complete blueprint for enhancing the Featured Discoveries panel to match and exceed the quality of other homepage components.