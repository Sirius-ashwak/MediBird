#!/bin/bash

# Kill any existing Node.js processes
pkill -f "node|tsx" || true
sleep 2

# Start the application in the background
NODE_ENV=development PORT=5000 HOST=0.0.0.0 tsx server/index.ts > medibridge.log 2>&1 &

# Store the process ID
echo $! > medibridge.pid

# Wait a moment for the app to start
sleep 5

# Output the log to see the startup progress
echo "MediBridge application started. Here are the startup logs:"
cat medibridge.log

# Output a success message
echo ""
echo "MediBridge is now running on port 5000"
echo "PID: $(cat medibridge.pid)"
echo ""
echo "To view more logs, run: tail -f medibridge.log"