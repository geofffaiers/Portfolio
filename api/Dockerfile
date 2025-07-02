FROM node:lts-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS staging
RUN npm ci
RUN npm install -g typescript
COPY . .
EXPOSE ${API_PORT}
CMD ["npm", "run", "staging"]

FROM base AS production
RUN npm ci --only=production
RUN npm install -g typescript
COPY . .
RUN npm run build
EXPOSE ${API_PORT}
CMD ["node", "build/index.js"]