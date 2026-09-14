import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';

import { Film, FilmSchema } from './repository/schema';

import { FilmsMongoRepository } from './repository/mongo.repository';
import { FilmsMemoryRepository } from './repository/memory.repository';

import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

// Корневой модуль приложения, объединяет все модули, контроллеры и провайдеры
@Module({
  // Подключение внешних модулей
  imports: [
    // Модуль для работы с переменными окружения
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным во всех модулях без необходимости импортировать ConfigModule
      cache: true, // Кэширует значения переменных для производительности
    }),

    // Модуль для раздачи статических файлов
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'), // Путь к директории с файлами
      serveRoot: '/content/afisha', // URL-префикс для доступа к файлам
    }),

    // Асинхронное подключение к MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Внедрение ConfigService для доступа к переменным
      // Фабрика, возвращающая конфигурацию подключения
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    // Регистрация Mongoose схем - создает модель Film на основе схемы FilmSchema, модель доступна для внедрения через @InjectModel(Film.name)
    MongooseModule.forFeature([
      {
        name: Film.name,
        schema: FilmSchema,
      },
    ]),
  ],
  // HTTP-контроллеры для обработки HTTP-запросов
  controllers: [FilmsController, OrderController],
  // Провайдеры - сервисы и зависимости
  providers: [
    // Сервисы
    FilmsService,
    OrderService,
    // Реализации репозиториев
    FilmsMongoRepository,
    FilmsMemoryRepository,
    // Провайдер выбора репозитория на основе переменной окружения DATABASE_DRIVER
    configProvider,
  ],
})
export class AppModule {}
