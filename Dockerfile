FROM ghcr.io/puppeteer/puppeteer:23.4.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true\
    CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome-stable\
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"] 