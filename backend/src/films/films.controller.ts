import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

// Контроллер для обработки HTTP-запросов, связанных с фильмами
@Controller('films')
export class FilmsController {
  // Внедрение зависимости FilmsService через конструктор, создает экземпляра сервиса для работы с данными фильмов
  constructor(private readonly filmsService: FilmsService) {}

  // Обрабатывает GET-запросы, возвращает список всех фильмов
  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  // Обрабатывает GET-запросы, возвращает информацию о фильме с расписанием сеансов
  @Get(':id/schedule')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }
}
