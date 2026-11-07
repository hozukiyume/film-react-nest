import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

// Юнит-тесты FilmsController - контроллер изолирован, сервис заменён моком
describe('FilmsController', () => {
  let controller: FilmsController;
  // Мок сервиса - те же методы, что у FilmsService
  let serviceMock: {
    findAll: jest.Mock;
    findOne: jest.Mock;
  };

  // Пересоздание мока перед каждым тестом, чтобы счётчики вызовов не накапливались
  beforeEach(async () => {
    serviceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    // Создание тестового модуля с контроллером
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      // Замена FilmsService на serviceMock через useValue
      providers: [
        {
          provide: FilmsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  // Сброс счётчиков вызовов и реализации моков между тестами
  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET /films - получение списка всех фильмов
  describe('findAll', () => {
    it('should return all films', async () => {
      // Тестовые данные имеют структуру как у реального ответа FilmsService.findAll()
      const filmsMock = {
        total: 1,
        items: [
          {
            id: 'test film',
            rating: 10,
            director: 'mister Creepy',
            tags: ['horror'],
            title: 'Creepy Test',
            about: 'very scary film',
            description: 'perfect for Halloween',
            image: 'image.jpg',
            cover: 'cover.jpg',
            schedule: [],
          },
        ],
      };

      // Моковый сервис вызывает findAll() и возвращает filmsMock
      serviceMock.findAll.mockResolvedValue(filmsMock);

      // Вызов метода контроллера
      const result = await controller.findAll();

      // Проверка что контроллер вызвал сервис один раз
      expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
      // Проверка что контроллер вернул то, что дал сервис
      expect(result).toEqual(filmsMock);
    });
  });

  // GET /films/:id/schedule - получение одного фильма с расписанием
  describe('findOne', () => {
    it('should return one film with schedule', async () => {
      // Реальный UUID из базы данных
      const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';

      // Тестовые данные со структурой как у реального ответа FilmsService.findOne(id)
      const schedulesMock = {
        total: 1,
        items: [
          {
            id: 'test session',
            daytime: '2026-10-14T18:00:00.000Z',
            hall: 1,
            rows: 1,
            seats: 1,
            price: 100,
            taken: ['1:1'],
          },
        ],
      };

      // Моковый сервис вызывает findOne() и возвращает schedulesMock
      serviceMock.findOne.mockResolvedValue(schedulesMock);

      // Вызов метода с конкретным id - проверка что контроллер передаёт его в сервис
      const result = await controller.findOne(filmId);

      // Проверка что контроллер вызвал сервис один раз
      expect(serviceMock.findOne).toHaveBeenCalledTimes(1);
      // Проверка что передан нужный id
      expect(serviceMock.findOne).toHaveBeenCalledWith(filmId);
      // Проверка что контроллер вернул то, что дал сервис
      expect(result).toEqual(schedulesMock);
    });
  });
});