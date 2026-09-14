//TODO описать DTO для запросов к /films
export class FilmDto {
  id: string; // Уникальный идентификатор фильма
  rating: number; // Рейтинг
  director: string; // Режиссёр
  tags: string[]; // Массив тегов
  title: string; // Название
  about: string; // Краткое описание
  description: string; // Полное описание
  image: string; // Путь к изображению
  cover: string; // Путь к обложке
}

export class ScheduleDto {
  id: string; // Уникальный идентификатор сеанса
  daytime: string; // Дата и время начала
  hall: number; // Номер зала
  rows: number; // Число рядов в зале
  seats: number; // Число мест в ряду
  price: number; // Цена билета
  taken: string[]; // Список занятых мест
}

export class FilmWithScheduleDto extends FilmDto {
  schedule: ScheduleDto[]; // Список сеансов
}
