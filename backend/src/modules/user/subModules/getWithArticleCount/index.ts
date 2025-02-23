import ArticleModel from '../../../article/models/schema.js';
import UserModel from '../../model.js';
import type GetUserWithArticleCountDto from './dto.js';
import type mongoose from 'mongoose';
import type { FilterQuery } from 'mongoose';

export default async (
  dto: GetUserWithArticleCountDto,
): Promise<{ id: mongoose.Types.ObjectId; name: string; surname: string; createdArticleCount: string }[]> => {
  const { startDate, endDate } = dto;

  let dateFilter: FilterQuery<unknown> = {};

  if (startDate || endDate) {
    dateFilter = { createdAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        (dateFilter.createdAt as Record<string, unknown>).$gte = start;
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        (dateFilter.createdAt as Record<string, unknown>).$lte = end;
      }
    }
  }

  // Agregacja w kolekcji artykułów, aby policzyć liczbę artykułów dla każdego użytkownika
  const usersWithArticleCount = await ArticleModel.aggregate([
    {
      $match: dateFilter, // Jeśli podano daty, filtruj artykuły po dacie
    },
    {
      $group: {
        _id: '$createdBy', // Grupowanie po użytkowniku
        createdArticleCount: { $sum: 1 }, // Zliczanie artykułów
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: '$user._id',
        name: '$user.name',
        surname: '$user.surname',
        createdArticleCount: 1,
      },
    },
    {
      $sort: {
        createdArticleCount: -1,
      },
    },
  ]);

  const allUsers = await UserModel.find();

  const usersWithZeroArticles = allUsers
    .filter((user) => !usersWithArticleCount.some((article) => article._id.toString() === user._id.toString()))
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      createdArticleCount: 0,
    }));

  return [...usersWithArticleCount, ...usersWithZeroArticles] as {
    id: mongoose.Types.ObjectId;
    name: string;
    surname: string;
    createdArticleCount: string;
  }[];
};
