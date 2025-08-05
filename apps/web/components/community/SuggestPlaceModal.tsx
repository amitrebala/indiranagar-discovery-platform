'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'

interface SuggestPlaceModalProps {
  isOpen: boolean
  onClose: () => void
  initialPlaceName?: string
}

export default function SuggestPlaceModal({ isOpen, onClose, initialPlaceName = '' }: SuggestPlaceModalProps) {
  const [placeName, setPlaceName] = useState(initialPlaceName)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { triggerHaptic } = useHapticFeedback()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!placeName.trim()) return

    setIsSubmitting(true)
    triggerHaptic(HapticPattern.LIGHT)
    
    try {
      // In a real app, this would submit to your API
      const response = await fetch('/api/community/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName: placeName.trim(),
          comment: comment.trim(),
          category: category || 'Other',
          suggestedAt: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        triggerHaptic(HapticPattern.SUCCESS)
        // Show success message
        alert('Thanks for the suggestion! I\'ll check it out.')
        onClose()
      } else {
        throw new Error('Failed to submit suggestion')
      }
    } catch (error) {
      console.error('Error suggesting place:', error)
      triggerHaptic(HapticPattern.ERROR)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Suggest a Place to Amit</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="place-name" className="block text-sm font-medium text-gray-700 mb-1">
                Place Name *
              </label>
              <input
                id="place-name"
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="e.g., Corner House, Brigade Road"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a category</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
                <option value="Shop">Shop</option>
                <option value="Park">Park</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Why should I visit? (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell me what makes this place special..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !placeName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Suggesting...' : 'Suggest Place'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}