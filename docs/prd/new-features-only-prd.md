# Product Requirements Document: NEW FEATURES ONLY
## Building on Existing Infrastructure - No Duplication

---

## EXECUTIVE SUMMARY

This PRD focuses EXCLUSIVELY on features that need to be built NEW. The existing codebase already has:
- ✅ Complete journey visualization and display system
- ✅ Comprehensive image service architecture
- ✅ Full community suggestion workflow
- ✅ Weather integration with recommendations
- ✅ Advanced search with NLP
- ✅ Interactive map with clustering
- ✅ Unified FAB with all interactions
- ✅ Supabase database with 300+ real places

We will BUILD ON TOP of these existing systems, not recreate them.

---

## 1. USER AUTHENTICATION & PROFILES (NEW)

### 1.1 Authentication System
**Build on**: Existing Supabase integration
**New Components Needed**:

```typescript
// New file: /lib/auth/auth-service.ts
class AuthenticationService {
  // Leverage Supabase Auth
  async signUpWithEmail(email: string, password: string) {
    // Use existing supabase client from /lib/supabase/client.ts
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: '',
          avatar_url: '/default-avatar.png',
          preferences: {}
        }
      }
    });
  }
  
  async signInWithGoogle() {
    // OAuth integration
  }
}
```

**New Database Tables Needed**:
```sql
-- Add to migrations
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  joined_at TIMESTAMP DEFAULT NOW(),
  reputation_score INTEGER DEFAULT 0,
  places_visited INTEGER[] DEFAULT '{}',
  journeys_completed INTEGER[] DEFAULT '{}'
);

CREATE TABLE user_saved_items (
  user_id UUID REFERENCES user_profiles(id),
  item_type TEXT CHECK (item_type IN ('place', 'journey', 'event')),
  item_id UUID,
  saved_at TIMESTAMP DEFAULT NOW()
);
```

**Integration Points**:
- Enhance existing `CommunitySuggestionForm.tsx` to auto-fill user info
- Update `CommunityVoting.tsx` to track user votes
- Modify `UnifiedAmitFAB.tsx` to show user-specific options when logged in

---

## 2. COMMENT SYSTEM (NEW)

### 2.1 Comments on Places
**Build on**: Existing place detail pages
**New Component**: `/components/comments/CommentThread.tsx`

```typescript
interface CommentThreadProps {
  entityType: 'place' | 'journey' | 'event';
  entityId: string;
  // Leverage existing Supabase real-time subscriptions
}

// Integrate into existing PlaceDetail component
// Add below PersonalReview component
<CommentThread 
  entityType="place" 
  entityId={place.id}
/>
```

**New Database Table**:
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES comments(id), -- for nested replies
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE
);
```

**Display Locations**:
1. **Place Cards**: Show comment count using existing PlaceCard component
   - Add `commentCount` prop to existing `PlaceCardEnhanced.tsx`
2. **Place Detail**: Full thread below existing PersonalReview
3. **Community Hub**: New tab in existing `/app/community/page.tsx`

---

## 3. USER RATING SYSTEM (NEW)

### 3.1 Enable User Ratings
**Build on**: Existing rating display in PlaceCard
**Enhance**: `/components/places/PlaceCard.tsx`

```typescript
// Add to existing PlaceCard component
const [showRatingModal, setShowRatingModal] = useState(false);

// Add click handler to existing star display
<div onClick={() => setShowRatingModal(true)}>
  {/* Existing star display code */}
</div>

// New modal component
<RatingModal 
  placeId={place.id}
  onClose={() => setShowRatingModal(false)}
  onSubmit={handleRatingSubmit}
/>
```

**New Database Table**:
```sql
CREATE TABLE user_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  place_id UUID REFERENCES places(id),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  review_text TEXT,
  visit_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, place_id) -- One rating per user per place
);
```

---

## 4. JOURNEY ENHANCEMENTS (BUILD ON EXISTING)

### 4.1 Journey Progress Tracking
**Enhance**: Existing `/components/journeys/JourneyExperienceCard.tsx`
**Add**: Progress indicator and save state

```typescript
// Add to existing journey display
interface JourneyProgress {
  journeyId: string;
  userId: string;
  stopsCompleted: string[];
  startedAt: timestamp;
  completedAt?: timestamp;
}

// Enhance existing JourneyRouteVisualization component
// Add checkpoints that can be marked complete
```

### 4.2 Journey Customization
**Enhance**: Existing journey pages
**New Component**: `/components/journeys/JourneyCustomizer.tsx`

```typescript
// Allow users to:
// - Reorder stops (drag and drop)
// - Add/remove places from journey
// - Save personalized version
// Uses existing journey data structure
```

---

## 5. ADVANCED SHARING (NEW)

### 5.1 Instagram Story Generator
**Build on**: Existing SocialShare component
**New Service**: `/lib/sharing/story-generator.ts`

```typescript
class StoryGenerator {
  async generateInstagramStory(entity: Place | Journey) {
    // Use Canvas API to create story-formatted images
    // 1080x1920 resolution
    // Include existing place images
    // Add overlays and stickers
  }
}
```

### 5.2 QR Codes for Places
**Enhance**: Existing place detail pages
**New Component**: `/components/sharing/QRCodeGenerator.tsx`

```typescript
// Add QR code option to existing share menu
// Generate QR that links to place URL
// Allow download as image
```

---

## 6. CALL & DIRECTIONS FUNCTIONALITY (NEW)

### 6.1 Call Button Implementation
**Enhance**: Existing place detail pages
**Update**: `/components/places/PlaceDetail.tsx`

```typescript
// Add to existing quick actions bar
const handleCall = (phoneNumber: string) => {
  if (typeof window !== 'undefined') {
    // Mobile: Direct dial
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // Desktop: Copy number and show toast
      navigator.clipboard.writeText(phoneNumber);
      showToast(`Phone number copied: ${phoneNumber}`);
    }
  }
};
```

### 6.2 Directions Integration
**Enhance**: Existing map functionality
**Update**: Quick actions in place cards

```typescript
const handleDirections = (place: Place) => {
  const destination = `${place.coordinates.lat},${place.coordinates.lng}`;
  
  // Check if user location available
  if (userLocation) {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    window.open(
      `https://www.google.com/maps/dir/${origin}/${destination}`,
      '_blank'
    );
  } else {
    // Just open place in Google Maps
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${destination}`,
      '_blank'
    );
  }
};
```

---

## 7. COMPANION ACTIVITIES CALCULATION (NEW)

### 7.1 Smart Companion Suggestions
**Build on**: Existing companion_activities database table
**New Service**: `/lib/companions/companion-engine.ts`

```typescript
class CompanionEngine {
  async calculateCompanions(placeId: string, context: UserContext) {
    // Get place from existing database
    const place = await getPlace(placeId);
    
    // Find nearby places using existing coordinates
    const nearby = await getNearbyPlaces(place.coordinates, 500); // 500m radius
    
    // Score based on:
    // - Distance (use existing coordinate data)
    // - Category compatibility
    // - Time of day
    // - User preferences
    
    return rankedCompanions;
  }
}
```

**Display**: Enhance existing `/components/places/CompanionActivityCard.tsx`
- Add "Perfect timing" indicator
- Show walking distance
- Add to journey button

---

## 8. REAL-TIME WEATHER FEATURES (ENHANCE EXISTING)

### 8.1 Weather-Based Journey Adjustments
**Enhance**: Existing WeatherWidget and Journey components
**Update**: `/components/weather/WeatherRecommendations.tsx`

```typescript
// Add to existing weather recommendations
const adjustJourneyForWeather = (journey: Journey, weather: Weather) => {
  if (weather.condition === 'rainy') {
    // Filter stops to indoor places only
    // Use existing place amenities data
    return journey.stops.filter(stop => 
      stop.place.amenities.includes('indoor') || 
      stop.place.amenities.includes('covered')
    );
  }
  // Return original journey for good weather
  return journey.stops;
};
```

### 8.2 Best Time Calculator
**New Utility**: `/lib/weather/best-time-calculator.ts`

```typescript
// Use existing weather data and place info
const calculateBestTime = async (placeId: string) => {
  const place = await getPlace(placeId); // Existing function
  const weather = await getWeatherForecast(); // Existing function
  
  // Calculate based on:
  // - Indoor/outdoor (from existing place data)
  // - Crowd patterns (new data point to add)
  // - Weather forecast
  
  return bestTimes;
};
```

---

## 9. ANALYTICS & INSIGHTS (NEW)

### 9.1 User Behavior Tracking
**Build on**: Existing analytics dashboard
**New Tables**:

```sql
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE place_analytics (
  place_id UUID REFERENCES places(id),
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  direction_clicks INTEGER DEFAULT 0,
  call_clicks INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Integration**: Add tracking to existing components:
- PlaceCard click tracking
- Journey completion tracking
- Search query logging

---

## 10. ADMIN TOOLS (NEW)

### 10.1 Journey Builder Interface
**New Page**: `/app/admin/journey-builder/page.tsx`
**Purpose**: Create and edit journeys using existing journey structure

```typescript
// Drag and drop interface
// Uses existing places from database
// Saves to existing journey tables
// Preview using existing JourneyRouteVisualization
```

### 10.2 Bulk Place Editor
**New Page**: `/app/admin/places/bulk-edit/page.tsx`
**Purpose**: Edit multiple places at once

```typescript
// Table view of all places
// Inline editing
// Bulk actions (category change, etc.)
// Uses existing place data structure
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core User Features (Week 1-2)
1. User Authentication (leverages Supabase Auth)
2. Comment System (adds to existing place pages)
3. User Ratings (enhances existing rating display)
4. Call & Directions (simple additions to existing components)

### Phase 2: Enhanced Interactions (Week 3-4)
1. Journey Progress Tracking
2. Companion Activity Engine
3. Weather-Based Adjustments
4. Best Time Calculator

### Phase 3: Social & Sharing (Week 5)
1. Instagram Story Generator
2. QR Code Generation
3. Enhanced Sharing Options

### Phase 4: Analytics & Admin (Week 6)
1. Analytics Dashboard
2. Admin Journey Builder
3. Bulk Editing Tools

---

## TECHNICAL NOTES

### Use Existing Infrastructure:
- **Database**: Continue using Supabase PostgreSQL
- **Auth**: Supabase Auth (already configured)
- **Storage**: Supabase Storage (already set up)
- **Real-time**: Supabase subscriptions (already implemented)
- **Maps**: Leaflet.js (already integrated)
- **Search**: Existing NLP search engine
- **Weather**: Existing multi-provider setup

### DO NOT Rebuild:
- ❌ Map component (InteractiveMap.tsx is complete)
- ❌ Search system (comprehensive NLP search exists)
- ❌ Image service (multi-provider system works)
- ❌ Weather integration (fully functional)
- ❌ FAB system (UnifiedAmitFAB is feature-complete)
- ❌ Place cards (PlaceCardEnhanced has everything)
- ❌ Journey visualization (complete implementation exists)

### API Endpoints to Add:
```typescript
// New endpoints only
POST   /api/comments
GET    /api/comments/[entityType]/[entityId]
POST   /api/ratings
GET    /api/ratings/[placeId]
POST   /api/journey-progress
GET    /api/companions/[placeId]
GET    /api/best-time/[placeId]
POST   /api/analytics/track
```

---

## SUCCESS METRICS

### New Feature Adoption:
- User registration rate > 30% of visitors
- Comment engagement > 5% of place views
- Rating submission > 10% of authenticated users
- Journey completion tracking > 50% of journey starts

### Performance Targets (Maintain Existing):
- Page load < 3s (already achieved)
- API response < 200ms (existing performance)
- Zero increase in bundle size for existing pages

---

## CONCLUSION

This PRD focuses on **NEW features only** that enhance the existing, robust platform. Every new feature builds upon and integrates with the current codebase without duplicating any existing functionality. The existing architecture is sophisticated and complete - we're adding the final layers of user interaction and personalization on top of a solid foundation.