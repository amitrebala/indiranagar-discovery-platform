import { Place } from '@/lib/supabase/types'

// Enhanced place type with metadata for image search
export interface EnhancedPlace extends Place {
  brand_name?: string | null
  establishment_type?: string | null
  search_keywords?: string[] | null
  metadata?: PlaceSearchMetadata | null
}

export interface PlaceSearchMetadata extends Record<string, unknown> {
  businessInfo?: {
    isChain?: boolean
    parentBrand?: string
  }
  searchHints?: {
    mustIncludeTerms?: string[]
    avoidTerms?: string[]
    locationQualifiers?: string[]
  }
}

export interface SearchOptions {
  place?: EnhancedPlace
  location?: { lat: number; lng: number }
  limit?: number
  timeout?: number
}

export interface ImageSearchResult {
  url: string
  thumbnail?: string
  width?: number
  height?: number
  attribution: {
    author: string
    source: string
    license?: string
    url?: string
  }
  relevanceScore: number
  tags?: string[]
  metadata?: {
    matchedTerms?: string[]
    searchStrategy?: string
  }
}