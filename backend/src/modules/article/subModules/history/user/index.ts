import ArticleHistoryModel from '../../../models/history.js';
import type { IArticleHistory } from '../../../../../types/article.js';

// eslint-disable-next-line import/prefer-default-export
export const getUserHistory = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<IArticleHistory[]> => {
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
    updatedBy: userId,
    eventType: 'updated',
    articleId: { $ne: null }, // Wyklucz historię bez powiązanego artykułu
  };

  // Dodajemy filtr dat, jeśli są podane
  if (startDate || endDate) {
    filter.updatedAt = {};
    if (startDate) {
      filter.updatedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.updatedAt.$lte = new Date(endDate);
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
