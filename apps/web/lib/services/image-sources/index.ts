import { ImageSource, ImageResult, Coordinates } from './types'
import { UnsplashSource } from './unsplash'
import { SearchStrategyManager } from './strategies/manager'
import { ImageValidator } from './validator'
import { FallbackImageProvider } from './fallback-provider'
import { EnhancedPlace, ImageSearchResult } from './enhanced-types'

export * from './types'
export * from './enhanced-types'

interface SearchOptions {
  place?: EnhancedPlace
  location?: Coordinates
  limit?: number
  timeout?: number
}

export class ImageSourceManager {
  private sources: ImageSource[] = []
  private strategyManager: SearchStrategyManager
  private validator: ImageValidator
  private fallbackProvider: FallbackImageProvider

  constructor() {
    this.initializeSources()
    this.strategyManager = new SearchStrategyManager()
    this.validator = new ImageValidator()
    this.fallbackProvider = new FallbackImageProvider()
  }

  private initializeSources() {
    const unsplash = new UnsplashSource()
    
    if (unsplash.isAvailable()) {
      this.sources.push(unsplash)
    }

    this.sources.sort((a, b) => a.priority - b.priority)
  }

  async findImages(
    placeName: string,
    options?: SearchOptions
  ): Promise<ImageResult[]> {
    if (this.sources.length === 0) {
      console.warn('No image sources available')
      return []
    }

    // If we have enhanced place data, use strategy-based search
    if (options?.place && this.hasEnhancedMetadata(options.place)) {
      const results = await this.strategyManager.searchWithStrategies(
        options.place,
        this.sources,
        {
          limit: options.limit,
          timeout: options.timeout
        }
      )

      // Validate and filter results
      const validResults = results.filter(result => 
        this.validator.validateImage(result, options.place!)
      )

      // Apply quality scoring
      const scoredResults = validResults.map(result => ({
        ...result,
        relevanceScore: result.relevanceScore * this.validator.scoreImageQuality(result)
      }))

      // If we have good results, return them
      if (scoredResults.length > 0) {
        return this.convertToImageResults(scoredResults, options.limit || 5)
      }

      // Otherwise, fall back to default search with fallback image
      const legacyResults = await this.legacySearch(placeName, options)
      if (legacyResults.length === 0) {
        return [this.fallbackProvider.getFallbackImage(options.place)]
      }
      return legacyResults
    }

    // Legacy search for places without metadata
    return this.legacySearch(placeName, options)
  }

  private hasEnhancedMetadata(place: EnhancedPlace): boolean {
    return !!(place.brand_name || place.establishment_type || place.metadata || 
      (place.search_keywords && place.search_keywords.length > 0))
  }

  private convertToImageResults(searchResults: ImageSearchResult[], limit: number): ImageResult[] {
    return searchResults
      .slice(0, limit)
      .map(result => ({
        url: result.url,
        thumbnail: result.thumbnail,
        width: result.width,
        height: result.height,
        attribution: result.attribution,
        relevanceScore: result.relevanceScore,
        tags: result.tags,
        metadata: result.metadata
      }))
  }

  private async legacySearch(
    placeName: string,
    options?: SearchOptions
  ): Promise<ImageResult[]> {
    const searchPromises = this.sources.map(source => 
      this.searchWithTimeout(source, placeName, options)
    )

    const results = await Promise.allSettled(searchPromises)
    
    const allImages: ImageResult[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allImages.push(...result.value)
      } else if (result.status === 'rejected') {
        console.error(`${this.sources[index].name} search failed:`, result.reason)
      }
    })

    return this.rankAndDeduplicate(allImages, options?.limit || 5)
  }

  private async searchWithTimeout(
    source: ImageSource,
    query: string,
    options?: SearchOptions
  ): Promise<ImageResult[]> {
    const timeout = options?.timeout || 5000
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`${source.name} search timeout`)), timeout)
    )

    try {
      return await Promise.race([
        source.search(query, options),
        timeoutPromise
      ])
    } catch (error) {
      console.error(`${source.name} search error:`, error)
      return []
    }
  }

  private rankAndDeduplicate(images: ImageResult[], limit: number): ImageResult[] {
    const uniqueImages = new Map<string, ImageResult>()

    images.forEach(image => {
      const key = this.getImageKey(image.url)
      const existing = uniqueImages.get(key)
      
      if (!existing || (image.relevanceScore || 0) > (existing.relevanceScore || 0)) {
        uniqueImages.set(key, image)
      }
    })

    return Array.from(uniqueImages.values())
      .sort((a, b) => {
        const scoreA = a.relevanceScore || 0
        const scoreB = b.relevanceScore || 0
        
        if (Math.abs(scoreA - scoreB) < 0.1) {
          return a.width && b.width ? b.width - a.width : 0
        }
        
        return scoreB - scoreA
      })
      .slice(0, limit)
  }

  private getImageKey(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  getAvailableSources(): string[] {
    return this.sources.map(source => source.name)
  }
}