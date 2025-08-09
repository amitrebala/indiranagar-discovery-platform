import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const INDIRANAGAR_CENTER = { lat: 12.9716, lng: 77.6411 };

async function testGooglePlacesAPI() {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env.local');
    console.log('Please add your API key to apps/web/.env.local:');
    console.log('GOOGLE_PLACES_API_KEY=your_actual_api_key_here');
    process.exit(1);
  }
  
  // Mask the API key in console output for security
  const maskedKey = API_KEY.substring(0, 8) + '...' + API_KEY.substring(API_KEY.length - 4);
  console.log('Testing Google Places API with key:', maskedKey);
  
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${INDIRANAGAR_CENTER.lat},${INDIRANAGAR_CENTER.lng}&` +
    `radius=2000&` +
    `type=restaurant&` +
    `key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Response status:', data.status);
    
    if (data.error_message) {
      console.error('Error message:', data.error_message);
    }
    
    if (data.results) {
      console.log('✅ Found', data.results.length, 'restaurants');
      if (data.results.length > 0) {
        console.log('First result:', data.results[0].name);
        console.log('Location:', data.results[0].vicinity);
      }
    }
  } catch (error) {
    console.error('Error calling API:', error);
  }
}

// Only run if executed directly
if (require.main === module) {
  testGooglePlacesAPI();
}

export { testGooglePlacesAPI };