import { LoggerService, Injectable } from '@nestjs/common';

// Логгер для production (LOGGER=json) - пишет каждую запись как JSON-строку
@Injectable()
// Реализует LoggerService - контракт NestJS для логгеров, который передаётся в app.useLogger()
export class JsonLogger implements LoggerService {
  // Формирование JSON-строки из уровня, сообщения и доп. параметров
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]): string {
    return JSON.stringify({ level, message, optionalParams }); // сериализация объекта
  }

  // Обычное информационное сообщение
  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  // Ошибка
  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  // Предупреждение
  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  // Отладочная информация
  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  // Детальная трассировка
  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}