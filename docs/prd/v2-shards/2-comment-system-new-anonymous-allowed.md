# 2. COMMENT SYSTEM (NEW - ANONYMOUS ALLOWED)

## 2.1 Anonymous Comments
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
