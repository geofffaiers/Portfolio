FROM node:lts-alpine AS base
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
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force
EXPOSE ${API_PORT}
CMD ["node", "build/index.js"]