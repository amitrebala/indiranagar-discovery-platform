// Using native fetch in Node.js 18+

const API_KEY = 'AIzaSyByOQJWNoUIXii0ihA6kq-MHinZuqtvjBE';
const INDIRANAGAR_CENTER = { lat: 12.9716, lng: 77.6411 };

async function testGooglePlacesAPI() {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${INDIRANAGAR_CENTER.lat},${INDIRANAGAR_CENTER.lng}&` +
    `radius=2000&` +
    `type=restaurant&` +
    `key=${API_KEY}`;
  
  console.log('Testing Google Places API...');
  console.log('URL:', url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Response status:', data.status);
    console.log('Error message:', data.error_message || 'None');
    
    if (data.results) {
      console.log('Found', data.results.length, 'restaurants');
      if (data.results.length > 0) {
        console.log('First result:', data.results[0].name);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGooglePlacesAPI();