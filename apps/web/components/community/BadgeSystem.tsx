'use client';

import { Award, Star, Trophy, Target } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  earned_date?: string;
}

interface BadgeSystemProps {
  userBadges: Badge[];
  allBadges: Badge[];
}

export const BadgeSystem = ({ userBadges, allBadges }: BadgeSystemProps) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="w-6 h-6" />;
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (level >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="badge-system space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h3>
        {userBadges.length === 0 ? (
          <p className="text-gray-500">Start contributing to earn your first badge!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 ${getLevelColor(badge.level)}`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <h4 className="font-semibold text-sm">{badge.name}</h4>
                  <p className="text-xs mt-1">{badge.description}</p>
                  {badge.earned_date && (
                    <p className="text-xs mt-2 opacity-75">
                      Earned {new Date(badge.earned_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Available Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges
            .filter(badge => !userBadges.find(ub => ub.id === badge.id))
            .map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2 text-gray-400">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-600">{badge.name}</h4>
                  <p className="text-xs mt-1 text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};