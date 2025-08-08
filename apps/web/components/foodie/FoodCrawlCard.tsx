'use client';

import { useState } from 'react';
import { MapPin, Clock, Wallet, Users, Navigation, Share2, Play, ChevronRight } from 'lucide-react';

interface FoodCrawl {
  name: string;
  theme: string;
  stops: Array<{
    order: number;
    place: {
      name: string;
      address: string;
      category: string;
      rating: number;
    };
    recommended_items: string[];
    estimated_cost: number;
    duration_minutes: number;
    walking_distance: string;
  }>;
  total_distance: string;
  total_duration: string;
  total_cost: number;
  tips: string[];
}

interface FoodCrawlCardProps {
  crawl: FoodCrawl;
  onStart?: (crawl: FoodCrawl) => void;
  onShare?: (crawl: FoodCrawl) => void;
  className?: string;
}

const themeConfig = {
  'breakfast marathon': {
    color: 'from-orange-400 to-yellow-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    emoji: '🌅',
  },
  'street food safari': {
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    emoji: '🌶️',
  },
  'craft beer journey': {
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    emoji: '🍺',
  },
  'dessert trail': {
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    emoji: '🍰',
  },
  default: {
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    emoji: '🍽️',
  },
};

export function FoodCrawlCard({
  crawl,
  onStart,
  onShare,
  className = '',
}: FoodCrawlCardProps) {
  const [activeTab, setActiveTab] = useState<'route' | 'tips'>('route');
  const [expandedStop, setExpandedStop] = useState<number | null>(null);
  
  const config = themeConfig[crawl.theme.toLowerCase() as keyof typeof themeConfig] || themeConfig.default;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{config.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold">{crawl.name}</h3>
                <p className="text-white/90 capitalize font-medium">{crawl.theme}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium text-white/80">STOPS</span>
            </div>
            <span className="text-xl font-bold">{crawl.stops.length}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium text-white/80">DURATION</span>
            </div>
            <span className="text-xl font-bold">{crawl.total_duration}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4" />
              <span className="text-xs font-medium text-white/80">WALKING</span>
            </div>
            <span className="text-xl font-bold">{crawl.total_distance}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium text-white/80">BUDGET</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(crawl.total_cost)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
          {[
            { key: 'route', label: 'Route', icon: MapPin },
            { key: 'tips', label: 'Tips', icon: Share2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === key
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[300px]">
          {activeTab === 'route' && (
            <div className="space-y-4">
              {crawl.stops.map((stop, index) => {
                const isExpanded = expandedStop === index;
                const isLast = index === crawl.stops.length - 1;

                return (
                  <div key={stop.order} className="relative">
                    {/* Stop card */}
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        isExpanded 
                          ? `${config.bgColor} border-2 ${config.textColor.replace('text-', 'border-')}`
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setExpandedStop(isExpanded ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Step number */}
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                            isExpanded ? config.color : 'bg-gray-400'
                          } bg-gradient-to-r`}>
                            {stop.order}
                          </div>
                          
                          {/* Place info */}
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">
                              {stop.place.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{stop.place.category}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span>{stop.place.rating}/5</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quick stats */}
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(stop.estimated_cost)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {stop.duration_minutes}m
                            </div>
                          </div>
                          
                          <ChevronRight 
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                          />
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">📍 Location</h5>
                              <p className="text-sm text-gray-600 mb-3">{stop.place.address}</p>
                              
                              <h5 className="font-medium text-gray-900 mb-2">🚶 Walking Distance</h5>
                              <p className="text-sm text-gray-600">{stop.walking_distance}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">🍽️ Recommended Items</h5>
                              <div className="space-y-1">
                                {stop.recommended_items.map((item, itemIndex) => (
                                  <span
                                    key={itemIndex}
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 mb-1 ${config.bgColor} ${config.textColor}`}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connection line */}
                    {!isLast && (
                      <div className="flex justify-center my-2">
                        <div className="w-px h-6 bg-gray-300"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              {crawl.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-600 text-xl flex-shrink-0">💡</span>
                  <span className="text-gray-900 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-6 flex gap-3">
        {onStart && (
          <button
            onClick={() => onStart(crawl)}
            className={`flex-1 bg-gradient-to-r ${config.color} text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <Play className="w-4 h-4" />
            Start Food Crawl
          </button>
        )}
        {onShare && (
          <button
            onClick={() => onShare(crawl)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}