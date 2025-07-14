FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS staging
RUN npm ci
COPY . .
EXPOSE ${CLIENT_PORT}
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci
COPY . .
RUN rm -rf .next && npm run build && npm prune --omit=dev
EXPOSE ${CLIENT_PORT}
CMD ["npm", "start"]
