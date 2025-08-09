import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, Rss, Mail } from 'lucide-react'
import BlogPost from '@/components/blog/BlogPost'
import NewsletterSignupWrapper from '@/components/blog/NewsletterSignupWrapper'
import { BlogPost as BlogPostType, BlogCategory } from '@/lib/types/blog'

// Mock data - in real app this would come from database/CMS
const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Neighborhood News',
    slug: 'neighborhood',
    description: 'Updates about Indiranagar developments and community happenings',
    color: 'neighborhood',
    icon: '🏘️',
    post_count: 12,
    featured: true
  },
  {
    id: '2',
    name: 'Business Updates',
    slug: 'business',
    description: 'New openings, closures, and business community news',
    color: 'business',
    icon: '🏪',
    post_count: 8,
    featured: true
  },
  {
    id: '3',
    name: 'Cultural Events',
    slug: 'cultural',
    description: 'Art, music, and cultural happenings in the area',
    color: 'cultural',
    icon: '🎭',
    post_count: 15,
    featured: true
  },
  {
    id: '4',
    name: 'Food & Dining',
    slug: 'food',
    description: 'Restaurant reviews, food trends, and culinary discoveries',
    color: 'food',
    icon: '🍽️',
    post_count: 20,
    featured: true
  }
]

const mockPosts: BlogPostType[] = [
  {
    id: '1',
    title: 'The Evolution of 100 Feet Road: A Decade of Change',
    slug: 'evolution-100-feet-road-decade-change',
    content: '<p>A comprehensive look at how Indiranagar\'s main artery has transformed...</p>',
    excerpt: 'From quiet residential street to bustling commercial hub, 100 Feet Road has undergone remarkable transformation in the past decade. Here\'s what I\'ve observed as a long-time resident.',
    author_id: 'amit',
    author_name: 'Amit Rebala',
    category: mockCategories[0],
    tags: ['development', 'infrastructure', 'history', 'observation'],
    featured_image: '/images/blog/100-feet-road.jpg',
    status: 'published',
    published_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    view_count: 1847,
    comment_count: 23,
    reading_time_minutes: 8,
    linked_places: [
      {
        place_id: 'place-1',
        place_name: 'Forum Mall',
        place_category: 'Shopping',
        mention_context: 'Landmark reference for street development',
        relationship_type: 'mentioned'
      },
      {
        place_id: 'place-2',
        place_name: 'Indiranagar Metro Station',
        place_category: 'Transport',
        mention_context: 'Major catalyst for area transformation',
        relationship_type: 'featured'
      }
    ],
    seo_metadata: {
      meta_title: 'The Evolution of 100 Feet Road: A Decade of Change | Indiranagar Discovery',
      meta_description: 'Explore how Indiranagar\'s main street has transformed over the past decade through the eyes of a long-time resident.',
      og_title: 'The Evolution of 100 Feet Road: A Decade of Change',
      og_description: 'From quiet residential street to bustling commercial hub - a decade of transformation.',
      og_image: '/images/blog/100-feet-road-og.jpg'
    }
  },
  {
    id: '2',
    title: 'Hidden Gems: 5 Cafes You\'ve Probably Never Noticed',
    slug: 'hidden-gems-5-cafes-never-noticed',
    content: '<p>Beyond the obvious coffee chains lie some truly special places...</p>',
    excerpt: 'While everyone flocks to the same popular spots, these five cafes have been quietly serving exceptional coffee and creating community spaces. Time to discover them.',
    author_id: 'amit',
    author_name: 'Amit Rebala',
    category: mockCategories[3],
    tags: ['coffee', 'hidden-gems', 'local-business', 'discovery'],
    featured_image: '/images/blog/hidden-cafes.jpg',
    status: 'published',
    published_at: '2024-01-12T14:30:00Z',
    created_at: '2024-01-11T09:15:00Z',
    updated_at: '2024-01-12T14:30:00Z',
    view_count: 923,
    comment_count: 15,
    reading_time_minutes: 6,
    linked_places: [
      {
        place_id: 'cafe-1',
        place_name: 'Corner House Coffee',
        place_category: 'Cafe',
        mention_context: 'Featured as hidden gem #3',
        relationship_type: 'featured'
      },
      {
        place_id: 'cafe-2',
        place_name: 'The Daily Grind',
        place_category: 'Cafe',
        mention_context: 'Featured as hidden gem #1',
        relationship_type: 'featured'
      }
    ],
    seo_metadata: {
      meta_title: 'Hidden Gems: 5 Cafes You\'ve Probably Never Noticed | Indiranagar Discovery',
      meta_description: 'Discover 5 exceptional but overlooked cafes in Indiranagar that serve great coffee and create community.',
      og_title: 'Hidden Gems: 5 Cafes You\'ve Probably Never Noticed',
      og_description: 'Beyond the popular chains - discover exceptional neighborhood cafes.',
      og_image: '/images/blog/hidden-cafes-og.jpg'
    }
  },
  {
    id: '3',
    title: 'Community Spotlight: The Vegetable Vendor Who Knows Everyone',
    slug: 'community-spotlight-vegetable-vendor-knows-everyone',
    content: '<p>In the heart of Indiranagar\'s residential area sits a small vegetable cart...</p>',
    excerpt: 'Meet Kumar, whose small vegetable cart has become an unofficial community center. His story reflects the human connections that make neighborhoods special.',
    author_id: 'amit',
    author_name: 'Amit Rebala',
    category: mockCategories[0],
    tags: ['community', 'people', 'local-business', 'human-stories'],
    featured_image: '/images/blog/vegetable-vendor.jpg',
    status: 'published',
    published_at: '2024-01-10T16:45:00Z',
    created_at: '2024-01-09T11:00:00Z',
    updated_at: '2024-01-10T16:45:00Z',
    view_count: 1456,
    comment_count: 31,
    reading_time_minutes: 5,
    linked_places: [],
    seo_metadata: {
      meta_title: 'Community Spotlight: The Vegetable Vendor Who Knows Everyone | Indiranagar Discovery',
      meta_description: 'Meet Kumar, whose vegetable cart has become an unofficial community center in Indiranagar.',
      og_title: 'Community Spotlight: The Vegetable Vendor Who Knows Everyone',
      og_description: 'The human connections that make neighborhoods special.',
      og_image: '/images/blog/community-og.jpg'
    }
  }
]

function CategoryGrid({ categories }: { categories: BlogCategory[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {categories.filter(cat => cat.featured).map((category) => (
        <Link
          key={category.id}
          href={`/blog/category/${category.slug}`}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {category.post_count} posts
            </span>
            <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View all →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function BlogGrid({ posts }: { posts: BlogPostType[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} variant="card" />
      ))}
    </div>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-3 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded mb-4" />
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/map"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Map</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Indiranagar Insights
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Personal commentary on neighborhood happenings, business updates, and the evolving 
              character of Indiranagar from someone who&apos;s called it home for years.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, places, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <CategoryGrid categories={mockCategories} />
        </div>

        {/* Featured Post */}
        {mockPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Post</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <BlogPost post={mockPosts[0]} variant="full" />
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          </div>
          
          <Suspense fallback={<BlogGridSkeleton />}>
            <BlogGrid posts={mockPosts.slice(1)} />
          </Suspense>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-12">
          <NewsletterSignupWrapper />
        </div>

        {/* About the Blog */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About This Blog</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              This blog is my personal take on life in Indiranagar - one of Bangalore&apos;s most vibrant neighborhoods. 
              Having lived here for several years, I&apos;ve watched the area evolve, businesses come and go, 
              and communities form around shared spaces.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              My goal is to document these changes, celebrate the people who make this neighborhood special, 
              and share insights that only come from being deeply embedded in the community. 
              Whether it&apos;s a new restaurant opening, a beloved shop closing, or just observations about 
              how the neighborhood is changing, you&apos;ll find it here.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This isn&apos;t just food blogging or travel writing - it&apos;s community journalism with a personal lens. 
              I hope it helps you see Indiranagar through the eyes of someone who truly calls it home.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Amit Rebala</strong> - Long-time Indiranagar resident, neighborhood enthusiast, 
              and curator of local experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}