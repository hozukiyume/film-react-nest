import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmsRepository } from './films.repository';

// Реализация репозитория фильмов в PostgreSQL, использует TypeORM для работы с реляционной БД
@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    // Внедрение TypeORM-репозитория для сущности Film (таблица films)
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    // Внедрение TypeORM-репозитория для сущности Schedule (таблица schedule)
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  // Получение списка всех фильмов без расписания
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();

    // Исключение поля schedule из ответа - возвращается массив DTO фильмов без расписания
    return films.map((film) => ({
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
    // Загрузка фильма вместе со связанными сеансами через JOIN (relations)
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true }, // JOIN по связи OneToMany
    });

    // Если фильм не найден - возвращается undefined
    if (!film) {
      return undefined;
    }

    // Возвращается фильм с расписанием
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map((session) => ({
          id: session.id,
          daytime: session.daytime,
          hall: session.hall,
          rows: session.rows,
          seats: session.seats,
          price: session.price,
          taken: session.taken, // список занятых мест
        })),
    };
  }

  // Бронирование места на сеансе реализует read-modify-write: сначала чтение сеанса, потом изменение списка занятых мест, и потом сохранение
  async reserveSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    // Формирование ключа места в формате "ряд:место"
    const key = `${row}:${seat}`;

    // READ: поиск сеанса, принадлежащего указанному фильму (проверка через связь film)
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } }, // используется связь ManyToOne
      relations: { film: true },
    });
    // Если сеанс не найден или не принадлежит фильму — возвращается false
    if (!session) {
      return false;
    }

    // MODIFY: проверка, не занято ли место
    if (session.taken.includes(key)) {
      return false;
    }

    // WRITE: добавление места в массив
    session.taken.push(key);
    
    // Сохранение изменений в БД
    await this.scheduleRepository.save(session);

    // Бронирование успешно
    return true;
  }

  // Освобождение ранее забронированного места, также реализовано как read-modify-write
  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    // Формирование ключа места в формате "ряд:место"
    const key = `${row}:${seat}`;

    // READ: поиск сеанса с проверкой принадлежности фильму
    const session = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
      relations: { film: true },
    });
    // Если сеанс не найден - возвращается false
    if (!session) {
      return false;
    }

    // MODIFY: проверка, было ли место занято
    if (!session.taken.includes(key)) {
      return false;
    }

    // WRITE: удаление места из массива
    session.taken = session.taken.filter((item) => item !== key);

    // Сохранение изменений в БД
    await this.scheduleRepository.save(session);

    // Освобождение успешно
    return true;
  }
}