FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY server.cjs ./
COPY database.sqlite ./

EXPOSE 3001

CMD ["node", "server.cjs"]
