# 3. RATING SYSTEM (NEW - ANONYMOUS ALLOWED)

## 3.1 Anonymous Ratings
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
