'use client'

import { Share2, Link, Twitter, Facebook, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface ShareButtonProps {
  url: string
  title: string
  description?: string
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url

  const handleShare = async (method: 'native' | 'twitter' | 'facebook' | 'copy') => {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: method,
        content_type: 'place',
        item_id: url
      })
    }

    switch (method) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: description,
              url: fullUrl
            })
          } catch (err) {
            // User cancelled sharing
          }
        }
        break
        
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
          '_blank'
        )
        break
        
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          '_blank'
        )
        break
        
      case 'copy':
        await navigator.clipboard.writeText(fullUrl)
        toast.success('Link copied to clipboard!')
        break
    }
  }

  // Check if Web Share API is available
  const canShare = typeof window !== 'undefined' && navigator.share

  if (canShare) {
    // Use native sharing on supported devices
    return (
      <Button 
        onClick={() => handleShare('native')}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>
    )
  }

  // Fallback to dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}