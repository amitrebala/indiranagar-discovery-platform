'use client'

import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CallButtonProps {
  phoneNumber: string
  placeName: string
}

export function CallButton({ phoneNumber, placeName }: CallButtonProps) {
  const handleCall = () => {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'call_place', {
        place_name: placeName,
        phone_number: phoneNumber
      })
    }

    // Check if on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Direct call on mobile
      window.location.href = `tel:${phoneNumber}`
    } else {
      // Copy to clipboard on desktop
      navigator.clipboard.writeText(phoneNumber)
      toast.success('Phone number copied to clipboard!')
    }
  }

  return (
    <Button 
      onClick={handleCall}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Phone className="w-4 h-4" />
      <span className="hidden sm:inline">Call</span>
      <span className="sm:hidden">Call</span>
    </Button>
  )
}