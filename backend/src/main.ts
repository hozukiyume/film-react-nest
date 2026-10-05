import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Точка входа - функция bootstrap инициализирует и запускает NestJS приложение
async function bootstrap() {
  // Создание экземпляра NestJS приложения, NestFactory.create() инициализирует DI-контейнер, подключает модули, контроллеры и провайдеры
  const app = await NestFactory.create(AppModule);
  // Установка глобального префикса для всех маршрутов - все эндпоинты будут доступны по пути: /api/afisha/...
  app.setGlobalPrefix('api/afisha');
  // Включение CORS - разрешает запросы с других доменов/портов
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаление полей, которых нет в DTO
      transform: true, // преобразование payload в экземпляр DTO
    }),
  );
  // Запуск HTTP-сервера на порту 3000 - приложение начинает принимать входящие запросы
  await app.listen(3000);
}

// Запуск приложения
bootstrap();
