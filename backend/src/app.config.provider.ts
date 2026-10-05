import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { FILMS_REPOSITORY } from './repository/films.repository';
import { FilmsPostgresRepository } from './repository/postgres.repository';
import { Film as FilmEntity } from './repository/entities/film.entity';
import { Schedule as ScheduleEntity } from './repository/entities/schedule.entity';

// Фабрика конфигурации TypeORM, возвращает объект с настройками подключения к PostgreSQL, прочитанными из переменных окружения через ConfigService
export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Чтение драйвера базы данных из .env
  const driver = configService.get<string>('DATABASE_DRIVER');
  if (driver !== 'postgres') {
    throw new Error(`Unsupported database driver: ${driver}`);
  }

  return {
    type: driver, // 'postgres'
    host: configService.getOrThrow<string>('DATABASE_HOST'), // из .env ('localhost')
    port: configService.get<number>('DATABASE_PORT') || 5432, // из .env, по умолчанию 5432
    database: configService.getOrThrow<string>('DATABASE_NAME'), // имя базы данных из .env ('exampledb')
    username: configService.getOrThrow<string>('DATABASE_USERNAME'), // из .env
    password: configService.getOrThrow<string>('DATABASE_PASSWORD'), // из .env
    entities: [FilmEntity, ScheduleEntity], // список сущностей, по которым строятся метаданные таблиц и связей
    synchronize: false, // отключение автоматического изменения схемы БД по сущностям
  };
};

// Провайдер, связывающий токен FILMS_REPOSITORY с конкретной реализацией
export const configProvider: Provider = {
  provide: FILMS_REPOSITORY, // сервисы зависят от интерфейса FilmsRepository через @Inject(FILMS_REPOSITORY), а не от класса напрямую
  useExisting: FilmsPostgresRepository, // переиспользуется единственный экземпляр FilmsPostgresRepository вместо создания нового
};
