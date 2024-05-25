# Указываем базовый образ
FROM node:14

WORKDIR /api1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
