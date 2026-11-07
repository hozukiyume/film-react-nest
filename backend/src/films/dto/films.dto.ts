//TODO описать DTO для запросов к /films
import { Type } from 'class-transformer';
import {
  IsArray, // Значение — массив
  IsInt, // Значение — целое число
  IsNumber, // Значение — число (целое или дробное)
  IsPositive, // Значение строго больше 0
  IsString, // Значение — строка
  IsUUID, // Значение — валидный UUID
  Min, // Минимальное значение
  ValidateNested, // Валидация вложенных объектов
} from 'class-validator';

export class FilmDto {
  @IsUUID()
  id: string; // Уникальный идентификатор фильма

  @IsNumber()
  rating: number; // Рейтинг

  @IsString()
  director: string; // Режиссёр

  @IsArray()
  @IsString({ each: true }) // Каждый элемент массива — строка
  tags: string[]; // Массив тегов

  @IsString()
  title: string; // Название

  @IsString()
  about: string; // Краткое описание

  @IsString()
  description: string; // Полное описание

  @IsString()
  image: string; // Путь к изображению

  @IsString()
  cover: string; // Путь к обложке
}

export class ScheduleDto {
  @IsUUID()
  id: string; // Уникальный идентификатор сеанса

  @IsString()
  daytime: string; // Дата и время начала

  @IsInt()
  @Min(1)
  hall: number; // Номер зала

  @IsInt()
  @Min(1)
  rows: number; // Число рядов в зале

  @IsInt()
  @Min(1)
  seats: number; // Число мест в ряду

  @IsNumber()
  @IsPositive()
  price: number; // Цена билета

  @IsArray()
  @IsString({ each: true }) // Каждый элемент массива — строка
  taken: string[]; // Список занятых мест
}

export class FilmWithScheduleDto extends FilmDto {
  @IsArray()
  @ValidateNested({ each: true }) // Валидация каждого элемента массива как вложенного объекта
  @Type(() => ScheduleDto) // Преобразование каждого элемента массива в экземпляр ScheduleDto
  schedule: ScheduleDto[]; // Список сеансов
}
