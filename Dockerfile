# ── Recuerdos QR — Backend API ──────────────────────────────────────────────
# Docker image for Railway deployment
# Includes: Node.js 20, FFmpeg, Playwright Chromium, TypeScript
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-slim

# ── System dependencies ──────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    libxrandr2 \
    libxdamage1 \
    libxfixes3 \
    libxcomposite1 \
    libxcursor1 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    fonts-liberation \
    libappindicator3-1 \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy root workspace configs
COPY package.json .
COPY package-lock.json* .

# Copy shared package
COPY packages/shared packages/shared

# Copy backend package
COPY packages/backend packages/backend

# Copy static assets (demo SVGs)
COPY regalo_qr_producto_v2/assets regalo_qr_producto_v2/assets

# Build shared package first
RUN npm --prefix packages/shared install --ignore-scripts
RUN npm --prefix packages/shared run build

# Install backend dependencies (with relative file:../shared dependency resolved)
RUN npm --prefix packages/backend install --ignore-scripts

# Build backend TypeScript
RUN npm --prefix packages/backend run build

# Create runtime directories
RUN mkdir -p packages/backend/uploads \
             packages/backend/uploads/exports \
             packages/backend/uploads/frames \
             packages/backend/data

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "packages/backend/dist/server.js"]
