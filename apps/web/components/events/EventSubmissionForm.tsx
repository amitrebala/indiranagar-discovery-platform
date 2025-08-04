'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_address: string;
  location_latitude: number;
  location_longitude: number;
  venue_type: 'indoor' | 'outdoor' | 'hybrid';
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  capacity?: number;
  cost_type: 'free' | 'paid' | 'donation';
  cost_amount?: number;
  is_recurring: boolean;
}

export const EventSubmissionForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    start_time: '',
    end_time: '',
    location_name: '',
    location_address: '',
    location_latitude: 12.9716,
    location_longitude: 77.5946,
    venue_type: 'indoor',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: '',
    cost_type: 'free',
    is_recurring: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Event "${result.event.title}" submitted successfully! It will be reviewed soon.`);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          start_time: '',
          end_time: '',
          location_name: '',
          location_address: '',
          location_latitude: 12.9716,
          location_longitude: 77.5946,
          venue_type: 'indoor',
          organizer_name: '',
          organizer_email: '',
          organizer_phone: '',
          cost_type: 'free',
          is_recurring: false
        });
      } else {
        throw new Error(result.error || 'Failed to submit event');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit New Event</h2>
          <p className="text-gray-600 mb-6">
            Share your event with the Indiranagar community and help people discover amazing local experiences.
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2">Event Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="e.g., Sunday Morning Art Market"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="food_festival">Food Festival</option>
              <option value="market">Market</option>
              <option value="cultural_event">Cultural Event</option>
              <option value="running_group">Running Group</option>
              <option value="meetup">Community Meetup</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              placeholder="Describe your event, what people can expect, any special activities..."
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Date & Time
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
              <input
                type="text"
                required
                value={formData.location_name}
                onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="e.g., Community Center Hall"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Type</label>
              <select
                value={formData.venue_type}
                onChange={(e) => setFormData(prev => ({ ...prev, venue_type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
            <textarea
              required
              value={formData.location_address}
              onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              placeholder="Complete address with landmarks..."
            />
          </div>
        </div>

        {/* Organizer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2">Organizer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.organizer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, organizer_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.organizer_email}
                onChange={(e) => setFormData(prev => ({ ...prev, organizer_email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.organizer_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, organizer_phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2">Additional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Capacity (Optional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  capacity: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Maximum attendees"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Cost Type
              </label>
              <select
                value={formData.cost_type}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="donation">Donation-based</option>
              </select>
            </div>
          </div>

          {formData.cost_type === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.cost_amount || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  cost_amount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Event price in rupees"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
              Submitting Event...
            </span>
          ) : (
            'Submit Event for Review'
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• Your event will be reviewed by our moderation team</p>
            <p>• You&apos;ll receive email updates on the review status</p>
            <p>• Approved events will be published on the community calendar</p>
            <p>• You&apos;ll get notifications when people RSVP to your event</p>
          </div>
        </div>
      </form>
    </div>
  );
};