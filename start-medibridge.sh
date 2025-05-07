#!/bin/bash
# Start script for MediBridge application

echo "Starting MediBridge application..."

# Set environment variables
export PORT=5000
export NODE_ENV=development
export GOOGLE_API_KEY=AIzaSyAgev0-OnF9IKw_pdiJFZnmOLwjV1i0VjI

# Start the combined server with Vite frontend + Express backend
node --inspect server/index.ts