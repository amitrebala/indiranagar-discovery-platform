# 1. COMPREHENSIVE ADMIN DASHBOARD (NEW - PRIORITY)

## 1.1 Admin Access Control
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

## 1.2 Admin Dashboard Home
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

## 1.3 Place Management Interface
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

## 1.4 Community Questions Manager
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

## 1.5 Journey Builder & Manager
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

## 1.6 Settings & Configuration
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

## 1.7 Analytics Dashboard
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
