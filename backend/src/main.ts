import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

// Точка входа - функция bootstrap инициализирует и запускает NestJS приложение
async function bootstrap() {
  // Создание экземпляра NestJS приложения, NestFactory.create() инициализирует DI-контейнер, подключает модули, контроллеры и провайдеры
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // хранит логи в памяти до подключения своего логгера, чтобы стартовые логи не ушли в дефолтный логгер Nest и попали в нужный формат (json/tskv/dev)
  });
  // Установка глобального префикса для всех маршрутов - все эндпоинты будут доступны по пути: /api/afisha/...
  app.setGlobalPrefix('api/afisha');
  // Включение CORS - разрешает запросы с других доменов/портов
  app.enableCors();
// Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаление полей, которых нет в DTO
      transform: true, // преобразование payload в экземпляр DTO
    }),
  );
  // Выбор логгера по переменной окружения
  const loggerType = process.env.LOGGER ?? 'dev';
  switch (loggerType) {
    case 'json':
      app.useLogger(new JsonLogger());
      break;
    case 'tskv':
      app.useLogger(new TskvLogger());
      break;
    case 'dev':
    default:
      app.useLogger(new DevLogger());
      break;
  }
  // Запуск HTTP-сервера на порту 3000 - приложение начинает принимать входящие запросы
  await app.listen(3000);
}

// Запуск приложения
bootstrap();
