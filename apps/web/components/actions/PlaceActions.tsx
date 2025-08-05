'use client';

interface PlaceActionsProps {
  place: {
    id: string;
    name: string;
    phone?: string;
    coordinates?: { lat: number; lng: number };
    address?: string;
    website?: string;
  };
}

export default function PlaceActions({ place }: PlaceActionsProps) {
  const handleCall = () => {
    if (place.phone) {
      // On mobile, this will open the dialer
      window.location.href = `tel:${place.phone}`;
      
      // Track analytics
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'place_call',
          place_id: place.id
        })
      });
    } else {
      alert('Phone number not available');
    }
  };

  const handleDirections = () => {
    if (place.coordinates) {
      const { lat, lng } = place.coordinates;
      // Open in Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${place.name}`;
      window.open(url, '_blank');
      
      // Track analytics
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'place_directions',
          place_id: place.id
        })
      });
    } else if (place.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/places/${place.id}`;
    
    if (navigator.share) {
      // Use native share on mobile
      try {
        await navigator.share({
          title: place.name,
          text: `Check out ${place.name} in Indiranagar`,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Copy to clipboard on desktop
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    
    // Track analytics
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'place_share',
        place_id: place.id
      })
    });
  };

  const handleWebsite = () => {
    if (place.website) {
      window.open(place.website, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {place.phone && (
        <button
          onClick={handleCall}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <span>📞</span>
          <span>Call</span>
        </button>
      )}
      
      <button
        onClick={handleDirections}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <span>🗺️</span>
        <span>Directions</span>
      </button>
      
      <button
        onClick={handleShare}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        <span>🔗</span>
        <span>Share</span>
      </button>
      
      {place.website && (
        <button
          onClick={handleWebsite}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <span>🌐</span>
          <span>Website</span>
        </button>
      )}
    </div>
  );
}