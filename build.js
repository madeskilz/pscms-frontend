#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_DIR = path.resolve(__dirname, 'build');
const FRONTEND_DIR = path.resolve(__dirname, 'frontend');
const BACKEND_DIR = path.resolve(__dirname, 'backend');

console.log('🔨 Building Strapi-like CMS...');

// Clean build directory
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Create build structure
fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(path.join(BUILD_DIR, 'public'), { recursive: true });

// Build frontend if Next.js project exists
if (fs.existsSync(path.join(FRONTEND_DIR, 'package.json'))) {
  console.log('📦 Building frontend static export...');
  process.chdir(FRONTEND_DIR);
  execSync('npm run build:static', { stdio: 'inherit' });
  
  // Copy frontend build to public
  const frontendOut = path.join(FRONTEND_DIR, 'out');
  if (fs.existsSync(frontendOut)) {
    console.log('📂 Copying frontend to build/public...');
    execSync(`cp -r "${frontendOut}"/* "${path.join(BUILD_DIR, 'public')}"/`, { stdio: 'inherit' });
  }
  process.chdir(__dirname);
}

// Copy backend files
console.log('🔧 Copying backend files...');
const backendFiles = ['src', 'knexfile.js', 'package.json', 'server.js'];
backendFiles.forEach(file => {
  const srcPath = path.join(BACKEND_DIR, file);
  const destPath = path.join(BUILD_DIR, file);
  
  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
});

// Create data directory and copy SQLite if exists
const dataDir = path.join(BUILD_DIR, '../data');
fs.mkdirSync(dataDir, { recursive: true });

// Create storage directory
const storageDir = path.join(BUILD_DIR, '../storage/uploads');
fs.mkdirSync(storageDir, { recursive: true });

console.log('✅ Build complete!');
console.log('');
console.log('🚀 To start the server:');
console.log('   cd build');
console.log('   npm install --omit=dev');
console.log('   node server.js');
console.log('');
console.log('📁 Structure:');
console.log('   /build/server.js     (Express server)');
console.log('   /build/public/       (Frontend static files)');
console.log('   /build/src/          (API routes)');
console.log('   /data/app.sqlite     (Dynamic SQLite database)');
