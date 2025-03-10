import ArticleHistoryModel from '../../../article/models/history.js';
import UserModel from '../../model.js';
import type GetUserWithChangeCountDto from './dto.js';
import type { FilterQuery } from 'mongoose';
import type mongoose from 'mongoose';

/**
 * Export controller, for endpoint to get user with change count.
 * @param dto
 */
const getUserWithChangeCount = async (
  dto: GetUserWithChangeCountDto,
): Promise<{ id: mongoose.Types.ObjectId; name: string; surname: string; createdArticleCount: string }[]> => {
  const { startDate, endDate } = dto;

  let dateFilter: FilterQuery<unknown> = {};

  if (startDate || endDate) {
    dateFilter = { updatedAt: {} };

    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        (dateFilter.updatedAt as Record<string, unknown>).$gte = start;
      }
    }

    if (endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        (dateFilter.updatedAt as Record<string, unknown>).$lte = end;
      }
    }
  }

  // Agregacja w kolekcji historii zmian artykułów
  const usersWithChangeCount = await ArticleHistoryModel.aggregate([
    {
      $match: {
        ...dateFilter, // Jeśli podano daty, filtruj zmiany po dacie
        eventType: 'updated', // Dodajemy filtr, który uwzględnia tylko zmiany typu 'updated'
      },
    },
    {
      $group: {
        _id: '$updatedBy', // Grupowanie po użytkowniku
        updatedArticleCount: { $sum: 1 }, // Zliczanie tylko tych zmian, które mają eventType 'updated'
      },
    },
    {
      $lookup: {
        from: 'users', // Łączenie z kolekcją użytkowników
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user', // Rozpakowywanie wyników z tablicy user
    },
    {
      $project: {
        _id: '$user._id',
        name: '$user.name',
        surname: '$user.surname',
        updatedArticleCount: 1,
      },
    },
    {
      $sort: {
        updatedArticleCount: -1, // Sortowanie po liczbie zmian malejąco
      },
    },
  ]);

  // Pobieramy wszystkich użytkowników
  const allUsers = await UserModel.find();

  // Użytkownicy, którzy nie wprowadzili żadnych zmian
  const usersWithZeroChanges = allUsers
    .filter((user) => !usersWithChangeCount.some((change) => change._id.toString() === user._id.toString()))
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      updatedArticleCount: 0,
    }));

  // Łączenie wyników z użytkownikami, którzy mają zero zmian
  return [...usersWithChangeCount, ...usersWithZeroChanges];
};

export default getUserWithChangeCount;
