# ── Recuerdos QR — Backend API ──────────────────────────────────────────────
FROM node:20-slim

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

COPY package.json .
COPY package-lock.json* .

COPY packages/shared packages/shared
COPY packages/backend packages/backend
COPY regalo_qr_producto_v2/assets regalo_qr_producto_v2/assets

RUN npm --prefix packages/shared install --ignore-scripts
RUN npm --prefix packages/shared run build

RUN npm --prefix packages/backend install --ignore-scripts
RUN npm --prefix packages/backend run build

RUN mkdir -p packages/backend/uploads \
             packages/backend/uploads/exports \
             packages/backend/uploads/frames \
             packages/backend/data

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "packages/backend/dist/server.js"]
