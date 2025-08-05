'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MapPin, Calendar, Camera } from 'lucide-react'
import { EnhancedPlace } from '@/lib/types/memory-palace'

interface MemoryPalaceStoryProps {
  place: EnhancedPlace;
}

export default function MemoryPalaceStory({ place }: MemoryPalaceStoryProps) {
  const [expandedAnecdote, setExpandedAnecdote] = useState<string | null>(null)

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'joyful':
        return '😊'
      case 'contemplative':
        return '🤔'
      case 'surprising':
        return '😲'
      case 'nostalgic':
        return '🥺'
      default:
        return '💭'
    }
  }

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'joyful':
        return 'border-yellow-200 bg-yellow-50'
      case 'contemplative':
        return 'border-blue-200 bg-blue-50'
      case 'surprising':
        return 'border-purple-200 bg-purple-50'
      case 'nostalgic':
        return 'border-pink-200 bg-pink-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <section className="memory-palace py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
        The Story Behind {place.name}
      </h2>
      
      {/* Discovery Story */}
      <div className="discovery-narrative mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How I Discovered This Place</h3>
            <p className="text-blue-800 leading-relaxed text-lg">
              {place.memory_palace_story.discovery_story}
            </p>
          </div>
        </div>
      </div>
      
      {/* Spatial Elements */}
      <div className="spatial-elements mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Visual Memories</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {place.memory_palace_story.spatial_elements.map((element) => (
            <div key={element.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image 
                  src={element.reference_image} 
                  fill
                  className="object-cover"
                  alt={element.description}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold text-lg">{element.title}</h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 leading-relaxed">{element.narrative}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Personal Anecdotes */}
      <div className="personal-anecdotes">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Personal Moments
        </h3>
        <div className="space-y-4">
          {place.memory_palace_story.personal_anecdotes.map((anecdote) => (
            <div 
              key={anecdote.id} 
              className={`border-l-4 pl-6 py-4 rounded-r-lg transition-all cursor-pointer ${getEmotionColor(anecdote.emotion)}`}
              onClick={() => setExpandedAnecdote(
                expandedAnecdote === anecdote.id ? null : anecdote.id
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getEmotionIcon(anecdote.emotion)}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {anecdote.date}
                    </span>
                  </div>
                  <blockquote 
                    className="text-gray-800 leading-relaxed italic text-lg"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    &quot;{anecdote.content}&quot;
                  </blockquote>
                  {expandedAnecdote === anecdote.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Context:</strong> {anecdote.context}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <footer className="text-sm mt-3 font-normal text-gray-500">
                — Amit&apos;s memory from {anecdote.context}
              </footer>
            </div>
          ))}
        </div>
      </div>

      {/* Photographer's Note */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Camera className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Curator's Photography Note</h4>
            <p className="text-amber-800 text-sm">
              Each photo and story here captures not just what this place looks like, 
              but how it feels to experience it. These visual memories help me share 
              the authentic essence of what makes this place special in Indiranagar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}