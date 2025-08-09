# Journey Routes Feature - Developer Documentation

## 🎯 Feature Overview

The **Journey Routes** feature is a core differentiator of the Indiranagar Discovery Platform. It transforms individual place visits into curated, multi-stop experiences with visual route connections, optimal timing, and personalized recommendations. Think of it as turning a list of places into a story-driven adventure with walking paths, timing suggestions, and mood-based categorization.

## 🏗️ Architecture & Data Model

### Core Database Tables

#### 1. `journeys` (Base Table)
```sql
- id: UUID (Primary Key)
- title: Text (Display name)
- description: Text
- gradient: Text (Visual theme)
- icon: Text
- estimated_time: Text
- vibe_tags: Text[] (Categories like 'foodie', 'explorer')
- created_at/updated_at: Timestamps
```

#### 2. `journey_places` (Junction Table)
```sql
- journey_id: UUID (FK to journeys)
- place_id: UUID (FK to places)
- order_index: Integer (Stop sequence)
- notes: Text (Context for this stop)
```

#### 3. Extended Tables (Advanced Features)
- `journey_experiences`: Rich narrative content
- `journey_stops`: Detailed stop information with activities
- `walking_directions`: Turn-by-turn navigation
- `photo_opportunities`: Instagram-worthy spots
- `journey_reviews`: User feedback and ratings

### Type Definitions

Key types in `/lib/types/journey.ts`:

```typescript
interface JourneyExperience {
  id: string
  name: string
  description: string
  mood_category: 'contemplative' | 'energetic' | 'social' | 'cultural' | 'culinary'
  duration_minutes: number
  difficulty_level: 'easy' | 'moderate' | 'challenging'
  weather_suitability: WeatherCondition[]
  optimal_times: TimeWindow[]
  journey_stops: JourneyStop[]
  alternatives: JourneyAlternative[]
}

interface JourneyStop {
  place_id: string
  order: number
  duration_minutes: number
  activities: EnhancedCompanionActivity[]
  walking_directions: WalkingDirection
  photo_opportunities: PhotoOpportunity[]
}

interface WalkingDirection {
  from_coordinates: LatLng
  to_coordinates: LatLng
  path: LatLng[]
  distance_meters: number
  estimated_minutes: number
  landmarks: string[]
}
```

## 📍 Integration Points

### 1. Map Visualization (`/components/map/JourneyRouteVisualization.tsx`)
- **Purpose**: Renders journey paths on interactive map
- **Features**:
  - Polyline routes connecting places in sequence
  - Different colors/styles for difficulty levels
  - Hover interactions showing journey details
  - Click-to-start journey functionality
- **Usage**: Embedded in main map view when journey mode is active

### 2. Journey Pages (`/app/journeys/`)
- **List View** (`page.tsx`): Browse all available journeys
- **Detail View** (`[slug]/page.tsx`): Individual journey with stops
- **Features**:
  - Mood-based filtering
  - Duration/difficulty categorization
  - Weather-aware recommendations

### 3. Homepage Integration
- **Journey Selector** (`/components/homepage/journey/JourneySelector.tsx`)
  - Quick access to popular journeys
  - Visual cards with gradients and icons
  - Links to full journey experience

### 4. API Routes (`/app/api/journeys/`)
- **GET `/api/journeys`**: List all journeys with filters
- **GET `/api/journeys/[slug]`**: Single journey with all stops
- **POST `/api/admin/journeys`**: Admin journey creation

## 🎨 User Experience Flow

### 1. Discovery Phase
```
User lands on homepage → 
Sees featured journeys → 
Clicks "Explore Journeys" or specific journey card
```

### 2. Selection Phase
```
Browse journeys by mood/difficulty → 
View journey preview on map → 
See estimated time and stops
```

### 3. Navigation Phase
```
Start journey → 
Follow stop-by-stop instructions → 
Get walking directions between stops → 
Complete activities at each location
```

### 4. Completion Phase
```
Mark stops as completed → 
Leave review/rating → 
Share journey experience
```

## 🚀 Expected Functionality

### Core Features (Currently Implemented)
1. **Journey Definition**: Admin can create multi-stop experiences
2. **Map Visualization**: Visual routes connecting places
3. **Basic Navigation**: Ordered stop progression
4. **Mood Categorization**: Filter by journey type

### Advanced Features (Partially Implemented)
1. **Turn-by-turn Directions**: Walking guidance between stops
2. **Weather Integration**: Alternative routes for rain/heat
3. **Time Optimization**: Best times to start each journey
4. **Photo Opportunities**: Marked Instagram spots
5. **Companion Activities**: Before/after suggestions

### Planned Enhancements
1. **User Progress Tracking**: Save journey state
2. **Social Sharing**: Journey completion badges
3. **Custom Journey Builder**: User-created routes
4. **Offline Mode**: Download journey for offline use
5. **Voice Navigation**: Hands-free guidance

## 👨‍💻 Developer Implementation Guide

### Creating a New Journey

```typescript
// 1. Define journey in database
const journey = {
  title: "Coffee Culture Crawl",
  description: "Best coffee spots in order",
  gradient: "from-amber-500 to-orange-600",
  icon: "coffee",
  estimated_time: "3 hours",
  vibe_tags: ['foodie', 'casual', 'morning']
}

// 2. Add journey stops
const stops = [
  { place_id: 'place-1', order_index: 1, notes: 'Best flat white' },
  { place_id: 'place-2', order_index: 2, notes: 'Try the croissants' },
  { place_id: 'place-3', order_index: 3, notes: 'Rooftop views' }
]

// 3. Configure route visualization
const routeConfig = {
  color: '#8B4513', // Coffee brown
  difficulty_level: 'easy',
  weather_dependency: false
}
```

### Integrating Journey Routes in Your Component

```tsx
import { JourneyRouteVisualization } from '@/components/map/JourneyRouteVisualization'
import { useJourneys } from '@/hooks/useJourneys'

function YourComponent() {
  const { journeys, loading } = useJourneys()
  
  return (
    <Map>
      {journeys.map(journey => (
        <JourneyRouteVisualization
          key={journey.id}
          journey={journey}
          onRouteClick={(j) => navigateToJourney(j)}
        />
      ))}
    </Map>
  )
}
```

### Adding Weather-Aware Alternatives

```typescript
const weatherAlternatives = {
  rainy: {
    avoid: ['open-air-market', 'rooftop-cafe'],
    prefer: ['covered-arcade', 'indoor-mall']
  },
  hot: {
    avoid: ['noon-walking-tour'],
    prefer: ['evening-stroll', 'air-conditioned-venues']
  }
}
```

## 🎯 User Benefits

### For Explorers
- **Structured Discovery**: No more wandering aimlessly
- **Time Optimization**: Know exactly how long experiences take
- **Mood Matching**: Find journeys that fit current vibe
- **Local Insights**: Benefit from curator's knowledge

### For Content Creators
- **Photo Opportunities**: Pre-marked Instagram spots
- **Story Templates**: Ready-made narrative structure
- **Timing Guidance**: Best light/crowd conditions

### For Groups
- **Shared Experiences**: Everyone follows same route
- **Flexible Pacing**: Optional stops for different interests
- **Meeting Points**: Clear locations for regrouping

## 🔧 Troubleshooting Common Issues

### Routes Not Displaying on Map
- Check if journey has valid place connections
- Verify coordinates are within Indiranagar bounds
- Ensure Leaflet polyline component is imported

### Journey Stops Out of Order
- Verify `order_index` in `journey_places` table
- Check sorting logic in component

### Walking Directions Missing
- Ensure Google Maps API key is configured
- Check if coordinates are properly formatted
- Verify network requests to directions API

## 📊 Analytics & Metrics

Track journey engagement with:
- **Start Rate**: How many users begin journeys
- **Completion Rate**: Full journey completions
- **Drop-off Points**: Where users abandon journeys
- **Popular Routes**: Most-selected journeys
- **Time Patterns**: When journeys are started

## 🚦 Next Steps for Developers

1. **Immediate Priorities**:
   - Complete walking directions integration
   - Add progress tracking functionality
   - Implement journey sharing features

2. **Enhancement Opportunities**:
   - AR navigation overlay
   - Group journey coordination
   - Gamification elements
   - Seasonal journey variations

3. **Performance Optimizations**:
   - Cache journey routes
   - Optimize polyline rendering
   - Lazy load journey details

## 📚 Related Documentation

- Epic 2 PRD: `/docs/prd/epic-2-place-discovery-journey-experiences.md`
- Map Component Guide: `/docs/architecture/map-integration.md`
- API Documentation: `/docs/api/journeys-api.md`
- Database Schema: `/supabase/migrations/`

---

*This documentation represents the Journey Routes feature as of the current implementation. The feature is actively being enhanced with additional capabilities based on user feedback and platform evolution.*