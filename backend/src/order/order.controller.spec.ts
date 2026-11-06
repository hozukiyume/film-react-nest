import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

// Юнит-тест OrderController - контроллер изолирован, сервис заменён моком
describe('OrderController', () => {
  let controller: OrderController;
  // Мок сервиса - тот же метод, что у OrderService
  let serviceMock: {
    createOrder: jest.Mock;
  };

  // Пересоздание мока перед каждым тестом, чтобы счётчики вызовов не накапливались
  beforeEach(async () => {
    serviceMock = {
      createOrder: jest.fn(),
    };

    // Создание тестового модуля с контроллером
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      // Замена OrderService на serviceMock через useValue
      providers: [
        {
          provide: OrderService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  // Сброс счётчиков вызовов и реализации моков между тестами
  afterEach(() => {
    jest.clearAllMocks();
  });

  // POST /order - создание нового заказа
  describe('create', () => {
    it('should create an order', async () => {
      // DTO, которое «приходит в body», имеет структуру как у реального CreateOrderDto
      const orderExample = {
        email: 'testuser@example.com',
        phone: '+70001234567',
        tickets: [
          {
            film: 'film example',
            session: 'session example',
            daytime: '2026-10-14T18:00:00.000Z',
            row: 1,
            seat: 1,
            price: 100,
          },
        ],
      };

      // Сервис «возвращает» тестовый заказ со структурой как у реального ответа OrderService.createOrder(), с присвоенным id и total = 1
      const orderMock = {
        total: 1,
        items: [
          {
            film: 'test film',
            session: 'test session',
            daytime: '2026-10-14T18:00:00.000Z',
            row: 1,
            seat: 1,
            price: 100,
          },
        ],
      };

      // Моковый сервис вызывает createOrder() и возвращает orderMock
      serviceMock.createOrder.mockResolvedValue(orderMock);

      // Вызов метода контроллера
      const result = await controller.create(orderExample);

      // Проверка что контроллер вызвал сервис один раз
      expect(serviceMock.createOrder).toHaveBeenCalledTimes(1);
      // Проверка что передан верный DTO
      expect(serviceMock.createOrder).toHaveBeenCalledWith(orderExample);
      // Проверка что контроллер вернул то, что дал сервис
      expect(result).toEqual(orderMock);
    });
  });
});