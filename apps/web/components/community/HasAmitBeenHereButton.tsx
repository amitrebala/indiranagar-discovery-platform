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
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium text-sm md:text-base group"
        aria-label="Ask Amit a question"
      >
        <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
        <span className="hidden sm:inline">Has Amit Been Here?</span>
        <span className="sm:hidden">Ask Amit</span>
      </button>

      {/* Modal */}
      {showModal && (
        <SuggestionForm onClose={() => setShowModal(false)} />
      )}
    </>
  )
}