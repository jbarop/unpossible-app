#!/bin/bash

set -e

echo "Resetting database..."

# Stop containers if running
docker compose down

# Remove postgres volume
docker volume rm unpossible-app_postgres_data 2>/dev/null || true

# Start just postgres
docker compose up -d postgres

# Wait for postgres to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations and seed
docker compose exec backend yarn prisma migrate reset --force

echo "Database reset complete!"
