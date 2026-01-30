#!/bin/bash

set -e

echo "Setting up Unpossible development environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env

    # Generate secure passwords
    ADMIN_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
    SESSION_SECRET=$(openssl rand -hex 32)

    # Update .env with generated values
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change-me-to-a-secure-password/$ADMIN_PASS/" .env
        sed -i '' "s/change-me-to-a-random-32-byte-hex-string/$SESSION_SECRET/" .env
    else
        sed -i "s/change-me-to-a-secure-password/$ADMIN_PASS/" .env
        sed -i "s/change-me-to-a-random-32-byte-hex-string/$SESSION_SECRET/" .env
    fi

    echo "Generated admin password: $ADMIN_PASS"
    echo "Please save this password securely!"
else
    echo ".env already exists, skipping..."
fi

# Install dependencies
echo "Installing dependencies..."
yarn install

echo "Setup complete! Run 'yarn dev' or './scripts/dev.sh' to start the development environment."
