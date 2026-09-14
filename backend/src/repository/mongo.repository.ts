import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { Film, FilmDocument } from './schema';

// Реализация репозитория фильмов в MongoDB, использует Mongoose ODM
@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(
    // Внедрение Mongoose модели Film для выполнения операций с коллекцией films в MongoDB
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  // Получение списка всех фильмов, использует .lean() для оптимизации производительности (возвращает обычные JS объекты вместо Mongoose документов)
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();

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
    // Поиск одного документа по id
    const film = await this.filmModel.findOne({ id }).lean();

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

  // Атомарное бронирование места на сеансе, использует MongoDB update operators
  async reserveSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    // Формирование ключа места в формате "ряд:место"
    const key = `${row}:${seat}`;

    // MongoDB запрос
    const result = await this.filmModel.updateOne(
      {
        id: filmId, // поиск фильма по ID
        // поиск сеанса с условиями
        schedule: {
          $elemMatch: {
            id: sessionId, // ID сеанса
            taken: { $ne: key }, // место не должно быть занято
          },
        },
      },
      {
        $push: {
          'schedule.$.taken': key, // добавление места в массив taken
        },
      },
    );

    // Если modifiedCount > 0 - документ был обновлен (место свободно), если 0 - место занято или сеанс не найден
    return result.modifiedCount > 0;
  }

  // Освобождение ранее забронированного места, использует MongoDB $pull для удаления элемента из массива
  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const key = `${row}:${seat}`;

    // MongoDB запрос
    const result = await this.filmModel.updateOne(
      {
        id: filmId, // поиск фильма по ID
        'schedule.id': sessionId, // поиск сеанса по ID
      },
      {
        $pull: {
          'schedule.$.taken': key, // удаление места из массива taken
        },
      },
    );

    // Если modifiedCount > 0 - место было удалено (было занято), если 0 - место не было занято или сеанс не найден
    return result.modifiedCount > 0;
  }
}
