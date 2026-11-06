import { LoggerService, Injectable } from '@nestjs/common';

// Логгер для production (LOGGER=tskv) - пишет каждую запись в формате TSKV (Tab-Separated Key=Value)
@Injectable()
// Реализует LoggerService - контракт NestJS для логгеров, который передаётся в app.useLogger()
export class TskvLogger implements LoggerService {
  // Формирование TSKV-строки - поля разделены табуляцией (\t), в конце перевод строки (\n)
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]): string {
    // Первые два поля - всегда level и message - преобразуются в строки
    const fields = [`level=${String(level)}`, `message=${String(message)}`];

    // Каждый доп. параметр - отдельное поле, нумерация с 1
    optionalParams.forEach((param, index) => {
      fields.push(`optionalParam${index + 1}=${String(param)}`);
    });

    // Поля склеиваются табуляцией, в конце перевод строки т.к. каждая запись - отдельная строка лога
    return `${fields.join('\t')}\n`;
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