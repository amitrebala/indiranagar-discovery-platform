'use client';

import { useState } from 'react';
import { Dice6, MapPin, Users, Clock, Sparkles, Loader2, Utensils } from 'lucide-react';
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
  'Vegetarian Quest'
];

const crawlThemes = [
  'Classic Bangalore',
  'Pub Crawl',
  'Dessert Trail',
  'Street Food Journey',
  'Cafe Hopping',
  'Fine Dining Experience',
  'Budget Foodie',
  'Vegetarian Delight'
];

export function FoodieAdventureGenerator() {
  const [state, setState] = useState<GeneratorState>({
    isLoading: false,
    selectedType: 'challenge',
    difficulty: 'medium',
    theme: 'Random Adventure',
    groupSize: 2,
    budget: 1500,
    timeLimit: '2 hours',
    generatedContent: null
  });

  const generateAdventure = async () => {
    setState(prev => ({ ...prev, isLoading: true, generatedContent: null }));
    
    try {
      let response;
      
      if (state.selectedType === 'challenge') {
        response = await foodieIntegration.generateChallenge({
          difficulty: state.difficulty,
          timeLimit: state.timeLimit,
          groupSize: state.groupSize,
          dietaryPreferences: state.theme === 'Vegetarian Quest' ? ['vegetarian'] : [],
        });
      } else {
        response = await foodieIntegration.createFoodCrawl({
          theme: state.theme,
          budget: state.budget,
          groupSize: state.groupSize,
          duration: state.timeLimit
        });
      }
      
      setState(prev => ({ ...prev, generatedContent: response, isLoading: false }));
    } catch (error) {
      console.error('Error generating adventure:', error);
      // Generate mock data as fallback
      const mockData = state.selectedType === 'challenge' 
        ? generateMockChallenge(state)
        : generateMockCrawl(state);
      setState(prev => ({ ...prev, generatedContent: mockData, isLoading: false }));
    }
  };

  const themes = state.selectedType === 'challenge' ? challengeThemes : crawlThemes;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Foodie Adventure Generator
        </h1>
        <p className="text-xl text-gray-700">
          Create personalized food challenges and crawls through Indiranagar
        </p>
      </div>

      {/* Generator Controls */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        {/* Adventure Type Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Adventure Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setState(prev => ({ ...prev, selectedType: 'challenge' }))}
              className={`p-4 rounded-xl border-2 transition-all ${
                state.selectedType === 'challenge'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Dice6 className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Food Challenge</span>
              <p className="text-xs mt-1 text-gray-600">Complete exciting food tasks</p>
            </button>
            
            <button
              onClick={() => setState(prev => ({ ...prev, selectedType: 'crawl' }))}
              className={`p-4 rounded-xl border-2 transition-all ${
                state.selectedType === 'crawl'
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Food Crawl</span>
              <p className="text-xs mt-1 text-gray-600">Multi-stop culinary journey</p>
            </button>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Difficulty/Theme */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {state.selectedType === 'challenge' ? 'Difficulty' : 'Theme'}
            </label>
            {state.selectedType === 'challenge' ? (
              <select
                value={state.difficulty}
                onChange={(e) => setState(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              >
                <option value="easy">Easy - Beginner Friendly</option>
                <option value="medium">Medium - Some Experience</option>
                <option value="hard">Hard - Experienced Foodie</option>
                <option value="legendary">Legendary - Ultimate Challenge</option>
              </select>
            ) : (
              <select
                value={state.theme}
                onChange={(e) => setState(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            )}
          </div>

          {/* Time/Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Time Limit
            </label>
            <select
              value={state.timeLimit}
              onChange={(e) => setState(prev => ({ ...prev, timeLimit: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="1 hour">1 Hour</option>
              <option value="2 hours">2 Hours</option>
              <option value="3 hours">3 Hours</option>
              <option value="4 hours">4 Hours</option>
              <option value="full day">Full Day</option>
            </select>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Group Size
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={state.groupSize}
              onChange={(e) => setState(prev => ({ ...prev, groupSize: parseInt(e.target.value) || 1 }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Budget (for crawls) */}
          {state.selectedType === 'crawl' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget per Person
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  min="500"
                  max="5000"
                  step="250"
                  value={state.budget}
                  onChange={(e) => setState(prev => ({ ...prev, budget: parseInt(e.target.value) || 1000 }))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateAdventure}
          disabled={state.isLoading}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {state.isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Adventure...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate {state.selectedType === 'challenge' ? 'Challenge' : 'Food Crawl'}
            </span>
          )}
        </button>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => {
              setState(prev => ({
                ...prev,
                difficulty: ['easy', 'medium', 'hard', 'legendary'][Math.floor(Math.random() * 4)] as Difficulty,
                theme: themes[Math.floor(Math.random() * themes.length)],
                groupSize: Math.floor(Math.random() * 4) + 1,
                budget: (Math.floor(Math.random() * 8) + 2) * 500,
                timeLimit: ['1 hour', '2 hours', '3 hours'][Math.floor(Math.random() * 3)]
              }));
              setTimeout(generateAdventure, 100);
            }}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            🎲 Surprise Me!
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {state.generatedContent && (
        <div className="animate-fade-in">
          {state.selectedType === 'challenge' ? (
            <FoodChallengeCard challenge={state.generatedContent} />
          ) : (
            <FoodCrawlCard crawl={state.generatedContent} />
          )}
        </div>
      )}
    </div>
  );
}

// Mock data generators
function generateMockChallenge(state: GeneratorState) {
  const challenges = {
    easy: {
      title: "Indiranagar Starter Quest",
      difficulty: "easy",
      points: 100,
      time_limit: state.timeLimit,
      objectives: [
        { task: "Try a dosa at any local restaurant", points: 30, place: "Brahmin's Coffee Bar" },
        { task: "Order a filter coffee", points: 20, place: "Third Wave Coffee" },
        { task: "Take a photo with your meal", points: 20, place: "Any restaurant" },
        { task: "Try one street food item", points: 30, place: "100 Feet Road" }
      ],
      rewards: ["Foodie Explorer Badge", "10% off next adventure"],
      special_rules: ["No food delivery apps allowed", "Must walk between locations"]
    },
    medium: {
      title: "Bangalore Food Trail",
      difficulty: "medium",
      points: 200,
      time_limit: state.timeLimit,
      objectives: [
        { task: "Eat at 3 different cuisines", points: 60, place: "Indiranagar" },
        { task: "Try the spiciest dish on menu", points: 40, place: "Andhra Restaurant" },
        { task: "Order in Kannada", points: 30, place: "Local eatery" },
        { task: "Find a hidden gem restaurant", points: 40, place: "Side streets" },
        { task: "Try a dish you've never had", points: 30, place: "Your choice" }
      ],
      rewards: ["Spice Warrior Badge", "Free dessert voucher"],
      special_rules: ["Must try vegetarian and non-veg", "Share on social media"]
    },
    hard: {
      title: "Ultimate Foodie Challenge",
      difficulty: "hard",
      points: 350,
      time_limit: state.timeLimit,
      objectives: [
        { task: "Complete a thali challenge", points: 80, place: "Koshy's" },
        { task: "Try 5 different chutneys", points: 60, place: "MTR" },
        { task: "Eat with hands only", points: 40, place: "Traditional restaurant" },
        { task: "Finish a family-size biryani", points: 100, place: "Meghana Foods" },
        { task: "Try 3 regional desserts", points: 70, place: "Various" }
      ],
      rewards: ["Master Foodie Badge", "₹500 restaurant voucher"],
      special_rules: ["No sharing allowed", "Time penalties for leftovers"]
    },
    legendary: {
      title: "Indiranagar Food Marathon",
      difficulty: "legendary",
      points: 500,
      time_limit: state.timeLimit,
      objectives: [
        { task: "Visit 10 restaurants", points: 150, place: "All of Indiranagar" },
        { task: "Try signature dish at each", points: 100, place: "Each restaurant" },
        { task: "No repeating cuisines", points: 80, place: "Diverse selection" },
        { task: "Finish everything ordered", points: 100, place: "No waste" },
        { task: "Document entire journey", points: 70, place: "Photo/video proof" }
      ],
      rewards: ["Legendary Foodie Title", "1 Month Free Adventures", "Hall of Fame Entry"],
      special_rules: ["Must complete in order", "Live updates required", "No outside help"]
    }
  };

  return challenges[state.difficulty];
}

function generateMockCrawl(state: GeneratorState) {
  const crawls = {
    'Classic Bangalore': {
      title: "Classic Bangalore Food Crawl",
      theme: "Classic Bangalore",
      stops: [
        { name: "Brahmin's Coffee Bar", type: "Breakfast", speciality: "Idli Vada", price: 100, duration: "30 min" },
        { name: "CTR", type: "Snack", speciality: "Benne Masala Dosa", price: 150, duration: "45 min" },
        { name: "Koshy's", type: "Lunch", speciality: "Mutton Cutlet", price: 400, duration: "1 hour" },
        { name: "Corner House", type: "Dessert", speciality: "Death by Chocolate", price: 250, duration: "30 min" }
      ],
      total_cost: 900,
      total_time: "2.5 hours",
      route_map: "Start at Brahmin's → Walk to CTR (10 min) → Auto to Koshy's (15 min) → Walk to Corner House (5 min)",
      local_tips: ["Go early for Brahmin's", "CTR gets crowded after 11 AM", "Book ahead at Koshy's on weekends"]
    },
    'Street Food Journey': {
      title: "Street Food Safari",
      theme: "Street Food Journey",
      stops: [
        { name: "Shivaji Nagar", type: "Chaat", speciality: "Pani Puri", price: 50, duration: "20 min" },
        { name: "VV Puram Food Street", type: "Various", speciality: "Congress Bun", price: 80, duration: "45 min" },
        { name: "Thindi Beedi", type: "Snacks", speciality: "Akki Roti", price: 60, duration: "30 min" },
        { name: "Russell Market", type: "Rolls", speciality: "Kathi Roll", price: 120, duration: "30 min" }
      ],
      total_cost: 310,
      total_time: "2 hours",
      route_map: "Start at Shivaji Nagar → Auto to VV Puram (20 min) → Walk around food street → Auto to Russell Market (15 min)",
      local_tips: ["Carry cash", "Go with empty stomach", "Best time is evening"]
    }
  };

  // Return appropriate crawl or default
  const crawlKey = Object.keys(crawls).find(key => 
    state.theme.toLowerCase().includes(key.toLowerCase())
  ) || 'Classic Bangalore';
  
  return {
    ...crawls[crawlKey as keyof typeof crawls],
    budget_per_person: state.budget,
    group_size: state.groupSize
  };
}