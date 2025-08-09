'use client';

import { useState } from 'react';
import { Share2, Check, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function ShareButton({ 
  title = 'Check out this amazing place in Indiranagar!',
  text = '',
  url,
  className = '',
  variant = 'outline'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      handleCopyLink();
    }
  };
  
  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };
  
  if (typeof window !== 'undefined' && navigator.share) {
    return (
      <Button
        variant={variant}
        onClick={handleNativeShare}
        className={className}
        size="sm"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className} size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this page</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy link
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
          <Linkedin className="w-4 h-4 mr-2" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}