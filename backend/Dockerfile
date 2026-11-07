# Multi-stage сборка - так в продакшн-контейнере не окажется лишних зависимостей и TS-исходников
# Первый этап (builder) собирает TypeScript в JavaScript, второй (production) - только запускает

# Этап 1: Сборка
# Задаем базовый образ для этапа сборки
FROM node:20-alpine AS builder
# Задаем рабочую директорию
WORKDIR /app
# Копируем список зависимостей и лок-файл отдельно от файлов проекта, это нужно для кэширования установки зависимостей
COPY package*.json ./
# Устанавливаем зависимости
RUN npm config set registry https://registry.npmmirror.com && npm ci
# Копируем остальные файлы проекта
COPY . .
# Компилируем TypeScript в JavaScript: результат появится в /app/dist
RUN npm run build

# Этап 2: Финальный образ - тот же базовый образ, но без dev-зависимостей и исходников TS
FROM node:20-alpine AS production
# Та же рабочая директория
WORKDIR /app
# Сообщаем Node.js и библиотекам, что работаем в production
ENV NODE_ENV=production
# Копируем package.json и package-lock.json, чтобы установить только prod-зависимости
COPY package*.json ./
# Флаг --omit=dev означает "не ставить dev-зависимости"
RUN npm config set registry https://registry.npmmirror.com && npm ci --omit=dev
# Копируем скомпилированный JavaScript из builder-этапа - в /app/dist окажется main.js и все скомпилированные модули
COPY --from=builder /app/dist ./dist
# Копируем статические файлы, которые раздаёт ServeStaticModule
COPY --from=builder /app/public ./public
# Документируем, что контейнер слушает порт 3000
EXPOSE 3000
# Команда для запуска
CMD ["node", "dist/main.js"]