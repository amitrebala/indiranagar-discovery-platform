export interface ImageAttribution {
  author: string
  source: string
  license?: string
  url?: string
}

export interface ImageResult {
  url: string
  thumbnail?: string
  width?: number
  height?: number
  attribution: ImageAttribution
  relevanceScore?: number
  tags?: string[]
  metadata?: {
    matchedTerms?: string[]
    searchStrategy?: string
  }
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface ImageSource {
  name: string
  priority: number
  search: (query: string, options?: { 
    location?: Coordinates
    limit?: number 
  }) => Promise<ImageResult[]>
  isAvailable: () => boolean
}