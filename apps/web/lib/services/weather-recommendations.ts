import { supabase } from '@/lib/supabase/client';
import { WeatherConditions, PlaceRecommendation } from '@/lib/types/journey';

export class WeatherRecommendations {
  async getRecommendations(
    weather: WeatherConditions,
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  ): Promise<PlaceRecommendation[]> {
    const { data: places } = await supabase
      .from('places')
      .select('*')
      .eq('has_amit_visited', true);
    
    if (!places) return [];
    
    // Score each place based on weather conditions
    const scored = places.map(place => {
      let score = 0.5; // Base score
      let reason = '';
      
      // Hot weather recommendations (> 30°C)
      if (weather.temp > 30) {
        // Prefer air-conditioned places
        if (place.has_ac || place.category === 'mall' || place.category === 'cafe') {
          score += 0.3;
          reason = 'Perfect for escaping the heat with AC';
        }
        
        // Indoor dining preferences
        if (place.category === 'restaurant' && place.has_indoor_seating) {
          score += 0.2;
          reason = 'Cool indoor dining away from the heat';
        }
        
        // Penalize outdoor-only places
        if (place.has_outdoor_seating && !place.has_indoor_seating) {
          score -= 0.4;
        }
        
        // Ice cream, cold drinks, etc.
        if (place.category === 'dessert' || place.category === 'ice_cream') {
          score += 0.3;
          reason = 'Perfect for cooling down';
        }
      }
      
      // Rainy weather recommendations
      if (weather.rain_chance > 50) {
        // Covered or indoor places
        if (place.has_covered_area || place.is_indoor || place.category === 'mall') {
          score += 0.4;
          reason = 'Great indoor option for rainy weather';
        }
        
        // Cozy cafes and restaurants
        if (place.category === 'cafe' || place.category === 'restaurant') {
          score += 0.2;
          reason = 'Perfect cozy spot to wait out the rain';
        }
        
        // Avoid outdoor activities
        if (place.category === 'park' || place.category === 'outdoor_activity') {
          score -= 0.5;
        }
        
        // Places with good ambiance for rainy days
        if (place.ambiance?.includes('cozy') || place.ambiance?.includes('intimate')) {
          score += 0.2;
          reason = 'Cozy atmosphere perfect for rainy days';
        }
      }
      
      // Pleasant weather (20-28°C, low rain chance)
      if (weather.temp >= 20 && weather.temp <= 28 && weather.rain_chance < 30) {
        // Outdoor seating is great
        if (place.has_outdoor_seating || place.category === 'rooftop') {
          score += 0.3;
          reason = 'Enjoy the perfect weather outdoors';
        }
        
        // Parks and outdoor activities
        if (place.category === 'park' || place.category === 'outdoor_activity') {
          score += 0.4;
          reason = 'Ideal weather for outdoor experiences';
        }
        
        // Street food and markets
        if (place.category === 'street_food' || place.category === 'market') {
          score += 0.2;
          reason = 'Perfect weather for exploring outdoor food';
        }
      }
      
      // Cold weather recommendations (< 20°C)
      if (weather.temp < 20) {
        // Warm, cozy places
        if (place.category === 'cafe' && place.serves_hot_beverages) {
          score += 0.3;
          reason = 'Warm up with hot coffee';
        }
        
        // Indoor activities
        if (place.is_indoor || place.category === 'gallery' || place.category === 'museum') {
          score += 0.2;
          reason = 'Comfortable indoor experience';
        }
        
        // Penalize outdoor seating
        if (place.has_outdoor_seating && !place.has_indoor_seating) {
          score -= 0.2;
        }
      }
      
      // High humidity adjustments
      if (weather.humidity > 70) {
        if (place.has_ac || place.has_good_ventilation) {
          score += 0.2;
          reason = reason || 'Good ventilation for humid weather';
        }
      }
      
      // Time of day adjustments
      switch (timeOfDay) {
        case 'morning':
          if (place.serves_breakfast || place.category === 'cafe') {
            score += 0.2;
            reason = reason || 'Perfect for morning coffee and breakfast';
          }
          break;
          
        case 'afternoon':
          if (place.category === 'restaurant' || place.category === 'lunch_spot') {
            score += 0.1;
          }
          break;
          
        case 'evening':
          if (place.good_for_groups || place.category === 'restaurant') {
            score += 0.1;
            reason = reason || 'Great for evening gatherings';
          }
          if (place.has_outdoor_seating && weather.temp >= 20 && weather.temp <= 28) {
            score += 0.2;
            reason = 'Perfect evening weather for outdoor dining';
          }
          break;
          
        case 'night':
          if (place.category === 'bar' || place.category === 'nightlife') {
            score += 0.2;
            reason = reason || 'Perfect nighttime spot';
          }
          break;
      }
      
      // Seasonal adjustments based on current month
      const month = new Date().getMonth() + 1;
      
      // Summer months (April-June)
      if (month >= 4 && month <= 6) {
        if (place.category === 'ice_cream' || place.serves_cold_drinks) {
          score += 0.2;
        }
      }
      
      // Monsoon months (July-September)  
      if (month >= 7 && month <= 9) {
        if (place.has_covered_area) {
          score += 0.3;
        }
      }
      
      return {
        place,
        score: Math.min(score, 1),
        reason: reason || this.generateGenericReason(place, weather, timeOfDay)
      };
    });
    
    // Sort by score and return top recommendations
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
  
  private generateGenericReason(place: any, weather: WeatherConditions, timeOfDay: string): string {
    const reasons = [
      `Great ${place.category} for today's ${weather.weather} weather`,
      `Recommended for current ${Math.round(weather.temp)}°C conditions`,
      `Perfect choice for ${timeOfDay} in ${weather.weather} weather`,
      `Amit's pick for days like this`,
      `Ideal spot given the current weather conditions`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
  
  async getJourneyRecommendations(
    weather: WeatherConditions
  ): Promise<any[]> {
    const { data: journeys } = await supabase
      .from('journeys')
      .select('*');
    
    if (!journeys) return [];
    
    // Filter and score journeys based on weather suitability
    const suitableJourneys = journeys.map(journey => {
      let score = 0.5; // Base score
      let weatherNote = '';
      
      // Convert legacy journey to have weather suitability
      const weatherSuitability = this.inferWeatherSuitability(journey);
      
      // Check avoid conditions
      if (weather.rain_chance > 70 && weatherSuitability.avoid_conditions.includes('heavy_rain')) {
        score -= 0.4;
        weatherNote = 'May not be ideal due to heavy rain';
      }
      
      if (weather.temp > 35 && weatherSuitability.avoid_conditions.includes('extreme_heat')) {
        score -= 0.3;
        weatherNote = 'Too hot for comfortable walking';
      }
      
      // Check ideal conditions
      if (weather.temp >= 20 && weather.temp <= 28 && weatherSuitability.ideal_conditions.includes('pleasant')) {
        score += 0.4;
        weatherNote = 'Perfect weather for this journey!';
      }
      
      if (weather.weather === 'clear' && weatherSuitability.ideal_conditions.includes('sunny')) {
        score += 0.3;
        weatherNote = 'Beautiful sunny weather for exploring';
      }
      
      // Time-based scoring
      const hour = new Date().getHours();
      if (journey.vibe_tags?.includes('morning') && hour < 12) {
        score += 0.2;
      }
      if (journey.vibe_tags?.includes('evening') && hour >= 17) {
        score += 0.2;
      }
      
      return {
        ...journey,
        weather_score: score,
        weather_note: weatherNote,
        weather_suitability: weatherSuitability
      };
    }).filter(journey => journey.weather_score > 0.3) // Only include suitable journeys
      .sort((a, b) => b.weather_score - a.weather_score)
      .slice(0, 5);
    
    return suitableJourneys;
  }
  
  private inferWeatherSuitability(journey: any) {
    // Infer weather suitability from journey characteristics
    const vibeTags = journey.vibe_tags || [];
    
    const suitability = {
      ideal_conditions: ['pleasant'] as string[],
      acceptable_conditions: ['cloudy', 'partly_cloudy'] as string[],
      avoid_conditions: [] as string[],
      seasonal_notes: {
        summer: 'Best during cooler hours',
        monsoon: 'Check weather conditions',
        winter: 'Perfect any time of day'
      }
    };
    
    // Outdoor-focused journeys
    if (vibeTags.includes('outdoor') || vibeTags.includes('nature')) {
      suitability.ideal_conditions.push('sunny', 'clear');
      suitability.avoid_conditions.push('heavy_rain');
    }
    
    // Walking-heavy journeys
    if (journey.title?.toLowerCase().includes('walk') || vibeTags.includes('walking')) {
      suitability.avoid_conditions.push('extreme_heat', 'heavy_rain');
      suitability.ideal_conditions.push('cool_breeze');
    }
    
    // Food-focused journeys
    if (vibeTags.includes('food') || vibeTags.includes('culinary')) {
      suitability.acceptable_conditions.push('light_rain');
    }
    
    // Cultural/indoor journeys
    if (vibeTags.includes('cultural') || vibeTags.includes('indoor')) {
      suitability.acceptable_conditions.push('light_rain', 'hot');
    }
    
    return suitability;
  }
}