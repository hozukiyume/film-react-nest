//TODO реализовать DTO для /orders
export class TicketDto {
  film: string; // Идентификатор фильма
  session: string; // Идентификатор сеанса
  daytime: string; // Дата и время сеанса
  row: number; // Номер ряда
  seat: number; // Номер места
  price: number; // Цена билета
}

export class CreateOrderDto {
  email: string; // Email пользователя
  phone: string; // Телефон пользователя
  tickets: TicketDto[]; // Массив билетов
}

export class OrderTicketDto extends TicketDto {
  id: string; // Уникальный идентификатор бронирования
}

export class OrderResponseDto {
  total: number; // Общее число забронированных билетов
  items: OrderTicketDto[]; // Массив забронированных билетов
}
