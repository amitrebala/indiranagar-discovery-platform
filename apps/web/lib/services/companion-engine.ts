import { supabase } from '@/lib/supabase/client';
import { CompanionSuggestion } from '@/lib/types/journey';

export class CompanionEngine {
  async findCompanions(
    placeId: string,
    preferences?: {
      time_available?: number;
      mood?: string;
      budget?: 'low' | 'medium' | 'high';
    }
  ): Promise<{
    before: CompanionSuggestion[];
    after: CompanionSuggestion[];
  }> {
    // Fetch the main place
    const { data: mainPlace } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single();
    
    if (!mainPlace) {
      return { before: [], after: [] };
    }
    
    // First, try to get pre-computed companions from the companion_activities table
    const { data: companions } = await supabase
      .from('companion_activities')
      .select(`
        *,
        companion_place:places!companion_place_id(*)
      `)
      .eq('place_id', placeId)
      .order('compatibility_score', { ascending: false });
    
    // If no pre-computed companions exist, calculate dynamically
    if (!companions || companions.length === 0) {
      return this.calculateCompanions(mainPlace, preferences);
    }
    
    // Filter based on preferences
    let filtered = companions;
    
    if (preferences?.time_available) {
      filtered = filtered.filter(c => 
        c.time_gap_minutes <= preferences.time_available!
      );
    }
    
    if (preferences?.mood) {
      filtered = filtered.filter(c => 
        c.companion_place.mood_tags?.includes(preferences.mood!)
      );
    }
    
    // Group by activity type
    const before = filtered
      .filter(c => c.activity_type === 'before')
      .map(c => ({
        place: c.companion_place,
        activity_type: 'before' as const,
        reason: this.generateReason(mainPlace, c.companion_place, 'before'),
        time_gap_minutes: c.time_gap_minutes,
        distance_meters: c.distance_meters,
        compatibility_score: c.compatibility_score
      }));
    
    const after = filtered
      .filter(c => c.activity_type === 'after')
      .map(c => ({
        place: c.companion_place,
        activity_type: 'after' as const,
        reason: this.generateReason(mainPlace, c.companion_place, 'after'),
        time_gap_minutes: c.time_gap_minutes,
        distance_meters: c.distance_meters,
        compatibility_score: c.compatibility_score
      }));
    
    return { before, after };
  }
  
  private async calculateCompanions(
    mainPlace: any,
    preferences?: any
  ) {
    // Fetch nearby places
    const { data: nearbyPlaces } = await supabase
      .from('places')
      .select('*')
      .neq('id', mainPlace.id)
      .eq('has_amit_visited', true); // Only places Amit has visited
    
    if (!nearbyPlaces) {
      return { before: [], after: [] };
    }
    
    const suggestions = nearbyPlaces.map(place => {
      // Calculate distance (simplified)
      const distance = this.calculateDistance(
        mainPlace.coordinates,
        place.coordinates
      );
      
      // Skip if too far (> 1km)
      if (distance > 1000) return null;
      
      // Calculate compatibility score
      const score = this.calculateCompatibility(mainPlace, place);
      
      // Determine if before or after
      const activityType = this.determineActivityType(mainPlace, place);
      
      return {
        place,
        activity_type: activityType,
        reason: this.generateReason(mainPlace, place, activityType),
        time_gap_minutes: Math.round(distance / 80) + 30, // Walking + activity time
        distance_meters: distance,
        compatibility_score: score
      };
    }).filter(Boolean) as CompanionSuggestion[];
    
    // Sort by score
    suggestions.sort((a, b) => b.compatibility_score - a.compatibility_score);
    
    // Group by type
    const before = suggestions
      .filter(s => s.activity_type === 'before')
      .slice(0, 5);
    
    const after = suggestions
      .filter(s => s.activity_type === 'after')
      .slice(0, 5);
    
    return { before, after };
  }
  
  private calculateDistance(coord1: any, coord2: any): number {
    if (!coord1 || !coord2) return 9999;
    
    const R = 6371e3;
    const φ1 = coord1.lat * Math.PI/180;
    const φ2 = coord2.lat * Math.PI/180;
    const Δφ = (coord2.lat - coord1.lat) * Math.PI/180;
    const Δλ = (coord2.lng - coord1.lng) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
  
  private calculateCompatibility(place1: any, place2: any): number {
    let score = 0.5; // Base score
    
    // Category compatibility matrix
    const compatiblePairs: Record<string, string[]> = {
      'restaurant': ['bar', 'cafe', 'dessert', 'bakery'],
      'cafe': ['bookstore', 'park', 'gallery', 'shopping'],
      'bar': ['restaurant', 'club', 'live_music'],
      'shopping': ['cafe', 'restaurant', 'bar'],
      'park': ['cafe', 'restaurant', 'activity'],
      'activity': ['restaurant', 'bar', 'cafe'],
      'bakery': ['cafe', 'park'],
      'dessert': ['cafe', 'restaurant']
    };
    
    const cat1 = place1.category?.toLowerCase() || '';
    const cat2 = place2.category?.toLowerCase() || '';
    
    if (compatiblePairs[cat1]?.includes(cat2)) {
      score += 0.3;
    }
    
    // Time-based compatibility
    if (cat1 === 'cafe' && cat2 === 'restaurant') {
      score += 0.2; // Coffee before lunch/dinner
    }
    
    if (cat1 === 'restaurant' && cat2 === 'bar') {
      score += 0.2; // Drinks after dinner
    }
    
    if (cat1 === 'activity' && (cat2 === 'cafe' || cat2 === 'restaurant')) {
      score += 0.15; // Food after activities
    }
    
    // Mood tag compatibility
    const mood1 = place1.mood_tags || [];
    const mood2 = place2.mood_tags || [];
    
    const commonMoods = mood1.filter((mood: string) => mood2.includes(mood));
    score += commonMoods.length * 0.1;
    
    return Math.min(score, 1);
  }
  
  private determineActivityType(
    mainPlace: any,
    companionPlace: any
  ): 'before' | 'after' {
    const mainCat = mainPlace.category?.toLowerCase() || '';
    const compCat = companionPlace.category?.toLowerCase() || '';
    
    // Categories that work well before main activity
    const beforeCategories = ['cafe', 'breakfast', 'bakery'];
    
    // Categories that work well after main activity  
    const afterCategories = ['bar', 'dessert', 'club', 'live_music'];
    
    if (beforeCategories.includes(compCat)) {
      return 'before';
    }
    
    if (afterCategories.includes(compCat)) {
      return 'after';
    }
    
    // Context-based logic
    if (mainCat === 'restaurant') {
      return compCat === 'cafe' ? 'before' : 'after';
    }
    
    if (mainCat === 'activity' || mainCat === 'park') {
      return compCat === 'cafe' ? 'before' : 'after';
    }
    
    // Default to after
    return 'after';
  }
  
  private generateReason(
    mainPlace: any,
    companionPlace: any,
    type: 'before' | 'after'
  ): string {
    const mainCat = mainPlace.category?.toLowerCase() || '';
    const compCat = companionPlace.category?.toLowerCase() || '';
    
    const reasonMap: Record<string, string> = {
      // Before combinations
      'cafe-restaurant': 'Perfect coffee spot before your meal',
      'cafe-activity': 'Fuel up with coffee before your adventure',
      'bakery-restaurant': 'Start with fresh pastries before lunch',
      'cafe-shopping': 'Energize before your shopping spree',
      
      // After combinations
      'restaurant-bar': 'Continue the evening with drinks',
      'restaurant-dessert': 'Sweet ending to your meal',
      'activity-restaurant': 'Refuel after your activity',
      'activity-cafe': 'Relax with coffee after your workout',
      'park-cafe': 'Unwind with coffee after your nature walk',
      'shopping-cafe': 'Take a well-deserved coffee break',
      'restaurant-cafe': 'End with a perfect espresso'
    };
    
    const key = type === 'before' 
      ? `${compCat}-${mainCat}`
      : `${mainCat}-${compCat}`;
    
    const customReason = reasonMap[key];
    
    if (customReason) {
      return customReason;
    }
    
    // Generic reasons
    const genericReasons = {
      before: [
        `Great way to start before visiting ${mainPlace.name}`,
        `Perfect warm-up for your ${mainPlace.name} experience`,
        `Build anticipation before ${mainPlace.name}`
      ],
      after: [
        `Perfect wind-down after ${mainPlace.name}`,
        `Great way to extend your ${mainPlace.name} experience`,
        `Continue the vibe from ${mainPlace.name}`
      ]
    };
    
    const reasons = genericReasons[type];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
  
  // Method to compute and store companion activities in the database
  async computeAndStoreCompanions(placeId: string): Promise<void> {
    const companions = await this.calculateCompanions({ id: placeId });
    
    const allCompanions = [...companions.before, ...companions.after];
    
    for (const companion of allCompanions) {
      try {
        await supabase
          .from('companion_activities')
          .upsert({
            place_id: placeId,
            companion_place_id: companion.place.id,
            activity_type: companion.activity_type,
            time_gap_minutes: companion.time_gap_minutes,
            distance_meters: companion.distance_meters,
            compatibility_score: companion.compatibility_score
          });
      } catch (error) {
        console.error('Error storing companion activity:', error);
      }
    }
  }
}