const { exec } = require('child_process');

console.log('🚀 Starting app test...');

// Start the development server
const server = exec('npm start', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error starting server:', error);
    return;
  }
  console.log('📱 Server output:', stdout);
  if (stderr) {
    console.error('⚠️ Server errors:', stderr);
  }
});

server.stdout.on('data', (data) => {
  console.log('📋 Server:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('❌ Server Error:', data.toString());
});

setTimeout(() => {
  console.log('🛑 Stopping test after 30 seconds...');
  server.kill();
}, 30000);
