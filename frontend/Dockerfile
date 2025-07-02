FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS staging
RUN npm ci
COPY . .
EXPOSE ${CLIENT_PORT}
CMD ["npm", "run", "dev"]

FROM base AS production  
RUN npm ci --only=production
COPY . .
RUN rm -rf .next
RUN npm run build
EXPOSE ${CLIENT_PORT}
CMD ["npm", "start"]
