# Multi-stage сборка фронтенда - сначала собираем статику (dist), потом кладём её в лёгкий образ

# Этап 1: Сборка
# node:20-bookworm-slim — официальный образ Node.js 20 на Debian Bookworm
FROM node:20-bookworm-slim AS builder
# Рабочая директория внутри контейнера
WORKDIR /app
# Копируем только package.json и package-lock.json - для кэширования установки зависимостей
COPY package*.json ./
# Устанавливаем все необходимые для сборки зависимости, включая dev
RUN npm config set registry https://registry.npmmirror.com && npm ci
# Копируем остальные файлы
COPY . .
# Собираем продакшн-бандл: Vite компилирует TS/JSX/SCSS в статику: результат появится в /app/dist
RUN npm run build

# Этап 2: Финальный образ - минимальный образ без Node.js, контейнер только копирует файлы, а не запускает JS
FROM alpine:3.20 AS production
# Та же рабочая директория
WORKDIR /app
# Копируем собранную статику из builder-этапа во временную папку /dist
COPY --from=builder /app/dist /dist
# Копируем сборку в volume - монтируется поверх /app/dist при запуске
CMD ["sh", "-c", "cp -r /dist/. /app/dist/"]