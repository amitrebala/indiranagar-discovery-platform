# 6. API ARCHITECTURE

## 6.1 RESTful API Design
```typescript
// API Route Structure
interface AdminAPIRoutes {
  // Places Management
  'GET /api/admin/places': { query: PlaceFilters; response: Place[] };
  'POST /api/admin/places': { body: PlaceInput; response: Place };
  'PUT /api/admin/places/:id': { body: PlaceUpdate; response: Place };
  'DELETE /api/admin/places/:id': { response: { success: boolean } };
  
  // Journey Management
  'GET /api/admin/journeys': { response: Journey[] };
  'POST /api/admin/journeys': { body: JourneyInput; response: Journey };
  'PUT /api/admin/journeys/:id': { body: JourneyUpdate; response: Journey };
  
  // Analytics
  'GET /api/admin/analytics/overview': { response: AnalyticsOverview };
  'GET /api/admin/analytics/places': { response: PlaceAnalytics[] };
  'GET /api/admin/analytics/search': { response: SearchAnalytics };
}

// Public API Routes (No Auth)
interface PublicAPIRoutes {
  // Comments
  'GET /api/comments': { query: { entity: string; id: string }; response: Comment[] };
  'POST /api/comments': { body: CommentInput; response: Comment };
  
  // Ratings
  'GET /api/ratings/:entity/:id': { response: RatingStats };
  'POST /api/ratings': { body: RatingInput; response: { success: boolean } };
}
```

## 6.2 API Implementation Pattern
```typescript
// app/api/admin/places/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  // Verify admin (middleware already checked token)
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Parse filters
  const searchParams = request.nextUrl.searchParams;
  const filters = {
    category: searchParams.get('category'),
    visited: searchParams.get('visited'),
    hasImages: searchParams.get('hasImages')
  };
  
  // Query with filters
  let query = supabase.from('places').select('*');
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.visited !== null) {
    query = query.eq('has_amit_visited', filters.visited === 'true');
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

---
