'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PlaceForm from '@/components/admin/PlaceForm';
import { Place } from '@/lib/supabase/types';

export default function EditPlacePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`/api/admin/places/${id}`);
        if (!response.ok) throw new Error('Failed to fetch place');
        const data = await response.json();
        setPlace(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">Loading place...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Place: {place?.name}
        </h1>
        {place && <PlaceForm place={place} />}
      </div>
    </div>
  );
}