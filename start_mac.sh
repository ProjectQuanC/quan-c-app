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

# List of directories to check for .env file
DIRECTORIES=("runner" "server" "client" "admin-panel")

# Loop through each directory and copy .env.example to .env if needed
for DIR in "${DIRECTORIES[@]}"; do
  copy_env_if_not_exists "$CURRENT_DIR/$DIR"
done

# Function to install and activate Python virtual environment
setup_python_env() {
  local DIR=$1
  echo "Setting up Python virtual environment in $DIR"
  
  # Install python3-venv if not already installed
  sudo apt install -y python3-venv
  
  # Create the virtual environment
  python3 -m venv "$DIR/venv"
  
  # Activate the virtual environment
  source "$DIR/venv/bin/activate"
  
  # Install Python dependencies
  pip install -r "$DIR/requirements.txt"
  
  # Install the quanchecker package
  pip install quanchecker
}

# Backend setup: Setup and activate virtual environment for the runner directory
setup_python_env "$CURRENT_DIR/runner"

# Activate the virtual environment
echo "Activating the virtual environment..."
source "$CURRENT_DIR/runner/venv/bin/activate"

# Start the backend server using uvicorn in a new Terminal tab (macOS)
osascript -e 'tell application "Terminal" to do script "cd '"$CURRENT_DIR"'/runner && source venv/bin/activate && uvicorn app.main:app --port 8080"'
osascript -e 'tell application "Terminal" to do script "cd '"$CURRENT_DIR"'/server && npm install && npm run run"'

# Start the frontend in a new Terminal tab (macOS)
osascript -e 'tell application "Terminal" to do script "cd '"$CURRENT_DIR"'/client && npm install && npm start"'

echo "Backend and frontend started in separate Terminal tabs."