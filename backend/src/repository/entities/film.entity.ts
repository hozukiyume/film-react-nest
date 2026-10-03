import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Schedule } from './schedule.entity';

// ValueTransformer для колонки tags преобразует данные между форматом хранения в базе данных и форматом работы в коде
const tagsTransformer: ValueTransformer = {
  to: (value: string[] | null | undefined): string =>
    Array.isArray(value) ? value.join(',') : '', // перед сохранением в БД: string[] преобразуется в CSV-строку - массив тегов склеивается через запятую
  from: (value: string | null): string[] =>
    value ? value.split(',').filter(Boolean) : [], // после чтения из БД: CSV-строка преобразуется в string[] с разделением по запятой
};

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Уникальный идентификатор фильма

  @Column('double precision')
  rating: number; // Рейтинг

  @Column()
  director: string; // Режиссёр

  @Column({
    type: 'text',
    transformer: tagsTransformer,
  })
  tags: string[]; // Теги

  @Column()
  image: string; // Путь к изображению

  @Column()
  cover: string; // Путь к обложке

  @Column()
  title: string; // Название

  @Column()
  about: string; // Краткое описание

  @Column()
  description: string; // Полное описание

  // Связь «один-ко-многим» - один фильм может иметь много сеансов
  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[]; // Список сеансов
}