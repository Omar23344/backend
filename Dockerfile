FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./
COPY src ./src

RUN npm install
RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/server.js"]