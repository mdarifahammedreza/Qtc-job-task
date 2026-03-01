# Frontend (Next.js) - dev mode
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install || yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["npm", "run", "dev"]
