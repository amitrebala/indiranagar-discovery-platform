'use client';

import { useState } from 'react';
import { MapPin, Users, Clock, Trophy, Share2, Play } from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  objectives: Array<{
    id: string;
    description: string;
    place?: {
      name: string;
      address: string;
      category: string;
    };
    points: number;
    completed?: boolean;
  }>;
  rewards: string[];
  time_limit: string;
  estimated_cost: number;
  rules: string[];
  tips: string[];
}

interface FoodChallengeCardProps {
  challenge: Challenge;
  onStart?: (challengeId: string) => void;
  onShare?: (challenge: Challenge) => void;
  className?: string;
}

const difficultyConfig = {
  easy: {
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    emoji: '🌱',
  },
  medium: {
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    emoji: '🔥',
  },
  hard: {
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    emoji: '💪',
  },
  legendary: {
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    emoji: '👑',
  },
};

export function FoodChallengeCard({
  challenge,
  onStart,
  onShare,
  className = '',
}: FoodChallengeCardProps) {
  const [activeTab, setActiveTab] = useState<'objectives' | 'rewards' | 'rules' | 'tips'>('objectives');
  const config = difficultyConfig[challenge.difficulty];
  const completedObjectives = challenge.objectives.filter(obj => obj.completed).length;
  const progress = (completedObjectives / challenge.objectives.length) * 100;

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${className}`}>
      {/* Header with difficulty badge */}
      <div className={`bg-gradient-to-r ${config.color} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{config.emoji}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize backdrop-blur-sm">
                {challenge.difficulty}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{challenge.name}</h3>
            <p className="text-white/90 text-base leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{challenge.time_limit}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">₹{challenge.estimated_cost}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{challenge.objectives.length} stops</span>
          </div>
        </div>

        {/* Progress bar (if started) */}
        {completedObjectives > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/90">Progress</span>
              <span className="text-sm font-medium">{completedObjectives}/{challenge.objectives.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content tabs */}
      <div className="p-6">
        {/* Tab navigation */}
        <div className="flex overflow-x-auto gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
          {[
            { key: 'objectives', label: 'Objectives', icon: MapPin },
            { key: 'rewards', label: 'Rewards', icon: Trophy },
            { key: 'rules', label: 'Rules', icon: Users },
            { key: 'tips', label: 'Tips', icon: Share2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
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
        <div className="min-h-[200px]">
          {activeTab === 'objectives' && (
            <div className="space-y-3">
              {challenge.objectives.map((objective, index) => (
                <div
                  key={objective.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    objective.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          objective.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900">
                          {objective.description}
                        </h4>
                      </div>
                      {objective.place && (
                        <div className="ml-9">
                          <p className="text-sm font-medium text-gray-700">
                            {objective.place.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {objective.place.address} • {objective.place.category}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                        {objective.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-3">
              {challenge.rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Trophy className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{reward}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              {challenge.rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-900">{rule}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              {challenge.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-purple-600 text-lg">💡</span>
                  <span className="text-gray-900">{tip}</span>
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
            onClick={() => onStart(challenge.id)}
            className={`flex-1 bg-gradient-to-r ${config.color} text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <Play className="w-4 h-4" />
            {completedObjectives > 0 ? 'Continue Challenge' : 'Start Challenge'}
          </button>
        )}
        {onShare && (
          <button
            onClick={() => onShare(challenge)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}