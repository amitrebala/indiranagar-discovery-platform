import { BadgeSystem } from '@/components/community/BadgeSystem';

const mockBadges = [
  {
    id: '1',
    name: 'First Discovery',
    description: 'Submitted your first place suggestion',
    icon: 'star',
    level: 1
  },
  {
    id: '2',
    name: 'Local Guide',
    description: '5 of your suggestions have been published',
    icon: 'target',
    level: 2
  },
  {
    id: '3',
    name: 'Community Champion',
    description: 'Consistently valuable contributions',
    icon: 'trophy',
    level: 5
  }
];

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Recognition
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn badges and recognition for your contributions to the Indiranagar community.
          </p>
        </div>
        
        <BadgeSystem userBadges={[]} allBadges={mockBadges} />
      </div>
    </div>
  );
}