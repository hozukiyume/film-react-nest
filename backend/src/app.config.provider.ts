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

  // Получение host, port и database из строки подключения через стандартный URL
  const databaseUrl = new URL(
    configService.get<string>('DATABASE_URL'),
  );

  return {
    type: driver, // 'postgres'
    host: databaseUrl.hostname, // из DATABASE_URL, ('localhost')
    port: Number(databaseUrl.port) || 5432, // из DATABASE_URL, по умолчанию 5432
    database: databaseUrl.pathname.slice(1), // имя БД без ведущего слэша ('exampledb')
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
