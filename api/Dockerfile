FROM node:lts
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i
RUN npm i -g typescript

COPY . .

RUN npm run build

EXPOSE ${API_PORT} ${STAGING_API_PORT}

CMD ["node", "build/index.js"]
