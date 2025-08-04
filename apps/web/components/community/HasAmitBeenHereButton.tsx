'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import SuggestionForm from './SuggestionForm'

export default function HasAmitBeenHereButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium text-sm md:text-base group min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
        aria-label="Ask Amit a question about places he has visited"
        aria-describedby="amit-button-description"
      >
        <MessageCircle className="w-5 h-5 group-hover:animate-pulse" aria-hidden="true" />
        <span className="hidden sm:inline">Has Amit Been Here?</span>
        <span className="sm:hidden">Ask Amit</span>
      </button>

      {/* Hidden description for screen readers */}
      <div id="amit-button-description" className="sr-only">
        Open a form to ask Amit questions about places in Indiranagar
      </div>

      {/* Modal */}
      {showModal && (
        <SuggestionForm onClose={() => setShowModal(false)} />
      )}
    </>
  )
}