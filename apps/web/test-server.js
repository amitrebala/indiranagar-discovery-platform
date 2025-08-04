// Simple test server to verify Node.js and port binding works
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>Test Server Working!</h1>
    <p>Node.js server is running on port 3002</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Environment variables loaded: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Yes' : 'No'}</p>
  `);
});

const PORT = 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`Environment check: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ENV LOADED' : 'ENV NOT LOADED'}`);
});

// Keep server alive
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  server.close();
});