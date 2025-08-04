export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author_id: string
  author_name: string
  category: BlogCategory
  tags: string[]
  featured_image?: string
  status: PostStatus
  published_at?: string
  created_at: string
  updated_at: string
  view_count: number
  comment_count: number
  linked_places: LinkedPlace[]
  seo_metadata: SEOMetadata
  reading_time_minutes: number
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  post_count: number
  featured: boolean
}

export interface LinkedPlace {
  place_id: string
  place_name: string
  place_category?: string
  mention_context: string
  relationship_type: 'featured' | 'mentioned' | 'related'
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  author_avatar?: string
  content: string
  status: CommentStatus
  parent_id?: string
  replies?: BlogComment[]
  created_at: string
  updated_at: string
  likes_count: number
  is_author_reply: boolean
}

export interface SEOMetadata {
  meta_title?: string
  meta_description?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  canonical_url?: string
  schema_markup?: any
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  status: SubscriberStatus
  preferences: NewsletterPreferences
  subscribed_at: string
  unsubscribed_at?: string
  confirmed_at?: string
  last_sent_at?: string
}

export interface NewsletterPreferences {
  categories: string[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'immediate'
  topics: string[]
  place_updates: boolean
  new_posts: boolean
  curator_picks: boolean
}

export interface BlogStats {
  total_posts: number
  published_posts: number
  total_views: number
  total_comments: number
  subscriber_count: number
  popular_tags: Array<{ tag: string; count: number }>
  category_distribution: Array<{ category: string; count: number }>
  monthly_views: Array<{ month: string; views: number }>
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'rejected'
export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed' | 'bounced'

// Social media integration types
export interface SocialMediaPost {
  id: string
  blog_post_id: string
  platform: SocialPlatform
  post_id?: string
  content: string
  media_urls: string[]
  scheduled_at?: string
  published_at?: string
  status: SocialPostStatus
  engagement_metrics: EngagementMetrics
}

export interface EngagementMetrics {
  likes: number
  shares: number
  comments: number
  clicks: number
  impressions: number
  reach: number
  engagement_rate: number
}

export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin'
export type SocialPostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

// Rich text editor types
export interface EditorContent {
  type: 'doc'
  content: EditorNode[]
}

export interface EditorNode {
  type: string
  attrs?: Record<string, any>
  content?: EditorNode[]
  text?: string
  marks?: Array<{
    type: string
    attrs?: Record<string, any>
  }>
}

// Archive and search types
export interface BlogArchive {
  years: Array<{
    year: number
    post_count: number
    months: Array<{
      month: number
      month_name: string
      post_count: number
      posts: BlogPost[]
    }>
  }>
}

export interface SearchFilters {
  categories?: string[]
  tags?: string[]
  date_range?: {
    start: string
    end: string
  }
  author?: string
  linked_places?: string[]
  status?: PostStatus[]
}

export interface SearchResult {
  posts: BlogPost[]
  total_count: number
  facets: {
    categories: Array<{ name: string; count: number }>
    tags: Array<{ name: string; count: number }>
    authors: Array<{ name: string; count: number }>
    years: Array<{ year: number; count: number }>
  }
}