#!/bin/bash

set -e

echo "Starting Unpossible development environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Run './scripts/setup.sh' first."
    exit 1
fi

# Start docker-compose with logs
docker compose up --build
