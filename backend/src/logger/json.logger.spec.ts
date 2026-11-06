import { JsonLogger } from './json.logger';

// Юнит-тесты JsonLogger - проверка, что каждый метод пишет правильную JSON-строку в нужный метод console
describe('JsonLogger', () => {
  let logger: JsonLogger;

  // Создание нового логгера перед каждым тестом
  beforeEach(() => {
    logger = new JsonLogger();
  });

  // Восстановление оригинальных методов console после каждого теста
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Формирование JSON-строки
  describe('formatMessage', () => {
    // Вызов formatMessage напрямую (без console) для проверки логики
    it('should format log data as JSON with level, message and optional params', () => {
      const result = logger.formatMessage('log', 'App is up!', 'Runs on Nest!');

      // Сравнение с JSON.stringify того же объекта
      expect(result).toBe(
        JSON.stringify({
          level: 'log',
          message: 'App is up!',
          optionalParams: ['Runs on Nest!'],
        }),
      );
    });
  });

  // Каждый метод пишет в свой console.*
  describe('log methods', () => {
    // log → console.log
    it('should write log message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log') // перехват вызова console.log
        .mockImplementation(() => undefined); // заглушка, чтобы реальный вывод не шёл в консоль

      logger.log('App is up!');

      // Проверка, что console.log вызван с одним аргументом - JSON-строкой
      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'App is up!',
          optionalParams: [],
        }),
      );
    });

    // error → console.error
    it('should write error message to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Something is wrong!');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Something is wrong!',
          optionalParams: [],
        }),
      );
    });

    // warn → console.warn
    it('should write warning message to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Caution!');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Caution!',
          optionalParams: [],
        }),
      );
    });

    // debug → console.debug
    it('should write debug message to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('There are bugs!');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'There are bugs!',
          optionalParams: [],
        }),
      );
    });

    // verbose → console.log
    it('should write verbose message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('More info!');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'verbose',
          message: 'More info!',
          optionalParams: [],
        }),
      );
    });
  });
});