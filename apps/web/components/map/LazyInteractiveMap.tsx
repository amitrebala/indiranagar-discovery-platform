'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const InteractiveMap = dynamic(
  () => import('./InteractiveMap').then(mod => ({ default: mod.InteractiveMap })),
  {
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
    ssr: false // Disable SSR for map component
  }
);

export default InteractiveMap;