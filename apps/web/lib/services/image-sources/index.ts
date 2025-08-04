import { ImageSource, ImageResult, Coordinates } from './types'
import { UnsplashSource } from './unsplash'

export * from './types'

interface SearchOptions {
  location?: Coordinates
  limit?: number
  timeout?: number
}

export class ImageSourceManager {
  private sources: ImageSource[] = []

  constructor() {
    this.initializeSources()
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