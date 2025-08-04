'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  content: {
    type: 'place' | 'journey' | 'event';
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  onShare?: (platform: string) => void;
}

export const SocialShare = ({ content, onShare }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const shareUrl = `${window?.location?.origin}/${content.type}s/${content.id}`;
  const shareText = `Check out "${content.title}" on Indiranagar Discovery! ${content.description}`;

  const handleShare = async (platform: string) => {
    onShare?.(platform);
    
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: content.title,
              text: content.description,
              url: shareUrl
            });
            return;
          } catch (err) {
            console.log('Native sharing failed, falling back to copy');
          }
        }
        
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
          <div className="py-2">
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Facebook className="w-4 h-4 mr-3 text-blue-600" />
              Facebook
            </button>
            
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Twitter className="w-4 h-4 mr-3 text-blue-400" />
              Twitter
            </button>
            
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <MessageCircle className="w-4 h-4 mr-3 text-green-600" />
              WhatsApp
            </button>
            
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Share2 className="w-4 h-4 mr-3 text-gray-600" />
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};