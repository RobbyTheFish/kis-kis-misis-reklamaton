# Указываем базовый образ
FROM node:14

WORKDIR /auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
