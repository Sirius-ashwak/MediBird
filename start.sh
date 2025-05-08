#!/bin/bash

# Check if environment variables are set
if [ ! -f .env ]; then
  echo "Warning: .env file not found. Using default environment variables."
  echo "Copy .env.example to .env and update with your API keys for full functionality."
fi

# Start the application
npm run dev