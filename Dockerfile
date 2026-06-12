FROM node:20-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Copy dependency files first (for caching)
COPY package*.json ./

# Install production dependencies (modern approach)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Metadata
LABEL maintainer="Michael Antoni michaelantoni.tech@gmail.com"
LABEL version="1.0.0"
LABEL description="e-shop MERN Stack Project"

# Start server
CMD ["node", "index.js"]