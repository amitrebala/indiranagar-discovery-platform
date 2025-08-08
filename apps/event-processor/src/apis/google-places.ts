import { EventSource, FetchParams, RawEvent, StandardEvent, SourceConfig } from '../../../../packages/shared/src/types/event-source';

export class GooglePlacesSource implements EventSource {
  id = 'google-places';
  name = 'Google Places';
  type = 'api' as const;
  
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';
  
  config: SourceConfig = {
    rateLimit: { requests: 100, window: 60 },
    searchRadius: 2000,
    placeTypes: ['restaurant', 'cafe', 'bar', 'night_club']
  };
  
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Places API key not configured');
    }
  }
  
  async authenticate(): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Google Places API key required');
    }
    
    const testUrl = `${this.baseUrl}/findplacefromtext/json?` +
      `input=test&inputtype=textquery&key=${this.apiKey}`;
    
    const response = await fetch(testUrl);
    if (!response.ok) {
      throw new Error('Invalid Google Places API key');
    }
  }
  
  async fetchEvents(params: FetchParams): Promise<RawEvent[]> {
    const events: RawEvent[] = [];
    
    if (!this.apiKey) {
      return events;
    }
    
    const places = await this.searchNearbyPlaces(params);
    
    for (const place of places) {
      const details = await this.getPlaceDetails(place.place_id);
      
      if (this.hasEventInfo(details)) {
        events.push({
          source: this.id,
          externalId: place.place_id,
          rawData: details,
          fetchedAt: new Date()
        });
      }
      
      await this.delay(100);
    }
    
    return events;
  }
  
  private async searchNearbyPlaces(params: FetchParams) {
    const lat = params.lat || 12.9716;
    const lng = params.lng || 77.6411;
    
    const url = `${this.baseUrl}/nearbysearch/json?` +
      `location=${lat},${lng}&` +
      `radius=${params.radius || this.config.searchRadius}&` +
      `type=${this.config.placeTypes?.join('|')}&` +
      `key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results || [];
  }
  
  private async getPlaceDetails(placeId: string) {
    const url = `${this.baseUrl}/details/json?` +
      `place_id=${placeId}&` +
      `fields=name,formatted_address,geometry,opening_hours,` +
      `editorial_summary,user_ratings_total,photos,website&` +
      `key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.result;
  }
  
  transform(raw: RawEvent): StandardEvent {
    const place = raw.rawData;
    
    return {
      title: `Visit ${place.name}`,
      description: place.editorial_summary?.overview || 
                   `Popular venue in Indiranagar`,
      startTime: new Date(),
      venue: {
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng
      },
      category: this.inferCategory(place),
      tags: this.extractTags(place),
      imageUrl: this.getPhotoUrl(place.photos?.[0]),
      externalUrl: place.website,
      price: { type: 'free' }
    };
  }
  
  validateResponse(response: any): boolean {
    return response && 
           response.status === 'OK' && 
           Array.isArray(response.results);
  }
  
  handleError(error: Error): void {
    console.error(`[${this.name}] Error:`, error.message);
  }
  
  private hasEventInfo(details: any): boolean {
    return details && 
           details.name && 
           (details.opening_hours || details.website);
  }
  
  private inferCategory(place: any): string {
    const types = place.types || [];
    if (types.includes('restaurant')) return 'dining';
    if (types.includes('cafe')) return 'cafe';
    if (types.includes('bar') || types.includes('night_club')) return 'nightlife';
    return 'venue';
  }
  
  private extractTags(place: any): string[] {
    const tags: string[] = [];
    if (place.types) {
      tags.push(...place.types.filter((t: string) => 
        !['point_of_interest', 'establishment'].includes(t)
      ));
    }
    return tags;
  }
  
  private getPhotoUrl(photo: any): string | undefined {
    if (!photo || !photo.photo_reference) return undefined;
    return `https://maps.googleapis.com/maps/api/place/photo?` +
           `maxwidth=800&photo_reference=${photo.photo_reference}&` +
           `key=${this.apiKey}`;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}