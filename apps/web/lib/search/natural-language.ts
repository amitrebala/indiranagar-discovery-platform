import type { SearchFilters, SearchContext } from './search-engine'

export interface ParsedQuery {
  mood?: string
  time_preference?: string
  category_hints: string[]
  weather_context?: string
  price_hints?: string
  crowd_preference?: string
  original_query: string
}

export class NaturalLanguageProcessor {
  private static moodPatterns = {
    'rainy': ['rainy', 'wet', 'monsoon', 'indoor', 'covered', 'shelter'],
    'quiet': ['quiet', 'peaceful', 'calm', 'serene', 'tranquil', 'relaxing'],
    'lively': ['lively', 'busy', 'energetic', 'vibrant', 'bustling', 'crowded'],
    'romantic': ['romantic', 'date', 'intimate', 'cozy', 'candlelit', 'couples'],
    'casual': ['casual', 'laid-back', 'relaxed', 'informal', 'easy-going'],
    'upscale': ['upscale', 'fancy', 'elegant', 'sophisticated', 'fine', 'premium']
  }

  private static timePatterns = {
    'morning': ['morning', 'breakfast', 'early', 'sunrise', 'dawn', 'am'],
    'afternoon': ['afternoon', 'lunch', 'midday', 'noon', 'pm'],
    'evening': ['evening', 'dinner', 'sunset', 'night', 'late']
  }

  private static categoryPatterns = {
    'food': ['food', 'eat', 'dining', 'meal', 'hungry'],
    'coffee': ['coffee', 'cafe', 'espresso', 'latte', 'cappuccino', 'caffeine'],
    'restaurant': ['restaurant', 'dine', 'dinner', 'lunch', 'cuisine'],
    'drinks': ['drinks', 'bar', 'cocktail', 'beer', 'wine', 'alcohol'],
    'shopping': ['shop', 'buy', 'market', 'store', 'purchase'],
    'activity': ['activity', 'fun', 'entertainment', 'experience', 'adventure']
  }

  private static weatherPatterns = {
    'rainy': ['rainy', 'rain', 'wet', 'drizzle', 'monsoon', 'storm'],
    'sunny': ['sunny', 'sun', 'bright', 'clear', 'sunshine'],
    'hot': ['hot', 'warm', 'heat', 'sweltering', 'scorching'],
    'cool': ['cool', 'cold', 'chilly', 'fresh', 'crisp'],
    'cloudy': ['cloudy', 'overcast', 'gray', 'grey', 'gloomy']
  }

  private static pricePatterns = {
    'budget': ['cheap', 'budget', 'affordable', 'inexpensive', 'economical'],
    'moderate': ['moderate', 'reasonable', 'fair', 'mid-range'],
    'premium': ['expensive', 'premium', 'upscale', 'luxury', 'high-end', 'fancy']
  }

  private static crowdPatterns = {
    'low': ['quiet', 'peaceful', 'empty', 'not crowded', 'less busy'],
    'moderate': ['moderate', 'normal', 'average', 'typical'],
    'high': ['busy', 'crowded', 'popular', 'packed', 'bustling']
  }

  static parseQuery(query: string): ParsedQuery {
    const lowerQuery = query.toLowerCase()
    
    return {
      mood: this.extractMood(lowerQuery),
      time_preference: this.extractTime(lowerQuery),
      category_hints: this.extractCategories(lowerQuery),
      weather_context: this.extractWeatherContext(lowerQuery),
      price_hints: this.extractPriceHints(lowerQuery),
      crowd_preference: this.extractCrowdPreference(lowerQuery),
      original_query: query
    }
  }

  private static extractMood(query: string): string | undefined {
    for (const [mood, patterns] of Object.entries(this.moodPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return mood
      }
    }
    return undefined
  }

  private static extractTime(query: string): string | undefined {
    for (const [time, patterns] of Object.entries(this.timePatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return time
      }
    }
    return undefined
  }

  private static extractCategories(query: string): string[] {
    const categories: string[] = []
    
    for (const [category, patterns] of Object.entries(this.categoryPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        categories.push(category)
      }
    }
    
    return categories
  }

  private static extractWeatherContext(query: string): string | undefined {
    for (const [weather, patterns] of Object.entries(this.weatherPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return weather
      }
    }
    return undefined
  }

  private static extractPriceHints(query: string): string | undefined {
    for (const [price, patterns] of Object.entries(this.pricePatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return price
      }
    }
    return undefined
  }

  private static extractCrowdPreference(query: string): string | undefined {
    for (const [crowd, patterns] of Object.entries(this.crowdPatterns)) {
      if (patterns.some(pattern => query.includes(pattern))) {
        return crowd
      }
    }
    return undefined
  }

  static generateSearchFilters(
    parsedQuery: ParsedQuery,
    context: SearchContext
  ): Partial<SearchFilters> {
    const filters: Partial<SearchFilters> = {}

    // Apply mood-based filtering
    if (parsedQuery.mood === 'quiet') {
      filters.crowd_level = 'low'
    } else if (parsedQuery.mood === 'lively') {
      filters.crowd_level = 'high'
    }

    // Apply weather context
    if (parsedQuery.weather_context === 'rainy' || context.current_weather?.condition.includes('rain')) {
      filters.weather_suitability = ['rainy', 'covered', 'indoor']
    } else if (parsedQuery.weather_context === 'sunny') {
      filters.weather_suitability = ['sunny', 'outdoor']
    }

    // Apply category hints  
    if (parsedQuery.category_hints.length > 0) {
      const categoryMap: Record<string, string[]> = {
        'food': ['restaurant', 'street_food', 'food_court'],
        'coffee': ['cafe', 'coffee_shop'],
        'restaurant': ['restaurant', 'fine_dining'],
        'drinks': ['bar', 'pub', 'lounge'],
        'shopping': ['shop', 'market', 'mall'],
        'activity': ['activity', 'entertainment']
      }

      const categories: string[] = []
      parsedQuery.category_hints.forEach(hint => {
        if (categoryMap[hint]) {
          categories.push(...categoryMap[hint])
        }
      })
      
      if (categories.length > 0) {
        filters.categories = categories
      }
    }

    // Apply price hints
    if (parsedQuery.price_hints) {
      filters.price_range = parsedQuery.price_hints as any
    }

    // Apply crowd preference
    if (parsedQuery.crowd_preference) {
      filters.crowd_level = parsedQuery.crowd_preference as any
    }

    return filters
  }

  static generateSuggestions(query: string): string[] {
    const suggestions: string[] = []
    const lowerQuery = query.toLowerCase()

    // Mood-based suggestions
    if (lowerQuery.includes('quiet')) {
      suggestions.push('quiet morning coffee', 'peaceful reading spot', 'quiet dinner place')
    }
    if (lowerQuery.includes('romantic')) {
      suggestions.push('romantic dinner', 'intimate date spot', 'cozy evening place')
    }
    if (lowerQuery.includes('coffee')) {
      suggestions.push('morning coffee', 'coffee with wifi', 'artisan coffee shop')
    }
    if (lowerQuery.includes('lunch')) {
      suggestions.push('quick lunch', 'business lunch', 'healthy lunch options')
    }
    if (lowerQuery.includes('rain')) {
      suggestions.push('rainy day spots', 'covered seating', 'indoor activities')
    }

    // Time-based suggestions
    const hour = new Date().getHours()
    if (hour < 12) {
      suggestions.push('breakfast spots', 'morning coffee', 'early morning walk')
    } else if (hour < 17) {
      suggestions.push('lunch places', 'afternoon tea', 'midday break')
    } else {
      suggestions.push('dinner restaurants', 'evening drinks', 'night out')
    }

    // Remove duplicates and limit
    return [...new Set(suggestions)].slice(0, 6)
  }

  static explainQuery(parsedQuery: ParsedQuery): string {
    const explanations: string[] = []

    if (parsedQuery.mood) {
      explanations.push(`Looking for ${parsedQuery.mood} places`)
    }

    if (parsedQuery.time_preference) {
      explanations.push(`Best for ${parsedQuery.time_preference}`)
    }

    if (parsedQuery.category_hints.length > 0) {
      explanations.push(`Categories: ${parsedQuery.category_hints.join(', ')}`)
    }

    if (parsedQuery.weather_context) {
      explanations.push(`Suitable for ${parsedQuery.weather_context} weather`)
    }

    if (parsedQuery.price_hints) {
      explanations.push(`${parsedQuery.price_hints} price range`)
    }

    if (explanations.length === 0) {
      return 'General search'
    }

    return explanations.join(' • ')
  }

  // Contextual query enhancement
  static enhanceQuery(query: string, context: SearchContext): string {
    let enhancedQuery = query

    // Add time context if not already specified
    if (!this.extractTime(query.toLowerCase()) && context.time_of_day) {
      enhancedQuery += ` ${context.time_of_day}`
    }

    // Add weather context if relevant
    if (context.current_weather && !this.extractWeatherContext(query.toLowerCase())) {
      const condition = context.current_weather.condition.toLowerCase()
      if (condition.includes('rain')) {
        enhancedQuery += ' indoor covered'
      } else if (condition.includes('sun')) {
        enhancedQuery += ' outdoor sunny'
      }
    }

    return enhancedQuery
  }
}