# Place Image Relevance Enhancement Architecture

## Problem Statement

The current image discovery system returns generic, irrelevant images that don't accurately represent the actual places. For example, searching for "Corner House Ice Cream" might return generic ice cream photos instead of the actual Corner House restaurant in Indiranagar.

### Root Causes
1. **Generic Search Queries**: Simply appending "india bangalore" to place names is insufficient
2. **No Context Awareness**: The system doesn't understand place types, brands, or local context
3. **Poor Relevance Scoring**: Current scoring only checks basic text matches
4. **No Fallback Strategy**: When specific images aren't found, random results are returned
5. **Missing Place Metadata**: No structured data about place characteristics

## Proposed Solution Architecture

### 1. Enhanced Place Metadata System

#### 1.1 Database Schema Enhancement
```sql
-- Add structured metadata to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS search_keywords TEXT[];
ALTER TABLE places ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255);
ALTER TABLE places ADD COLUMN IF NOT EXISTS establishment_type VARCHAR(100);

-- Create place characteristics table
CREATE TABLE IF NOT EXISTS place_characteristics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  characteristic_type VARCHAR(50) NOT NULL, -- 'cuisine', 'ambiance', 'service_type', etc.
  characteristic_value VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_places_search_keywords ON places USING GIN(search_keywords);
CREATE INDEX idx_places_metadata ON places USING GIN(metadata);
CREATE INDEX idx_place_characteristics_place_id ON place_characteristics(place_id);
```

#### 1.2 Place Metadata Structure
```typescript
interface PlaceMetadata {
  // Visual characteristics for better image matching
  visualCharacteristics: {
    exteriorType?: 'standalone' | 'mall' | 'street' | 'complex'
    interiorStyle?: 'modern' | 'traditional' | 'vintage' | 'casual' | 'upscale'
    primaryColors?: string[]
    distinctiveFeatures?: string[] // ['rooftop', 'garden', 'heritage building']
  }
  
  // Business information
  businessInfo: {
    isChain?: boolean
    parentBrand?: string // 'Corner House' for all branches
    yearEstablished?: number
    ownershipType?: 'franchise' | 'independent' | 'chain'
  }
  
  // Search optimization
  searchHints: {
    avoidTerms?: string[] // Terms that return wrong results
    mustIncludeTerms?: string[] // Essential search terms
    locationQualifiers?: string[] // ['100 Feet Road', 'Indiranagar']
  }
}
```

### 2. Intelligent Image Search Strategy

#### 2.1 Multi-Strategy Search System
```typescript
// lib/services/image-sources/strategies/index.ts
export interface SearchStrategy {
  name: string
  applicableFor: (place: EnhancedPlace) => boolean
  generateQueries: (place: EnhancedPlace) => string[]
  scoreResult: (place: EnhancedPlace, image: ImageResult) => number
}

export class SearchStrategyManager {
  private strategies: SearchStrategy[] = [
    new BrandedEstablishmentStrategy(),    // For chains like Corner House
    new LocalLandmarkStrategy(),           // For unique local places
    new GenericCategoryStrategy(),         // Fallback for generic places
    new StreetViewStrategy(),              // For exterior shots
    new MenuItemStrategy(),                // For restaurants/cafes
  ]
  
  async searchWithStrategies(
    place: EnhancedPlace,
    sources: ImageSource[]
  ): Promise<RankedImageResult[]> {
    const applicableStrategies = this.strategies
      .filter(s => s.applicableFor(place))
      .sort((a, b) => this.getStrategyPriority(a, place) - this.getStrategyPriority(b, place))
    
    const allResults: RankedImageResult[] = []
    
    for (const strategy of applicableStrategies) {
      const queries = strategy.generateQueries(place)
      
      for (const query of queries) {
        const results = await this.searchAllSources(query, sources)
        
        const rankedResults = results.map(result => ({
          ...result,
          relevanceScore: strategy.scoreResult(place, result),
          strategy: strategy.name,
          query: query
        }))
        
        allResults.push(...rankedResults)
        
        // Early exit if we found highly relevant results
        if (rankedResults.some(r => r.relevanceScore > 0.8)) {
          break
        }
      }
    }
    
    return this.deduplicateAndRank(allResults)
  }
}
```

#### 2.2 Specific Search Strategies

```typescript
// lib/services/image-sources/strategies/branded-establishment.ts
export class BrandedEstablishmentStrategy implements SearchStrategy {
  name = 'BrandedEstablishment'
  
  applicableFor(place: EnhancedPlace): boolean {
    return !!(place.brand_name || place.metadata?.businessInfo?.isChain)
  }
  
  generateQueries(place: EnhancedPlace): string[] {
    const brand = place.brand_name || place.name
    const location = place.metadata?.searchHints?.locationQualifiers || ['Indiranagar', 'Bangalore']
    
    return [
      // Most specific to least specific
      `"${brand}" ${location.join(' ')} exterior`,
      `"${brand}" ${location[0]} storefront`,
      `${brand} restaurant ${location[0]}`,
      `"${brand}" india outlet`,
      // Include interior shots
      `"${brand}" interior seating`,
      `"${brand}" ${place.category?.toLowerCase()} ambiance`
    ]
  }
  
  scoreResult(place: EnhancedPlace, image: ImageResult): number {
    let score = 0.5
    const brand = place.brand_name || place.name
    
    // Check for brand name in image metadata
    const hasExactBrand = [
      image.description,
      image.alt_description,
      ...image.tags
    ].some(text => text?.toLowerCase().includes(brand.toLowerCase()))
    
    if (hasExactBrand) score += 0.4
    
    // Check for location markers
    const hasLocation = place.metadata?.searchHints?.locationQualifiers?.some(
      loc => image.description?.toLowerCase().includes(loc.toLowerCase())
    )
    
    if (hasLocation) score += 0.1
    
    return Math.min(score, 1)
  }
}

// lib/services/image-sources/strategies/local-landmark.ts
export class LocalLandmarkStrategy implements SearchStrategy {
  name = 'LocalLandmark'
  
  applicableFor(place: EnhancedPlace): boolean {
    return place.category === 'Transportation' || 
           place.category === 'Landmarks' ||
           place.metadata?.visualCharacteristics?.distinctiveFeatures?.length > 0
  }
  
  generateQueries(place: EnhancedPlace): string[] {
    const queries = []
    
    if (place.category === 'Transportation' && place.name.includes('Metro')) {
      queries.push(
        `${place.name} entrance Bangalore`,
        `Namma Metro ${place.name.replace('Metro Station', '')}`,
        `Bangalore Metro purple line ${place.name.replace('Metro Station', '')}`
      )
    }
    
    // Add distinctive features
    const features = place.metadata?.visualCharacteristics?.distinctiveFeatures || []
    features.forEach(feature => {
      queries.push(`${place.name} ${feature}`)
    })
    
    return queries
  }
  
  scoreResult(place: EnhancedPlace, image: ImageResult): number {
    // Implementation similar to above
    return 0.7
  }
}
```

### 3. Enhanced Image Validation & Filtering

#### 3.1 Image Content Validation
```typescript
// lib/services/image-validation/index.ts
export class ImageValidator {
  async validateRelevance(
    image: ImageResult,
    place: EnhancedPlace,
    strategy: string
  ): Promise<ValidationResult> {
    const checks = [
      this.checkTextualRelevance(image, place),
      this.checkVisualCoherence(image, place),
      this.checkLocationContext(image, place),
      this.checkBrandConsistency(image, place),
    ]
    
    const results = await Promise.all(checks)
    const overallScore = results.reduce((sum, r) => sum + r.score * r.weight, 0) /
                         results.reduce((sum, r) => sum + r.weight, 0)
    
    return {
      isValid: overallScore > 0.6,
      score: overallScore,
      reasons: results.flatMap(r => r.reasons),
      suggestions: results.flatMap(r => r.suggestions)
    }
  }
  
  private checkBrandConsistency(image: ImageResult, place: EnhancedPlace) {
    if (!place.brand_name) return { score: 1, weight: 0, reasons: [] }
    
    // Check if image contains competing brands
    const competingBrands = this.getCompetingBrands(place.category)
    const hasCompetingBrand = competingBrands.some(brand => 
      image.description?.toLowerCase().includes(brand.toLowerCase()) ||
      image.tags?.some(tag => tag.toLowerCase().includes(brand.toLowerCase()))
    )
    
    if (hasCompetingBrand) {
      return {
        score: 0,
        weight: 2,
        reasons: ['Image shows competing brand'],
        suggestions: ['Filter out images with competing brand names']
      }
    }
    
    return { score: 1, weight: 1, reasons: [] }
  }
}
```

### 4. Fallback Image System

#### 4.1 Curated Fallback Images
```typescript
// lib/services/image-sources/fallback-images.ts
export class FallbackImageProvider {
  private fallbackImages: Map<string, FallbackImage[]> = new Map()
  
  constructor() {
    this.initializeFallbacks()
  }
  
  private initializeFallbacks() {
    // Category-based fallbacks
    this.fallbackImages.set('Food & Dining', [
      {
        url: '/images/fallbacks/restaurant-interior.jpg',
        description: 'Restaurant interior',
        attribution: { author: 'System', source: 'Internal' }
      },
      {
        url: '/images/fallbacks/dining-ambiance.jpg',
        description: 'Dining ambiance',
        attribution: { author: 'System', source: 'Internal' }
      }
    ])
    
    // Specific place type fallbacks
    this.fallbackImages.set('ice-cream-parlor', [
      {
        url: '/images/fallbacks/ice-cream-shop.jpg',
        description: 'Ice cream parlor',
        attribution: { author: 'System', source: 'Internal' }
      }
    ])
  }
  
  getFallbackImage(place: EnhancedPlace): ImageResult {
    // Try specific type first
    const typeImages = this.fallbackImages.get(
      place.establishment_type || place.subcategory || ''
    )
    
    if (typeImages?.length) {
      return this.selectBestFallback(typeImages, place)
    }
    
    // Fall back to category
    const categoryImages = this.fallbackImages.get(place.category || 'default')
    
    if (categoryImages?.length) {
      return this.selectBestFallback(categoryImages, place)
    }
    
    // Ultimate fallback
    return {
      url: '/images/fallbacks/default-place.jpg',
      description: 'Local establishment',
      attribution: { author: 'System', source: 'Internal' },
      relevanceScore: 0.3
    }
  }
}
```

### 5. Implementation Plan

#### Phase 1: Data Enhancement (Week 1)
1. **Manual Place Annotation**
   ```typescript
   // scripts/enhance-place-data.ts
   const placeEnhancements = {
     'Corner House Ice Cream': {
       brand_name: 'Corner House',
       establishment_type: 'ice-cream-parlor',
       search_keywords: ['corner house', 'ice cream', 'sundae', 'death by chocolate'],
       metadata: {
         businessInfo: {
           isChain: true,
           parentBrand: 'Corner House',
           yearEstablished: 1982
         },
         searchHints: {
           avoidTerms: ['corner', 'house'], // Too generic alone
           mustIncludeTerms: ['Corner House'],
           locationQualifiers: ['Indiranagar', '100 Feet Road']
         },
         visualCharacteristics: {
           primaryColors: ['red', 'white'],
           interiorStyle: 'casual',
           distinctiveFeatures: ['red signage', 'ice cream display']
         }
       }
     },
     'Church Street Social': {
       brand_name: 'Social',
       establishment_type: 'gastropub',
       search_keywords: ['social', 'gastropub', 'church street social', 'bar'],
       metadata: {
         businessInfo: {
           isChain: true,
           parentBrand: 'Social',
           ownershipType: 'chain'
         },
         searchHints: {
           mustIncludeTerms: ['Social gastropub', 'Church Street Social'],
           locationQualifiers: ['Church Street', 'Bangalore']
         }
       }
     }
   }
   ```

2. **Database Migration**
   ```sql
   -- migrations/add_place_metadata.sql
   BEGIN;
   
   ALTER TABLE places ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255);
   ALTER TABLE places ADD COLUMN IF NOT EXISTS establishment_type VARCHAR(100);
   ALTER TABLE places ADD COLUMN IF NOT EXISTS search_keywords TEXT[];
   ALTER TABLE places ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
   
   -- Update existing places
   UPDATE places SET
     brand_name = 'Corner House',
     establishment_type = 'ice-cream-parlor',
     search_keywords = ARRAY['corner house', 'ice cream', 'death by chocolate'],
     metadata = '{"businessInfo": {"isChain": true}}'::jsonb
   WHERE name = 'Corner House Ice Cream';
   
   COMMIT;
   ```

#### Phase 2: Search Strategy Implementation (Week 1-2)
1. Implement SearchStrategy interface and concrete strategies
2. Create SearchStrategyManager
3. Integrate with existing ImageSourceManager
4. Add validation layer

#### Phase 3: Testing & Refinement (Week 2)
1. Create test suite for each strategy
2. Manual testing with real places
3. Collect feedback and refine scoring
4. Add monitoring for image relevance

### 6. Success Metrics

1. **Relevance Score**: Average relevance score > 0.7 for discovered images
2. **User Satisfaction**: Reduced complaints about irrelevant images
3. **Fallback Rate**: < 10% of places need to use fallback images
4. **Search Efficiency**: < 2 seconds to find relevant image
5. **Brand Accuracy**: 95%+ accuracy for branded establishments

### 7. Technical Considerations

#### 7.1 Performance Optimization
- Cache search strategies per place type
- Implement request deduplication
- Use Redis for strategy result caching
- Batch similar searches

#### 7.2 Cost Management
- Implement daily API rate limits
- Cache successful searches for 30 days
- Use tiered search (try cheap sources first)
- Monitor API usage per strategy

#### 7.3 Extensibility
- Plugin architecture for new strategies
- Easy addition of new image sources
- Configurable scoring weights
- A/B testing framework for strategies

### 8. Migration Strategy

#### Step 1: Non-Breaking Addition
```typescript
// Add new fields without breaking existing code
interface EnhancedPlace extends Place {
  brand_name?: string
  establishment_type?: string
  search_keywords?: string[]
  metadata?: PlaceMetadata
}
```

#### Step 2: Gradual Enhancement
1. Deploy new search system alongside old one
2. Use feature flag to control rollout
3. A/B test with subset of places
4. Monitor metrics and refine
5. Full rollout after validation

### 9. Developer Implementation Guide

#### Quick Start for Dev Agent
```typescript
// 1. Install dependencies
npm install --save string-similarity

// 2. Create new search strategy
export class YourStrategy implements SearchStrategy {
  name = 'YourStrategy'
  
  applicableFor(place: EnhancedPlace): boolean {
    // Define when this strategy applies
    return place.category === 'YourCategory'
  }
  
  generateQueries(place: EnhancedPlace): string[] {
    // Return search queries in order of specificity
    return ['most specific query', 'fallback query']
  }
  
  scoreResult(place: EnhancedPlace, image: ImageResult): number {
    // Score from 0-1 based on relevance
    return 0.5
  }
}

// 3. Register strategy
const searchManager = new SearchStrategyManager()
searchManager.registerStrategy(new YourStrategy())

// 4. Use in image discovery
const images = await searchManager.searchWithStrategies(place, imageSources)
```

### 10. Rollback Plan

If issues arise:
1. Feature flag to disable new search system
2. Revert to simple search via environment variable
3. Clear image cache to force re-fetch
4. Database changes are backward compatible

## Conclusion

This architecture addresses the root causes of irrelevant image results by:
1. Adding rich metadata to places
2. Using intelligent, context-aware search strategies
3. Validating image relevance before display
4. Providing appropriate fallbacks
5. Enabling continuous improvement through metrics

The phased approach ensures safe deployment while the modular design allows for easy extension and refinement.