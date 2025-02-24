import ArticleHistoryModel from '../../../models/history.js';
import type GetHistoryByUserDto from './dto.js';
import type { IArticleHistory } from '../../../types.js';

// eslint-disable-next-line import/prefer-default-export
export const getUserHistory = async (dto: GetHistoryByUserDto): Promise<IArticleHistory[]> => {
  // Tworzymy podstawowy filtr
  const filter: {
    updatedBy: string;
    updatedAt?: {
      $gte?: Date;
      $lte?: Date;
    };
    eventType: string;
    articleId?: { $ne: null };
  } = {
    updatedBy: dto.id,
    eventType: 'updated',
    articleId: { $ne: null }, // Wyklucz historię bez powiązanego artykułu
  };

  // Dodajemy filtr dat, jeśli są podane
  if (dto.startDate || dto.endDate) {
    filter.updatedAt = {};
    if (dto.startDate) {
      filter.updatedAt.$gte = new Date(dto.startDate);
    }
    if (dto.endDate) {
      filter.updatedAt.$lte = new Date(dto.endDate);
    }
  }

  // Zapytanie do bazy danych
  return ArticleHistoryModel.find(filter)
    .populate({
      path: 'articleId', // Powiązanie z artykułem
      select: ['title', 'isTrashed'], // Pobierz tylko potrzebne pola
      match: { isTrashed: false }, // Wyklucz artykuły, które są w koszu
    })
    .populate({
      path: 'updatedBy', // Powiązanie z użytkownikiem
      select: 'name surname', // Pobierz imię i nazwisko użytkownika
    })
    .exec();
};
