#!/bin/bash

# Render build script for PTE Mobile App
echo "🚀 Starting Render deployment build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the React app
echo "🏗️ Building React application..."
npm run build

# Verify build output
echo "✅ Build completed successfully!"
ls -la build/

echo "🌟 PTE Mobile Weather App is ready for deployment!"
