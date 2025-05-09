#!/bin/bash

# Kill any existing Node.js processes
pkill -f "node|tsx" || true
sleep 2

echo "Starting MediBird application..."
export NODE_ENV=development

# Run the application
exec npx tsx server/index.ts
