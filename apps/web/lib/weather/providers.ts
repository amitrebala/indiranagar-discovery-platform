import { WeatherData, WeatherAPIResponse, WeatherAPIComResponse } from './types'

// Map weather conditions to our standard format (future use)
// function mapConditionToStandard(condition: string): WeatherData['condition'] {
//   const lower = condition.toLowerCase()
//   
//   if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) {
//     return 'rainy'
//   }
//   if (lower.includes('cloud') || lower.includes('overcast')) {
//     return 'cloudy'
//   }
//   if (lower.includes('clear') || lower.includes('sun')) {
//     return 'sunny'
//   }
//   
//   return 'cloudy' // default
// }

// Determine condition based on temperature and humidity
function determineCondition(temp: number, humidity: number): WeatherData['condition'] {
  if (temp > 30) return 'hot'
  if (temp < 20) return 'cool'
  if (humidity > 80) return 'humid'
  return 'sunny'
}

// Generate recommendations based on weather
function generateRecommendations(condition: WeatherData['condition'], _temp: number): string[] {
  const recommendations: string[] = []
  
  switch (condition) {
    case 'sunny':
      recommendations.push('Perfect weather for outdoor exploration!')
      recommendations.push('Great for walking around Commercial Street')
      break
    case 'rainy':
      recommendations.push('Visit covered markets like Chickpet')
      recommendations.push('Perfect weather for cozy cafes')
      break
    case 'hot':
      recommendations.push('Stay hydrated and seek shade')
      recommendations.push('Indoor venues recommended')
      break
    case 'cool':
      recommendations.push('Great weather for long walks')
      recommendations.push('Perfect for outdoor dining')
      break
    case 'humid':
      recommendations.push('Light clothing recommended')
      recommendations.push('Air-conditioned venues preferred')
      break
    case 'cloudy':
      recommendations.push('Pleasant weather for exploration')
      recommendations.push('Good for photography')
      break
  }
  
  return recommendations
}

export async function fetchFromOpenWeatherMap(lat: number, lng: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    console.warn('OpenWeatherMap API key not configured')
    return null
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    const response = await fetch(url, { 
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }
    
    const data: WeatherAPIResponse = await response.json()
    const condition = determineCondition(data.main.temp, data.main.humidity)
    
    return {
      condition,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Weather data',
      recommendations: generateRecommendations(condition, data.main.temp),
      source: 'openweather',
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('OpenWeatherMap fetch error:', error)
    return null
  }
}

export async function fetchFromWeatherAPI(lat: number, lng: number): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHERAPI_KEY
  if (!apiKey) {
    console.warn('WeatherAPI key not configured')
    return null
  }

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}&aqi=no`
    const response = await fetch(url, { 
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`)
    }
    
    const data: WeatherAPIComResponse = await response.json()
    const condition = determineCondition(data.current.temp_c, data.current.humidity)
    
    return {
      condition,
      temperature: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      description: data.current.condition.text,
      recommendations: generateRecommendations(condition, data.current.temp_c),
      source: 'weatherapi',
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('WeatherAPI fetch error:', error)
    return null
  }
}

export function getFallbackWeather(_lat: number, _lng: number): WeatherData {
  // Seasonal defaults based on Bangalore weather patterns
  const month = new Date().getMonth()
  let condition: WeatherData['condition'] = 'sunny'
  let temperature = 25
  
  // Bangalore seasonal patterns
  if (month >= 5 && month <= 9) {
    // Monsoon season
    condition = 'rainy'
    temperature = 23
  } else if (month >= 2 && month <= 4) {
    // Summer
    condition = 'hot'  
    temperature = 30
  } else {
    // Winter
    condition = 'cool'
    temperature = 22
  }
  
  return {
    condition,
    temperature,
    humidity: 65,
    description: `Typical ${condition} weather for Bangalore`,
    recommendations: generateRecommendations(condition, temperature),
    source: 'fallback',
    timestamp: Date.now()
  }
}