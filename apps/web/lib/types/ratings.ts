export interface Rating {
  id: string;
  entity_type: string;
  entity_id: string;
  rating: number;
  ip_address?: string;
  created_at: string;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  user_rating?: number;
}