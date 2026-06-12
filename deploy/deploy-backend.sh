#!/bin/bash

set -e

echo "***********************************"
echo "Deploying BACKEND"
echo "***********************************"

cd ~/deploy || exit 1

echo "Pulling backend image..."
docker compose pull backend

echo "Starting backend..."
docker compose up -d backend

echo "Pruning unused images..."
docker image prune -f

echo "***********************************"
echo "Backend deployment complete"
echo "***********************************"