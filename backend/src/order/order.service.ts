import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
  TicketDto,
} from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

// Сервис для обработки заказов билетов, содержит бизнес-логику бронирования мест и управления заказами
@Injectable()
export class OrderService {
  // Внедрение зависимости FilmsRepository, используется для работы с данными фильмов и бронирования мест
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  // Создание нового заказа на билеты, бронирует места для всех билетов в заказе и возвращает информацию о заказе
  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    // Массив для хранения информации о билетах в заказе
    const items: OrderTicketDto[] = [];
    // Массив для хранения успешно забронированных билетов
    const reserved: TicketDto[] = [];

    try {
      for (const ticket of order.tickets) {
        // Попытка забронировать место
        const isReserved = await this.filmsRepository.reserveSeat(
          ticket.film,
          ticket.session,
          ticket.row,
          ticket.seat,
        );

        // Если место не удалось забронировать
        if (!isReserved) {
          throw new BadRequestException({
            error: `Место ${ticket.seat} в ряду ${ticket.row} занято или сеанс не найден`,
          });
        }

        // Сохранение успешно забронированного билета в массив
        reserved.push(ticket);

        // Добавление билета в заказ с уникальным ID
        items.push({
          ...ticket,
          id: randomUUID(),
        });
      }

      // Успешный ответ с информацией о заказе
      return {
        total: items.length, // Общее количество билетов
        items, // Массив билетов с ID
      };
    } catch (error) {
      // В случае любой ошибки освобождаются все ранее забронированные мест
      for (const ticket of reserved) {
        await this.filmsRepository.releaseSeat(
          ticket.film,
          ticket.session,
          ticket.row,
          ticket.seat,
        );
      }

      throw error;
    }
  }
}