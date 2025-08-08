export interface EventSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'rss' | 'webhook';
  config: SourceConfig;
  
  authenticate(): Promise<void>;
  fetchEvents(params: FetchParams): Promise<RawEvent[]>;
  transform(raw: RawEvent): StandardEvent;
  validateResponse(response: any): boolean;
  handleError(error: Error): void;
}

export interface SourceConfig {
  rateLimit?: {
    requests: number;
    window: number;
  };
  searchRadius?: number;
  placeTypes?: string[];
  [key: string]: any;
}

export interface FetchParams {
  lat?: number;
  lng?: number;
  radius?: number;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  limit?: number;
}

export interface RawEvent {
  source: string;
  externalId: string;
  rawData: any;
  fetchedAt: Date;
}

export interface StandardEvent {
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  venue: {
    name?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  category?: string;
  tags?: string[];
  imageUrl?: string;
  externalUrl?: string;
  price?: {
    type: 'free' | 'paid' | 'donation';
    amount?: number;
    currency?: string;
  };
}