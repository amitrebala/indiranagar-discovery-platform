'use client'

import React, { useState } from 'react'
import { Share2, Link, Twitter, Facebook, MessageCircle, Check, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { JourneyExperience } from '@/lib/types/journey'
import { JourneyProgress } from '@/hooks/useJourneyProgress'

interface JourneyShareButtonProps {
  journey: JourneyExperience
  progress?: JourneyProgress | null
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function JourneyShareButton({
  journey,
  progress,
  variant = 'outline',
  size = 'default',
  className
}: JourneyShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { toast } = useToast()

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/journeys/${journey.slug}`
    : ''

  const shareTitle = progress?.isCompleted
    ? `I completed the "${journey.name}" journey in Indiranagar! 🎉`
    : `Check out this amazing journey in Indiranagar: ${journey.name}`

  const shareDescription = `${journey.description} - ${journey.journey_stops?.length || 0} stops, ${journey.duration_minutes} minutes`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Journey link has been copied to your clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      setShowShareDialog(true)
    }
  }

  const handleSocialShare = (platform: string) => {
    let url = ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)
    const encodedDescription = encodeURIComponent(shareDescription)

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const getCompletionStats = () => {
    if (!progress) return null
    
    const completionPercentage = Math.round(
      (progress.completedStops.length / progress.totalStops) * 100
    )
    
    const timeTaken = (() => {
      const start = new Date(progress.startedAt)
      const end = new Date(progress.lastUpdatedAt)
      const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    })()

    return {
      completionPercentage,
      timeTaken,
      stopsCompleted: progress.completedStops.length,
      totalStops: progress.totalStops
    }
  }

  const stats = getCompletionStats()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Share2 className={size === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
            {size !== 'icon' && 'Share'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Share Journey</DropdownMenuLabel>
          {progress?.isCompleted && (
            <>
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Trophy className="h-4 w-4" />
                  <span className="font-medium">Journey Completed!</span>
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Copy link
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSocialShare('whatsapp')}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </DropdownMenuItem>
          {navigator.share && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleNativeShare}>
                <Share2 className="mr-2 h-4 w-4" />
                More sharing options...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Dialog for Desktop */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Journey
            </DialogTitle>
            <DialogDescription>
              {progress?.isCompleted 
                ? "Share your completed journey with friends!"
                : "Share this amazing journey with your friends"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Journey Info */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-1">{journey.name}</h3>
              <p className="text-sm text-muted-foreground">{journey.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  {journey.journey_stops?.length || 0} stops
                </Badge>
                <Badge variant="secondary">
                  {journey.duration_minutes} min
                </Badge>
                {journey.difficulty_level && (
                  <Badge variant="secondary">
                    {journey.difficulty_level}
                  </Badge>
                )}
              </div>
            </div>

            {/* Completion Stats */}
            {stats && progress?.isCompleted && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Journey Completed!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Time taken:</span>
                    <span className="ml-1 font-medium">{stats.timeTaken}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stops visited:</span>
                    <span className="ml-1 font-medium">{stats.stopsCompleted}/{stats.totalStops}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleSocialShare('twitter')
                  setShowShareDialog(false)
                }}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleSocialShare('facebook')
                  setShowShareDialog(false)
                }}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleSocialShare('whatsapp')
                  setShowShareDialog(false)
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Share on WhatsApp
              </Button>
            </div>

            {/* Share Text */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Share text:</p>
              <p className="text-sm">{shareTitle}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}