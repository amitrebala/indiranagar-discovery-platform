export interface Comment {
  id: string;
  entity_type: 'place' | 'journey' | 'blog';
  entity_id: string;
  parent_id?: string;
  author_name: string;
  author_ip?: string;
  content: string;
  is_admin: boolean;
  is_flagged: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
  user_has_liked?: boolean;
}

export interface CommentInput {
  entity_type: string;
  entity_id: string;
  content: string;
  author_name?: string;
  parent_id?: string;
}

export interface CommentStats {
  total_comments: number;
  average_sentiment?: number;
  top_commenters: Array<{
    name: string;
    count: number;
  }>;
}