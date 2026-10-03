import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider, typeOrmConfigFactory } from './app.config.provider';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';

import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as FilmEntity } from './repository/entities/film.entity';
import { Schedule as ScheduleEntity } from './repository/entities/schedule.entity';
import { FilmsPostgresRepository } from './repository/postgres.repository';

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

    // Асинхронная конфигурация TypeORM на основе переменных окружения
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),

    // Регистрация репозиториев для указанных сущностей в контексте текущего модуля
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  // HTTP-контроллеры для обработки HTTP-запросов
  controllers: [FilmsController, OrderController],
  // Провайдеры - сервисы и зависимости
  providers: [
    // Сервисы
    FilmsService,
    OrderService,
    // Реализация репозитория фильмов для PostgreSQL, внедряет Repository<Film> и Repository<Schedule> через @InjectRepository
    FilmsPostgresRepository,
    // Провайдер, связывающий токен FILMS_REPOSITORY с реализацией FilmsPostgresRepository через useExisting
    configProvider,
  ],
})
export class AppModule {}
