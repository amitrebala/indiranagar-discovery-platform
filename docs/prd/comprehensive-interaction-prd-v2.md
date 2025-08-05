# Product Requirements Document: Indiranagar Discovery Platform V2
## Deep Technical & Data Architecture Specification

---

## PART A: JOURNEY SYSTEM - COMPLETE DATA ARCHITECTURE

### A.1 Journey Data Model

#### Core Journey Entity
```typescript
Journey {
  id: uuid (auto-generated)
  slug: string (URL-friendly, generated from name)
  name: string (60 char max)
  tagline: string (120 char max)
  description: text (rich text, 500 words max)
  
  // Metadata
  created_by: "amit" | "community" | "ai_suggested"
  created_at: timestamp
  updated_at: timestamp
  version: integer (for tracking edits)
  
  // Core Properties
  duration_minutes: integer (calculated from stops)
  actual_duration_variance: integer (±15 mins typical)
  total_distance_km: float (calculated via Google Maps API)
  difficulty_level: enum ["easy", "moderate", "challenging"]
  accessibility_score: integer (0-100)
  
  // Categorization
  mood_categories: array ["contemplative", "energetic", "social", "romantic", "family", "solo"]
  primary_category: string (most relevant mood)
  tags: array (searchable keywords)
  
  // Timing Data
  optimal_times: array [{
    day_of_week: array ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    start_time: time (24hr format)
    end_time: time
    reason: string (why this time is optimal)
    crowd_level: enum ["quiet", "moderate", "busy"]
  }]
  
  // Weather Suitability
  weather_suitability: {
    ideal_conditions: array ["sunny", "cloudy", "cool"]
    acceptable_conditions: array ["light_rain", "overcast"]
    avoid_conditions: array ["heavy_rain", "extreme_heat"]
    seasonal_notes: {
      summer: string
      monsoon: string
      winter: string
    }
  }
  
  // Cost Estimation
  estimated_cost: {
    min: integer (INR)
    max: integer (INR)
    breakdown: array [{
      category: string ("food", "activities", "transport")
      amount_range: string ("₹200-400")
    }]
  }
  
  // Images
  hero_image: {
    url: string (Cloudinary URL)
    alt_text: string
    credit: string
    focal_point: {x: float, y: float} (for smart cropping)
  }
  gallery_images: array (max 10)
  
  // Analytics
  view_count: integer
  completion_count: integer
  save_count: integer
  share_count: integer
  average_rating: float
  rating_count: integer
}
```

#### Journey Stop Data Model
```typescript
JourneyStop {
  id: uuid
  journey_id: uuid (foreign key)
  order_index: integer (position in journey)
  
  // Place Information
  place_id: uuid (links to places table)
  arrival_time_offset: integer (minutes from start)
  recommended_duration: integer (minutes to spend)
  
  // Stop Details
  stop_type: enum ["must_visit", "optional", "photo_op", "refreshment", "activity"]
  description: text (what to do here)
  insider_tips: array [string] (Amit's personal tips)
  
  // Timing
  best_time_at_stop: string ("Morning coffee", "Sunset views")
  skip_if: string ("Raining", "Too crowded")
  
  // Activities at Stop
  activities: array [{
    name: string
    duration: integer
    cost: integer
    booking_required: boolean
    booking_link: string
  }]
  
  // Navigation
  walking_time_from_previous: integer (minutes)
  transport_options: array [{
    type: "walk" | "auto" | "bike"
    duration: integer
    cost: integer
    instructions: string
  }]
  
  // Alternatives
  alternative_stops: array [place_id] (if this is closed/busy)
  alternative_reason: string
}
```

### A.2 Journey Data Sources & Population

#### Data Collection Strategy

1. **Amit's Curated Content** (Primary Source)
   - Manual entry through admin panel
   - Based on personal experience
   - Updated weekly with new discoveries
   - Includes seasonal variations

2. **Community Contributions** (Secondary)
   - User-submitted journey variations
   - Requires approval workflow
   - Community voting for quality
   - Attribution to contributor

3. **AI-Generated Suggestions** (Tertiary)
   ```javascript
   // AI Journey Generation Pipeline
   async function generateJourneyVariation(baseJourney, userPreferences) {
     // 1. Analyze user preferences
     const preferences = {
       avoidCrowds: userPreferences.crowdTolerance < 3,
       dietaryRestrictions: userPreferences.dietary,
       mobilityNeeds: userPreferences.accessibility,
       budget: userPreferences.budgetRange
     };
     
     // 2. Fetch alternative places
     const alternatives = await fetchAlternatives(
       baseJourney.stops,
       preferences
     );
     
     // 3. Optimize route
     const optimizedRoute = await optimizeRoute(alternatives, {
       startPoint: userPreferences.location,
       maxDistance: preferences.mobilityNeeds ? 2 : 5, // km
       algorithm: 'traveling_salesman_variant'
     });
     
     // 4. Calculate timings
     const timings = calculateOptimalTimings(optimizedRoute, {
       paceMultiplier: preferences.mobilityNeeds ? 1.5 : 1.0,
       includeRestStops: preferences.avoidCrowds
     });
     
     return {
       ...baseJourney,
       variant_id: generateVariantId(),
       customized_for: userPreferences.userId,
       stops: optimizedRoute,
       timings: timings
     };
   }
   ```

### A.3 Distance & Duration Calculations

#### Real-time Distance Calculation
```javascript
// Distance Calculation Service
class DistanceCalculator {
  constructor() {
    this.googleMapsClient = new GoogleMapsClient(process.env.GOOGLE_MAPS_API_KEY);
    this.cache = new Map(); // Cache for 24 hours
  }
  
  async calculateJourneyDistance(stops) {
    const cacheKey = stops.map(s => s.place_id).join('-');
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    let totalDistance = 0;
    let totalDuration = 0;
    const segments = [];
    
    for (let i = 0; i < stops.length - 1; i++) {
      const origin = stops[i];
      const destination = stops[i + 1];
      
      // Get walking directions by default
      const result = await this.googleMapsClient.directions({
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: 'walking',
        alternatives: true
      });
      
      // Choose the most scenic route if available
      const route = this.selectBestRoute(result.routes);
      
      segments.push({
        from: origin.place_id,
        to: destination.place_id,
        distance_meters: route.distance.value,
        duration_seconds: route.duration.value,
        polyline: route.overview_polyline,
        steps: route.legs[0].steps.map(step => ({
          instruction: step.html_instructions,
          distance: step.distance.text,
          duration: step.duration.text
        }))
      });
      
      totalDistance += route.distance.value;
      totalDuration += route.duration.value;
    }
    
    const result = {
      total_distance_km: (totalDistance / 1000).toFixed(2),
      total_walking_time_min: Math.ceil(totalDuration / 60),
      segments: segments,
      calculated_at: new Date().toISOString()
    };
    
    this.cache.set(cacheKey, result);
    return result;
  }
  
  selectBestRoute(routes) {
    // Prefer routes through parks, avoid main roads
    return routes.reduce((best, route) => {
      const score = this.calculateRouteScore(route);
      return score > best.score ? {route, score} : best;
    }, {route: routes[0], score: 0}).route;
  }
  
  calculateRouteScore(route) {
    let score = 100;
    const avoidKeywords = ['highway', 'main road', 'flyover'];
    const preferKeywords = ['park', 'garden', 'lane', 'street'];
    
    route.legs[0].steps.forEach(step => {
      avoidKeywords.forEach(keyword => {
        if (step.html_instructions.toLowerCase().includes(keyword)) {
          score -= 10;
        }
      });
      preferKeywords.forEach(keyword => {
        if (step.html_instructions.toLowerCase().includes(keyword)) {
          score += 5;
        }
      });
    });
    
    return score;
  }
}
```

### A.4 Journey Save & Customization

#### Save Journey Flow
```javascript
// When user clicks "Save Journey"
async function handleSaveJourney(journeyId, userId) {
  // 1. Check if user is authenticated
  if (!userId) {
    // Save to localStorage for anonymous users
    const saved = localStorage.getItem('saved_journeys') || '[]';
    const journeys = JSON.parse(saved);
    
    if (!journeys.includes(journeyId)) {
      journeys.push(journeyId);
      localStorage.setItem('saved_journeys', JSON.stringify(journeys));
      
      // Show success animation
      showToast('Journey saved! Create an account to sync across devices.');
    }
    return;
  }
  
  // 2. Save to database for authenticated users
  try {
    await supabase.from('user_saved_journeys').insert({
      user_id: userId,
      journey_id: journeyId,
      saved_at: new Date().toISOString(),
      customizations: {
        notes: '',
        planned_date: null,
        companions: [],
        budget_override: null
      }
    });
    
    // 3. Update journey save count
    await supabase.rpc('increment_journey_saves', { journey_id: journeyId });
    
    // 4. Show success with customization prompt
    showCustomizationModal(journeyId, {
      title: 'Journey Saved!',
      subtitle: 'Want to customize it for your trip?',
      options: [
        'Add trip date',
        'Set budget',
        'Add companions',
        'Make notes'
      ]
    });
    
  } catch (error) {
    showToast('Failed to save journey. Please try again.', 'error');
  }
}

// Journey Customization
async function customizeJourney(journeyId, customizations) {
  const { date, companions, budget, dietary, pace } = customizations;
  
  // 1. Adjust timing based on date
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // 2. Fetch base journey
  const journey = await fetchJourney(journeyId);
  
  // 3. Apply customizations
  const customized = {
    ...journey,
    customizations: {
      planned_date: date,
      companion_count: companions.length,
      companion_types: companions, // ["family", "friends", "kids"]
      budget_per_person: budget,
      
      // Adjust stops based on companions
      stops: journey.stops.map(stop => {
        // Skip bars if kids are included
        if (companions.includes('kids') && stop.place.category === 'bar') {
          return {
            ...stop,
            skip: true,
            skip_reason: 'Not suitable for children',
            alternative: stop.alternative_stops[0]
          };
        }
        
        // Add more time for elderly companions
        if (companions.includes('elderly')) {
          return {
            ...stop,
            recommended_duration: stop.recommended_duration * 1.3,
            walking_time_from_previous: stop.walking_time_from_previous * 1.5
          };
        }
        
        return stop;
      }).filter(stop => !stop.skip),
      
      // Calculate new totals
      estimated_duration: calculateCustomDuration(journey.stops, pace),
      estimated_cost: calculateCustomCost(journey.stops, budget, companions.length)
    }
  };
  
  // 4. Save customization
  await saveCustomizedJourney(userId, customized);
  
  // 5. Generate calendar event
  if (date) {
    generateCalendarEvent(customized);
  }
  
  return customized;
}
```

---

## PART B: IMAGE SYSTEM - COMPLETE ARCHITECTURE

### B.1 Image Data Model & Storage

#### Image Entity Structure
```typescript
PlaceImage {
  id: uuid
  place_id: uuid (foreign key)
  
  // Source Information
  source: enum ["amit_photo", "unsplash", "google_places", "user_upload", "instagram"]
  source_id: string (external ID if applicable)
  photographer: string
  photographer_url: string (for attribution)
  
  // Image Variants (Cloudinary transformations)
  variants: {
    original: {
      url: string
      width: integer
      height: integer
      size_kb: integer
    },
    desktop_hero: { // 1920x1080, webp, q:auto
      url: string
      blurhash: string // for placeholder
    },
    desktop_card: { // 400x300, webp, q:auto
      url: string
      blurhash: string
    },
    mobile_hero: { // 768x432, webp, q:auto:low
      url: string
      blurhash: string
    },
    mobile_card: { // 200x150, webp, q:auto:low
      url: string
      blurhash: string
    },
    thumbnail: { // 100x100, webp, q:auto:low
      url: string
      blurhash: string
    },
    social_share: { // 1200x630, jpg, q:90
      url: string
      with_overlay: boolean
    }
  },
  
  // Metadata
  alt_text: string (for accessibility)
  caption: string
  
  // Contextual Data
  time_of_day: enum ["morning", "afternoon", "evening", "night"]
  weather_condition: enum ["sunny", "cloudy", "rainy", "night"]
  season: enum ["summer", "monsoon", "winter"]
  
  // Display Properties
  is_hero: boolean
  display_order: integer
  categories: array ["interior", "exterior", "food", "ambiance", "people"]
  
  // Quality Metrics
  quality_score: float (0-1, based on resolution, composition)
  engagement_score: float (based on views, likes)
  
  // Temporal
  taken_at: timestamp
  uploaded_at: timestamp
  last_displayed: timestamp
}
```

### B.2 Image Fetching Strategy

#### Multi-Source Image Pipeline
```javascript
class ImageFetchingService {
  constructor() {
    this.sources = {
      database: new DatabaseImageSource(),
      unsplash: new UnsplashImageSource(process.env.UNSPLASH_ACCESS_KEY),
      googlePlaces: new GooglePlacesImageSource(process.env.GOOGLE_PLACES_KEY),
      fallback: new FallbackImageSource()
    };
  }
  
  async fetchPlaceImages(placeId, context = {}) {
    const { deviceType, timeOfDay, weather, count = 5 } = context;
    
    // 1. Try database first (Amit's photos)
    let images = await this.sources.database.fetch(placeId, {
      limit: count,
      filters: {
        time_of_day: this.matchTimeOfDay(timeOfDay),
        weather_condition: this.matchWeather(weather)
      }
    });
    
    // 2. If insufficient, fetch from Unsplash
    if (images.length < count) {
      const unsplashImages = await this.fetchFromUnsplash(placeId, {
        needed: count - images.length,
        context: { timeOfDay, weather }
      });
      images = [...images, ...unsplashImages];
    }
    
    // 3. Google Places as backup
    if (images.length < count) {
      const googleImages = await this.fetchFromGooglePlaces(placeId, {
        needed: count - images.length
      });
      images = [...images, ...googleImages];
    }
    
    // 4. Apply device-specific transformations
    images = await this.optimizeForDevice(images, deviceType);
    
    // 5. Sort by relevance
    images = this.sortByRelevance(images, context);
    
    return images;
  }
  
  async fetchFromUnsplash(placeId, options) {
    const place = await getPlace(placeId);
    const { needed, context } = options;
    
    // Build contextual search query
    const searchQuery = this.buildSearchQuery(place, context);
    
    try {
      const response = await this.sources.unsplash.search({
        query: searchQuery,
        per_page: needed,
        orientation: 'landscape',
        content_filter: 'high'
      });
      
      // Transform Unsplash response to our format
      return response.results.map(photo => ({
        source: 'unsplash',
        source_id: photo.id,
        photographer: photo.user.name,
        photographer_url: photo.user.links.html,
        variants: this.generateVariants(photo.urls),
        alt_text: photo.alt_description || `Photo of ${place.name}`,
        quality_score: this.calculateQualityScore(photo),
        engagement_score: photo.likes / 1000
      }));
    } catch (error) {
      console.error('Unsplash fetch failed:', error);
      return [];
    }
  }
  
  buildSearchQuery(place, context) {
    const queries = [];
    
    // Base query
    queries.push(place.name);
    queries.push(place.category);
    
    // Contextual modifiers
    if (context.timeOfDay === 'evening') {
      queries.push('sunset', 'golden hour');
    } else if (context.timeOfDay === 'night') {
      queries.push('night', 'lights', 'neon');
    }
    
    if (context.weather === 'rainy') {
      queries.push('monsoon', 'rain', 'wet streets');
    }
    
    // Location context
    queries.push('Bangalore', 'Indiranagar');
    
    return queries.join(' ');
  }
  
  optimizeForDevice(images, deviceType) {
    return images.map(image => {
      const variant = this.selectVariant(image.variants, deviceType);
      
      return {
        ...image,
        selected_variant: variant,
        loading: deviceType === 'mobile' ? 'lazy' : 'eager',
        priority: image.is_hero ? 'high' : 'low',
        srcset: this.generateSrcSet(image.variants, deviceType)
      };
    });
  }
  
  selectVariant(variants, deviceType) {
    const mapping = {
      'mobile': 'mobile_card',
      'tablet': 'desktop_card',
      'desktop': 'desktop_hero',
      'desktop_4k': 'original'
    };
    
    return variants[mapping[deviceType]] || variants.desktop_card;
  }
}
```

### B.3 Time & Weather-Based Image Selection

```javascript
// Intelligent Image Selection
class ContextAwareImageSelector {
  selectImages(availableImages, context) {
    const { currentTime, currentWeather, userMood, season } = context;
    
    // Score each image based on context
    const scoredImages = availableImages.map(image => {
      let score = 0;
      
      // Time matching (highest weight)
      if (this.timeMatches(image.time_of_day, currentTime)) {
        score += 40;
      }
      
      // Weather matching
      if (image.weather_condition === currentWeather) {
        score += 30;
      }
      
      // Season matching
      if (image.season === season) {
        score += 20;
      }
      
      // Quality bonus
      score += image.quality_score * 10;
      
      // Engagement bonus
      score += image.engagement_score * 5;
      
      // Mood matching
      if (this.moodMatches(image.categories, userMood)) {
        score += 15;
      }
      
      return { ...image, contextScore: score };
    });
    
    // Sort by score and return top matches
    return scoredImages
      .sort((a, b) => b.contextScore - a.contextScore)
      .slice(0, 5);
  }
  
  timeMatches(imageTime, currentTime) {
    const hour = new Date(currentTime).getHours();
    
    const timeMapping = {
      'morning': [5, 11],
      'afternoon': [11, 16],
      'evening': [16, 20],
      'night': [20, 5]
    };
    
    const [start, end] = timeMapping[imageTime] || [0, 24];
    
    if (start > end) { // Night case
      return hour >= start || hour < end;
    }
    
    return hour >= start && hour < end;
  }
}
```

---

## PART C: COMPANION ACTIVITIES - DEEP DIVE

### C.1 Companion Activity Data Model

```typescript
CompanionActivity {
  id: uuid
  place_id: uuid (main place)
  companion_place_id: uuid (suggested companion)
  
  // Relationship Type
  relationship_type: enum [
    "before_meal",     // Coffee before lunch
    "after_meal",      // Dessert after dinner
    "pre_activity",    // Fuel before shopping
    "post_activity",   // Relax after workout
    "alternative",     // If main place is full
    "complement"       // Goes well together
  ]
  
  // Timing Data
  optimal_sequence: enum ["before", "after", "either"]
  time_gap_minutes: {
    min: integer,
    max: integer,
    ideal: integer
  }
  
  // Distance Calculation
  walking_distance_meters: integer
  walking_time_minutes: integer
  route_polyline: string (encoded polyline)
  
  // Contextual Suitability
  weather_transition: {
    from_indoor_to_outdoor: boolean,
    shelter_available: boolean
  }
  
  // Scoring Factors
  compatibility_score: float (0-1)
  popularity_score: float (based on actual user behavior)
  amit_endorsed: boolean
  
  // Reasons & Tips
  reason: string ("Perfect dessert spot after dinner")
  insider_tip: string ("Ask for the secret menu")
  best_for: array ["date", "family", "friends", "solo"]
  
  // Restrictions
  time_restrictions: {
    valid_days: array,
    valid_hours: {start: time, end: time},
    seasonal: boolean
  }
}
```

### C.2 Companion Activity Calculation Engine

```javascript
class CompanionActivityEngine {
  constructor() {
    this.maxWalkingDistance = 500; // meters
    this.maxTimeBetween = 30; // minutes
  }
  
  async calculateCompanions(placeId, context = {}) {
    const place = await getPlace(placeId);
    const { userLocation, timeOfDay, groupSize, preferences } = context;
    
    // 1. Get nearby places
    const nearbyPlaces = await this.getNearbyPlaces(place, this.maxWalkingDistance);
    
    // 2. Score each potential companion
    const companions = await Promise.all(
      nearbyPlaces.map(async (candidate) => {
        const score = await this.scoreCompanion(place, candidate, context);
        return { ...candidate, score };
      })
    );
    
    // 3. Filter and sort
    return companions
      .filter(c => c.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(companion => this.enrichCompanion(place, companion, context));
  }
  
  async scoreCompanion(mainPlace, companion, context) {
    let score = 0;
    const weights = {
      distance: 0.3,
      category: 0.25,
      timing: 0.2,
      popularity: 0.15,
      weather: 0.1
    };
    
    // Distance scoring (closer is better)
    const distance = await this.calculateWalkingDistance(mainPlace, companion);
    score += weights.distance * (1 - (distance / this.maxWalkingDistance));
    
    // Category compatibility
    const categoryScore = this.getCategoryCompatibility(
      mainPlace.category,
      companion.category
    );
    score += weights.category * categoryScore;
    
    // Timing compatibility
    const timingScore = this.getTimingCompatibility(
      mainPlace,
      companion,
      context.timeOfDay
    );
    score += weights.timing * timingScore;
    
    // Popularity pairing (based on historical data)
    const popularityScore = await this.getPopularityScore(
      mainPlace.id,
      companion.id
    );
    score += weights.popularity * popularityScore;
    
    // Weather transition scoring
    const weatherScore = this.getWeatherTransitionScore(
      mainPlace,
      companion,
      context.weather
    );
    score += weights.weather * weatherScore;
    
    return Math.min(score, 1);
  }
  
  getCategoryCompatibility(main, companion) {
    const compatibilityMatrix = {
      'restaurant': {
        'cafe': 0.9,      // Coffee after meal
        'dessert': 0.95,  // Dessert after meal
        'bar': 0.8,       // Drinks after dinner
        'shopping': 0.3,  // Not ideal
        'restaurant': 0.2 // Too much food
      },
      'cafe': {
        'restaurant': 0.8,  // Meal after coffee
        'bakery': 0.9,      // Pastries with coffee
        'bookstore': 0.85,  // Reading spot
        'park': 0.7,        // Walk after coffee
        'cafe': 0.3         // Too much caffeine
      },
      'shopping': {
        'cafe': 0.9,        // Rest after shopping
        'restaurant': 0.85, // Meal after shopping
        'shopping': 0.7,    // More shopping
        'spa': 0.8          // Relax after shopping
      },
      'activity': {
        'restaurant': 0.9,  // Meal after activity
        'cafe': 0.85,       // Refreshment
        'spa': 0.9,         // Relaxation
        'bar': 0.7          // Drinks after activity
      }
    };
    
    return compatibilityMatrix[main]?.[companion] || 0.5;
  }
  
  getTimingCompatibility(mainPlace, companion, timeOfDay) {
    // Check if companion is open at the right time
    const mainDuration = mainPlace.typical_duration_minutes || 60;
    const gapTime = 15; // Typical transition time
    
    const exitTime = this.addMinutes(timeOfDay, mainDuration + gapTime);
    
    if (!this.isOpen(companion, exitTime)) {
      return 0;
    }
    
    // Prefer companions that are optimal at that time
    if (companion.peak_hours?.includes(exitTime.getHours())) {
      return 1;
    }
    
    return 0.7;
  }
  
  async getPopularityScore(mainId, companionId) {
    // Query historical user behavior
    const query = `
      SELECT COUNT(*) as pair_count
      FROM user_place_visits
      WHERE user_id IN (
        SELECT user_id FROM user_place_visits WHERE place_id = $1
      )
      AND place_id = $2
      AND visited_at BETWEEN 
        (SELECT visited_at FROM user_place_visits WHERE place_id = $1) - INTERVAL '2 hours'
        AND 
        (SELECT visited_at FROM user_place_visits WHERE place_id = $1) + INTERVAL '2 hours'
    `;
    
    const result = await db.query(query, [mainId, companionId]);
    const pairCount = result.rows[0].pair_count;
    
    // Normalize to 0-1 scale
    return Math.min(pairCount / 100, 1);
  }
  
  enrichCompanion(mainPlace, companion, context) {
    const walkingTime = Math.ceil(companion.distance / 80); // 80m/min walking speed
    
    return {
      place: companion,
      relationship: this.determineRelationship(mainPlace, companion),
      walking_time: walkingTime,
      perfect_timing: this.calculatePerfectTiming(mainPlace, companion, context),
      reason: this.generateReason(mainPlace, companion),
      insider_tip: this.getInsiderTip(companion),
      weather_suitable: this.checkWeatherSuitability(mainPlace, companion, context.weather)
    };
  }
  
  determineRelationship(main, companion) {
    if (companion.category === 'dessert' && main.category === 'restaurant') {
      return 'after_meal';
    }
    if (companion.category === 'cafe' && main.category === 'restaurant') {
      return 'before_meal';
    }
    if (companion.category === 'bar' && main.category === 'restaurant') {
      return 'after_meal';
    }
    // ... more logic
    return 'complement';
  }
}
```

### C.3 Companion Activity User Interactions

```javascript
// Companion Activity Component Interactions
class CompanionActivityInteractions {
  
  // When user clicks on a companion activity card
  async handleCompanionClick(companionData, mainPlace) {
    const { place, relationship, walking_time } = companionData;
    
    // 1. Log the interaction
    await this.logInteraction('companion_click', {
      main_place_id: mainPlace.id,
      companion_place_id: place.id,
      relationship_type: relationship
    });
    
    // 2. Show options modal
    const modal = new CompanionModal({
      title: `Add ${place.name} to your journey?`,
      subtitle: `${walking_time} min walk from ${mainPlace.name}`,
      options: [
        {
          label: 'View Details',
          icon: 'info',
          action: () => navigateTo(`/places/${place.slug}`)
        },
        {
          label: 'Add to Journey',
          icon: 'plus',
          action: () => this.addToCurrentJourney(place, mainPlace)
        },
        {
          label: 'Get Directions',
          icon: 'navigate',
          action: () => this.showDirections(mainPlace, place)
        },
        {
          label: 'Save for Later',
          icon: 'bookmark',
          action: () => this.saveCompanionPair(mainPlace, place)
        }
      ]
    });
    
    modal.show();
  }
  
  // Add companion to active journey
  async addToCurrentJourney(companion, afterPlace) {
    const journey = getCurrentJourney();
    
    if (!journey) {
      // Create new journey starting with these two places
      const newJourney = await createJourney({
        name: `${afterPlace.name} & ${companion.name}`,
        stops: [afterPlace, companion]
      });
      
      showToast(`Started new journey: ${newJourney.name}`);
      return;
    }
    
    // Insert companion after the current place
    const placeIndex = journey.stops.findIndex(s => s.place_id === afterPlace.id);
    journey.stops.splice(placeIndex + 1, 0, {
      place_id: companion.id,
      recommended_duration: companion.typical_duration_minutes,
      added_by_user: true
    });
    
    // Recalculate journey metrics
    await this.recalculateJourney(journey);
    
    showToast(`Added ${companion.name} to your journey`);
  }
  
  // Show walking directions
  async showDirections(from, to) {
    const directionsPanel = new DirectionsPanel({
      origin: from,
      destination: to,
      mode: 'walking'
    });
    
    // Fetch turn-by-turn directions
    const directions = await getDirections(from, to);
    
    directionsPanel.show({
      steps: directions.steps,
      distance: directions.distance,
      duration: directions.duration,
      warnings: directions.warnings, // "Cross at signal", etc.
      alternatives: directions.alternatives
    });
    
    // Option to open in Google Maps
    directionsPanel.onExternalNav = () => {
      const url = `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
      window.open(url, '_blank');
    };
  }
}
```

---

## PART D: COMMUNITY HUB - COMPLETE DATA ARCHITECTURE

### D.1 Comments System

```typescript
// Comment Data Model
Comment {
  id: uuid
  parent_id: uuid (for nested replies)
  
  // Context
  entity_type: enum ["place", "journey", "event", "suggestion"]
  entity_id: uuid
  
  // Author
  author_id: uuid (null for anonymous)
  author_name: string
  author_avatar: string
  author_verified: boolean (is this Amit?)
  
  // Content
  content: text (max 500 chars)
  edited: boolean
  edited_at: timestamp
  
  // Rich Media
  attachments: array [{
    type: "image" | "link",
    url: string,
    thumbnail: string,
    metadata: object
  }]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  
  // Engagement
  likes_count: integer
  replies_count: integer
  
  // Moderation
  status: enum ["pending", "approved", "hidden", "flagged"]
  moderation_reason: string
  reported_count: integer
  
  // Display
  pinned: boolean (by place owner/admin)
  highlighted: boolean (helpful comment)
}
```

#### Comment Management System
```javascript
class CommentSystem {
  constructor() {
    this.moderation = new ModerationService();
    this.notifications = new NotificationService();
  }
  
  async addComment(entityType, entityId, content, author) {
    // 1. Validate content
    const validation = await this.validateComment(content);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }
    
    // 2. Check for spam/inappropriate content
    const moderationResult = await this.moderation.check(content);
    
    // 3. Create comment
    const comment = await supabase.from('comments').insert({
      entity_type: entityType,
      entity_id: entityId,
      content: this.sanitizeContent(content),
      author_id: author?.id || null,
      author_name: author?.name || 'Anonymous Explorer',
      author_avatar: author?.avatar || this.generateAvatar(),
      status: moderationResult.requiresReview ? 'pending' : 'approved',
      created_at: new Date().toISOString()
    }).single();
    
    // 4. Update counters
    await this.updateCommentCount(entityType, entityId, 1);
    
    // 5. Send notifications
    if (entityType === 'place') {
      // Notify Amit about new comment on his place
      await this.notifications.send('amit', {
        type: 'new_comment',
        place_id: entityId,
        comment_preview: content.substring(0, 50)
      });
    }
    
    // 6. Check for mentions and notify
    const mentions = this.extractMentions(content);
    for (const mention of mentions) {
      await this.notifications.send(mention, {
        type: 'mention',
        comment_id: comment.id,
        entity_type: entityType
      });
    }
    
    return comment;
  }
  
  async displayComments(entityType, entityId, options = {}) {
    const { 
      limit = 10, 
      offset = 0, 
      sortBy = 'recent', 
      includeReplies = true 
    } = options;
    
    // Build query
    let query = supabase
      .from('comments')
      .select(`
        *,
        likes: comment_likes(count),
        replies: comments!parent_id(count)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .in('status', ['approved', 'highlighted']);
    
    // Apply sorting
    switch(sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('likes_count', { ascending: false });
        break;
      case 'helpful':
        query = query.eq('highlighted', true);
        break;
    }
    
    // Fetch comments
    const { data: comments } = await query.limit(limit).range(offset, offset + limit - 1);
    
    // Fetch replies if needed
    if (includeReplies) {
      for (const comment of comments) {
        comment.replies = await this.fetchReplies(comment.id);
      }
    }
    
    // Add user interaction states
    const userId = getCurrentUserId();
    if (userId) {
      for (const comment of comments) {
        comment.user_has_liked = await this.hasUserLiked(comment.id, userId);
      }
    }
    
    return comments;
  }
  
  // Where comment numbers are shown
  getCommentCountDisplay(count) {
    if (count === 0) return 'Be the first to comment';
    if (count === 1) return '1 comment';
    if (count < 10) return `${count} comments`;
    if (count < 100) return `${Math.floor(count / 10) * 10}+ comments`;
    return '100+ comments';
  }
  
  // Comment display locations across site
  getCommentPlacements() {
    return {
      place_card: {
        show_count: true,
        show_preview: false,
        max_display: 99
      },
      place_detail: {
        show_count: true,
        show_preview: true,
        show_full_thread: true,
        allow_adding: true
      },
      journey_card: {
        show_count: true,
        show_preview: false
      },
      journey_detail: {
        show_count: true,
        show_full_thread: true,
        allow_adding: true,
        group_by_stop: true
      },
      community_hub: {
        show_all: true,
        allow_filtering: true,
        allow_searching: true
      }
    };
  }
}
```

### D.2 Rating System

```typescript
// Rating Data Model
Rating {
  id: uuid
  user_id: uuid
  entity_type: enum ["place", "journey", "event"]
  entity_id: uuid
  
  // Rating Details
  overall_rating: integer (1-5)
  
  // Aspect Ratings (optional)
  aspect_ratings: {
    food_quality?: integer (1-5),
    service?: integer (1-5),
    ambiance?: integer (1-5),
    value_for_money?: integer (1-5),
    cleanliness?: integer (1-5)
  }
  
  // Context
  visit_date: date
  visit_time: enum ["morning", "afternoon", "evening", "night"]
  group_size: integer
  occasion: enum ["casual", "business", "date", "family", "celebration"]
  
  // Review Content
  title: string (optional, 60 chars)
  review: text (optional, 1000 chars)
  pros: array [string]
  cons: array [string]
  
  // Media
  photos: array [image_id]
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  device_type: string
  verified_purchase: boolean (from payment integration)
  
  // Helpfulness
  helpful_count: integer
  not_helpful_count: integer
}
```

#### Rating Implementation
```javascript
class RatingSystem {
  // Where users can rate
  getRatingLocations() {
    return [
      {
        location: 'place_detail_page',
        trigger: 'Rate This Place button',
        position: 'After visit info, before comments'
      },
      {
        location: 'post_visit_prompt',
        trigger: 'Automatic after detected visit',
        position: 'Modal popup'
      },
      {
        location: 'journey_completion',
        trigger: 'After completing journey',
        position: 'Journey summary screen'
      },
      {
        location: 'quick_rating',
        trigger: 'Star icons on place cards',
        position: 'Inline on hover'
      }
    ];
  }
  
  async submitRating(entityType, entityId, ratingData) {
    const userId = getCurrentUserId();
    
    // 1. Check if user has already rated
    const existingRating = await this.getUserRating(userId, entityType, entityId);
    
    if (existingRating) {
      // Update existing rating
      return await this.updateRating(existingRating.id, ratingData);
    }
    
    // 2. Validate rating data
    if (ratingData.overall_rating < 1 || ratingData.overall_rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    // 3. Create rating
    const rating = await supabase.from('ratings').insert({
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      ...ratingData,
      created_at: new Date().toISOString()
    }).single();
    
    // 4. Update aggregate ratings
    await this.updateAggregateRatings(entityType, entityId);
    
    // 5. Check for milestones
    await this.checkRatingMilestones(entityType, entityId);
    
    // 6. Trigger notifications
    if (ratingData.overall_rating === 5) {
      await this.notifyHighRating(entityType, entityId, userId);
    }
    
    return rating;
  }
  
  async updateAggregateRatings(entityType, entityId) {
    // Fetch all ratings
    const { data: ratings } = await supabase
      .from('ratings')
      .select('overall_rating, aspect_ratings')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId);
    
    // Calculate aggregates
    const aggregate = {
      total_ratings: ratings.length,
      average_rating: this.calculateAverage(ratings.map(r => r.overall_rating)),
      rating_distribution: this.calculateDistribution(ratings),
      aspect_averages: this.calculateAspectAverages(ratings)
    };
    
    // Update entity
    await supabase
      .from(entityType + 's')
      .update({
        rating_aggregate: aggregate,
        updated_at: new Date().toISOString()
      })
      .eq('id', entityId);
    
    // Update search index
    await this.updateSearchIndex(entityType, entityId, aggregate);
  }
  
  // Display ratings across the site
  async displayRating(entityType, entityId, displayType = 'full') {
    const { data: entity } = await supabase
      .from(entityType + 's')
      .select('rating_aggregate')
      .eq('id', entityId)
      .single();
    
    const aggregate = entity.rating_aggregate;
    
    switch(displayType) {
      case 'stars_only':
        return this.renderStars(aggregate.average_rating);
        
      case 'with_count':
        return `${this.renderStars(aggregate.average_rating)} (${aggregate.total_ratings})`;
        
      case 'detailed':
        return {
          stars: this.renderStars(aggregate.average_rating),
          average: aggregate.average_rating.toFixed(1),
          total: aggregate.total_ratings,
          distribution: aggregate.rating_distribution,
          aspects: aggregate.aspect_averages
        };
        
      case 'full':
        return {
          ...this.displayRating(entityType, entityId, 'detailed'),
          recent_reviews: await this.getRecentReviews(entityType, entityId, 3),
          user_rating: await this.getUserRating(getCurrentUserId(), entityType, entityId)
        };
    }
  }
  
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      full: fullStars,
      half: hasHalfStar,
      empty: emptyStars,
      value: rating
    };
  }
}
```

### D.3 Event Calendar System

```typescript
// Event Data Model
Event {
  id: uuid
  
  // Basic Info
  title: string
  description: text
  category: enum ["music", "food", "art", "sports", "community", "workshop"]
  
  // Location
  place_id: uuid (if at a specific place)
  custom_location: string (if not at a known place)
  location_coordinates: point
  
  // Timing
  start_datetime: timestamp
  end_datetime: timestamp
  timezone: string
  recurrence_rule: string (iCal RRULE format)
  
  // Organizer
  organizer_type: enum ["amit", "place", "community", "external"]
  organizer_id: uuid
  organizer_name: string
  organizer_contact: object
  
  // Capacity
  max_attendees: integer
  current_attendees: integer
  waitlist_enabled: boolean
  
  // Cost
  is_free: boolean
  price: {
    amount: integer,
    currency: string,
    early_bird: object,
    group_discount: object
  }
  
  // Media
  cover_image: string
  gallery: array [image_urls]
  
  // Requirements
  age_restriction: string
  prerequisites: array
  what_to_bring: array
  
  // Weather
  weather_dependent: boolean
  rain_plan: string
  
  // Status
  status: enum ["draft", "published", "cancelled", "completed"]
  cancellation_reason: string
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  view_count: integer
  share_count: integer
}
```

#### Event Calendar Implementation
```javascript
class EventCalendarSystem {
  constructor() {
    this.calendar = new CalendarWidget();
    this.notifications = new NotificationService();
    this.weather = new WeatherService();
  }
  
  // Calendar Display Location
  getCalendarPlacements() {
    return {
      dedicated_page: {
        url: '/events',
        layout: 'full_calendar',
        features: ['month_view', 'week_view', 'list_view', 'filters']
      },
      homepage_widget: {
        position: 'below_featured_places',
        layout: 'upcoming_events_list',
        limit: 5
      },
      place_detail: {
        position: 'sidebar',
        layout: 'mini_calendar',
        filter: 'place_specific'
      },
      community_hub: {
        position: 'tab',
        layout: 'event_cards',
        features: ['rsvp', 'share', 'remind']
      }
    };
  }
  
  // Data Sources
  async fetchEvents(options = {}) {
    const { 
      view = 'month', 
      date = new Date(), 
      filters = {},
      limit = 50 
    } = options;
    
    // 1. Calculate date range based on view
    const dateRange = this.calculateDateRange(view, date);
    
    // 2. Fetch from multiple sources
    const sources = await Promise.all([
      this.fetchDatabaseEvents(dateRange, filters),
      this.fetchGoogleCalendarEvents(dateRange),
      this.fetchFacebookEvents(dateRange),
      this.fetchMeetupEvents(dateRange)
    ]);
    
    // 3. Merge and deduplicate
    let events = this.mergeEvents(sources);
    
    // 4. Apply filters
    events = this.applyFilters(events, filters);
    
    // 5. Add weather predictions
    events = await this.enrichWithWeather(events);
    
    // 6. Sort by relevance
    events = this.sortEvents(events, options.sortBy || 'date');
    
    return events.slice(0, limit);
  }
  
  async fetchDatabaseEvents(dateRange, filters) {
    let query = supabase
      .from('events')
      .select(`
        *,
        place:places(name, address, category),
        attendees:event_attendees(count),
        organizer:profiles(name, avatar)
      `)
      .gte('start_datetime', dateRange.start)
      .lte('start_datetime', dateRange.end)
      .eq('status', 'published');
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.place_id) {
      query = query.eq('place_id', filters.place_id);
    }
    
    const { data } = await query;
    return data || [];
  }
  
  async fetchGoogleCalendarEvents(dateRange) {
    // Public Google Calendar for Indiranagar events
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
        `key=${apiKey}&` +
        `timeMin=${dateRange.start.toISOString()}&` +
        `timeMax=${dateRange.end.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`
      );
      
      const data = await response.json();
      
      return data.items.map(event => ({
        source: 'google_calendar',
        external_id: event.id,
        title: event.summary,
        description: event.description,
        start_datetime: event.start.dateTime || event.start.date,
        end_datetime: event.end.dateTime || event.end.date,
        location: event.location,
        organizer_name: event.organizer?.displayName
      }));
    } catch (error) {
      console.error('Google Calendar fetch failed:', error);
      return [];
    }
  }
  
  // Update Frequency
  getUpdateSchedule() {
    return {
      database_events: 'real_time', // Via Supabase subscriptions
      google_calendar: 'every_5_minutes',
      facebook_events: 'every_30_minutes',
      meetup_events: 'every_hour',
      weather_enrichment: 'every_3_hours'
    };
  }
  
  async setupRealtimeUpdates() {
    // Subscribe to database changes
    supabase
      .from('events')
      .on('*', payload => {
        this.handleEventUpdate(payload);
      })
      .subscribe();
    
    // Setup periodic fetches
    setInterval(() => this.fetchGoogleCalendarEvents(), 5 * 60 * 1000);
    setInterval(() => this.fetchFacebookEvents(), 30 * 60 * 1000);
    setInterval(() => this.fetchMeetupEvents(), 60 * 60 * 1000);
  }
  
  // Calendar Page Layout
  renderCalendarPage() {
    return {
      layout: 'responsive_grid',
      components: [
        {
          type: 'header',
          content: {
            title: 'Indiranagar Events',
            subtitle: 'Discover what\'s happening in the neighborhood',
            filters: ['category', 'date_range', 'price', 'venue']
          }
        },
        {
          type: 'view_switcher',
          options: ['month', 'week', 'day', 'list'],
          default: 'month'
        },
        {
          type: 'calendar_grid',
          features: {
            drag_to_create: false,
            click_to_view: true,
            hover_preview: true,
            weather_indicators: true,
            capacity_indicators: true
          }
        },
        {
          type: 'sidebar',
          components: [
            'upcoming_events_list',
            'event_categories',
            'popular_venues',
            'weather_forecast'
          ]
        }
      ]
    };
  }
  
  // Event Interactions
  async handleEventClick(eventId) {
    const event = await this.getEvent(eventId);
    
    const modal = new EventModal({
      event: event,
      actions: [
        {
          label: 'RSVP',
          action: () => this.handleRSVP(eventId),
          show: !this.hasUserRSVPd(eventId)
        },
        {
          label: 'Cancel RSVP',
          action: () => this.cancelRSVP(eventId),
          show: this.hasUserRSVPd(eventId)
        },
        {
          label: 'Add to Calendar',
          action: () => this.addToCalendar(event)
        },
        {
          label: 'Share',
          action: () => this.shareEvent(event)
        },
        {
          label: 'Get Directions',
          action: () => this.getDirections(event.location_coordinates)
        }
      ]
    });
    
    modal.show();
  }
  
  async handleRSVP(eventId) {
    const userId = getCurrentUserId();
    
    if (!userId) {
      // Show auth prompt
      showAuthModal('Sign in to RSVP for events');
      return;
    }
    
    try {
      // Check capacity
      const event = await this.getEvent(eventId);
      if (event.current_attendees >= event.max_attendees) {
        if (event.waitlist_enabled) {
          const confirm = await showConfirm('Event is full. Join waitlist?');
          if (!confirm) return;
        } else {
          showToast('Sorry, this event is full', 'error');
          return;
        }
      }
      
      // Create RSVP
      await supabase.from('event_attendees').insert({
        event_id: eventId,
        user_id: userId,
        status: event.current_attendees >= event.max_attendees ? 'waitlist' : 'confirmed',
        rsvp_at: new Date().toISOString()
      });
      
      // Update count
      await supabase.rpc('increment_event_attendees', { event_id: eventId });
      
      // Send confirmation
      await this.sendRSVPConfirmation(userId, event);
      
      // Show success
      showToast('RSVP confirmed! Check your email for details');
      
      // Add to user's calendar
      this.promptCalendarAdd(event);
      
    } catch (error) {
      showToast('Failed to RSVP. Please try again', 'error');
    }
  }
}
```

---

## PART E: WEATHER INTEGRATION - COMPLETE SYSTEM

### E.1 Weather-Aware Features Throughout

```javascript
class WeatherIntegrationSystem {
  constructor() {
    this.providers = {
      primary: new OpenWeatherMapProvider(),
      fallback: new WeatherAPIProvider()
    };
    this.cache = new WeatherCache();
  }
  
  // Weather integration points across the platform
  getIntegrationPoints() {
    return {
      homepage: {
        hero_section: {
          feature: 'Dynamic background based on current weather',
          implementation: 'Weather-specific imagery and gradients'
        },
        recommendations: {
          feature: 'Weather-appropriate place suggestions',
          implementation: 'Filter places by indoor/outdoor, AC availability'
        }
      },
      
      place_cards: {
        weather_badge: {
          feature: 'Show if place is good for current weather',
          implementation: 'Green/yellow/red indicator'
        },
        timing_suggestion: {
          feature: 'Best time to visit today based on weather',
          implementation: 'Avoid rain, prefer pleasant hours'
        }
      },
      
      journey_planning: {
        route_optimization: {
          feature: 'Adjust route based on weather forecast',
          implementation: 'More indoor stops during rain'
        },
        timing_recommendations: {
          feature: 'Suggest best start time',
          implementation: 'Avoid peak heat, rain predictions'
        },
        clothing_suggestions: {
          feature: 'What to wear/bring',
          implementation: 'Umbrella, sunscreen, jacket alerts'
        }
      },
      
      map_view: {
        weather_overlay: {
          feature: 'Show current conditions on map',
          implementation: 'Rain clouds, temperature gradient'
        },
        shelter_markers: {
          feature: 'Highlight covered areas during rain',
          implementation: 'Special markers for shelter spots'
        }
      },
      
      notifications: {
        weather_alerts: {
          feature: 'Proactive weather warnings',
          implementation: 'Push notifications for saved journeys'
        },
        rescheduling_suggestions: {
          feature: 'Suggest better days for outdoor plans',
          implementation: 'ML-based prediction'
        }
      }
    };
  }
  
  // Real-time weather data fetching
  async getCurrentWeather(location = 'indiranagar') {
    // Check cache first (5-minute TTL)
    const cached = this.cache.get('current_weather');
    if (cached && cached.timestamp > Date.now() - 300000) {
      return cached.data;
    }
    
    try {
      // Try primary provider
      const weather = await this.providers.primary.getCurrent({
        lat: 12.9716,
        lon: 77.6412,
        units: 'metric'
      });
      
      // Process and enhance data
      const enhanced = {
        ...weather,
        feels_like_category: this.categorizeFeelsLike(weather.feels_like),
        comfort_index: this.calculateComfortIndex(weather),
        activity_suitability: this.getActivitySuitability(weather),
        local_insights: this.getLocalInsights(weather)
      };
      
      // Cache the result
      this.cache.set('current_weather', enhanced);
      
      return enhanced;
      
    } catch (error) {
      // Fallback to secondary provider
      console.error('Primary weather provider failed:', error);
      return await this.providers.fallback.getCurrent(location);
    }
  }
  
  // Calculate comfort index (0-100)
  calculateComfortIndex(weather) {
    let index = 100;
    
    // Temperature factor (optimal: 22-26°C)
    const temp = weather.temp;
    if (temp < 22) index -= (22 - temp) * 2;
    if (temp > 26) index -= (temp - 26) * 3;
    
    // Humidity factor (optimal: 40-60%)
    const humidity = weather.humidity;
    if (humidity < 40) index -= (40 - humidity);
    if (humidity > 60) index -= (humidity - 60) * 0.5;
    
    // Rain factor
    if (weather.rain) index -= 30;
    
    // Wind factor (optimal: 5-15 km/h)
    const wind = weather.wind_speed;
    if (wind > 20) index -= 10;
    
    // UV index factor
    if (weather.uvi > 7) index -= 15;
    
    return Math.max(0, Math.min(100, index));
  }
  
  // Weather-based joy creation
  createWeatherJoy() {
    return {
      sunny_day_surprises: {
        trigger: 'Perfect weather detected (comfort > 85)',
        action: 'Show special "Perfect Day" banner with outdoor suggestions',
        celebration: 'Animated sun rays on homepage'
      },
      
      rainy_day_comfort: {
        trigger: 'Rain detected',
        action: 'Transform UI to cozy mode with rain sounds option',
        suggestions: 'Warm cafes, covered markets, comfort food'
      },
      
      golden_hour_alert: {
        trigger: '1 hour before sunset on clear days',
        action: 'Push notification for photography spots',
        feature: 'Golden hour countdown timer'
      },
      
      monsoon_specials: {
        trigger: 'Monsoon season active',
        action: 'Show monsoon-special foods and experiences',
        ui_change: 'Rain animation on appropriate pages'
      },
      
      heat_wave_care: {
        trigger: 'Temperature > 35°C',
        action: 'Prominently show AC places, cold drinks',
        warnings: 'Hydration reminders, shade route preference'
      }
    };
  }
  
  // Seasonality Integration
  async getSeasonalContent() {
    const currentMonth = new Date().getMonth();
    const currentSeason = this.getCurrentSeason(currentMonth);
    
    return {
      season: currentSeason,
      
      seasonal_highlights: await this.getSeasonalHighlights(currentSeason),
      
      seasonal_events: await this.getSeasonalEvents(currentSeason),
      
      seasonal_foods: await this.getSeasonalFoods(currentSeason),
      
      seasonal_activities: await this.getSeasonalActivities(currentSeason),
      
      seasonal_warnings: this.getSeasonalWarnings(currentSeason),
      
      seasonal_tips: this.getSeasonalTips(currentSeason)
    };
  }
  
  getCurrentSeason(month) {
    // Bangalore seasons
    if (month >= 2 && month <= 4) return 'summer';
    if (month >= 5 && month <= 9) return 'monsoon';
    if (month >= 10 || month <= 1) return 'winter';
  }
  
  async getSeasonalHighlights(season) {
    const highlights = {
      summer: [
        'Mango season at local markets',
        'Rooftop dining in evenings',
        'Early morning walks (before 8 AM)',
        'Tender coconut water spots'
      ],
      monsoon: [
        'Hot chai and pakora places',
        'Covered shopping areas',
        'Rain photography spots',
        'Indoor entertainment venues'
      ],
      winter: [
        'Outdoor brunches',
        'Evening markets',
        'Bonfire restaurants',
        'Street food tours'
      ]
    };
    
    return highlights[season];
  }
  
  // Best time to visit calculation
  async calculateBestTimeToVisit(placeId) {
    const place = await getPlace(placeId);
    const weather = await this.getWeatherForecast();
    
    // Factors to consider
    const factors = {
      is_outdoor: place.categories.includes('outdoor'),
      has_ac: place.amenities.includes('ac'),
      has_cover: place.amenities.includes('covered'),
      typical_crowd_pattern: await this.getCrowdPattern(placeId),
      opening_hours: place.opening_hours
    };
    
    // Calculate scores for each hour
    const hourlyScores = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let score = 0;
      
      // Weather score
      const hourWeather = weather.hourly[hour];
      if (factors.is_outdoor) {
        if (hourWeather.temp >= 20 && hourWeather.temp <= 28) score += 30;
        if (hourWeather.rain_probability < 20) score += 20;
        if (hour >= 6 && hour <= 9) score += 20; // Morning freshness
        if (hour >= 16 && hour <= 18) score += 15; // Evening pleasantness
      } else {
        // Indoor places are less weather-dependent
        score += 20;
        if (hourWeather.rain_probability > 50) score += 10; // Good during rain
      }
      
      // Crowd score (inverse)
      const crowdLevel = factors.typical_crowd_pattern[hour];
      score += (1 - crowdLevel) * 30;
      
      // Opening hours check
      if (!this.isOpen(factors.opening_hours, hour)) {
        score = 0;
      }
      
      hourlyScores.push({
        hour: hour,
        score: score,
        weather: hourWeather,
        crowd_level: crowdLevel
      });
    }
    
    // Find best times
    const sorted = hourlyScores
      .filter(h => h.score > 0)
      .sort((a, b) => b.score - a.score);
    
    return {
      best_time: sorted[0],
      good_times: sorted.slice(0, 3),
      avoid_times: sorted.slice(-3),
      reasoning: this.generateTimeRecommendationText(sorted[0], factors)
    };
  }
  
  generateTimeRecommendationText(bestTime, factors) {
    const reasons = [];
    
    if (bestTime.weather.temp >= 20 && bestTime.weather.temp <= 28) {
      reasons.push('Perfect temperature');
    }
    
    if (bestTime.crowd_level < 0.3) {
      reasons.push('Fewer crowds');
    }
    
    if (bestTime.hour >= 16 && bestTime.hour <= 18 && factors.is_outdoor) {
      reasons.push('Golden hour lighting');
    }
    
    if (bestTime.weather.rain_probability < 20 && factors.is_outdoor) {
      reasons.push('Low chance of rain');
    }
    
    return reasons.join(', ');
  }
}
```

---

## PART F: SHARING MECHANISMS

### F.1 Universal Sharing System

```javascript
class SharingSystem {
  constructor() {
    this.analytics = new AnalyticsService();
    this.shortener = new URLShortenerService();
  }
  
  // What can be shared
  getShareableEntities() {
    return {
      place: {
        url_pattern: '/places/{slug}',
        title_template: '{name} - Indiranagar Discovery',
        description_template: 'Check out {name} in Indiranagar. {rating} stars, {category}',
        image: 'place.hero_image',
        metadata: ['rating', 'category', 'ami_visited']
      },
      
      journey: {
        url_pattern: '/journeys/{id}',
        title_template: '{name} - Curated Journey',
        description_template: '{description}. {duration} minutes, {stop_count} stops',
        image: 'journey.hero_image',
        metadata: ['duration', 'difficulty', 'stops']
      },
      
      place_card: {
        url_pattern: '/places/{slug}#card',
        title_template: 'Quick Look: {name}',
        custom_image: true, // Generate card image
        compact: true
      },
      
      route: {
        url_pattern: '/routes/{encoded_route}',
        title_template: 'Route from {start} to {end}',
        map_image: true,
        interactive: true
      },
      
      event: {
        url_pattern: '/events/{id}',
        title_template: '{title} - {date}',
        calendar_integration: true
      },
      
      collection: {
        url_pattern: '/collections/{id}',
        title_template: "{name}'s Collection",
        preview_count: 5
      }
    };
  }
  
  async share(entityType, entityId, options = {}) {
    const { 
      method = 'native', // native, copy, social
      platform = null,
      custom_message = null 
    } = options;
    
    // 1. Generate share data
    const shareData = await this.generateShareData(entityType, entityId);
    
    // 2. Track share intent
    await this.analytics.track('share_initiated', {
      entity_type: entityType,
      entity_id: entityId,
      method: method,
      platform: platform
    });
    
    // 3. Execute share based on method
    switch(method) {
      case 'native':
        return await this.nativeShare(shareData);
        
      case 'copy':
        return await this.copyToClipboard(shareData);
        
      case 'social':
        return await this.socialShare(shareData, platform);
        
      case 'qr':
        return await this.generateQRCode(shareData);
        
      case 'email':
        return await this.emailShare(shareData);
    }
  }
  
  async generateShareData(entityType, entityId) {
    const entity = await this.getEntity(entityType, entityId);
    const template = this.getShareableEntities()[entityType];
    
    // Generate short URL
    const longUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${template.url_pattern.replace('{slug}', entity.slug || entity.id)}`;
    const shortUrl = await this.shortener.shorten(longUrl);
    
    // Generate title and description
    const title = this.fillTemplate(template.title_template, entity);
    const description = template.description_template ? 
      this.fillTemplate(template.description_template, entity) : '';
    
    // Generate or fetch image
    let image = null;
    if (template.custom_image) {
      image = await this.generateCustomImage(entityType, entity);
    } else if (template.map_image) {
      image = await this.generateMapImage(entity);
    } else if (template.image) {
      image = this.getNestedProperty(entity, template.image);
    }
    
    return {
      title: title,
      text: description,
      url: shortUrl,
      image: image,
      hashtags: this.generateHashtags(entityType, entity),
      via: 'IndinagarWithAmit'
    };
  }
  
  async nativeShare(shareData) {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        });
        
        showToast('Shared successfully!');
        return true;
        
      } catch (error) {
        if (error.name === 'AbortError') {
          // User cancelled
          return false;
        }
        // Fall back to copy
        return await this.copyToClipboard(shareData);
      }
    } else {
      // Show custom share modal
      return await this.showShareModal(shareData);
    }
  }
  
  async socialShare(shareData, platform) {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareData.title + '\n' + shareData.url)}`,
      
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}&hashtags=${shareData.hashtags.join(',')}&via=${shareData.via}`,
      
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
      
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
      
      instagram: 'instagram://share' // Opens Instagram app
    };
    
    if (platform === 'instagram') {
      // Special handling for Instagram
      await this.shareToInstagram(shareData);
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    
    // Track successful share
    await this.analytics.track('share_completed', {
      platform: platform,
      url: shareData.url
    });
  }
  
  async shareToInstagram(shareData) {
    // Generate Instagram-ready image
    const image = await this.generateInstagramStory(shareData);
    
    // Check if Instagram app is available (mobile)
    if (navigator.userAgent.match(/Instagram/)) {
      // In Instagram in-app browser
      showToast('Screenshot to share as story');
    } else {
      // Show instructions modal
      const modal = new Modal({
        title: 'Share to Instagram',
        content: `
          <img src="${image}" alt="Share image" />
          <p>1. Save this image</p>
          <p>2. Open Instagram</p>
          <p>3. Create a story or post</p>
          <p>4. Add link: ${shareData.url}</p>
        `,
        actions: [
          {
            label: 'Download Image',
            action: () => this.downloadImage(image, 'indiranagar-share.jpg')
          },
          {
            label: 'Copy Link',
            action: () => this.copyToClipboard({ url: shareData.url })
          }
        ]
      });
      
      modal.show();
    }
  }
  
  async generateCustomImage(entityType, entity) {
    // Use Canvas API or server-side generation
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw main image
    if (entity.image) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = entity.image;
      });
      ctx.drawImage(img, 0, 0, 600, 630);
    }
    
    // Text overlay
    ctx.fillStyle = 'white';
    ctx.fillRect(600, 0, 600, 630);
    
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px Inter';
    ctx.fillText(entity.name, 650, 100);
    
    // Add metadata
    if (entity.rating) {
      this.drawRating(ctx, entity.rating, 650, 150);
    }
    
    // Add branding
    ctx.fillStyle = '#f97316';
    ctx.font = '24px Inter';
    ctx.fillText('Indiranagar with Amit', 650, 580);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
}
```

---

## PART G: DATA PERSISTENCE STRATEGY

### G.1 Multi-Layer Storage Architecture

```javascript
class DataPersistenceStrategy {
  constructor() {
    this.layers = {
      memory: new MemoryCache(),          // In-memory, fastest
      session: new SessionStorage(),      // Tab-specific
      local: new LocalStorage(),          // Device-specific
      indexed: new IndexedDBStorage(),    // Large data, offline
      cloud: new SupabaseStorage()        // Synced, persistent
    };
  }
  
  // Storage Decision Matrix
  getStorageStrategy(dataType) {
    const strategies = {
      // Temporary UI state
      ui_state: {
        primary: 'memory',
        backup: 'session',
        ttl: 300000, // 5 minutes
        sync: false
      },
      
      // User preferences
      preferences: {
        primary: 'local',
        backup: 'cloud',
        ttl: null, // No expiry
        sync: true
      },
      
      // Journey progress
      journey_progress: {
        primary: 'session',
        backup: 'local',
        ttl: 86400000, // 24 hours
        sync: true
      },
      
      // Saved places
      saved_places: {
        primary: 'indexed',
        backup: 'cloud',
        ttl: null,
        sync: true,
        offline: true
      },
      
      // Search history
      search_history: {
        primary: 'local',
        backup: null,
        ttl: 2592000000, // 30 days
        sync: false,
        limit: 50 // Max items
      },
      
      // Image cache
      image_cache: {
        primary: 'indexed',
        backup: null,
        ttl: 604800000, // 7 days
        sync: false,
        maxSize: 50 * 1024 * 1024 // 50MB
      },
      
      // Analytics events
      analytics_queue: {
        primary: 'indexed',
        backup: null,
        ttl: 86400000, // 24 hours
        sync: true,
        batch: true
      },
      
      // Weather data
      weather_cache: {
        primary: 'session',
        backup: 'local',
        ttl: 300000, // 5 minutes current, 3600000 for forecast
        sync: false
      }
    };
    
    return strategies[dataType] || strategies.ui_state;
  }
  
  // Unified storage interface
  async store(key, value, options = {}) {
    const dataType = options.type || this.inferDataType(key);
    const strategy = this.getStorageStrategy(dataType);
    
    // Store in primary layer
    await this.layers[strategy.primary].set(key, value, strategy.ttl);
    
    // Store in backup if specified
    if (strategy.backup) {
      await this.layers[strategy.backup].set(key, value, strategy.ttl);
    }
    
    // Sync to cloud if needed
    if (strategy.sync && this.isAuthenticated()) {
      await this.syncToCloud(key, value, dataType);
    }
    
    // Handle storage limits
    if (strategy.limit) {
      await this.enforceLimit(key, strategy.limit, strategy.primary);
    }
    
    return true;
  }
  
  async retrieve(key, options = {}) {
    const dataType = options.type || this.inferDataType(key);
    const strategy = this.getStorageStrategy(dataType);
    
    // Try primary layer first
    let value = await this.layers[strategy.primary].get(key);
    
    // Fall back to backup if needed
    if (!value && strategy.backup) {
      value = await this.layers[strategy.backup].get(key);
      
      // Restore to primary if found in backup
      if (value) {
        await this.layers[strategy.primary].set(key, value, strategy.ttl);
      }
    }
    
    // Try cloud if still not found and synced
    if (!value && strategy.sync && this.isAuthenticated()) {
      value = await this.fetchFromCloud(key, dataType);
      
      // Cache locally if found
      if (value) {
        await this.layers[strategy.primary].set(key, value, strategy.ttl);
      }
    }
    
    return value;
  }
  
  // Session Storage Details
  setupSessionStorage() {
    const sessionData = {
      // Navigation state
      scroll_positions: new Map(), // Page -> scroll position
      expanded_sections: new Set(), // Which sections are expanded
      active_tab: null, // Current tab in tabbed interfaces
      
      // Form data
      form_drafts: new Map(), // Form ID -> draft data
      validation_errors: new Map(), // Field -> error messages
      
      // Temporary selections
      selected_filters: new Set(),
      compared_places: new Array(3), // Max 3 places
      
      // Map state
      map_viewport: {
        center: null,
        zoom: null,
        layers: new Set()
      },
      
      // Journey builder
      journey_draft: {
        stops: [],
        customizations: {},
        unsaved_changes: false
      },
      
      // Performance
      api_cache: new Map(), // Endpoint -> response (5 min TTL)
      
      // User flow
      referrer: null,
      entry_point: null,
      interaction_count: 0
    };
    
    // Auto-save session data
    window.addEventListener('beforeunload', () => {
      this.saveSessionSnapshot(sessionData);
    });
    
    // Restore on load
    window.addEventListener('load', () => {
      this.restoreSessionSnapshot();
    });
    
    return sessionData;
  }
  
  // Real-time data synchronization
  setupRealtimeSync() {
    // Weather updates
    setInterval(async () => {
      const weather = await this.fetchWeatherUpdate();
      this.store('current_weather', weather, { type: 'weather_cache' });
      this.broadcastUpdate('weather', weather);
    }, 5 * 60 * 1000); // Every 5 minutes
    
    // Place availability
    this.subscribeTo('places:availability', (update) => {
      this.updateLocalCache('place_availability', update);
      this.rerenderAffectedComponents(update.place_id);
    });
    
    // Live events
    this.subscribeTo('events:live', (event) => {
      this.store(`event:${event.id}`, event, { type: 'events' });
      
      if (this.shouldNotifyUser(event)) {
        this.showEventNotification(event);
      }
    });
    
    // User activity sync (if authenticated)
    if (this.isAuthenticated()) {
      this.subscribeTo(`user:${this.userId}:activity`, (activity) => {
        this.mergeUserActivity(activity);
      });
    }
  }
  
  // Offline-first architecture
  setupOfflineSupport() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    
    // Cache critical data
    this.precacheEssentials([
      '/api/places?essential=true',
      '/api/journeys?featured=true',
      '/api/weather/current'
    ]);
    
    // Queue actions when offline
    window.addEventListener('offline', () => {
      this.enableOfflineMode();
    });
    
    window.addEventListener('online', () => {
      this.syncOfflineQueue();
    });
  }
  
  async syncOfflineQueue() {
    const queue = await this.layers.indexed.get('offline_queue') || [];
    
    for (const action of queue) {
      try {
        await this.executeAction(action);
        await this.removeFromQueue(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
  }
  
  // Data lifecycle management
  setupDataLifecycle() {
    // Cleanup expired data daily
    setInterval(() => {
      this.cleanupExpiredData();
    }, 24 * 60 * 60 * 1000);
    
    // Compress old analytics
    setInterval(() => {
      this.compressAnalytics();
    }, 7 * 24 * 60 * 60 * 1000); // Weekly
    
    // Optimize storage
    setInterval(() => {
      this.optimizeStorage();
    }, 60 * 60 * 1000); // Hourly
  }
  
  async cleanupExpiredData() {
    const now = Date.now();
    
    // Check each storage layer
    for (const [layerName, layer] of Object.entries(this.layers)) {
      const keys = await layer.keys();
      
      for (const key of keys) {
        const metadata = await layer.getMetadata(key);
        
        if (metadata.expires && metadata.expires < now) {
          await layer.delete(key);
          console.log(`Cleaned up expired: ${key} from ${layerName}`);
        }
      }
    }
  }
  
  async optimizeStorage() {
    // Check storage usage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const {usage, quota} = await navigator.storage.estimate();
      const percentUsed = (usage / quota) * 100;
      
      if (percentUsed > 80) {
        // Free up space
        await this.freeUpSpace();
      }
    }
  }
  
  async freeUpSpace() {
    // Remove least recently used items
    const lruItems = await this.getLRUItems();
    
    for (const item of lruItems) {
      if (!item.critical) {
        await this.layers[item.layer].delete(item.key);
      }
    }
    
    // Clear image cache
    await this.clearOldImageCache();
    
    // Compress large data
    await this.compressLargeData();
  }
}
```

---

## PART H: INSTAGRAM STORY INTERFACE

### H.1 Instagram-Style Story Experience

```javascript
class InstagramStoryInterface {
  constructor() {
    this.currentStory = 0;
    this.currentSlide = 0;
    this.autoPlayTimer = null;
    this.touchStartX = 0;
    this.holdTimer = null;
  }
  
  // Story Data Structure
  getStoryStructure() {
    return {
      journey_story: {
        id: 'journey_123',
        type: 'journey',
        
        slides: [
          {
            type: 'intro',
            background: 'gradient_or_image',
            duration: 5000,
            content: {
              title: 'Coffee Crawl Morning',
              subtitle: 'A perfect Saturday journey',
              author: {
                name: 'Amit',
                avatar: '/amit-avatar.jpg',
                verified: true
              }
            },
            interactions: {
              swipe_up: 'more_info',
              tap_avatar: 'profile'
            }
          },
          
          {
            type: 'place',
            place_id: 'third_wave_coffee',
            duration: 7000,
            media: {
              type: 'image',
              url: '/places/third-wave.jpg',
              alt: 'Third Wave Coffee'
            },
            content: {
              name: 'Third Wave Coffee',
              time: '9:00 AM',
              duration: '45 min',
              tip: 'Try the Ethiopian single origin'
            },
            stickers: [
              {
                type: 'poll',
                question: 'Coffee or Tea person?',
                options: ['Coffee ☕', 'Tea 🍵']
              }
            ],
            interactions: {
              tap_location: 'open_map',
              swipe_up: 'place_details',
              tap_sticker: 'interact'
            }
          },
          
          {
            type: 'transition',
            duration: 3000,
            media: {
              type: 'map_animation',
              from: 'third_wave',
              to: 'blue_tokai',
              mode: 'walking'
            },
            content: {
              distance: '5 min walk',
              tip: 'Take the tree-lined path'
            }
          },
          
          {
            type: 'place',
            place_id: 'blue_tokai',
            duration: 7000,
            media: {
              type: 'video',
              url: '/videos/blue-tokai-ambiance.mp4',
              poster: '/places/blue-tokai.jpg'
            },
            content: {
              name: 'Blue Tokai Coffee',
              time: '10:00 AM',
              highlight: 'Roastery tour available'
            },
            stickers: [
              {
                type: 'question',
                prompt: 'Ask Amit anything about this place'
              }
            ]
          },
          
          {
            type: 'summary',
            duration: 10000,
            background: 'map_overview',
            content: {
              total_time: '3 hours',
              places_visited: 4,
              distance_walked: '2.1 km',
              calories_burned: 150,
              money_spent: '₹800-1200'
            },
            interactions: {
              swipe_up: 'save_journey',
              tap_share: 'share_story'
            }
          }
        ],
        
        metadata: {
          total_slides: 5,
          total_duration: 32000,
          music: '/audio/upbeat-morning.mp3',
          created_at: '2024-01-15',
          views: 234,
          saves: 45
        }
      }
    };
  }
  
  // Story Renderer
  async renderStory(storyData) {
    const container = document.createElement('div');
    container.className = 'story-container';
    container.innerHTML = `
      <div class="story-wrapper">
        <!-- Progress bars -->
        <div class="story-progress">
          ${storyData.slides.map((_, i) => `
            <div class="progress-bar" data-slide="${i}">
              <div class="progress-fill"></div>
            </div>
          `).join('')}
        </div>
        
        <!-- Header -->
        <div class="story-header">
          <div class="author-info">
            <img src="${storyData.slides[0].content.author.avatar}" alt="" />
            <span>${storyData.slides[0].content.author.name}</span>
            ${storyData.slides[0].content.author.verified ? '<span class="verified">✓</span>' : ''}
          </div>
          <div class="story-actions">
            <button class="pause-btn" aria-label="Pause">⏸</button>
            <button class="mute-btn" aria-label="Mute">🔇</button>
            <button class="close-btn" aria-label="Close">✕</button>
          </div>
        </div>
        
        <!-- Content area -->
        <div class="story-content">
          <div class="slide-container"></div>
        </div>
        
        <!-- Interaction areas -->
        <div class="tap-areas">
          <div class="tap-left" data-action="previous"></div>
          <div class="tap-right" data-action="next"></div>
        </div>
        
        <!-- Bottom actions -->
        <div class="story-footer">
          <input type="text" placeholder="Send a message..." class="message-input" />
          <button class="reaction-btn">❤️</button>
          <button class="share-btn">↗️</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Initialize interactions
    this.setupInteractions(container, storyData);
    
    // Start story
    this.playSlide(0, storyData);
    
    return container;
  }
  
  setupInteractions(container, storyData) {
    // Touch gestures
    let touchStartY = 0;
    
    container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      // Hold to pause
      this.holdTimer = setTimeout(() => {
        this.pauseStory();
        container.classList.add('holding');
      }, 200);
    });
    
    container.addEventListener('touchend', (e) => {
      clearTimeout(this.holdTimer);
      container.classList.remove('holding');
      this.resumeStory();
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Swipe detection
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -50) {
          // Swipe up
          this.handleSwipeUp(storyData.slides[this.currentSlide]);
        } else if (deltaY > 50) {
          // Swipe down
          this.closeStory();
        }
      } else {
        if (Math.abs(deltaX) > 50) {
          // Horizontal swipe between stories
          if (deltaX > 0) {
            this.previousStory();
          } else {
            this.nextStory();
          }
        }
      }
    });
    
    // Tap areas
    container.querySelector('.tap-left').addEventListener('click', () => {
      this.previousSlide();
    });
    
    container.querySelector('.tap-right').addEventListener('click', () => {
      this.nextSlide();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          this.previousSlide();
          break;
        case 'ArrowRight':
          this.nextSlide();
          break;
        case 'Escape':
          this.closeStory();
          break;
        case ' ':
          e.preventDefault();
          this.togglePause();
          break;
      }
    });
    
    // Reactions
    container.querySelector('.reaction-btn').addEventListener('click', () => {
      this.sendReaction('❤️');
      this.showReactionAnimation();
    });
    
    // Message input
    container.querySelector('.message-input').addEventListener('focus', () => {
      this.pauseStory();
    });
    
    container.querySelector('.message-input').addEventListener('blur', () => {
      this.resumeStory();
    });
  }
  
  playSlide(index, storyData) {
    this.currentSlide = index;
    const slide = storyData.slides[index];
    
    // Update progress bars
    this.updateProgress(index);
    
    // Render slide content
    this.renderSlideContent(slide);
    
    // Set auto-advance timer
    this.autoPlayTimer = setTimeout(() => {
      if (index < storyData.slides.length - 1) {
        this.playSlide(index + 1, storyData);
      } else {
        this.storyComplete();
      }
    }, slide.duration);
    
    // Animate progress bar
    this.animateProgressBar(index, slide.duration);
    
    // Preload next slide
    if (index < storyData.slides.length - 1) {
      this.preloadSlide(storyData.slides[index + 1]);
    }
  }
  
  renderSlideContent(slide) {
    const container = document.querySelector('.slide-container');
    
    switch(slide.type) {
      case 'intro':
        container.innerHTML = `
          <div class="intro-slide" style="background: ${slide.background}">
            <h1>${slide.content.title}</h1>
            <p>${slide.content.subtitle}</p>
          </div>
        `;
        break;
        
      case 'place':
        container.innerHTML = `
          <div class="place-slide">
            ${slide.media.type === 'video' ? 
              `<video autoplay muted loop playsinline>
                <source src="${slide.media.url}" type="video/mp4">
              </video>` :
              `<img src="${slide.media.url}" alt="${slide.media.alt}" />`
            }
            <div class="place-info">
              <h2>${slide.content.name}</h2>
              <p>${slide.content.time} • ${slide.content.duration || ''}</p>
              ${slide.content.tip ? `<p class="tip">💡 ${slide.content.tip}</p>` : ''}
            </div>
            ${this.renderStickers(slide.stickers)}
          </div>
        `;
        break;
        
      case 'transition':
        this.renderMapTransition(slide);
        break;
        
      case 'summary':
        container.innerHTML = `
          <div class="summary-slide">
            <h2>Journey Complete!</h2>
            <div class="stats">
              <div class="stat">
                <span class="value">${slide.content.total_time}</span>
                <span class="label">Total Time</span>
              </div>
              <div class="stat">
                <span class="value">${slide.content.places_visited}</span>
                <span class="label">Places</span>
              </div>
              <div class="stat">
                <span class="value">${slide.content.distance_walked}</span>
                <span class="label">Walked</span>
              </div>
            </div>
            <button class="save-journey-btn">Save This Journey</button>
          </div>
        `;
        break;
    }
  }
  
  renderStickers(stickers) {
    if (!stickers) return '';
    
    return stickers.map(sticker => {
      switch(sticker.type) {
        case 'poll':
          return `
            <div class="story-poll">
              <p>${sticker.question}</p>
              <div class="poll-options">
                ${sticker.options.map(opt => 
                  `<button class="poll-option">${opt}</button>`
                ).join('')}
              </div>
            </div>
          `;
          
        case 'question':
          return `
            <div class="story-question">
              <p>${sticker.prompt}</p>
              <input type="text" placeholder="Type your answer..." />
            </div>
          `;
          
        default:
          return '';
      }
    }).join('');
  }
  
  // Utility functions
  handleSwipeUp(slide) {
    if (slide.interactions?.swipe_up) {
      switch(slide.interactions.swipe_up) {
        case 'more_info':
          this.showMoreInfo(slide);
          break;
        case 'place_details':
          window.location.href = `/places/${slide.place_id}`;
          break;
        case 'save_journey':
          this.saveJourney();
          break;
      }
    }
  }
  
  showMoreInfo(slide) {
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>About this place</h3>
        <p>Additional information about ${slide.content.name}</p>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Make stories useful
  makeStoriesUseful() {
    return {
      use_cases: {
        journey_preview: 'Quick visual preview before committing to journey',
        place_discovery: 'Swipeable exploration of new places',
        event_highlights: 'Event recaps and upcoming previews',
        daily_recommendations: 'Personalized daily story with suggestions',
        user_journeys: 'Users share their completed journeys',
        seasonal_guides: 'Season-specific curated experiences'
      },
      
      engagement_features: {
        polls: 'Gather preferences for better recommendations',
        questions: 'Direct Q&A with Amit about places',
        reactions: 'Quick feedback on places',
        save_points: 'Save specific stops for later',
        share_slides: 'Share individual slides',
        remix: 'Create variations of journeys'
      },
      
      monetization: {
        sponsored_stops: 'Featured partner places in stories',
        exclusive_content: 'Premium story content',
        booking_integration: 'Book directly from story',
        merchandise: 'Swipe up to buy related items'
      }
    };
  }
}
```

---

## CONCLUSION & IMPLEMENTATION NOTES

This comprehensive PRD now covers:

1. **Journey System**: Complete data architecture, distance calculations, save mechanisms, customization options
2. **Image System**: Multi-source fetching, device optimization, weather/time-aware selection
3. **Companion Activities**: Smart calculation engine, relationship mapping, user interactions
4. **Community Hub**: Full comment system, rating implementation, event calendar with multiple data sources
5. **Weather Integration**: Deep integration across all features, joy creation, seasonality
6. **Sharing**: Universal sharing system for all entities, social platform integration
7. **Data Persistence**: Multi-layer storage strategy, offline support, real-time sync
8. **Instagram Stories**: Complete implementation for journey storytelling

### Key Implementation Priorities:

1. **Performance**: Implement aggressive caching and lazy loading
2. **Offline-First**: Ensure core features work without internet
3. **Real-time Updates**: WebSocket connections for live data
4. **Progressive Enhancement**: Basic functionality first, then enhancements
5. **Analytics**: Track every interaction for continuous improvement

### Success Metrics:
- User engagement: >5 min average session
- Feature adoption: >60% users try journeys
- Performance: <3s page load, <100ms interactions
- Reliability: <0.1% error rate
- Delight: >50% users discover easter eggs

This PRD ensures every button works, every interaction is meaningful, and the entire platform creates joy through thoughtful, data-driven experiences.