# ---- Build Stage ----
FROM node:22-slim AS builder

WORKDIR /app

# Copy only package files and install ALL dependencies (dev included for build)
COPY package*.json ./
RUN npm install

# Copy remaining source
COPY . .

# ---- Production Stage ----
FROM node:22-slim

# Install Chromium for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory
WORKDIR /app

# Copy only production dependencies and built code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# The frontend is deployed separately on Vercel — no need to include it here

EXPOSE 3000

# Non-root user for security
USER node

CMD ["node", "server.js"]
