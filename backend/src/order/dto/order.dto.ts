//TODO реализовать DTO для /orders
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty, // Массив не пустой
  IsArray, // Значение — массив
  IsEmail, // Значение — корректный email
  IsInt, // Значение — целое число
  IsNumber, // Значение — число (целое или дробное)
  IsPositive, // Значение строго больше 0
  IsString, // Значение — строка
  IsUUID, // Значение — валидный UUID
  Min, // Минимальное значение
  ValidateNested, // Валидация вложенных объектов
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string; // Идентификатор фильма

  @IsUUID()
  session: string; // Идентификатор сеанса

  @IsString()
  daytime: string; // Дата и время сеанса

  @IsInt()
  @Min(1)
  row: number; // Номер ряда

  @IsInt()
  @Min(1)
  seat: number; // Номер места

  @IsNumber()
  @IsPositive()
  price: number; // Цена билета
}

export class CreateOrderDto {
  @IsEmail()
  email: string; // Email пользователя

  @IsString()
  phone: string; // Телефон пользователя

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Валидация каждого элемента массива как вложенного объекта
  @Type(() => TicketDto) // Преобразование каждого элемента массива в экземпляр TicketDto
  tickets: TicketDto[]; // Массив билетов
}

export class OrderTicketDto extends TicketDto {
  @IsUUID()
  id: string; // Уникальный идентификатор бронирования
}

export class OrderResponseDto {
  @IsInt()
  @Min(0)
  total: number; // Общее число забронированных билетов

  @IsArray()
  @ValidateNested({ each: true }) // Валидация каждого элемента массива как вложенного объекта
  @Type(() => OrderTicketDto) // Преобразование каждого элемента массива в экземпляр OrderTicketDto
  items: OrderTicketDto[]; // Массив забронированных билетов
}
