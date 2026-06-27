FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts=false

COPY server.cjs ./

EXPOSE 3001

CMD ["node", "server.cjs"]
