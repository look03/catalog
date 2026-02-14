# Используем официальный Node.js образ (LTS)
FROM node:22-alpine

# Создаем директорию приложения
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD npm run start:dev