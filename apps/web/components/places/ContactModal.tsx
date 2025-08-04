'use client'

import { useState } from 'react'
import { X, Mail, MessageCircle } from 'lucide-react'
import { Place } from '@/lib/validations'

interface ContactModalProps {
  place: Place
  onClose: () => void
}

export default function ContactModal({ place, onClose }: ContactModalProps) {
  const [message, setMessage] = useState('')
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const personalizedMessage = `Hi Amit! I'm interested in ${place.name}. ${message || 'Could you share more details about this place?'}`
    
    if (contactMethod === 'whatsapp') {
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(personalizedMessage)}`
      window.open(whatsappUrl, '_blank')
    } else {
      const emailSubject = `Question about ${place.name}`
      const emailUrl = `mailto:amit@indiranagardiscovery.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(personalizedMessage)}`
      window.open(emailUrl)
    }
    
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Personal Recommendations
            </h2>
            <p className="text-gray-600">
              Ask Amit directly about <strong>{place.name}</strong> and get insider tips from years of exploring Indiranagar.
            </p>
          </div>

          {/* Contact method selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">How would you like to connect?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setContactMethod('whatsapp')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  contactMethod === 'whatsapp'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </button>
              <button
                onClick={() => setContactMethod('email')}
                className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                  contactMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Message form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your message (optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={`What would you like to know about ${place.name}?`}
              />
            </div>

            {/* Contact info preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">You&apos;ll be connecting with:</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-medium text-gray-900">Amit Rebala</p>
                  <p className="text-sm text-gray-600">Indiranagar Local Expert</p>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {contactMethod === 'whatsapp' ? (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Message on WhatsApp
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Email
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Amit typically responds within a few hours and loves sharing local insights!
          </p>
        </div>
      </div>
    </>
  )
}