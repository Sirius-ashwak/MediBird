#!/bin/bash

# Start MediBridge application
export NODE_ENV=development
export GOOGLE_API_KEY=AIzaSyAgev0-OnF9IKw_pdiJFZnmOLwjV1i0VjI

# Run the application with TSX
npx tsx server/index.ts
