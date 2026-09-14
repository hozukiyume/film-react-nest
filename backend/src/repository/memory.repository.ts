import { Injectable } from '@nestjs/common';
import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

// Реализация репозитория фильмов в памяти, хранит данные в оперативной памяти
@Injectable()
export class FilmsMemoryRepository implements FilmsRepository {
  // Хранилище фильмов с расписанием в оперативной памяти, инициализируется пустым массивом
  private readonly films: FilmWithScheduleDto[] = [];

  // Получение списка всех фильмов, преобразует FilmWithScheduleDto в FilmDto (без расписания)
  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    }));
  }

  // Поиск фильма по ID с полным расписанием или undefined, если не найден
  async findOne(id: string): Promise<FilmWithScheduleDto | undefined> {
    return this.films.find((film) => film.id === id);
  }

  // Бронирование места на сеансе
  async reserveSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    // 1. Поиск фильма по ID
    const film = this.films.find((item) => item.id === filmId);

    // Если фильм не найден - возвращается false
    if (!film) {
      return false;
    }

    // 2. Поиск сеанса в расписании фильма
    const session = film.schedule.find((item) => item.id === sessionId);

    // Если сеанс не найден - возвращается false
    if (!session) {
      return false;
    }

    // 3. Формирование ключа места в формате "ряд:место"
    const key = `${row}:${seat}`;

    // 4. Проверка не занято ли место
    if (session.taken.includes(key)) {
      return false;
    }

    // 5. Добавление места в список занятых
    session.taken.push(key);

    // Бронирование успешно
    return true;
  }

  // Освобождение ранее забронированного места, используется для отката транзакций или отмены заказов
  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    // 1. Поиск фильма по ID
    const film = this.films.find((item) => item.id === filmId);

    // Если фильм не найден - возвращает false
    if (!film) {
      return false;
    }

    // // 2. Поиск сеанса в расписании фильма
    const session = film.schedule.find((item) => item.id === sessionId);

    // // Если сеанс не найден - возвращает false
    if (!session) {
      return false;
    }

    // // 3. Формирование ключа места
    const key = `${row}:${seat}`;

    // 4. Поиск индекса места в списке занятых
    const index = session.taken.indexOf(key);

    // Если место не найдено в списке занятых - возвращает false
    if (index === -1) {
      return false;
    }

    // 5. Удаление места из списка занятых
    session.taken.splice(index, 1);

    // Освобождение успешно
    return true;
  }
}
