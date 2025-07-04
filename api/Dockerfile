FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS staging
RUN npm ci
COPY . .
EXPOSE ${API_PORT}
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev
EXPOSE ${API_PORT}
CMD ["node", "build/index.js"]