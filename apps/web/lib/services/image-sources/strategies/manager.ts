import { SearchStrategy } from './types'
import { BrandedEstablishmentStrategy } from './branded-establishment'
import { LocalLandmarkStrategy } from './local-landmark'
import { GenericPlaceStrategy } from './generic-place'
import { EnhancedPlace, ImageSearchResult } from '../enhanced-types'
import { ImageSource, ImageResult } from '../types'

export class SearchStrategyManager {
  private strategies: SearchStrategy[] = []
  private debugMode: boolean

  constructor() {
    this.debugMode = process.env.NEXT_PUBLIC_DEBUG_IMAGE_SEARCH === 'true'
    this.initializeStrategies()
  }

  private initializeStrategies() {
    // Order matters - higher priority strategies are tried first
    this.strategies = [
      new BrandedEstablishmentStrategy(),
      new LocalLandmarkStrategy(),
      new GenericPlaceStrategy()
    ].sort((a, b) => a.priority - b.priority)
  }

  async searchWithStrategies(
    place: EnhancedPlace,
    sources: ImageSource[],
    options?: { limit?: number; timeout?: number }
  ): Promise<ImageSearchResult[]> {
    const applicableStrategies = this.strategies.filter(strategy => 
      strategy.applicableFor(place)
    )

    if (this.debugMode) {
      console.log(`[ImageSearch] Place: ${place.name}`)
      console.log(`[ImageSearch] Applicable strategies: ${applicableStrategies.map(s => s.name).join(', ')}`)
    }

    const allResults: ImageSearchResult[] = []
    
    // Try each strategy in order
    for (const strategy of applicableStrategies) {
      const queries = strategy.generateQueries(place)
      
      if (this.debugMode) {
        console.log(`[ImageSearch] Strategy ${strategy.name} queries:`, queries)
      }

      // Search with each query
      for (const query of queries) {
        const enhancedQuery = strategy.enhanceQuery ? 
          strategy.enhanceQuery(query, place) : query
        
        const results = await this.searchWithQuery(
          enhancedQuery,
          sources,
          options
        )

        // Score and enhance results
        const scoredResults = results.map(result => ({
          ...result,
          relevanceScore: strategy.scoreResult(place, result),
          metadata: {
            ...result.metadata,
            searchStrategy: strategy.name,
            matchedTerms: this.extractMatchedTerms(enhancedQuery, result)
          }
        }))

        allResults.push(...scoredResults)

        // If we have enough high-quality results, stop searching
        const highQualityResults = allResults.filter(r => r.relevanceScore > 0.7)
        if (highQualityResults.length >= (options?.limit || 5)) {
          break
        }
      }

      // Check if we have enough results after this strategy
      if (allResults.length >= (options?.limit || 5) * 2) {
        break
      }
    }

    // Sort by relevance and deduplicate
    return this.rankAndDeduplicate(allResults, options?.limit || 5)
  }

  private async searchWithQuery(
    query: string,
    sources: ImageSource[],
    options?: { limit?: number; timeout?: number }
  ): Promise<ImageResult[]> {
    const searchPromises = sources.map(source =>
      this.searchWithTimeout(source, query, options)
    )

    const results = await Promise.allSettled(searchPromises)
    const allImages: ImageResult[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allImages.push(...result.value)
      } else if (result.status === 'rejected' && this.debugMode) {
        console.error(`[ImageSearch] ${sources[index].name} failed:`, result.reason)
      }
    })

    return allImages
  }

  private async searchWithTimeout(
    source: ImageSource,
    query: string,
    options?: { limit?: number; timeout?: number }
  ): Promise<ImageResult[]> {
    const timeout = options?.timeout || 5000
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${source.name} timeout`)), timeout)
    )

    try {
      return await Promise.race([
        source.search(query, { limit: options?.limit || 3 }),
        timeoutPromise
      ])
    } catch (error) {
      if (this.debugMode) {
        console.error(`[ImageSearch] ${source.name} error:`, error)
      }
      return []
    }
  }

  private rankAndDeduplicate(
    images: ImageSearchResult[],
    limit: number
  ): ImageSearchResult[] {
    const uniqueImages = new Map<string, ImageSearchResult>()

    images.forEach(image => {
      const key = this.getImageKey(image.url)
      const existing = uniqueImages.get(key)
      
      if (!existing || image.relevanceScore > existing.relevanceScore) {
        uniqueImages.set(key, image)
      }
    })

    return Array.from(uniqueImages.values())
      .sort((a, b) => {
        // Sort by relevance score
        const scoreDiff = b.relevanceScore - a.relevanceScore
        if (Math.abs(scoreDiff) > 0.1) {
          return scoreDiff
        }
        
        // If scores are similar, prefer larger images
        return (b.width || 0) - (a.width || 0)
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

  private extractMatchedTerms(query: string, result: ImageResult): string[] {
    const queryTerms = query.toLowerCase().split(/\s+/)
    const resultText = [
      ...(result.tags || []),
      result.attribution.author,
      result.attribution.source
    ].join(' ').toLowerCase()

    return queryTerms.filter(term => 
      term.length > 2 && resultText.includes(term)
    )
  }
}