import { EnhancedPlace, ImageSearchResult } from '../enhanced-types'
import { ImageResult, ImageSource } from '../types'

export interface SearchStrategy {
  name: string
  priority: number
  applicableFor: (place: EnhancedPlace) => boolean
  generateQueries: (place: EnhancedPlace) => string[]
  scoreResult: (place: EnhancedPlace, image: ImageResult) => number
  enhanceQuery?: (query: string, place: EnhancedPlace) => string
}

export interface StrategyResult {
  strategyName: string
  results: ImageSearchResult[]
  queries: string[]
}

export interface SearchContext {
  place: EnhancedPlace
  sources: ImageSource[]
  options?: {
    limit?: number
    timeout?: number
  }
}