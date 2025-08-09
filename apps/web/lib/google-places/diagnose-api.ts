import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function diagnoseGooglePlacesAPI() {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in .env.local');
    return;
  }
  
  console.log('🔍 Diagnosing Google Places API...');
  console.log('API Key:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4));
  console.log('');
  
  // Test 1: Simple geocoding (doesn't require Places API)
  console.log('📍 Test 1: Geocoding API (simpler test)');
  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Bangalore&key=${API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();
    
    console.log('Geocoding Status:', geocodeData.status);
    if (geocodeData.error_message) {
      console.log('Geocoding Error:', geocodeData.error_message);
    } else if (geocodeData.results?.length > 0) {
      console.log('✅ Geocoding works - API key is valid');
    }
  } catch (error) {
    console.log('❌ Geocoding test failed:', error);
  }
  console.log('');
  
  // Test 2: Places Nearby Search
  console.log('🏪 Test 2: Places Nearby Search');
  try {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=12.9716,77.6411&radius=1000&type=restaurant&key=${API_KEY}`;
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();
    
    console.log('Places Status:', placesData.status);
    if (placesData.error_message) {
      console.log('Places Error:', placesData.error_message);
    }
    
    // Decode common error messages
    switch (placesData.status) {
      case 'REQUEST_DENIED':
        console.log('❌ REQUEST_DENIED - Common causes:');
        console.log('   1. Places API not enabled in Google Cloud Console');
        console.log('   2. Billing not enabled on your Google Cloud project');
        console.log('   3. API key restrictions prevent access');
        console.log('   4. Using wrong API (try "Places API (New)" instead of legacy)');
        break;
      case 'INVALID_REQUEST':
        console.log('❌ INVALID_REQUEST - Check your parameters');
        break;
      case 'OVER_QUERY_LIMIT':
        console.log('❌ OVER_QUERY_LIMIT - You\'ve exceeded your quota');
        break;
      case 'ZERO_RESULTS':
        console.log('✅ API works but no results found');
        break;
      case 'OK':
        console.log('✅ Places API works perfectly!');
        console.log('Found', placesData.results?.length || 0, 'places');
        break;
      default:
        console.log('❓ Unknown status:', placesData.status);
    }
  } catch (error) {
    console.log('❌ Places test failed:', error);
  }
  console.log('');
  
  // Test 3: Check what APIs are enabled (if key works)
  console.log('🔧 Next steps:');
  console.log('1. Go to: https://console.cloud.google.com/apis/library');
  console.log('2. Search for "Places API" and enable "Places API (New)"');
  console.log('3. Go to: https://console.cloud.google.com/billing');
  console.log('4. Ensure billing is enabled on your project');
  console.log('5. Check API key restrictions in Credentials section');
}

diagnoseGooglePlacesAPI();