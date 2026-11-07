# FILM!

Онлайн-сервис бронирования билетов в кинотеатре с фронтендом на React и бэкендом на NestJS и базой данных PostgreSQL.

## Деплой

Ссылка на репозиторий: https://github.com/hozukiyume/film-react-nest/tree/review-2

Ссылка на сервер: http://212.193.58.105/

Образы собираются и публикуются в GitHub Container Registry (ghcr.io) через GitHub Actions при пуше в `main` или `review-2` (см. `.github/workflows/docker.yml`).

На сервере:

```bash
docker compose up -d

## Установка

### PostgreSQL

Локальный запуск базы данных с использованием Docker Compose.

Создайте `.env.docker` на основе корневого `.env.example`:

```bash
cp .env.example .env.docker
```

Запустите приложение из корня проекта:

```bash
docker compose up -d --build
```

При первом запуске PostgreSQL автоматически создаются таблицы с данными из файлов:

- `backend/test/prac.init.sql`
- `backend/test/prac.films.sql`
- `backend/test/prac.shedules.sql`

После запуска доступно:

- `http://localhost` - приложение - фронтенд и API через nginx
- `http://localhost:8080` - pgAdmin - с тестовыми данными

### Повторная инициализация базы данных

```bash
docker compose down -v
docker compose up -d --build
```

### Бэкенд

Перейдите в папку с исходным кодом бэкенда:

`cd backend`

Установите зависимости:

`npm i`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

- `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `postgres`
- `DATABASE_HOST` - хост СУБД PostgreSQL, `localhost` (локально) / `database` (для Docker)
- `DATABASE_PORT` - порт СУБД PostgreSQL, `5432`
- `DATABASE_NAME` - имя СУБД PostgreSQL, `exampledb` (локально) / `films` (для Docker)
- `DATABASE_USERNAME` - имя пользователя БД
- `DATABASE_PASSWORD` - пароль пользователя БД
- `LOGGER` - формат логирования

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

По умолчанию API будет доступен по адресу:

```text
http://localhost:3000/api/afisha
```

### Фронтенд

Перейдите в папку с исходным кодом фронтенда:

`cd frontend`

Установите зависимости:

`npm i`

Создайте `.env` файл из примера `.env.example`.

Переменные окружения:

```
VITE_API_URL=/api/afisha
VITE_CDN_URL=/content/afisha
```

Запустите фронтенд в режиме разработки:

`npm run dev`

Приложение откроется по адресу `http://localhost:5173`.