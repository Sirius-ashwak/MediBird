#!/bin/bash

# Kill any existing Node.js processes
pkill -f "node|tsx" || true
sleep 2

# Start the application in the background
NODE_ENV=development PORT=5000 HOST=0.0.0.0 tsx server/index.ts > medibird.log 2>&1 &

# Store the process ID
echo $! > medibird.pid

# Wait a moment for the app to start
sleep 5

# Output the log to see the startup progress
echo "MediBird application started. Here are the startup logs:"
cat medibird.log

# Output a success message
echo ""
echo "MediBird is now running on port 5000"
echo "PID: $(cat medibird.pid)"
echo ""
echo "To view more logs, run: tail -f medibird.log"