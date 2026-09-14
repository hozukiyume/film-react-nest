import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Schedule {
  @Prop({ required: true })
  id: string; // Уникальный идентификатор сеанса

  @Prop({ required: true })
  daytime: string; // Дата и время начала

  @Prop({ required: true })
  hall: number; // Номер зала

  @Prop({ required: true })
  rows: number; // Число рядов в зале

  @Prop({ required: true })
  seats: number; // Число мест в ряду

  @Prop({ required: true })
  price: number; // Цена билета

  @Prop({ type: [String], default: [] })
  taken: string[]; // Список занятых мест
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true })
  id: string; // Уникальный идентификатор фильма

  @Prop({ required: true })
  rating: number; // Рейтинг

  @Prop({ required: true })
  director: string; // Режиссёр

  @Prop({ type: [String], required: true })
  tags: string[]; // Теги

  @Prop({ required: true })
  image: string; // Путь к изображению

  @Prop({ required: true })
  cover: string; // Путь к обложке

  @Prop({ required: true })
  title: string; // Название

  @Prop({ required: true })
  about: string; // Краткое описание

  @Prop({ required: true })
  description: string; // Полное описание

  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: Schedule[]; // Список сеансов
}

export type FilmDocument = HydratedDocument<Film>;

export const FilmSchema = SchemaFactory.createForClass(Film);
