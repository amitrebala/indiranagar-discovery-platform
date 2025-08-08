import { Metadata } from 'next';
import { FoodieAdventureGenerator } from '@/components/foodie/FoodieAdventureGenerator';

export const metadata: Metadata = {
  title: 'Foodie Adventure Generator | Indiranagar Discovery',
  description: 'Create personalized food challenges and crawls through Indiranagar. Gamified experiences for solo adventures or groups.',
  keywords: 'food challenge, food crawl, Indiranagar, Bangalore, restaurant discovery, foodie adventure',
};

export default function FoodieAdventurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <FoodieAdventureGenerator />
      </div>
    </div>
  );
}