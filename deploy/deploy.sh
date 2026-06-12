#!/bin/bash

set -e

echo "***********************************"
echo "Navigate to deploy folder"
echo "***********************************"

cd ~/deploy || exit 1

echo "***********************************"
echo "Stopping containers..."
echo "***********************************"

docker compose down

echo "***********************************"
echo "Cleaning unused resources..."
echo "***********************************"

docker image prune -f
docker container prune -f

echo "***********************************"
echo "Pulling latest images..."
echo "***********************************"

docker compose pull

echo "***********************************"
echo "Starting application..."
echo "***********************************"

docker compose up -d --remove-orphans

echo "***********************************"
echo "Deployment complete!"
echo "***********************************"