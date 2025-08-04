/**
 * Simple configuration management
 * Uses environment variables from .env.local (dev) or Vercel (production)
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  weather: {
    openWeatherMapKey: process.env.OPENWEATHERMAP_API_KEY!,
    weatherApiKey: process.env.WEATHERAPI_KEY,
  },
  database: {
    url: process.env.DATABASE_URL!,
    password: process.env.SUPABASE_DB_PASSWORD!,
  },
  vercel: {
    token: process.env.VERCEL_TOKEN,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },
};

// Validate required config on startup
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENWEATHERMAP_API_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
}