import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from '@/app/api/weather/route'
import { NextRequest } from 'next/server'

describe('/api/weather', () => {
  beforeEach(() => {
    // Clear any rate limiting state
    vi.clearAllMocks()
  })

  it('should return weather data for valid coordinates', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather?lat=12.975&lng=77.615')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()
    expect(data.data.condition).toBeDefined()
    expect(data.data.temperature).toBeTypeOf('number')
    expect(data.data.humidity).toBeTypeOf('number')
    expect(data.data.recommendations).toBeInstanceOf(Array)
  })

  it('should return 400 for missing coordinates', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing latitude or longitude parameters')
  })

  it('should return 400 for invalid coordinates', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather?lat=invalid&lng=77.615')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid latitude or longitude values')
  })

  it('should return 400 for coordinates outside Indiranagar bounds', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather?lat=10.0&lng=77.615')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Coordinates must be within Indiranagar boundaries')
  })

  it('should include proper weather data structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather?lat=12.975&lng=77.615')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.data).toMatchObject({
      condition: expect.any(String),
      temperature: expect.any(Number),
      humidity: expect.any(Number),
      description: expect.any(String),
      recommendations: expect.any(Array),
      source: expect.any(String),
      timestamp: expect.any(Number)
    })
  })

  it('should return cached data source when available', async () => {
    // First request
    const request1 = new NextRequest('http://localhost:3000/api/weather?lat=12.975&lng=77.615')
    const response1 = await GET(request1)
    const data1 = await response1.json()
    
    // Second request should return cached data
    const request2 = new NextRequest('http://localhost:3000/api/weather?lat=12.975&lng=77.615')
    const response2 = await GET(request2)
    const data2 = await response2.json()
    
    expect(data2.data.source).toBe('cache')
  })
})