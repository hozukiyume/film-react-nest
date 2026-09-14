// Токен для внедрения зависимости FilmsRepository, используется в декораторе @Inject() для идентификации конкретной реализации репозитория
export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';

// Интерфейс репозитория для работы с фильмами и бронированием мест
export interface FilmsRepository {
  // Получение списка всех фильмов
  findAll(): Promise<FilmDto[]>;
  // Поиск фильма по его уникальному идентификатору, возвращает фильм с полным расписанием сеансов
  findOne(id: string): Promise<FilmWithScheduleDto | undefined>;
  // Бронирование места на сеансе фильма
  reserveSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
  // Освобождение ранее забронированного места
  releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
}
