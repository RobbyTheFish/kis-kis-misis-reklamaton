# Указываем базовый образ
FROM node:14

WORKDIR /api2

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["npm", "start"]
