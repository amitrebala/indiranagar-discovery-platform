import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API responses
export const handlers = [
  // Weather API mock
  http.get('/api/weather', ({ request }) => {
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lng = url.searchParams.get('lng')
    
    if (!lat || !lng) {
      return HttpResponse.json(
        { error: 'Missing latitude or longitude parameters' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        condition: 'sunny',
        temperature: 25,
        humidity: 65,
        description: 'Clear sky',
        recommendations: ['Perfect weather for outdoor exploration!'],
        source: 'cache',
        timestamp: Date.now()
      }
    })
  }),

  // Suggestions API mock
  http.post('/api/suggestions', async ({ request }) => {
    const body = await request.json()
    
    if (!body || typeof body !== 'object') {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Question submitted successfully',
      id: 'test-suggestion-id'
    })
  }),

  // Places API mock
  http.get('/api/places', () => {
    return HttpResponse.json([
      {
        id: 'test-place-1',
        name: 'Test Cafe',
        description: 'A wonderful test cafe in Indiranagar',
        latitude: 12.975,
        longitude: 77.615,
        rating: 4.5,
        category: 'Cafe',
        primary_image: '/test-image.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }),

  // External Weather API mocks
  http.get('https://api.openweathermap.org/data/2.5/weather', () => {
    return HttpResponse.json({
      main: {
        temp: 25,
        humidity: 65
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky'
        }
      ]
    })
  }),

  http.get('https://api.weatherapi.com/v1/current.json', () => {
    return HttpResponse.json({
      current: {
        temp_c: 25,
        humidity: 65,
        condition: {
          text: 'Sunny'
        }
      }
    })
  })
]

export const server = setupServer(...handlers)