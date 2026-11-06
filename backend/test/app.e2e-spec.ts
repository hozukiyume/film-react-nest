import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// Поднимаем AppModule с реальной базой данных и проверяем HTTP-запросы
describe('Films API (e2e)', () => {
  let app: INestApplication;

  // Реальные id из БД
  const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
  const sessionId = 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce';

  // Создаём тестовое приложение из AppModule один раз перед всеми тестами
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Повторяем конфигурацию из main.ts
    // Глобальный префикс
    app.setGlobalPrefix('api/afisha');
    // Для валидации DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // удаление лишних полей
        transform: true, // преобразование payload в экземпляр DTO
      }),
    );

    await app.init();
  });

  // Закрываем приложение: освобождаем соединения TypeORM с PostgreSQL после всех тестов
  afterAll(async () => {
    await app.close();
  });

  // Получение списка фильмов
  it('GET /api/afisha/films should return films', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    // Проверка структуры ответа
    expect(response.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        items: expect.any(Array),
      }),
    );
  });

  // Получение расписания фильма
  it('GET /api/afisha/films/:id/schedule should return schedule', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        items: expect.any(Array),
      }),
    );
  });

  // Заказ билета с блокировкой дубликатов
  it('POST /api/afisha/order should return order and block duplicates', async () => {
    const order = {
      email: 'testuser@example.com',
      phone: '+770001234567',
      tickets: [
        {
          film: filmId,
          session: sessionId,
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };

    // Первый запрос - успешный заказ
    const response = await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send(order)
      .expect(200);

    // Проверка, что в заказе один билет
    expect(response.body.total).toBe(1);
    // Проверка, что билет содержит те же значения
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        film: filmId,
        session: sessionId,
        row: 1,
        seat: 1,
      }),
    );
    // Проверка ID заказа
    expect(response.body.items[0].id).toEqual(expect.any(String));

    // Второй запрос с тем же заказом - занять одно и то же место дважды нельзя
    await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send(order)
      .expect(400);
  });
});