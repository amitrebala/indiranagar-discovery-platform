// Debug server to test binding issues
const http = require('http');

console.log('🔍 DEBUGGING SERVER STARTUP');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());

const server = http.createServer((req, res) => {
  console.log(`📡 Request received: ${req.method} ${req.url}`);
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(`
    <h1>🎉 DEBUG SERVER WORKING!</h1>
    <p>✅ Server running on port 8888</p>
    <p>✅ Bound to 0.0.0.0 (all interfaces)</p>
    <p>✅ Time: ${new Date().toISOString()}</p>
    <p>✅ Process ID: ${process.pid}</p>
    <p>✅ Node version: ${process.version}</p>
  `);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  console.log('✅ Server successfully bound to:', addr);
  console.log('🌐 Access via: http://localhost:8888');
  console.log('🌐 Access via: http://127.0.0.1:8888');
  console.log('🌐 Process ID:', process.pid);
});

// Bind to all interfaces on port 8888
server.listen(8888, '0.0.0.0', () => {
  console.log('🚀 Server started - listening on 0.0.0.0:8888');
});

// Keep alive and log status
setInterval(() => {
  console.log('💓 Server alive, PID:', process.pid, 'Time:', new Date().toLocaleTimeString());
}, 5000);

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');
  server.close();
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down...');
  server.close();
});