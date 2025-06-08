const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Build the web application
console.log('Building web application...');
execSync('npm run build:web', { stdio: 'inherit' });

// Copy the server files
console.log('Copying server files...');
fs.cpSync(
  path.join(__dirname, '../server'),
  path.join(distDir, 'server'),
  { recursive: true }
);

// Create the production package.json
const pkg = {
  name: "screen-share-app",
  version: "1.0.0",
  private: true,
  scripts: {
    "start": "node server/index.js"
  },
  dependencies: {
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "cors": "^2.8.5"
  }
};

fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(pkg, null, 2)
);

console.log('Build complete!');