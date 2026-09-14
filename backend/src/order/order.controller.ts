import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

// Контроллер для обработки HTTP-запросов, связанных с заказами билетов
@Controller('order')
export class OrderController {
  // Внедрение зависимости OrderService через конструктор, создает экземпляр сервиса для работы с заказами
  constructor(private readonly orderService: OrderService) {}

  // Обрабатывает POST-запросы, создает новый заказ билетов
  @Post()
  @HttpCode(200)
  create(@Body() order: CreateOrderDto) {
    return this.orderService.createOrder(order);
  }
}
