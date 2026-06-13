#!/bin/bash

set -e

echo "***********************************"
echo "Deploying BACKEND"
echo "***********************************"

cd ~/deploy/backend || exit 1

echo "Removing old backend container..."
docker rm -f mern-backend 2>/dev/null || true

echo "Pulling backend image..."
docker compose --project-name mern pull backend

echo "Starting backend..."
docker compose --project-name mern up -d backend
docker compose --project-name mern up -d dozzle loki promtail grafana

echo "Saving backend logs..."
LOGDIR=~/deploy/backend/logs
mkdir -p "$LOGDIR"
docker logs mern-backend > "$LOGDIR/backend_$(date +%Y%m%d_%H%M%S).log" 2>&1

echo "Pruning unused images..."
docker image prune -f

echo "***********************************"
echo "Backend deployment complete"
echo "***********************************"