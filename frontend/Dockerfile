FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS staging
RUN npm ci
COPY . .
EXPOSE ${STAGING_CLIENT_PORT}
CMD ["npm", "run", "staging"]

FROM base AS production  
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE ${API_PORT}
CMD ["npm", "start"]
