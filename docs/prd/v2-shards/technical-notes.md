# TECHNICAL NOTES

## Admin Security
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

## Database Changes Needed
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
