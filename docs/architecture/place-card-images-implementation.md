# Place Card Images Implementation Architecture

## Overview
This document provides a comprehensive implementation plan for adding external image support to place cards in the Indiranagar Discovery Platform. The solution focuses on runtime image fetching with optimization, without storing images locally.

## Current State Analysis

### Existing Infrastructure
1. **Database Schema**: `place_images` table with flexible `storage_path` field
2. **PlaceCard Component**: Basic image display functionality with fallback placeholders
3. **OptimizedImage Component**: Advanced lazy loading and adaptive quality
4. **QuickImageAdder**: Manual external URL addition capability
5. **Next.js Image Config**: Supports Supabase and Unsplash domains

### Gap Analysis
- No automatic image discovery from external sources
- Limited runtime optimization for external images
- No intelligent caching strategy
- Missing image proxy for CORS handling
- No automatic fallback for failed images

## Proposed Architecture

### Option 1: Edge-Based Image Proxy (Recommended)
**Approach**: Vercel Edge Functions for image optimization and caching
```typescript
// API Route: /api/images/proxy
- Fetch external images through edge function
- Apply on-the-fly optimization (resize, format conversion)
- Cache at edge locations globally
- Handle CORS and security
```

**Pros**:
- Zero infrastructure cost (within Vercel limits)
- Global edge caching
- Automatic WebP/AVIF conversion
- Built-in security and rate limiting

**Cons**:
- Dependent on Vercel platform
- Usage limits on free tier

### Option 2: Client-Side Direct Fetching
**Approach**: Fetch images directly from external sources
```typescript
// Enhanced PlaceCard with multiple image sources
- Try primary source (manual URL if exists)
- Fallback to Google Places API
- Fallback to Unsplash search
- Fallback to placeholder
```

**Pros**:
- Simple implementation
- No proxy infrastructure needed
- Direct CDN benefits from image providers

**Cons**:
- CORS limitations
- No optimization control
- Potential rate limiting issues

### Option 3: Hybrid Approach (Balanced)
**Approach**: Combine direct fetching with selective proxying
```typescript
// Smart image loading strategy
- Direct fetch for known good sources (Unsplash, Pexels)
- Proxy for problematic sources (Google Places, Yelp)
- Client-side format negotiation
- Service worker caching
```

## Implementation Plan

### Phase 1: Core Infrastructure (2-3 days)

#### 1.1 Image Source Service
```typescript
// lib/services/image-sources.ts
interface ImageSource {
  name: string
  search: (query: string) => Promise<ImageResult[]>
  priority: number
}

class ImageSourceManager {
  sources: ImageSource[] = [
    new UnsplashSource(),
    new PexelsSource(),
    new PixabaySource()
  ]
  
  async findImages(placeName: string, location?: Coordinates): Promise<ImageResult[]> {
    // Parallel search with priority ordering
    // Intelligent result ranking
    // Quality filtering
  }
}
```

#### 1.2 Image Proxy API
```typescript
// app/api/images/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  const width = searchParams.get('w')
  const quality = searchParams.get('q')
  
  // Security validation
  if (!isAllowedDomain(imageUrl)) {
    return new Response('Forbidden', { status: 403 })
  }
  
  // Fetch and optimize
  const optimizedImage = await optimizeImage(imageUrl, { width, quality })
  
  // Return with cache headers
  return new Response(optimizedImage, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000',
      'CDN-Cache-Control': 'max-age=31536000'
    }
  })
}
```

#### 1.3 Enhanced PlaceCard Component
```typescript
// components/places/PlaceCard.tsx
const PlaceCard = ({ place }) => {
  const { imageUrl, isLoading, error } = usePlaceImage(place)
  
  return (
    <OptimizedImage
      src={imageUrl}
      fallbackSrc="/images/placeholder-place.jpg"
      loader={({ src, width, quality }) => {
        // Use proxy for non-whitelisted domains
        if (needsProxy(src)) {
          return `/api/images/proxy?url=${src}&w=${width}&q=${quality}`
        }
        return src
      }}
    />
  )
}
```

### Phase 2: Image Discovery (2-3 days)

#### 2.1 Automatic Image Discovery Hook
```typescript
// hooks/usePlaceImage.ts
export function usePlaceImage(place: Place) {
  const [imageUrl, setImageUrl] = useState<string>()
  const [status, setStatus] = useState<ImageLoadStatus>('loading')
  
  useEffect(() => {
    async function discoverImage() {
      // 1. Check existing place_images
      const existingImage = await getExistingImage(place.id)
      if (existingImage) {
        setImageUrl(existingImage.storage_path)
        return
      }
      
      // 2. Search external sources
      const discovered = await imageSourceManager.findImages(
        place.name,
        { lat: place.latitude, lng: place.longitude }
      )
      
      if (discovered.length > 0) {
        // 3. Optionally save best result to database
        if (shouldPersistImage()) {
          await savePlaceImage(place.id, discovered[0].url)
        }
        
        setImageUrl(discovered[0].url)
      }
    }
    
    discoverImage()
  }, [place])
  
  return { imageUrl, status }
}
```

#### 2.2 Image Source Implementations
```typescript
// lib/services/sources/unsplash.ts
export class UnsplashSource implements ImageSource {
  async search(query: string): Promise<ImageResult[]> {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=3`,
      { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }}
    )
    
    const data = await response.json()
    return data.results.map(photo => ({
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      attribution: {
        author: photo.user.name,
        source: 'Unsplash'
      }
    }))
  }
}
```

### Phase 3: Optimization & Caching (1-2 days)

#### 3.1 Service Worker Caching
```typescript
// public/sw.js enhancement
const IMAGE_CACHE = 'place-images-v1'
const IMAGE_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/images/proxy')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached && !isExpired(cached)) {
          return cached
        }
        
        return fetch(event.request).then((response) => {
          const responseToCache = response.clone()
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
      })
    )
  }
})
```

#### 3.2 Progressive Enhancement
```typescript
// lib/utils/image-optimization.ts
export function getOptimalImageUrl(
  originalUrl: string,
  options: ImageOptions
): string {
  const { width, devicePixelRatio, networkSpeed } = options
  
  // Adjust quality based on network
  const quality = networkSpeed === 'slow' ? 60 : 85
  
  // Calculate optimal width
  const optimalWidth = Math.min(
    width * devicePixelRatio,
    networkSpeed === 'slow' ? 800 : 1200
  )
  
  return `/api/images/proxy?url=${originalUrl}&w=${optimalWidth}&q=${quality}`
}
```

## Configuration & Environment Variables

```env
# Image Source API Keys
UNSPLASH_ACCESS_KEY=your_key_here
PEXELS_API_KEY=your_key_here
PIXABAY_API_KEY=your_key_here

# Image Optimization
NEXT_PUBLIC_IMAGE_CACHE_DURATION=604800

# Allowed External Domains
NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS=unsplash.com,pexels.com,pixabay.com
```

## Next.js Configuration Updates

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: '*.googleapis.com' }, // Google Places
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  }
}
```

## Database Migration (Optional)

```sql
-- Add image metadata for better tracking
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS source VARCHAR(50);
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS attribution JSONB;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS last_validated TIMESTAMP;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS auto_discovered BOOLEAN DEFAULT false;

-- Index for performance
CREATE INDEX idx_place_images_source ON place_images(source);
CREATE INDEX idx_place_images_auto_discovered ON place_images(auto_discovered);
```

## Implementation Checklist

### Immediate Tasks (MVP)
- [ ] Create image proxy API route
- [ ] Add Unsplash integration
- [ ] Update PlaceCard to use proxy
- [ ] Configure Next.js remote patterns
- [ ] Add loading states and error handling

### Phase 1 Tasks
- [ ] Implement ImageSourceManager
- [ ] Add usePlaceImage hook
- [ ] Create OptimizedImage integration
- [ ] Add attribution display
- [ ] Implement basic caching

### Phase 2 Tasks
- [ ] Add Pexels and Pixabay sources
- [ ] Implement intelligent image selection
- [ ] Add service worker caching
- [ ] Create admin interface for image management
- [ ] Add image quality preferences

### Phase 3 Tasks
- [ ] Implement Google Places integration
- [ ] Add ML-based image relevance scoring
- [ ] Create image CDN warming
- [ ] Add A/B testing for image sources
- [ ] Implement usage analytics

## Performance Metrics

### Target Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Image Load Time: < 800ms (cached), < 2s (uncached)
- Cache Hit Rate: > 80%
- Bandwidth Savings: > 60% through optimization

### Monitoring
```typescript
// lib/monitoring/image-metrics.ts
export function trackImagePerformance(imageUrl: string, metrics: ImageMetrics) {
  // Log to analytics
  analytics.track('image_load', {
    url: imageUrl,
    loadTime: metrics.loadTime,
    cacheHit: metrics.cacheHit,
    optimizationSavings: metrics.savedBytes,
    source: metrics.source
  })
}
```

## Security Considerations

1. **URL Validation**: Whitelist allowed image domains
2. **Rate Limiting**: Implement per-IP rate limits on proxy
3. **Image Validation**: Verify image content type and size
4. **CORS Headers**: Properly configure for security
5. **API Key Protection**: Never expose keys client-side

## Fallback Strategy

```typescript
// Cascading fallback approach
1. Existing place_images entry
2. Cached external image
3. Fresh external image fetch
4. Generic category placeholder
5. Default placeholder
```

## Developer Notes

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys

# Run development server
npm run dev

# Test image proxy
curl http://localhost:3000/api/images/proxy?url=https://images.unsplash.com/photo-123&w=400&q=80
```

### Testing
```typescript
// tests/lib/image-sources.test.ts
describe('ImageSourceManager', () => {
  it('should find relevant images for place', async () => {
    const images = await imageSourceManager.findImages('Corner House')
    expect(images).toHaveLength(greaterThan(0))
    expect(images[0]).toHaveProperty('url')
  })
  
  it('should handle source failures gracefully', async () => {
    // Mock API failure
    const images = await imageSourceManager.findImages('Test Place')
    expect(images).toHaveLength(greaterThan(0)) // Other sources compensate
  })
})
```

## Conclusion

This architecture provides a robust, scalable solution for adding external images to place cards while maintaining performance and avoiding local storage. The phased approach allows for incremental implementation with immediate value delivery.

The recommended approach (Edge-based proxy) provides the best balance of performance, control, and user experience while keeping infrastructure costs minimal.