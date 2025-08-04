'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Link as LinkIcon, X } from 'lucide-react'

interface QuickImageAdderProps {
  placeId: string
  placeName: string
  onImageAdded?: () => void
}

export function QuickImageAdder({ placeId, placeName, onImageAdded }: QuickImageAdderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const addExternalImage = async () => {
    if (!externalUrl.trim()) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('place_images')
        .insert({
          place_id: placeId,
          storage_path: externalUrl,
          caption: `Image for ${placeName}`,
          is_primary: true, // Make it primary if it's the first image
          sort_order: 0
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Image added successfully!' })
      setExternalUrl('')
      onImageAdded?.()

      // Close after success
      setTimeout(() => {
        setIsOpen(false)
        setMessage(null)
      }, 2000)

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to add image' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
      >
        <Upload className="w-3 h-3" />
        Add Image
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Add Image for {placeName}</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-1" />
              Image URL
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste a direct link to an image (jpg, png, webp)
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded text-sm ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={addExternalImage}
              disabled={loading || !externalUrl.trim()}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Image'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}