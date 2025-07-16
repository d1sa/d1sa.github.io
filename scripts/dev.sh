#!/bin/bash

# Development script

echo "🛠️  Starting development environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server with watch
echo "👀 Starting SCSS watch and dev server..."
npm run dev
