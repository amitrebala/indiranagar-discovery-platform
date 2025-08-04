'use client';

import { useState, useEffect } from 'react';
import { MapPin, User, Clock, ThumbsUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface CommunitySuggestion {
  id: string;
  submitter_name: string;
  submitter_email: string;
  place_name: string;
  suggested_latitude: number;
  suggested_longitude: number;
  category: string;
  personal_notes: string;
  status: 'submitted' | 'under_review' | 'approved' | 'published' | 'rejected' | 'needs_clarification';
  admin_notes?: string;
  admin_response?: string;
  votes: number;
  created_at: string;
  suggestion_images?: Array<{
    id: string;
    storage_path: string;
    thumbnail_path?: string;
    caption?: string;
  }>;
  contributors?: {
    name: string;
    recognition_level: string;
  };
}

interface SuggestionCardProps {
  suggestion: CommunitySuggestion;
  isSelected: boolean;
  onClick: () => void;
}

const SuggestionCard = ({ suggestion, isSelected, onClick }: SuggestionCardProps) => {
  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    published: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    needs_clarification: 'bg-orange-100 text-orange-800'
  };

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {suggestion.place_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{suggestion.category}</span>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[suggestion.status]}`}>
          {suggestion.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {suggestion.personal_notes}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <User className="w-3 h-3 mr-1" />
          <span>{suggestion.submitter_name}</span>
          <Clock className="w-3 h-3 ml-3 mr-1" />
          <span>{format(new Date(suggestion.created_at), 'MMM d')}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-gray-500">
            <ThumbsUp className="w-3 h-3 mr-1" />
            <span>{suggestion.votes}</span>
          </div>
        </div>
      </div>

      {suggestion.suggestion_images && suggestion.suggestion_images.length > 0 && (
        <div className="mt-3 flex space-x-2">
          {suggestion.suggestion_images.slice(0, 3).map((image, index) => (
            <img
              key={image.id}
              src={image.thumbnail_path || image.storage_path}
              alt={image.caption || 'Suggestion photo'}
              className="w-12 h-12 rounded object-cover"
            />
          ))}
          {suggestion.suggestion_images.length > 3 && (
            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-600">
              +{suggestion.suggestion_images.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SuggestionDetailPanelProps {
  suggestion: CommunitySuggestion;
  onStatusChange: (suggestionId: string, newStatus: string, adminNotes?: string) => void;
  onConvertToPlace?: (suggestion: CommunitySuggestion) => void;
}

const SuggestionDetailPanel = ({ 
  suggestion, 
  onStatusChange, 
  onConvertToPlace 
}: SuggestionDetailPanelProps) => {
  const [adminResponse, setAdminResponse] = useState(suggestion.admin_response || '');
  const [adminNotes, setAdminNotes] = useState(suggestion.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(suggestion.id, newStatus, adminNotes);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{suggestion.place_name}</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {suggestion.category}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <strong>Submitted by:</strong> {suggestion.submitter_name}
          </div>
          <div>
            <strong>Email:</strong> {suggestion.submitter_email}
          </div>
          <div>
            <strong>Date:</strong> {format(new Date(suggestion.created_at), 'MMM d, yyyy')}
          </div>
          <div>
            <strong>Votes:</strong> {suggestion.votes}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Location</h3>
          <p className="text-sm text-gray-600">
            Lat: {suggestion.suggested_latitude}, Lng: {suggestion.suggested_longitude}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">{suggestion.personal_notes}</p>
        </div>

        {suggestion.suggestion_images && suggestion.suggestion_images.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Photos</h3>
            <div className="grid grid-cols-3 gap-3">
              {suggestion.suggestion_images.map((image) => (
                <img
                  key={image.id}
                  src={image.storage_path}
                  alt={image.caption || 'Suggestion photo'}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Admin Actions</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Internal)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              rows={3}
              placeholder="Internal notes about this suggestion..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response to Submitter
            </label>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              rows={3}
              placeholder="Response that will be sent to the submitter..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('under_review')}
              disabled={isUpdating}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => handleStatusChange('approved')}
              disabled={isUpdating}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('needs_clarification')}
              disabled={isUpdating}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              Need Clarification
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
            {suggestion.status === 'approved' && onConvertToPlace && (
              <button
                onClick={() => onConvertToPlace(suggestion)}
                disabled={isUpdating}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
              >
                Publish as Place
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSuggestionReview = () => {
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedSuggestion, setSelectedSuggestion] = useState<CommunitySuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [filter]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community-suggestions?status=${filter}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (suggestionId: string, newStatus: string, adminNotes?: string) => {
    // Implementation would call API to update status
    console.log('Updating status:', { suggestionId, newStatus, adminNotes });
    await loadSuggestions();
  };

  const convertToPlace = async (suggestion: CommunitySuggestion) => {
    // Implementation would convert suggestion to actual place
    console.log('Converting to place:', suggestion);
    toast.success(`Place "${suggestion.place_name}" has been published!`);
  };

  return (
    <div className="admin-suggestion-review">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Suggestions</h1>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">All Suggestions</option>
          <option value="submitted">New Submissions</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="needs_clarification">Needs Clarification</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading suggestions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No suggestions found.</p>
              ) : (
                suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isSelected={selectedSuggestion?.id === suggestion.id}
                    onClick={() => setSelectedSuggestion(suggestion)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedSuggestion ? (
              <SuggestionDetailPanel
                suggestion={selectedSuggestion}
                onStatusChange={handleStatusChange}
                onConvertToPlace={convertToPlace}
              />
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a suggestion to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};