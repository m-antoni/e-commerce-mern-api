#!/bin/bash

set -e

# =========================
# CONFIGURATION
# =========================
DOCKER_USERNAME="michael0221"
IMAGE_NAME="eshop-mern-backend"

# Version tag (git commit hash)
TAG=$(git rev-parse --short HEAD)

FULL_IMAGE="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
LATEST_IMAGE="$DOCKER_USERNAME/$IMAGE_NAME:ec2"

# =========================
# LOGIN TO DOCKER HUB
# =========================
echo "Logging in to Docker Hub..."
docker login -u "$DOCKER_USERNAME"

# =========================
# BUILD IMAGE LOCALLY
# =========================
echo "Building Docker image..."
docker build -t "$FULL_IMAGE" .

# Tag as latest (ec2)
docker tag "$FULL_IMAGE" "$LATEST_IMAGE"

# =========================
# PUSH TO DOCKER HUB
# =========================
echo "Pushing versioned image..."
docker push "$FULL_IMAGE"

echo "Pushing latest image..."
docker push "$LATEST_IMAGE"

echo "Push complete."

# =========================
# CLEANUP LOCAL DOCKER IMAGES
# =========================
echo "Cleaning up local Docker images..."

# Remove specific images
docker rmi "$FULL_IMAGE" || true
docker rmi "$LATEST_IMAGE" || true

# Remove unused/dangling images + cache
docker image prune -f

echo "Cleanup complete. Local Docker space freed."