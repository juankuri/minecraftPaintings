FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3360
EXPOSE 80

CMD ["node", "index.js"]
