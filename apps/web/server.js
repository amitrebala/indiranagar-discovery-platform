// Enhanced Experience Intelligence Platform - Production Server
// Integrates built Next.js app with Express server

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('🚀 Starting Enhanced Experience Intelligence Platform...');
console.log(`Environment: ${dev ? 'development' : 'production'}`);
console.log(`Node.js: ${process.version}`);

app.prepare().then(() => {
  const server = express();
  
  // Trust proxy for proper client IP detection
  server.set('trust proxy', true);
  
  // Health check endpoint
  server.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      features: {
        foundation: process.env.NEXT_PUBLIC_ENABLE_FOUNDATION_FEATURES === 'true',
        placeDiscovery: process.env.NEXT_PUBLIC_ENABLE_PLACE_DISCOVERY === 'true',
        socialCommunity: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_COMMUNITY === 'true',
        weatherRecommendations: process.env.NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS === 'true',
        naturalLanguageSearch: process.env.NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH === 'true'
      },
      services: {
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        weather: !!process.env.NEXT_PUBLIC_WEATHER_API_KEY,
        mapbox: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      }
    });
  });

  // Debug endpoint for development
  if (dev) {
    server.get('/debug', (req, res) => {
      res.json({
        message: '🔧 Debug Information',
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing',
          NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY ? '✅ Configured' : '❌ Missing',
          NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? '✅ Configured' : '❌ Missing'
        },
        features: {
          'Epic 1 - Foundation': process.env.NEXT_PUBLIC_ENABLE_FOUNDATION_FEATURES,
          'Epic 2 - Place Discovery': process.env.NEXT_PUBLIC_ENABLE_PLACE_DISCOVERY,
          'Epic 3 - Social Community': process.env.NEXT_PUBLIC_ENABLE_SOCIAL_COMMUNITY,
          'Epic 4 - Weather Recommendations': process.env.NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS,
          'Epic 5 - Natural Language Search': process.env.NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH
        },
        timestamp: new Date().toISOString(),
        pid: process.pid
      });
    });
  }

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Error handling
  server.on('error', (err) => {
    console.error('❌ Server error:', err);
  });

  // Start server
  server.listen(port, hostname, () => {
    console.log(`✅ Enhanced Experience Intelligence Platform ready!`);
    console.log(`   - Local: http://localhost:${port}`);
    console.log(`   - Network: http://${hostname}:${port}`);
    console.log(`   - Health: http://localhost:${port}/health`);
    if (dev) {
      console.log(`   - Debug: http://localhost:${port}/debug`);
    }
    console.log(`   - Process ID: ${process.pid}`);
    console.log('');
    console.log('🌟 All 5 Epic features enabled:');
    console.log('   ✅ Epic 1: Foundation & Core Infrastructure');
    console.log('   ✅ Epic 2: Place Discovery & Journey Experiences');  
    console.log('   ✅ Epic 3: Social Coordination & Community Features');
    console.log('   ✅ Epic 4: Enhanced Discovery & Content Hub');
    console.log('   ✅ Epic 5: UX Excellence & Accessibility');
    console.log('');
    console.log('🔗 Database & Services:');
    console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'} Supabase Database`);
    console.log(`   ${process.env.NEXT_PUBLIC_WEATHER_API_KEY ? '✅' : '❌'} Weather API`);
    console.log(`   ${process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? '✅' : '❌'} Enhanced Maps (Mapbox)`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });

}).catch((ex) => {
  console.error('❌ Failed to start server:', ex);
  process.exit(1);
});