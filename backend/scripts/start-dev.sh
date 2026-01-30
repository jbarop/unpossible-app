#!/bin/sh
set -e

echo "Running database migrations..."
yarn prisma migrate deploy

echo "Checking if database needs seeding..."
QUOTE_COUNT=$(echo "SELECT COUNT(*) FROM \"Quote\";" | yarn prisma db execute --stdin 2>/dev/null | grep -o '[0-9]*' | head -1 || echo "0")

if [ "$QUOTE_COUNT" = "0" ] || [ -z "$QUOTE_COUNT" ]; then
  echo "Database is empty, running seed..."
  yarn db:seed
else
  echo "Database already has $QUOTE_COUNT quotes, skipping seed."
fi

echo "Starting development server..."
exec yarn dev
