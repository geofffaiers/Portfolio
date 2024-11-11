FROM node:lts
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i
RUN npm i -g typescript

COPY . .

RUN npm run build

CMD ["node", "build/index.js"]
