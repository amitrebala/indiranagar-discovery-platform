'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { MessageCircle, MapPin, ThumbsUp, Filter, Search, Award, Plus } from 'lucide-react'

interface Suggestion {
  id: string
  placeName: string
  suggestedBy: string
  reason: string
  votes: number
  timestamp: Date
  status: 'pending' | 'approved' | 'declined'
}

interface Comment {
  id: string
  placeName: string
  username: string
  comment: string
  type: 'question' | 'suggestion'
  timestamp: Date
  replies: number
}

// Mock data - in real app this would come from database
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    placeName: 'Corner House Ice Cream',
    suggestedBy: 'IceCreamLover',
    reason: 'Amazing death by chocolate, perfect for hot days!',
    votes: 12,
    timestamp: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    id: '2',
    placeName: 'MTR Restaurant',
    suggestedBy: 'FoodieExplorer',
    reason: 'Authentic South Indian breakfast spot, been around for decades',
    votes: 8,
    timestamp: new Date('2024-01-12'),
    status: 'approved'
  },
  {
    id: '3',
    placeName: 'The Hole in the Wall Cafe',
    suggestedBy: 'CoffeeAddict',
    reason: 'Great coffee and cozy atmosphere for working',
    votes: 15,
    timestamp: new Date('2024-01-10'),
    status: 'pending'
  }
]

const mockComments: Comment[] = [
  {
    id: '1',
    placeName: 'Urban Solace',
    username: 'LocalGuide',
    comment: 'Is the rooftop seating still available? Planning to visit next week.',
    type: 'question',
    timestamp: new Date('2024-01-15'),
    replies: 2
  },
  {
    id: '2',
    placeName: 'Koshys',
    username: 'HeritageSeeker',
    comment: 'You should mention their famous mutton curry - it\'s legendary!',
    type: 'suggestion',
    timestamp: new Date('2024-01-14'),
    replies: 0
  },
  {
    id: '3',
    placeName: 'ZAMA',
    username: 'RollEnthusiast',
    comment: 'What time do they usually run out of rolls? Want to make sure I don\'t miss out.',
    type: 'question',
    timestamp: new Date('2024-01-13'),
    replies: 1
  }
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'comments'>('suggestions')
  const [suggestions] = useState<Suggestion[]>(mockSuggestions)
  const [comments] = useState<Comment[]>(mockComments)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'declined'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesFilter = filterStatus === 'all' || suggestion.status === filterStatus
    const matchesSearch = suggestion.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suggestion.reason.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredComments = comments.filter(comment =>
    comment.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.comment.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Join the conversation about Indiranagar&apos;s best places. Share suggestions, ask questions, and help others discover amazing experiences.
            </p>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/suggest" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Suggest a New Place
              </Link>
              <Link 
                href="/community/badges" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <Award className="w-4 h-4" />
                Community Badges
              </Link>
              <Link 
                href="/events" 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {suggestions.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Suggestions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-8 h-8 text-secondary" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{comments.length}</div>
                  <div className="text-sm text-gray-600">Community Comments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {suggestions.reduce((sum, s) => sum + s.votes, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'suggestions'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Place Suggestions ({suggestions.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'comments'
                    ? 'text-secondary border-b-2 border-secondary bg-secondary/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  All Comments ({comments.length})
                </div>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search places or comments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                {activeTab === 'suggestions' && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'declined')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'suggestions' ? (
                <div className="space-y-4">
                  {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No suggestions found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  ) : (
                    filteredSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{suggestion.placeName}</h3>
                            <p className="text-sm text-gray-600">
                              Suggested by <span className="font-medium">{suggestion.suggestedBy}</span> on{' '}
                              {suggestion.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              suggestion.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-700'
                                : suggestion.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {suggestion.status}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <ThumbsUp className="w-4 h-4" />
                              {suggestion.votes}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{suggestion.reason}</p>
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-primary hover:text-primary/80 font-medium">
                            Vote Up
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Add Comment
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria.</p>
                    </div>
                  ) : (
                    filteredComments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{comment.placeName}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                comment.type === 'question' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {comment.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              by <span className="font-medium">{comment.username}</span> on{' '}
                              {comment.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          {comment.replies > 0 && (
                            <div className="text-sm text-gray-600">
                              {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{comment.comment}</p>
                        <button className="text-sm text-secondary hover:text-secondary/80 font-medium">
                          View on Place Page →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border border-primary/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Contribute?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Know a great place Amit hasn&apos;t discovered yet? Have questions about a specific spot? 
              Use the floating &quot;Has Amit Been Here?&quot; button to suggest places or ask questions directly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/suggest"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-center"
              >
                Suggest a Place
              </Link>
              <Link 
                href="/places"
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium text-center"
              >
                Browse Places
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}