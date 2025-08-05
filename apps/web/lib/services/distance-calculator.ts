import { Client } from '@googlemaps/google-maps-services-js';

export class DistanceCalculator {
  private client: Client;
  private cache: Map<string, any>;
  
  constructor() {
    this.client = new Client({});
    this.cache = new Map();
  }
  
  async calculateJourneyDistance(stops: Array<{ lat: number; lng: number; place_id: string }>) {
    const cacheKey = stops.map(s => s.place_id).join('-');
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    let totalDistance = 0;
    let totalDuration = 0;
    const segments = [];
    
    for (let i = 0; i < stops.length - 1; i++) {
      const origin = stops[i];
      const destination = stops[i + 1];
      
      try {
        // Check if Google Maps API key is available
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          console.warn('Google Maps API key not configured, using fallback calculation');
          // Use haversine distance fallback
          const distance = this.haversineDistance(origin, destination);
          segments.push({
            from: origin.place_id,
            to: destination.place_id,
            distance_meters: distance,
            duration_seconds: Math.round(distance / 1.4), // ~5km/h walking speed
            polyline: '',
            steps: [{
              instruction: `Walk ${Math.round(distance/100)*100}m to next stop`,
              distance: `${Math.round(distance/100)*100}m`,
              duration: `${Math.ceil((distance / 1.4) / 60)} min`
            }]
          });
          
          totalDistance += distance;
          totalDuration += Math.round(distance / 1.4);
          continue;
        }
        
        // Get walking directions from Google Maps
        const response = await this.client.directions({
          params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            mode: 'walking' as any,
            key: apiKey,
          }
        });
        
        if (response.data.routes.length > 0) {
          const route = response.data.routes[0];
          const leg = route.legs[0];
          
          segments.push({
            from: origin.place_id,
            to: destination.place_id,
            distance_meters: leg.distance.value,
            duration_seconds: leg.duration.value,
            polyline: route.overview_polyline.points,
            steps: leg.steps.map(step => ({
              instruction: step.html_instructions,
              distance: step.distance.text,
              duration: step.duration.text
            }))
          });
          
          totalDistance += leg.distance.value;
          totalDuration += leg.duration.value;
        }
      } catch (error) {
        console.error('Error calculating route segment:', error);
        // Fallback to straight-line distance
        const distance = this.haversineDistance(origin, destination);
        segments.push({
          from: origin.place_id,
          to: destination.place_id,
          distance_meters: distance,
          duration_seconds: Math.round(distance / 1.4), // ~5km/h walking
          polyline: '',
          steps: [{
            instruction: `Walk approximately ${Math.round(distance/100)*100}m`,
            distance: `${Math.round(distance/100)*100}m`,
            duration: `${Math.ceil((distance / 1.4) / 60)} min`
          }]
        });
        
        totalDistance += distance;
        totalDuration += Math.round(distance / 1.4);
      }
    }
    
    const result = {
      total_distance_km: Number((totalDistance / 1000).toFixed(2)),
      total_walking_time_min: Math.ceil(totalDuration / 60),
      segments,
      calculated_at: new Date().toISOString()
    };
    
    // Cache for 24 hours
    this.cache.set(cacheKey, result);
    setTimeout(() => this.cache.delete(cacheKey), 24 * 60 * 60 * 1000);
    
    return result;
  }
  
  private haversineDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
  
  // Calculate distance between two points
  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<{
    distance_meters: number;
    duration_seconds: number;
    walking_time_minutes: number;
  }> {
    const cacheKey = `${origin.lat},${origin.lng}-${destination.lat},${destination.lng}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        // Fallback calculation
        const distance = this.haversineDistance(origin, destination);
        const result = {
          distance_meters: distance,
          duration_seconds: Math.round(distance / 1.4),
          walking_time_minutes: Math.ceil((distance / 1.4) / 60)
        };
        
        this.cache.set(cacheKey, result);
        return result;
      }
      
      const response = await this.client.directions({
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode: 'walking' as any,
          key: apiKey,
        }
      });
      
      if (response.data.routes.length > 0) {
        const leg = response.data.routes[0].legs[0];
        const result = {
          distance_meters: leg.distance.value,
          duration_seconds: leg.duration.value,
          walking_time_minutes: Math.ceil(leg.duration.value / 60)
        };
        
        this.cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
    
    // Fallback
    const distance = this.haversineDistance(origin, destination);
    return {
      distance_meters: distance,
      duration_seconds: Math.round(distance / 1.4),
      walking_time_minutes: Math.ceil((distance / 1.4) / 60)
    };
  }
}