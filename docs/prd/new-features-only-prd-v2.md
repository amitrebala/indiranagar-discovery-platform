# Product Requirements Document: NEW FEATURES ONLY V2
## No Auth - Focus on Admin Tools & Core Features

---

## EXECUTIVE SUMMARY

This PRD focuses EXCLUSIVELY on features that need to be built NEW, with emphasis on:
- **Comprehensive Admin Dashboard** (password-protected for Amit only)
- **Comment/Rating Systems** (anonymous allowed)
- **Journey Enhancements**
- **Advanced Features** building on existing infrastructure

**REMOVED**: User authentication system - keeping the platform open and accessible

---

## 1. COMPREHENSIVE ADMIN DASHBOARD (NEW - PRIORITY)

### 1.1 Admin Access Control
**Simple Protection**: Password-based access for Amit only
**Implementation**: Environment variable check

```typescript
// New file: /app/admin/layout.tsx
export default function AdminLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const checkPassword = () => {
    // Check against environment variable
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      // Store in session
      sessionStorage.setItem('admin_authenticated', 'true');
    }
  };
  
  if (!authenticated && !sessionStorage.getItem('admin_authenticated')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h2>Admin Access</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
          />
          <button onClick={checkPassword}>Enter</button>
        </div>
      </div>
    );
  }
  
  return children;
}
```

### 1.2 Admin Dashboard Home
**New Page**: `/app/admin/dashboard/page.tsx`
**Features**: Central hub for all admin functions

```typescript
interface AdminDashboard {
  sections: {
    places: {
      totalCount: number;
      recentlyAdded: Place[];
      needsAttention: Place[]; // Missing images, info
    };
    community: {
      pendingSuggestions: number;
      unresolvedQuestions: number;
      recentActivity: Activity[];
    };
    content: {
      draftJourneys: number;
      scheduledPosts: number;
    };
    analytics: {
      todayViews: number;
      weeklyTrend: number;
      popularPlaces: Place[];
    };
  };
  
  quickActions: [
    'Add New Place',
    'Review Questions',
    'Edit Journey',
    'Update Settings',
    'Export Data'
  ];
}
```

### 1.3 Place Management Interface
**New Page**: `/app/admin/places/manage/page.tsx`
**Purpose**: Complete CRUD for places

```typescript
interface PlaceManager {
  // LIST VIEW
  placeTable: {
    columns: [
      'name',
      'category',
      'rating',
      'hasAmitVisited',
      'images',
      'lastUpdated',
      'actions'
    ];
    
    bulkActions: [
      'Update Category',
      'Add Tags',
      'Set Visited Status',
      'Delete Selected'
    ];
    
    filters: {
      category: string[];
      visited: boolean;
      hasImages: boolean;
      needsUpdate: boolean;
    };
  };
  
  // ADD/EDIT FORM
  placeForm: {
    basic: {
      name: string;
      category: string;
      subcategory: string;
      description: text;
      amitNotes: text; // Personal notes
    };
    
    location: {
      address: string;
      coordinates: { lat: number; lng: number };
      // Map picker component
      landmarks: string[];
    };
    
    details: {
      phone: string;
      website: string;
      email: string;
      hours: OpeningHours;
      priceRange: string;
    };
    
    visitInfo: {
      hasAmitVisited: boolean;
      visitDate: date;
      rating: number;
      personalReview: text;
      recommendedFor: string[];
      avoidIf: string[];
    };
    
    media: {
      images: File[];
      imageUrls: string[];
      videoUrl: string;
      instagramHandle: string;
    };
    
    seo: {
      slug: string; // Auto-generated, editable
      metaDescription: string;
      keywords: string[];
    };
    
    relationships: {
      companionActivities: Place[];
      similarPlaces: Place[];
      journeys: Journey[]; // Which journeys include this
    };
  };
}
```

**Implementation Details**:
```typescript
// Add New Place Flow
const AddPlaceFlow = () => {
  const [step, setStep] = useState(1);
  const [placeData, setPlaceData] = useState({});
  
  const steps = [
    { title: 'Basic Info', component: <BasicInfoForm /> },
    { title: 'Location', component: <LocationPicker /> },
    { title: 'Details', component: <DetailsForm /> },
    { title: 'Amit\'s Review', component: <ReviewForm /> },
    { title: 'Media', component: <MediaUploader /> },
    { title: 'Preview', component: <PlacePreview /> }
  ];
  
  const savePlace = async () => {
    // Save to existing places table
    const { data, error } = await supabase
      .from('places')
      .insert(placeData);
    
    // Update search index
    await updateSearchIndex(data.id);
    
    // Invalidate caches
    await revalidatePath('/places');
  };
};

// Bulk Import
const BulkImport = () => {
  // CSV upload
  // Google Sheets integration
  // JSON import
  
  const handleCSV = (file) => {
    // Parse CSV
    // Map columns
    // Validate data
    // Show preview
    // Batch insert
  };
};
```

### 1.4 Community Questions Manager
**Enhance**: Existing `/app/admin/questions/enhanced/page.tsx`
**Add New Features**:

```typescript
interface EnhancedQuestionManager {
  // Existing question display
  questions: CommunityQuestion[];
  
  // NEW: Response System
  responsePanel: {
    quickResponses: [
      'I\'ll visit and check!',
      'Yes, been there recently',
      'Not yet, but on my list',
      'Thanks for the suggestion!'
    ];
    
    customResponse: {
      text: string;
      attachImage: boolean;
      markAsResolved: boolean;
      convertToPlace: boolean; // If it's a suggestion
    };
  };
  
  // NEW: Question Categories
  categories: {
    'Need Visit': Question[]; // Places to check out
    'Need Info': Question[]; // Missing information
    'Suggestions': Question[]; // New place suggestions
    'General': Question[]; // Other questions
  };
  
  // NEW: Bulk Actions
  bulkActions: {
    markResolved: (ids: string[]) => void;
    assignCategory: (ids: string[], category: string) => void;
    exportToCSV: () => void;
    createTodoList: () => void; // Generate visit list
  };
  
  // NEW: Analytics
  analytics: {
    totalQuestions: number;
    resolvedThisWeek: number;
    averageResponseTime: string;
    topAskers: User[];
    trendingTopics: string[];
  };
}
```

### 1.5 Journey Builder & Manager
**New Page**: `/app/admin/journeys/builder/page.tsx`
**Purpose**: Visual journey creation tool

```typescript
interface JourneyBuilder {
  // Visual Builder
  canvas: {
    mapView: LeafletMap; // Show route on map
    placeCards: DraggableList; // Reorder stops
    timeline: TimelineView; // Show timing
  };
  
  // Journey Properties
  properties: {
    basic: {
      name: string;
      description: string;
      mood: string[];
      duration: number;
      difficulty: string;
    };
    
    stops: {
      places: Place[];
      order: number[];
      timing: {
        arrivalOffset: number;
        duration: number;
      }[];
      notes: string[]; // Per stop notes
    };
    
    metadata: {
      bestTime: string;
      seasonality: string;
      weatherRequirements: string[];
      accessibility: number;
      costEstimate: { min: number; max: number };
    };
    
    publishing: {
      status: 'draft' | 'published';
      featuredImage: string;
      gallery: string[];
      publishDate: date;
    };
  };
  
  // Actions
  actions: {
    preview: () => void; // Show as user would see
    test: () => void; // Walk through journey
    publish: () => void;
    duplicate: () => void;
    export: () => void; // Export as PDF/Image
  };
}
```

### 1.6 Settings & Configuration
**New Page**: `/app/admin/settings/page.tsx`
**Purpose**: Control platform behavior

```typescript
interface AdminSettings {
  // Site Settings
  site: {
    maintenance: boolean;
    announcement: string; // Banner message
    features: {
      enableComments: boolean;
      enableRatings: boolean;
      enableSuggestions: boolean;
      enableWeather: boolean;
    };
  };
  
  // Content Settings
  content: {
    autoApprove: {
      comments: boolean;
      ratings: boolean;
      suggestions: boolean;
    };
    
    moderation: {
      bannedWords: string[];
      flagThreshold: number;
      requireApproval: boolean;
    };
    
    defaults: {
      placeholderImage: string;
      defaultMapCenter: Coordinates;
      itemsPerPage: number;
    };
  };
  
  // API Settings
  apis: {
    weather: {
      provider: 'openweather' | 'weatherapi';
      apiKey: string;
      cacheDuration: number;
    };
    
    maps: {
      provider: 'google' | 'mapbox';
      apiKey: string;
    };
    
    images: {
      unsplashKey: string;
      cloudinaryUrl: string;
    };
  };
  
  // Notification Settings
  notifications: {
    email: string;
    dailyDigest: boolean;
    instantAlerts: string[]; // Types of alerts
    
    triggers: {
      newSuggestion: boolean;
      newQuestion: boolean;
      errorThreshold: number;
    };
  };
  
  // Backup & Export
  dataManagement: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly';
    exportFormat: 'json' | 'csv' | 'sql';
    
    actions: {
      exportPlaces: () => void;
      exportAnalytics: () => void;
      createBackup: () => void;
      restoreBackup: (file: File) => void;
    };
  };
}
```

### 1.7 Analytics Dashboard
**New Page**: `/app/admin/analytics/detailed/page.tsx`
**Purpose**: Deep insights into platform usage

```typescript
interface DetailedAnalytics {
  // Real-time Stats
  realtime: {
    activeUsers: number;
    currentPage: Map<string, number>; // Page -> user count
    recentSearches: string[];
    liveMap: Coordinates[]; // User locations
  };
  
  // Place Analytics
  places: {
    mostViewed: { place: Place; views: number }[];
    mostShared: { place: Place; shares: number }[];
    mostSaved: { place: Place; saves: number }[];
    
    conversionFunnel: {
      viewed: number;
      clicked: number;
      gotDirections: number;
      called: number;
    };
    
    heatmap: { // Geographic heat map
      coordinates: Coordinates;
      intensity: number;
    }[];
  };
  
  // Journey Analytics
  journeys: {
    started: number;
    completed: number;
    averageCompletion: number; // percentage
    popularRoutes: Journey[];
    dropoffPoints: Place[]; // Where people stop
  };
  
  // Search Analytics
  search: {
    topQueries: { query: string; count: number }[];
    noResults: string[]; // Searches with no results
    categories: { [category: string]: number };
    trends: { // Over time
      daily: number[];
      weekly: number[];
    };
  };
  
  // User Behavior
  behavior: {
    averageSession: number; // minutes
    bounceRate: number;
    returnRate: number;
    deviceTypes: { mobile: number; desktop: number; tablet: number };
    referrers: { source: string; count: number }[];
  };
}
```

---

## 2. COMMENT SYSTEM (NEW - ANONYMOUS ALLOWED)

### 2.1 Anonymous Comments
**Build on**: Existing place detail pages
**New Component**: `/components/comments/AnonymousCommentThread.tsx`

```typescript
interface AnonymousComment {
  id: string;
  entity_type: 'place' | 'journey' | 'event';
  entity_id: string;
  
  // Anonymous identity
  anonymous_id: string; // Generated session ID
  display_name: string; // "Anonymous Explorer", "Curious Visitor", etc.
  avatar_color: string; // Random color for consistency
  
  content: string;
  created_at: timestamp;
  
  // Moderation
  flagged: boolean;
  approved: boolean; // Admin can pre-moderate
  ip_hash: string; // For spam prevention
}

// Implementation
const submitComment = async (content: string, placeId: string) => {
  // Get or create anonymous session
  let anonId = sessionStorage.getItem('anon_id');
  if (!anonId) {
    anonId = generateAnonId();
    sessionStorage.setItem('anon_id', anonId);
  }
  
  // Submit comment
  await supabase.from('comments').insert({
    entity_type: 'place',
    entity_id: placeId,
    anonymous_id: anonId,
    display_name: generateAnonName(),
    content: content,
    approved: !REQUIRE_MODERATION // Set in admin settings
  });
};
```

---

## 3. RATING SYSTEM (NEW - ANONYMOUS ALLOWED)

### 3.1 Anonymous Ratings
**Implementation**: Similar to comments, session-based

```typescript
interface AnonymousRating {
  id: string;
  place_id: string;
  anonymous_id: string; // Session-based
  rating: number; // 1-5
  
  // Optional details
  visit_time: 'morning' | 'afternoon' | 'evening' | 'night';
  visit_type: 'solo' | 'couple' | 'family' | 'friends';
  
  // One rating per session per place
  UNIQUE(anonymous_id, place_id);
}
```

---

## 4. JOURNEY ENHANCEMENTS (BUILD ON EXISTING)

### 4.1 Journey Progress Tracking (Anonymous)
**Store in**: localStorage for anonymous users

```typescript
interface LocalJourneyProgress {
  journeyId: string;
  startedAt: Date;
  stopsCompleted: string[];
  notes: { [stopId: string]: string };
  photos: { [stopId: string]: string[] }; // Local URLs
  
  // Persist locally
  save: () => {
    localStorage.setItem(
      `journey_${journeyId}`,
      JSON.stringify(this)
    );
  };
  
  // Resume journey
  resume: () => {
    const saved = localStorage.getItem(`journey_${journeyId}`);
    return JSON.parse(saved);
  };
}
```

---

## 5. CALL & DIRECTIONS FUNCTIONALITY (NEW)

### 5.1 Enhanced Call Button
```typescript
const handleCall = (place: Place) => {
  // Track call intent (anonymous)
  trackEvent('call_clicked', { 
    placeId: place.id,
    sessionId: getSessionId() 
  });
  
  const phone = place.phone;
  
  if (!phone) {
    showToast('No phone number available');
    return;
  }
  
  // Mobile: Direct dial
  if (isMobile()) {
    window.location.href = `tel:${phone}`;
  } else {
    // Desktop: Show modal with number
    showModal({
      title: `Call ${place.name}`,
      content: `
        <div class="text-2xl font-bold">${phone}</div>
        <button onclick="copyToClipboard('${phone}')">
          Copy Number
        </button>
      `
    });
  }
};
```

### 5.2 Smart Directions
```typescript
const handleDirections = async (place: Place) => {
  // Check for current location
  const userLocation = await getCurrentLocation();
  
  if (userLocation) {
    // Calculate distance
    const distance = calculateDistance(userLocation, place.coordinates);
    
    if (distance < 0.5) { // Less than 500m
      // Show walking directions in-app
      showWalkingDirections(userLocation, place);
    } else {
      // Open Google Maps for driving
      openGoogleMaps(userLocation, place);
    }
  } else {
    // No location - just show place on map
    openGoogleMaps(null, place);
  }
};
```

---

## 6. COMPANION ACTIVITIES ENGINE (NEW)

### 6.1 Smart Companion Calculation
```typescript
class CompanionEngine {
  calculateCompanions(currentPlace: Place, context: Context) {
    const companions = [];
    
    // Get nearby places (use existing data)
    const nearby = getNearbyPlaces(currentPlace, 500);
    
    for (const place of nearby) {
      const score = this.scoreCompanion(currentPlace, place, context);
      
      if (score > 0.5) {
        companions.push({
          place,
          score,
          reason: this.getReason(currentPlace, place),
          walkingTime: this.calculateWalkingTime(currentPlace, place),
          perfectTiming: this.getPerfectTiming(currentPlace, place)
        });
      }
    }
    
    return companions.sort((a, b) => b.score - a.score);
  }
  
  private scoreCompanion(from: Place, to: Place, context: Context) {
    let score = 0;
    
    // Distance (closer is better)
    const distance = calculateDistance(from.coordinates, to.coordinates);
    score += (500 - distance) / 500 * 0.3;
    
    // Category compatibility
    const compatibility = {
      'restaurant': { 'dessert': 0.9, 'cafe': 0.8, 'bar': 0.7 },
      'cafe': { 'bakery': 0.9, 'restaurant': 0.7 },
      'bar': { 'restaurant': 0.8, 'cafe': 0.6 }
    };
    
    score += (compatibility[from.category]?.[to.category] || 0.5) * 0.4;
    
    // Time compatibility
    if (this.isOpenAfter(to, from, context.time)) {
      score += 0.3;
    }
    
    return score;
  }
}
```

---

## 7. ENHANCED WEATHER FEATURES

### 7.1 Best Time Calculator
```typescript
const calculateBestTime = (place: Place) => {
  const scores = [];
  
  for (let hour = 6; hour <= 22; hour++) {
    let score = 0;
    
    // Weather score (from existing weather data)
    const weather = getHourlyWeather(hour);
    if (place.is_outdoor) {
      if (weather.temp >= 20 && weather.temp <= 28) score += 30;
      if (weather.rain_chance < 20) score += 20;
    }
    
    // Crowd score (new data point)
    const crowdLevel = estimateCrowd(place, hour);
    score += (1 - crowdLevel) * 30;
    
    // Special times
    if (hour === 7) score += 10; // Early bird bonus
    if (hour === 17) score += 15; // Golden hour
    
    scores.push({ hour, score });
  }
  
  return scores.sort((a, b) => b.score - a.score)[0];
};
```

---

## 8. SHARING ENHANCEMENTS

### 8.1 Instagram Story Generator
```typescript
class StoryGenerator {
  async generateStory(place: Place) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    
    // Background image
    const img = await loadImage(place.image);
    ctx.drawImage(img, 0, 0, 1080, 1920);
    
    // Gradient overlay
    const gradient = ctx.createLinearGradient(0, 1200, 0, 1920);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Inter';
    ctx.fillText(place.name, 100, 1600);
    
    ctx.font = '48px Inter';
    ctx.fillText(`📍 ${place.area}`, 100, 1700);
    
    // Logo
    ctx.font = '36px Inter';
    ctx.fillText('Indiranagar with Amit', 100, 1850);
    
    return canvas.toDataURL('image/jpeg');
  }
}
```

---

## IMPLEMENTATION PRIORITY

### Week 1: Admin Dashboard Core
1. Admin access control (password protection)
2. Dashboard home page with stats
3. Place management CRUD interface
4. Bulk place import tool

### Week 2: Admin Tools Completion  
1. Community questions manager with responses
2. Journey builder interface
3. Settings & configuration page
4. Analytics dashboard

### Week 3: Core User Features
1. Anonymous comment system
2. Anonymous rating system
3. Call & directions implementation
4. Companion activities engine

### Week 4: Enhancements
1. Journey progress tracking (localStorage)
2. Weather best time calculator
3. Instagram story generator
4. Final testing and refinement

---

## SUCCESS METRICS

### Admin Efficiency
- Time to add new place < 2 minutes
- Bulk import 50+ places in one go
- Response to community questions < 24 hours
- Journey creation time < 10 minutes

### User Engagement (Anonymous)
- Comment rate > 5% of place views
- Rating submission > 10% of place views
- Journey completion > 40% of starts
- Companion activity clicks > 30% of place views

### Platform Performance
- Admin dashboard load < 2 seconds
- Zero impact on public site performance
- All admin actions reversible/undoable

---

## TECHNICAL NOTES

### Admin Security
```typescript
// Middleware for all admin routes
export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_auth');
  
  if (!isAdmin && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

// Additional security headers
headers: {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin'
}
```

### Database Changes Needed
```sql
-- Comments table (anonymous allowed)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  anonymous_id TEXT, -- Session-based ID
  display_name TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ratings table (anonymous allowed)  
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id),
  anonymous_id TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(anonymous_id, place_id)
);

-- Admin activity log
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## CONCLUSION

This PRD focuses on:
1. **Comprehensive Admin Dashboard** - Complete control over content
2. **Anonymous Interactions** - No auth required for users
3. **Smart Features** - Companion engine, best times, weather integration
4. **Building on Existing** - Leveraging current robust infrastructure

The admin dashboard will be the command center for managing the entire platform, while keeping the user experience open and friction-free.