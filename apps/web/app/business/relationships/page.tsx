import { Suspense } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Gift, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  Network
} from 'lucide-react'
import BusinessRelationshipCard from '@/components/business/BusinessRelationshipCard'
import NetworkVisualization from '@/components/business/NetworkVisualization'
import { BusinessRelationship, RelationshipMetrics } from '@/lib/types/business-relationships'

// Mock data - in real app this would come from database
const mockRelationships: BusinessRelationship[] = [
  {
    id: '1',
    place_id: 'place-1',
    place_name: 'Blue Tokai Coffee Roasters',
    business_name: 'Blue Tokai Coffee Roasters',
    contact_person: 'Rahul Sharma',
    contact_email: 'rahul@bluetokai.com',
    contact_phone: '+91 98765 43210',
    relationship_type: 'mention_my_name',
    trust_level: 'high',
    connection_strength: 'strong',
    established_date: '2022-06-15',
    last_interaction: '2024-01-10',
    status: 'active',
    description: 'Long-standing relationship with the manager. Regular customer who often brings friends. They appreciate detailed feedback and recommendations.',
    special_arrangements: [
      {
        id: 'arr-1',
        type: 'discount',
        description: '15% discount on all orders when mentioning my name',
        terms: 'Valid for groups up to 6 people',
        usage_count: 12,
        max_usage: 50,
        is_active: true
      }
    ],
    referral_benefits: [
      {
        id: 'ben-1',
        type: 'percentage_discount',
        description: 'Friends get 10% off their first visit',
        discount_percentage: 10,
        conditions: ['First-time customers only', 'Must mention Amit'],
        is_active: true
      }
    ],
    interaction_history: [
      {
        id: 'int-1',
        date: '2024-01-10',
        type: 'visit',
        description: 'Brought a group of 4 friends, introduced them to the single-origin selection',
        outcome: 'positive',
        follow_up_required: false,
        referrals_made: 4
      }
    ],
    tags: ['coffee', 'artisanal', 'weekend-visits', 'group-friendly'],
    notes: 'Great for introducing coffee enthusiasts to specialty coffee. The staff is knowledgeable and patient.',
    mutual_contacts: ['Priya Nair', 'Rohan Gupta']
  },
  {
    id: '2',
    place_id: 'place-2',
    place_name: 'Koshy\'s Restaurant',
    business_name: 'Koshy\'s Restaurant',
    contact_person: 'Mrs. Koshy',
    contact_phone: '+91 80 2558 4333',
    relationship_type: 'personal_friend',
    trust_level: 'verified',
    connection_strength: 'strong',
    established_date: '2021-03-20',
    last_interaction: '2024-01-08',
    status: 'active',
    description: 'Family friend relationship spanning multiple generations. Mrs. Koshy remembers my preferences and always ensures excellent service.',
    special_arrangements: [
      {
        id: 'arr-2',
        type: 'priority_service',
        description: 'Reserved seating in the old wing for special occasions',
        terms: 'With 24-hour advance notice',
        usage_count: 3,
        is_active: true
      }
    ],
    referral_benefits: [
      {
        id: 'ben-2',
        type: 'special_access',
        description: 'Access to the heritage breakfast menu',
        special_access: 'Traditional recipes not on regular menu',
        conditions: ['Weekend mornings only', 'Must call ahead'],
        is_active: true
      }
    ],
    interaction_history: [
      {
        id: 'int-2',
        date: '2024-01-08',
        type: 'visit',
        description: 'Family brunch with visiting relatives',
        outcome: 'positive',
        follow_up_required: false,
        value_generated: 2500
      }
    ],
    tags: ['heritage', 'family-friendly', 'breakfast', 'institutional'],
    notes: 'Perfect for visitors who want to experience old Bangalore charm. The heritage breakfast is exceptional.',
    mutual_contacts: ['Uncle Kumar', 'Meera Aunty']
  },
  {
    id: '3',
    place_id: 'place-3',
    place_name: 'Mavalli Tiffin Room',
    business_name: 'Mavalli Tiffin Room (MTR)',
    contact_person: 'Vivek Gupta',
    contact_email: 'vivek@mavallitiffinroom.com',
    relationship_type: 'regular_customer',
    trust_level: 'medium',
    connection_strength: 'moderate',
    established_date: '2023-01-15',
    last_interaction: '2023-12-20',
    status: 'active',
    description: 'Regular weekend customer. The manager recognizes me and knows my usual order. Good relationship building over consistent visits.',
    special_arrangements: [],
    referral_benefits: [
      {
        id: 'ben-3',
        type: 'priority_booking',
        description: 'Preferred seating during peak hours',
        conditions: ['Weekends only', 'Based on availability'],
        is_active: true
      }
    ],
    interaction_history: [
      {
        id: 'int-3',
        date: '2023-12-20',
        type: 'visit',
        description: 'Regular weekend breakfast',
        outcome: 'positive',
        follow_up_required: false
      }
    ],
    tags: ['traditional', 'weekend-routine', 'south-indian'],
    notes: 'Consistent quality and service. Good for authentic South Indian breakfast experience.',
    mutual_contacts: []
  }
]

const mockMetrics: RelationshipMetrics = {
  total_relationships: 15,
  active_relationships: 12,
  relationship_by_type: {
    mention_my_name: 6,
    personal_friend: 3,
    regular_customer: 4,
    business_partner: 1,
    supplier: 0,
    referral_source: 1,
    collaborator: 0,
    community_connection: 0
  },
  trust_level_distribution: {
    high: 4,
    verified: 3,
    medium: 5,
    low: 0,
    new: 0
  },
  referrals_made: 47,
  referrals_received: 12,
  value_generated: 25000,
  relationship_growth_rate: 0.23,
  average_relationship_age: 18.5
}

function MetricsCards({ metrics }: { metrics: RelationshipMetrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">{metrics.total_relationships}</span>
        </div>
        <p className="text-gray-600">Total Relationships</p>
        <p className="text-sm text-green-600 mt-1">
          {metrics.active_relationships} active
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">{metrics.referrals_made}</span>
        </div>
        <p className="text-gray-600">Referrals Made</p>
        <p className="text-sm text-blue-600 mt-1">
          {metrics.referrals_received} received
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <Gift className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900">
            {Object.values(metrics.relationship_by_type).reduce((sum, count) => 
              sum + (count > 0 ? 1 : 0), 0
            )}
          </span>
        </div>
        <p className="text-gray-600">Benefit Programs</p>
        <p className="text-sm text-purple-600 mt-1">
          Active arrangements
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <BarChart3 className="w-8 h-8 text-orange-600" />
          <span className="text-2xl font-bold text-gray-900">
            ₹{(metrics.value_generated / 1000).toFixed(0)}k
          </span>
        </div>
        <p className="text-gray-600">Value Generated</p>
        <p className="text-sm text-orange-600 mt-1">
          +{(metrics.relationship_growth_rate * 100).toFixed(0)}% growth
        </p>
      </div>
    </div>
  )
}

function RelationshipGrid({ relationships }: { relationships: BusinessRelationship[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {relationships.map((relationship) => (
        <BusinessRelationshipCard
          key={relationship.id}
          relationship={relationship}
          variant="detailed"
          onEdit={(rel) => console.log('Edit relationship:', rel.id)}
          onViewDetails={(id) => console.log('View details:', id)}
          onAddInteraction={(id) => console.log('Add interaction:', id)}
        />
      ))}
    </div>
  )
}

function RelationshipGridSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-16 bg-gray-200 rounded" />
          </div>
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-6">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BusinessRelationshipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/map"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Map</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Network className="w-5 h-5" />
                <span className="hidden sm:inline">Network View</span>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Relationship</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Business Relationships
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Track and leverage personal connections with local businesses to create mutual value 
              and enhance the community experience for everyone.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses, contacts, or relationship types..."
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Metrics */}
        <MetricsCards metrics={mockMetrics} />

        {/* Network Visualization */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Relationship Network</h2>
          <NetworkVisualization
            relationships={mockRelationships}
            onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
            onNodeHover={(nodeId) => console.log('Hovered node:', nodeId)}
            height={400}
          />
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-blue-900 font-medium">New referral made to Blue Tokai Coffee</p>
                  <p className="text-blue-700 text-sm">Introduced 4 friends to their single-origin selection</p>
                  <p className="text-blue-600 text-xs mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-green-900 font-medium">Special arrangement activated at Koshy's</p>
                  <p className="text-green-700 text-sm">Reserved heritage breakfast for visiting family</p>
                  <p className="text-green-600 text-xs mt-1">1 week ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <p className="text-yellow-900 font-medium">Follow-up reminder</p>
                  <p className="text-yellow-700 text-sm">Check in with MTR about weekend seating preferences</p>
                  <p className="text-yellow-600 text-xs mt-1">Due tomorrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Relationships */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Relationships</h2>
            <Link
              href="/business/relationships/all"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all relationships →
            </Link>
          </div>
          
          <Suspense fallback={<RelationshipGridSkeleton />}>
            <RelationshipGrid relationships={mockRelationships} />
          </Suspense>
        </div>

        {/* Insights and Opportunities */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Relationship Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">Maintenance Opportunity</h4>
                <p className="text-orange-800 text-sm mb-3">
                  You haven't visited MTR in 3 weeks. Consider scheduling a weekend breakfast to maintain the relationship.
                </p>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Schedule visit →
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Growth Opportunity</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Consider introducing Blue Tokai to your coffee enthusiast friends - high conversion rate expected.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Plan group visit →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Trust Relationships</span>
                <span className="font-semibold text-gray-900">{mockMetrics.trust_level_distribution.high + mockMetrics.trust_level_distribution.verified}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Special Arrangements</span>
                <span className="font-semibold text-gray-900">
                  {mockRelationships.reduce((sum, rel) => sum + rel.special_arrangements.filter(arr => arr.is_active).length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Relationship Age</span>
                <span className="font-semibold text-gray-900">{mockMetrics.average_relationship_age} months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network Growth Rate</span>
                <span className="font-semibold text-green-600">+{(mockMetrics.relationship_growth_rate * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}