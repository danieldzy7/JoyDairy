#!/bin/bash
set -e

echo "Starting build process..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Navigate to client and install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install

# Build React app
echo "Building React application..."
npm run build

# Go back to root
cd ..

echo "Build completed successfully!"
echo "Checking if build directory exists..."
ls -la client/build/

echo "Build process finished."
