#!/bin/bash

# Build script for production

echo "🚀 Starting production build..."

# Clean previous build
echo "🧹 Cleaning previous build..."
npm run clean

# Compile SCSS
echo "🎨 Compiling SCSS..."
npm run build:sass

# Optimize CSS
echo "⚡ Optimizing CSS..."
npm run optimize:css

# Check if build was successful
if [ -f "dist/css/style.css" ] && [ -f "dist/css/style.min.css" ]; then
    echo "✅ Build completed successfully!"
    echo "📦 Files generated:"
    echo "   - dist/css/style.css"
    echo "   - dist/css/style.min.css"
    
    # Show file sizes
    echo "📏 File sizes:"
    ls -lh dist/css/
else
    echo "❌ Build failed!"
    exit 1
fi
