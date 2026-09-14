import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

import { FILMS_REPOSITORY } from './repository/films.repository';
import { FilmsRepository } from './repository/films.repository';
import { FilmsMongoRepository } from './repository/mongo.repository';
import { FilmsMemoryRepository } from './repository/memory.repository';

// Интерфейс конфигурации базы данных, описывает структуру настроек для подключения к БД
export interface AppConfigDatabase {
  driver: string;
  url: string;
}

// Общий интерфейс конфигурации приложения, содержит все настройки приложения
export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

// Провайдер для выбора реализации FilmsRepository, определяет какой репозиторий использовать на основе переменной окружения DATABASE_DRIVER
export const configProvider: Provider = {
  // Токен, по которому можно внедрить результат работы фабрики, используется в @Inject(FILMS_REPOSITORY)
  provide: FILMS_REPOSITORY,
  // Зависимости, которые внедряются в useFactory
  inject: [ConfigService, FilmsMongoRepository, FilmsMemoryRepository],
  // Фабричная функция, возвращающая нужную реализацию репозитория
  useFactory: (
    configService: ConfigService, // Для чтения переменных окружения
    mongoRepository: FilmsMongoRepository,
    memoryRepository: FilmsMemoryRepository,
  ): FilmsRepository => {
    // Чтение переменной DATABASE_DRIVER из .env
    const driver = configService.get<string>('DATABASE_DRIVER');

    // Возвращается соответствующая реализация
    return driver === 'mongodb' ? mongoRepository : memoryRepository;
  },
};
