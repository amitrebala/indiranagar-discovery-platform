'use client';

import { useState } from 'react';
import { Dice6, MapPin, Users, Clock, Sparkles, Loader2 } from 'lucide-react';
import { foodieIntegration } from '@/lib/mcp/foodie-integration';
import { FoodChallengeCard } from './FoodChallengeCard';
import { FoodCrawlCard } from './FoodCrawlCard';

type AdventureType = 'challenge' | 'crawl';
type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary';

interface GeneratorState {
  isLoading: boolean;
  selectedType: AdventureType;
  difficulty: Difficulty;
  theme: string;
  groupSize: number;
  budget: number;
  timeLimit: string;
  generatedContent: any | null;
}

const challengeThemes = [
  'Random Adventure',
  'Breakfast Explorer',
  'Street Food Safari', 
  'Spice Warrior',
  'Dessert Marathon',
  'Budget Master',
  'Local Legend',
];

const crawlThemes = [
  'breakfast marathon',
  'street food safari',
  'craft beer journey',
  'dessert trail',
  'lunch crawl',
  'coffee expedition',
  'fusion food tour',
];

const difficultyDescriptions = {
  easy: 'Perfect for beginners - 3 stops, 4 hours, ₹300-600',
  medium: 'Great adventure - 4-5 stops, 6 hours, ₹600-1200', 
  hard: 'Serious challenge - 5-7 stops, 8+ hours, ₹1000-2000',
  legendary: 'Ultimate experience - 10+ stops, multiple days, ₹3000+',
};

const timeLimits = [
  { value: 'morning', label: 'Morning (3-4 hours)' },
  { value: 'day', label: 'Full Day (6-8 hours)' },
  { value: 'weekend', label: 'Weekend (2 days)' },
  { value: 'week', label: 'One Week' },
];

export function FoodieAdventureGenerator() {
  const [state, setState] = useState<GeneratorState>({
    isLoading: false,
    selectedType: 'challenge',
    difficulty: 'medium',
    theme: crawlThemes[0],
    groupSize: 2,
    budget: 1500,
    timeLimit: 'day',
    generatedContent: null,
  });

  const updateState = (updates: Partial<GeneratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const generateAdventure = async () => {
    updateState({ isLoading: true, generatedContent: null });

    try {
      if (state.selectedType === 'challenge') {
        const response = await foodieIntegration.generateChallenge({
          difficulty: state.difficulty,
          timeLimit: state.timeLimit,
          groupSize: state.groupSize,
        });

        if (response.success) {
          updateState({ generatedContent: response.data });
        } else {
          throw new Error(response.error || 'Failed to generate challenge');
        }
      } else {
        const response = await foodieIntegration.createFoodCrawl({
          theme: state.theme,
          budgetPerPerson: Math.floor(state.budget / state.groupSize),
          durationHours: state.timeLimit === 'morning' ? 4 : state.timeLimit === 'day' ? 8 : 12,
          startLocation: '100 Feet Road',
        });

        if (response.success) {
          updateState({ generatedContent: response.data });
        } else {
          throw new Error(response.error || 'Failed to generate food crawl');
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      // Show error state - in a real app you'd want proper error handling
      alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleShare = (content: any) => {
    const shareText = state.selectedType === 'challenge' 
      ? `🍽️ Check out this food challenge: ${content.name}! ${content.objectives?.length} stops in ${content.time_limit}. #IndiranagarFoodie`
      : `🍽️ Join me on this food crawl: ${content.name}! ${content.stops?.length} amazing stops. #IndiranagarFoodie`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Indiranagar Food Adventure',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleStart = (content: any) => {
    // In a real implementation, this would integrate with your app's navigation
    // For now, we'll just show an alert
    alert(`Starting ${state.selectedType}! This would navigate to the adventure tracking page.`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Foodie Adventure Generator
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Create personalized food challenges and crawls through Indiranagar. 
          Perfect for solo adventures or group experiences!
        </p>
      </div>

      {/* Adventure Type Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Adventure</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => updateState({ selectedType: 'challenge', generatedContent: null })}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              state.selectedType === 'challenge'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Dice6 className={`w-6 h-6 ${state.selectedType === 'challenge' ? 'text-purple-600' : 'text-gray-500'}`} />
              <h3 className="text-lg font-semibold">Food Challenge</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Gamified objectives with points, rewards, and difficulty levels. 
              Perfect for systematic food exploration.
            </p>
          </button>

          <button
            onClick={() => updateState({ selectedType: 'crawl', generatedContent: null })}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              state.selectedType === 'crawl'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <MapPin className={`w-6 h-6 ${state.selectedType === 'crawl' ? 'text-purple-600' : 'text-gray-500'}`} />
              <h3 className="text-lg font-semibold">Food Crawl</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Optimized routes with themes, budget planning, and walking directions. 
              Great for group experiences.
            </p>
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customize Your Adventure</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {state.selectedType === 'challenge' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="space-y-2">
                  {(Object.keys(difficultyDescriptions) as Difficulty[]).map((level) => (
                    <label key={level} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={state.difficulty === level}
                        onChange={(e) => updateState({ difficulty: e.target.value as Difficulty })}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium capitalize">{level}</div>
                        <div className="text-sm text-gray-600">
                          {difficultyDescriptions[level]}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Crawl Theme
                </label>
                <select
                  value={state.theme}
                  onChange={(e) => updateState({ theme: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {crawlThemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Time Limit
              </label>
              <select
                value={state.timeLimit}
                onChange={(e) => updateState({ timeLimit: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {timeLimits.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Group Size
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={state.groupSize}
                onChange={(e) => updateState({ groupSize: parseInt(e.target.value) || 1 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Total Budget (₹)
              </label>
              <input
                type="number"
                min="200"
                max="10000"
                step="100"
                value={state.budget}
                onChange={(e) => updateState({ budget: parseInt(e.target.value) || 500 })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600 mt-1">
                ≈ ₹{Math.floor(state.budget / state.groupSize)} per person
              </div>
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={generateAdventure}
            disabled={state.isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {state.isLoading ? 'Generating...' : `Generate ${state.selectedType === 'challenge' ? 'Challenge' : 'Food Crawl'}`}
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {state.generatedContent && (
        <div className="animate-fade-in">
          {state.selectedType === 'challenge' ? (
            <FoodChallengeCard
              challenge={state.generatedContent}
              onStart={handleStart}
              onShare={handleShare}
            />
          ) : (
            <FoodCrawlCard
              crawl={state.generatedContent}
              onStart={handleStart}
              onShare={handleShare}
            />
          )}
        </div>
      )}
    </div>
  );
}