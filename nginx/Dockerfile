# Образ nginx для раздачи статики фронтенда и проксирования /api/ и /content/ на backend
FROM nginx:1.27-alpine
# Копируем конфиг как фрагмент в conf.d - он подключается внутрь http { } дефолтного nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Документируем, что контейнер слушает порт 80
EXPOSE 80