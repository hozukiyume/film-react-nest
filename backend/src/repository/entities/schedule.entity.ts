import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Film } from './film.entity';

// ValueTransformer для колонки taken преобразует данные между форматом хранения в базе данных и форматом работы в коде
const takenTransformer: ValueTransformer = {
  to: (value: string[] | null | undefined): string =>
    Array.isArray(value) ? value.join(',') : '', // перед сохранением в БД: string[] преобразуется в CSV-строку - массив занятых мест склеивается через запятую
  from: (value: string | null): string[] =>
    value ? value.split(',').filter(Boolean) : [], // после чтения из БД: CSV-строка преобразуется в string[] с разделением по запятой
};

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Уникальный идентификатор сеанса

  @Column()
  daytime: string; // Дата и время начала

  @Column()
  hall: number; // Номер зала

  @Column()
  rows: number; // Число рядов в зале

  @Column()
  seats: number; // Число мест в ряду

  @Column('double precision')
  price: number; // Цена билета

  @Column({
    type: 'text',
    transformer: takenTransformer,
  })
  taken: string[]; // Список занятых мест

  // Связь «многие-к-одному» - много сеансов могут принадлежать одному фильму
  @ManyToOne(() => Film, (film) => film.schedule, {
    nullable: true, // внешний ключ filmId может быть null, т. е. сеанс может существовать без привязки к фильму
  })
  film: Film | null;
}