# ── Recuerdos QR — Backend API ──────────────────────────────────────────────
# Docker image for Railway deployment
# Includes: Node.js 20, FFmpeg, Playwright Chromium, TypeScript
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-slim

# ── System dependencies ──────────────────────────────────────────────────────
# FFmpeg for video encoding
# Chromium deps for Playwright
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

# ── Tell Playwright to use the system Chromium (no download needed) ──────────
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# ── Copy shared package first (needed by backend) ────────────────────────────
COPY packages/shared/package.json packages/shared/
COPY packages/shared/tsconfig.json packages/shared/
COPY packages/shared/src packages/shared/src/

# ── Copy backend ──────────────────────────────────────────────────────────────
COPY packages/backend/package.json packages/backend/
COPY packages/backend/tsconfig.json packages/backend/
COPY packages/backend/src packages/backend/src/

# ── Copy root package.json for workspace resolution ───────────────────────────
COPY package.json .
COPY package-lock.json* .

# ── Install dependencies ───────────────────────────────────────────────────────
RUN npm install --prefix packages/shared --ignore-scripts
RUN npm install --prefix packages/backend --ignore-scripts

# ── Build shared types first, then backend ────────────────────────────────────
RUN npm --prefix packages/shared run build 2>/dev/null || true
RUN npm --prefix packages/backend run build

# ── Create directories ─────────────────────────────────────────────────────────
RUN mkdir -p packages/backend/uploads \
             packages/backend/uploads/exports \
             packages/backend/uploads/frames \
             packages/backend/data

# ── Copy static assets (demo SVGs) ────────────────────────────────────────────
COPY regalo_qr_producto_v2/assets regalo_qr_producto_v2/assets/
RUN mkdir -p regalo_qr_producto_v2/assets 2>/dev/null || true

# ── Expose port and start ──────────────────────────────────────────────────────
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "packages/backend/dist/server.js"]
