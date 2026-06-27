FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install express cors

COPY server.cjs ./

EXPOSE 3001

CMD ["node", "server.cjs"]
