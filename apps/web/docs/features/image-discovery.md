# Place Card Image Discovery Feature

## Overview

The Place Card Image Discovery feature automatically finds and displays relevant images for places from external sources when manual images are not available. It includes an image proxy for optimization, caching, and CORS handling.

## Features Implemented

### 1. **Image Proxy API** (`/api/images/proxy`)
- Edge function for optimizing external images
- Supports WebP/AVIF conversion
- Security validation for allowed domains
- Cache headers for CDN optimization
- CORS handling

### 2. **Image Source Manager**
- Pluggable architecture for multiple image sources
- Currently supports Unsplash (with easy extension for Pexels, Pixabay)
- Intelligent ranking based on relevance scores
- Parallel searches with timeout protection
- Deduplication of results

### 3. **usePlaceImage Hook**
- Automatic image discovery for places
- Local caching (7-day duration)
- Fallback chain: Database → Cache → External Sources → Placeholder
- Network-aware loading
- Attribution tracking

### 4. **Enhanced PlaceCard Component**
- Backward compatible with existing PlaceCard
- Shows image attribution on hover
- Loading states and error handling
- Automatic proxy usage for external images
- Cache indicators

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```env
# Required for image discovery
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Optional settings
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_IMAGE_PROXY_ENABLED=true
NEXT_PUBLIC_AUTO_SAVE_IMAGES=false
```

To get an Unsplash API key:
1. Go to https://unsplash.com/developers
2. Create a new application
3. Copy the "Access Key"

### 2. Database Migration (Optional)

If you want to track image metadata:

```bash
npm run supabase:migrate
```

This adds columns for source tracking, attribution, and auto-discovery flags.

## Usage

### Basic Usage

Replace `PlaceCard` with `PlaceCardEnhanced`:

```tsx
import { PlaceCardEnhanced } from '@/components/places/PlaceCardEnhanced'

<PlaceCardEnhanced 
  place={place} 
  showAttribution={true}
/>
```

### Using the Hook Directly

```tsx
import { usePlaceImage } from '@/hooks/usePlaceImage'

function MyComponent({ place }) {
  const { imageUrl, attribution, status } = usePlaceImage(place)
  
  return (
    <img 
      src={imageUrl} 
      alt={place.name}
      title={attribution ? `Photo by ${attribution.author}` : ''}
    />
  )
}
```

### Using the Image Proxy

For external images that need optimization:

```tsx
const proxyUrl = `/api/images/proxy?url=${encodeURIComponent(imageUrl)}&w=800&q=85`
```

## Testing

Visit `/test-images` to see the image discovery in action with sample places.

## Architecture Decisions

1. **Edge-based Proxy**: Uses Vercel Edge Functions for global performance
2. **Client-side Caching**: localStorage for offline support and performance
3. **Progressive Enhancement**: Works without JavaScript, enhances with it
4. **Fallback Strategy**: Multiple levels of fallbacks ensure images always display

## Performance Considerations

- Images are cached at multiple levels (browser, CDN, localStorage)
- Proxy converts images to modern formats (WebP/AVIF)
- Lazy loading with intersection observer
- Network-aware quality selection
- Automatic retries with exponential backoff

## Security

- Domain whitelisting in proxy
- No API keys exposed to client (except Unsplash public key)
- Content-Type validation
- Safe URL encoding

## Future Enhancements

1. Add Pexels and Pixabay sources
2. Implement ML-based relevance scoring
3. Add admin UI for image management
4. Service worker for offline support
5. A/B testing for image sources