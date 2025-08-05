import { NextRequest, NextResponse } from 'next/server';
import { WeatherRecommendations } from '@/lib/services/weather-recommendations';

export async function GET(request: NextRequest) {
  try {
    // Get current weather (use existing weather API)
    const weatherResponse = await fetch(
      `${request.nextUrl.origin}/api/weather`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Extract relevant weather information
    const weatherConditions = {
      temp: weatherData.current?.temp_c || weatherData.main?.temp || 25,
      feels_like: weatherData.current?.feelslike_c || weatherData.main?.feels_like || 25,
      humidity: weatherData.current?.humidity || weatherData.main?.humidity || 60,
      weather: weatherData.current?.condition?.text || weatherData.weather?.[0]?.main || 'clear',
      rain_chance: weatherData.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 
                   weatherData.daily?.[0]?.pop * 100 || 20
    };
    
    // Get time of day
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon'; 
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    // Get recommendations
    const recommender = new WeatherRecommendations();
    
    const [placeRecommendations, journeyRecommendations] = await Promise.all([
      recommender.getRecommendations(weatherConditions, timeOfDay),
      recommender.getJourneyRecommendations(weatherConditions)
    ]);
    
    return NextResponse.json({
      weather: {
        ...weatherConditions,
        description: this.getWeatherDescription(weatherConditions, timeOfDay)
      },
      timeOfDay,
      recommendations: {
        places: placeRecommendations,
        journeys: journeyRecommendations
      },
      insights: this.generateInsights(weatherConditions, timeOfDay)
    });
  } catch (error) {
    console.error('Error getting weather recommendations:', error);
    
    // Fallback recommendations without weather data
    const timeOfDay = this.getTimeOfDay();
    const fallbackWeather = {
      temp: 25,
      feels_like: 25,
      humidity: 60,
      weather: 'pleasant',
      rain_chance: 20,
      description: 'Weather data unavailable, showing general recommendations'
    };
    
    const recommender = new WeatherRecommendations();
    const placeRecommendations = await recommender.getRecommendations(fallbackWeather, timeOfDay);
    
    return NextResponse.json({
      weather: fallbackWeather,
      timeOfDay,
      recommendations: {
        places: placeRecommendations.slice(0, 5),
        journeys: []
      },
      insights: ['Check weather conditions before heading out', `Great time for ${timeOfDay} activities`]
    });
  }
}

function getWeatherDescription(weather: any, timeOfDay: string): string {
  const temp = Math.round(weather.temp);
  const conditions = [];
  
  if (temp > 30) {
    conditions.push('Hot');
  } else if (temp < 20) {
    conditions.push('Cool');
  } else {
    conditions.push('Pleasant');
  }
  
  if (weather.rain_chance > 70) {
    conditions.push('Rainy');
  } else if (weather.rain_chance > 30) {
    conditions.push('Possibly rainy');
  }
  
  return `${conditions.join(' and ')} ${timeOfDay} (${temp}°C)`;
}

function generateInsights(weather: any, timeOfDay: string): string[] {
  const insights = [];
  
  if (weather.temp > 30) {
    insights.push('🌡️ Hot weather - seek air-conditioned places');
    insights.push('💧 Stay hydrated and avoid prolonged outdoor activities');
  }
  
  if (weather.rain_chance > 50) {
    insights.push('☔ Rain expected - choose indoor activities');
    insights.push('🏠 Perfect time for cozy cafes and covered areas');
  }
  
  if (weather.temp >= 20 && weather.temp <= 28 && weather.rain_chance < 30) {
    insights.push('🌟 Perfect weather for outdoor dining');
    insights.push('🚶 Great time for walking around Indiranagar');
  }
  
  if (timeOfDay === 'morning') {
    insights.push('☕ Morning is ideal for coffee and breakfast spots');
  } else if (timeOfDay === 'evening') {
    insights.push('🌅 Evening is perfect for outdoor seating and social dining');
  }
  
  return insights;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}