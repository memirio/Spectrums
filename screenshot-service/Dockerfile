FROM mcr.microsoft.com/playwright:v1.48.2-jammy

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npx playwright install --with-deps chromium

EXPOSE 3000

CMD ["npm", "run", "dev"]

