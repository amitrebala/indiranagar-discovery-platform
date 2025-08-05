import { ImageSource, ImageResult } from './types'

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  width: number
  height: number
  user: {
    name: string
    username: string
  }
  description?: string
  alt_description?: string
  tags?: Array<{ title: string }>
}

export class UnsplashSource implements ImageSource {
  name = 'Unsplash'
  priority = 1
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }

  async search(query: string, options?: { limit?: number }): Promise<ImageResult[]> {
    if (!this.isAvailable()) {
      return []
    }

    const limit = options?.limit || 3
    const searchQuery = encodeURIComponent(`${query} india bangalore`)

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=${limit}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${this.apiKey}`,
          },
        }
      )

      if (!response.ok) {
        console.error('Unsplash API error:', response.statusText)
        return []
      }

      const data = await response.json()
      const photos: UnsplashPhoto[] = data.results || []

      return photos.map((photo) => ({
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        width: photo.width,
        height: photo.height,
        attribution: {
          author: photo.user.name,
          source: 'Unsplash',
          url: `https://unsplash.com/@${photo.user.username}?utm_source=indiranagar_discovery&utm_medium=referral`,
        },
        tags: photo.tags?.map(tag => tag.title) || [],
        relevanceScore: this.calculateRelevance(query, photo),
        metadata: {
          searchStrategy: 'Unsplash API'
        }
      }))
    } catch (error) {
      console.error('Unsplash search error:', error)
      return []
    }
  }

  private calculateRelevance(query: string, photo: UnsplashPhoto): number {
    const queryLower = query.toLowerCase()
    let score = 0.5

    if (photo.description?.toLowerCase().includes(queryLower)) {
      score += 0.3
    }

    if (photo.alt_description?.toLowerCase().includes(queryLower)) {
      score += 0.2
    }

    const relevantTags = photo.tags?.filter(tag => 
      tag.title.toLowerCase().includes(queryLower) ||
      queryLower.includes(tag.title.toLowerCase())
    ).length || 0

    score += Math.min(relevantTags * 0.1, 0.3)

    return Math.min(score, 1)
  }
}