import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, Share2, Tag } from 'lucide-react'
import BlogPost from '@/components/blog/BlogPost'
import BlogComments from '@/components/blog/BlogComments'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
import { BlogPost as BlogPostType, BlogComment } from '@/lib/types/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Mock data - in real app this would come from database/CMS
const mockPost: BlogPostType = {
  id: '1',
  title: 'The Evolution of 100 Feet Road: A Decade of Change',
  slug: 'evolution-100-feet-road-decade-change',
  content: `
    <p>Walking down 100 Feet Road today, it's hard to imagine this was once a quiet residential street with more trees than traffic lights. Over the past decade, I've watched this main artery of Indiranagar transform from a neighborhood connector into one of Bangalore's most happening commercial strips.</p>

    <h2>The Catalyst: Metro Connectivity</h2>
    <p>The single biggest game-changer was the Indiranagar Metro Station. When it opened in 2011, it didn't just connect us to the rest of the city - it fundamentally shifted how people discovered and experienced our neighborhood. Suddenly, weekend visitors weren't limited to those with cars or the patience for endless traffic jams.</p>

    <blockquote>
      <p>"The metro didn't just bring people to Indiranagar, it brought a new kind of energy. The foot traffic, the weekend explorers, the young professionals who could suddenly live here and commute easily - it all changed the commercial equation."</p>
    </blockquote>

    <h2>From Residential to Commercial</h2>
    <p>I remember when getting a good cup of coffee meant a trip to Forum Mall or a compromise with instant coffee at home. Now, within a 500-meter radius of any point on 100 Feet Road, you'll find at least three specialty coffee shops, each with its own personality and loyal following.</p>

    <p>The transformation wasn't overnight, but it was systematic:</p>
    <ul>
      <li><strong>2011-2013:</strong> The first wave brought chain restaurants and established brands</li>
      <li><strong>2014-2016:</strong> Independent cafes and boutique stores started appearing</li>
      <li><strong>2017-2019:</strong> The craft beer revolution and experiential dining</li>
      <li><strong>2020-2024:</strong> Post-pandemic resilience and community-focused businesses</li>
    </ul>

    <h2>The Human Cost of Progress</h2>
    <p>But transformation always comes with trade-offs. The small grocery store where aunty knew everyone's usual order? Replaced by a trendy organic market. The repair shop that could fix anything for ₹50? Gone, because the rent went up 400%.</p>

    <p>These aren't just business changes - they're community changes. When you lose the spaces where neighbors naturally interact, you lose something harder to quantify but equally important: the social fabric that makes a neighborhood feel like home.</p>

    <h2>Finding Balance</h2>
    <p>The best businesses that have emerged understand this balance. They're not just capitalizing on foot traffic; they're contributing to the community. The new bookstore-cafe that hosts poetry readings. The restaurant that sources from local vendors and employs neighborhood youth. The fitness studio that organizes community runs.</p>

    <p>These places get it: commercial success and community building aren't mutually exclusive. In fact, in a neighborhood like Indiranagar, they're symbiotic.</p>

    <h2>Looking Forward</h2>
    <p>As I write this in 2024, I see the next wave starting. Sustainability is becoming more than a buzzword. Digital-first businesses are creating physical community spaces. The pandemic taught us that neighborhoods matter more than we realized.</p>

    <p>The challenge for the next decade will be managing growth while preserving character. How do we welcome new businesses and residents while maintaining the community connections that make Indiranagar special?</p>

    <p>I don't have all the answers, but I'm optimistic. The same community spirit that made this transformation possible is still here. It's evolved, adapted, but it's still the beating heart of what makes this more than just another commercial district.</p>

    <p>It's still home.</p>
  `,
  excerpt: 'From quiet residential street to bustling commercial hub, 100 Feet Road has undergone remarkable transformation in the past decade. Here\'s what I\'ve observed as a long-time resident.',
  author_id: 'amit',
  author_name: 'Amit Rebala',
  category: {
    id: '1',
    name: 'Neighborhood News',
    slug: 'neighborhood',
    description: 'Updates about Indiranagar developments and community happenings',
    color: 'neighborhood',
    icon: '🏘️',
    post_count: 12,
    featured: true
  },
  tags: ['development', 'infrastructure', 'history', 'observation', 'community', 'metro', 'change'],
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
}

const mockComments: BlogComment[] = [
  {
    id: '1',
    post_id: '1',
    author_name: 'Priya Sharma',
    author_email: 'priya@example.com',
    content: 'This is such an accurate observation! I moved to Indiranagar in 2015 and even in that shorter timeframe, I\'ve seen so much change. The metro really was a game-changer. Though I do miss some of the quieter, more residential feel it used to have.',
    status: 'approved',
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    likes_count: 12,
    is_author_reply: false,
    replies: [
      {
        id: '2',
        post_id: '1',
        parent_id: '1',
        author_name: 'Amit Rebala',
        author_email: 'amit@example.com',
        content: 'Thanks Priya! You arrived right at the inflection point. The challenge is finding that balance between growth and preserving the community feel. What aspects of the residential character do you miss most?',
        status: 'approved',
        created_at: '2024-01-16T16:45:00Z',
        updated_at: '2024-01-16T16:45:00Z',
        likes_count: 8,
        is_author_reply: true
      }
    ]
  },
  {
    id: '3',
    post_id: '1',
    author_name: 'Rajesh Kumar',
    author_email: 'rajesh@example.com',
    content: 'As someone who grew up here in the 90s, this hit me right in the feels. You captured the bittersweet nature of this transformation perfectly. The economic opportunities are great, but we definitely lost some of that neighborhood intimacy.',
    status: 'approved',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z',
    likes_count: 15,
    is_author_reply: false
  },
  {
    id: '4',
    post_id: '1',
    author_name: 'Maya Patel',
    author_email: 'maya@example.com',
    content: 'Great piece! I run a small business on 12th Main and can definitely relate to the rent pressures you mentioned. It\'s tough for local businesses to compete with the chains, but there\'s still room for businesses that truly serve the community.',
    status: 'approved',
    created_at: '2024-01-17T11:20:00Z',
    updated_at: '2024-01-17T11:20:00Z',
    likes_count: 9,
    is_author_reply: false
  }
]

async function getBlogPost(slug: string): Promise<BlogPostType | null> {
  // In real app, this would be a database query
  if (slug === 'evolution-100-feet-road-decade-change') {
    return mockPost
  }
  return null
}

async function getBlogComments(postId: string): Promise<BlogComment[]> {
  // In real app, this would be a database query
  return mockComments
}

function RelatedPosts() {
  const relatedPosts = [
    {
      title: 'The Rise and Fall of Indiranagar\'s Iconic Bookstores',
      slug: 'rise-fall-indiranagar-bookstores',
      excerpt: 'A look at how digital disruption affected the neighborhood\'s literary culture.',
      category: 'Cultural',
      reading_time: 6
    },
    {
      title: 'Community Voices: What Residents Really Think About Development',
      slug: 'community-voices-residents-development',
      excerpt: 'Conversations with long-time residents about neighborhood changes.',
      category: 'Community',
      reading_time: 10
    },
    {
      title: 'The Economics of Gentrification: A Local Perspective',
      slug: 'economics-gentrification-local-perspective',
      excerpt: 'Understanding the economic forces reshaping urban neighborhoods.',
      category: 'Analysis',
      reading_time: 12
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Related Posts</h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {post.title}
            </h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.reading_time}min read
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
      <div className="h-80 bg-gray-200 rounded-xl mb-8" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const comments = await getBlogComments(post.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/blog"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Suspense fallback={<PostSkeleton />}>
          <BlogPost
            post={post}
            variant="full"
            showLinkedPlaces={true}
            onShare={(post) => {
              console.log('Share post:', post.title)
            }}
            onLike={(postId) => {
              console.log('Like post:', postId)
            }}
          />
        </Suspense>

        {/* Comments Section */}
        <div className="mt-12">
          <BlogComments
            comments={comments}
            postId={post.id}
            onAddComment={async (content, parentId) => {
              console.log('Add comment:', content, 'Parent:', parentId)
            }}
            onLikeComment={(commentId) => {
              console.log('Like comment:', commentId)
            }}
            onReportComment={(commentId) => {
              console.log('Report comment:', commentId)
            }}
            allowComments={true}
          />
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <NewsletterSignup
            variant="inline"
            showPreferences={false}
            onSubscribe={async (email, preferences) => {
              console.log('Newsletter signup:', email, preferences)
              await new Promise(resolve => setTimeout(resolve, 1000))
              return true
            }}
          />
        </div>

        {/* Related Posts */}
        <div className="mt-12">
          <RelatedPosts />
        </div>
      </div>
    </div>
  )
}