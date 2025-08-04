'use client';

import { useState } from 'react';
import { MapPin, Upload, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

interface SuggestionFormData {
  submitter_name: string;
  submitter_email: string;
  submitter_social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  place_name: string;
  suggested_latitude: number;
  suggested_longitude: number;
  category: string;
  personal_notes: string;
  images: File[];
}

export const CommunitySuggestionForm = () => {
  const [formData, setFormData] = useState<SuggestionFormData>({
    submitter_name: '',
    submitter_email: '',
    place_name: '',
    suggested_latitude: 12.9716,
    suggested_longitude: 77.5946,
    category: '',
    personal_notes: '',
    images: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      suggested_latitude: lat,
      suggested_longitude: lng
    }));
  };

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 5 - formData.images.length);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/community-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        toast.success(`Thank you! Your suggestion has been submitted. Track it with ID: ${result.suggestion.id}`);
        
        // Reset form
        setFormData({
          submitter_name: '',
          submitter_email: '',
          place_name: '',
          suggested_latitude: 12.9716,
          suggested_longitude: 77.5946,
          category: '',
          personal_notes: '',
          images: []
        });
      } else {
        throw new Error(result.error || 'Failed to submit suggestion');
      }
    } catch (error) {
      setSubmitStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Suggest a New Place</h2>
          <p className="text-gray-600 mb-6">
            Help expand Indiranagar's discovery platform by sharing your favorite places!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
            <input
              type="text"
              required
              value={formData.submitter_name}
              onChange={(e) => setFormData(prev => ({ ...prev, submitter_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (for updates) *</label>
            <input
              type="email"
              required
              value={formData.submitter_email}
              onChange={(e) => setFormData(prev => ({ ...prev, submitter_email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Place Name *</label>
          <input
            type="text"
            required
            value={formData.place_name}
            onChange={(e) => setFormData(prev => ({ ...prev, place_name: e.target.value }))}
            placeholder="e.g., Amazing Coffee House"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Currently set to Indiranagar center</span>
            </div>
            <div className="text-xs text-gray-500">
              Lat: {formData.suggested_latitude.toFixed(6)}, Lng: {formData.suggested_longitude.toFixed(6)}
            </div>
          </div>
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
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="shopping">Shopping</option>
            <option value="culture">Culture</option>
            <option value="activity">Activity</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <div className="space-y-3">
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Upload Photos (Max 5)</span>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB each</p>
              </div>
            </label>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about this place *</label>
          <textarea
            required
            value={formData.personal_notes}
            onChange={(e) => setFormData(prev => ({ ...prev, personal_notes: e.target.value }))}
            placeholder="What makes this place special? When did you discover it? What should people know?"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.personal_notes.length}/2000 characters
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Optional: Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Instagram handle"
              value={formData.submitter_social?.instagram || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                submitter_social: {
                  ...prev.submitter_social,
                  instagram: e.target.value
                }
              }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Twitter handle"
              value={formData.submitter_social?.twitter || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                submitter_social: {
                  ...prev.submitter_social,
                  twitter: e.target.value
                }
              }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="LinkedIn profile"
              value={formData.submitter_social?.linkedin || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                submitter_social: {
                  ...prev.submitter_social,
                  linkedin: e.target.value
                }
              }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
              Submitting...
            </span>
          ) : (
            'Submit Suggestion'
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">Success!</p>
            <p className="text-green-700 text-sm mt-1">
              Your suggestion has been submitted and will be reviewed soon. You'll receive email updates on its status.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};