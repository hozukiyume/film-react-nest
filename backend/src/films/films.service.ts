import { FilmDto, ScheduleDto } from './dto/films.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

// Сервис для работы с фильмами, содержит бизнес-логику по получению информации о фильмах и их расписании
@Injectable()
export class FilmsService {
  // Внедрение зависимости FilmsRepository через декоратор @Inject; используется токен FILMS_REPOSITORY для внедрения конкретной реализации репозитория (MongoDB или Memory в зависимости от конфигурации)
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  // Получение списка всех фильмов из репозитория
  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsRepository.findAll();

    // Возврат ответа с общим количеством
    return {
      total: films.length,
      items: films,
    };
  }

  // Получение расписания сеансов для одного фильма по его ID
  async findOne(id: string): Promise<{ total: number; items: ScheduleDto[] }> {
    // Поиск фильма по ID в репозитории
    const film = await this.filmsRepository.findOne(id);

    // Проверка существования фильма
    if (!film) {
      throw new NotFoundException({
        error: 'Фильм не найден',
      });
    }

    // Возврат структурированного ответа с расписанием фильма
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
