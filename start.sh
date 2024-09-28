#!/bin/bash

# Get the current directory
CURRENT_DIR=$(pwd)

# Function to copy .env.example to .env if .env doesn't exist
copy_env_if_not_exists() {
  local DIR=$1
  if [ -f "$DIR/.env" ]; then
    echo ".env already exists in $DIR"
  else
    echo "Creating .env in $DIR from .env.example"
    cp "$DIR/.env.example" "$DIR/.env"
  fi
}

# Copy .env.example to .env in the frontend (client) directory
copy_env_if_not_exists "$CURRENT_DIR/client"

# Copy .env.example to .env in the backend (server) directory
copy_env_if_not_exists "$CURRENT_DIR/server"

# Start frontend in a new Terminal tab (macOS)
osascript -e 'tell application "Terminal" to do script "cd '"$CURRENT_DIR"'/client && npm install && npm start"'

# Start backend in a new Terminal tab (macOS)
osascript -e 'tell application "Terminal" to do script "cd '"$CURRENT_DIR"'/server && npm install && npm start"'

echo "Frontend and backend started in separate Terminal tabs."