#!/bin/bash

# This script serves as an entry point for the MediBridge application
# Set development environment
export NODE_ENV=development

# Check if environment variables file exists
if [ ! -f .env ]; then
  echo "Notice: .env file not found. Creating from example with default values."
  cp .env.example .env
  echo "Please update .env file with your actual API keys for full functionality."
fi

# Kill any existing processes
pkill -f "tsx server/index.ts" || true

# Start the application
npm run dev