# ---- Build Stage ----
FROM node:22-slim AS builder

# Prevent Puppeteer from downloading Chromium during npm install
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package*.json ./
RUN npm install

# Copy remaining source code
COPY . .

# ---- Production Stage ----
FROM node:22-slim

# Install Chromium for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Point Puppeteer to the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory
WORKDIR /app

# Copy node_modules + source from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Expose backend port
EXPOSE 3000

# Non-root user for security
USER node

CMD ["node", "server.js"]
