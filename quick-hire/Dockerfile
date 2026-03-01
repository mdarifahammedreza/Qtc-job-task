# Backend (NestJS) - dev mode
FROM node:22-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN npm install || yarn install --frozen-lockfile

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
