import { TskvLogger } from './tskv.logger';

// Юнит-тесты TskvLogger - проверка, что каждый метод пишет правильную TSKV-строку в нужный метод console
describe('TskvLogger', () => {
  let logger: TskvLogger;

  // Создание нового логгера перед каждым тестом
  beforeEach(() => {
    logger = new TskvLogger();
  });

  // Восстановление оригинальных методов console после каждого теста
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Формирование TSKV-строки
  describe('formatMessage', () => {
    // Вызов formatMessage напрямую (без console) для проверки логики
    it('should format log data as TSKV with level, message and optional params', () => {
      const result = logger.formatMessage('log', 'App is up!', 'Runs on Nest!');

      // Ожидаемый ответ с полями в фиксированном порядке, разделёнными через \t и в конце \n
      expect(result).toBe(
        'level=log\tmessage=App is up!\toptionalParam1=Runs on Nest!\n',
      );
    });

    // Проверка конвертации в строку для разных типов
    it('should convert non-string values to strings', () => {
      const result = logger.formatMessage('log', 123, true, { id: 1 });

      // Ожидаемый ответ с данными в строковом формате (а объект - теряет поля)
      expect(result).toBe(
        'level=log\tmessage=123\toptionalParam1=true\toptionalParam2=[object Object]\n',
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

      // Проверка, что console.log вызван с одним аргументом - TSKV-строкой
      expect(consoleSpy).toHaveBeenCalledWith(
        'level=log\tmessage=App is up!\n',
      );
    });

    // error → console.error
    it('should write error message to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Something is wrong!');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Something is wrong!\n',
      );
    });

    // warn → console.warn
    it('should write warning message to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Caution!');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=warn\tmessage=Caution!\n',
      );
    });

    // debug → console.debug
    it('should write debug message to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('There are bugs!');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=debug\tmessage=There are bugs!\n',
      );
    });

    // verbose → console.log
    it('should write verbose message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('More info!');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=verbose\tmessage=More info!\n',
      );
    });
  });
});