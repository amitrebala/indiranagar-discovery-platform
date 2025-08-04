// Express server to serve the Next.js app
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from .next/static
app.use('/_next/static', express.static(path.join(__dirname, '.next/static')));

// Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// Simple route for testing
app.get('/test', (req, res) => {
  res.json({
    message: '🎉 Express server working!',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Basic HTML for root
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Express Server - Enhanced Experience Intelligence Platform</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; margin-bottom: 20px; }
          .status { background: #e8f5e8; color: #2d5a2d; padding: 10px; border-radius: 4px; margin: 10px 0; }
          .info { background: #e8f4fd; color: #1a5490; padding: 10px; border-radius: 4px; margin: 10px 0; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Express Server Working!</h1>
          <div class="status">✅ Server successfully running on port ${PORT}</div>
          <div class="info">
            <strong>Enhanced Experience Intelligence Platform</strong><br>
            Alternative server implementation using Express
          </div>
          
          <h3>Test Endpoints:</h3>
          <ul>
            <li><a href="/test">/test</a> - JSON test response</li>
            <li><a href="/health">/health</a> - Health check</li>
          </ul>
          
          <h3>Environment:</h3>
          <ul>
            <li>Node.js: ${process.version}</li>
            <li>Platform: ${process.platform}</li>
            <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
            <li>Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}</li>
            <li>Weather API: ${process.env.NEXT_PUBLIC_WEATHER_API_KEY ? '✅ Configured' : '❌ Missing'}</li>
          </ul>
          
          <p><em>Generated at: ${new Date().toISOString()}</em></p>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express server running at:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Network: http://0.0.0.0:${PORT}`);
  console.log(`   - Process ID: ${process.pid}`);
  console.log(`✅ Server successfully bound to 0.0.0.0:${PORT}`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});