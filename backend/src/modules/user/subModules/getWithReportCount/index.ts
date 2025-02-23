import Log from 'simpl-loggar';
import ConversationReportModel from '../../../conversationReport/model.js';
import UserModel from '../../model.js';
import type GetUsersWithReportCountDto from './dto.js';
import type mongoose from 'mongoose';
import type { FilterQuery } from 'mongoose';

export default async (
  dto: GetUsersWithReportCountDto,
): Promise<{ id: mongoose.Types.ObjectId; name: string; surname: string; createdArticleCount: string }[]> => {
  const { startDate, endDate } = dto;

  let dateFilter: FilterQuery<unknown> = {};

  if (startDate || endDate) {
    dateFilter = { createdAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        (dateFilter.createdAt as Record<string, unknown>).$gte = start;
        Log.log('User controller', 'Valid start date:', start);
      } else {
        Log.error('User controller', 'Invalid start date:', startDate);
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        (dateFilter.createdAt as Record<string, unknown>).$lte = end;
        Log.log('User controller', 'Valid end date:', end);
      } else {
        Log.error('User controller', 'Invalid end date:', endDate);
      }
    }
  }

  // AGREGACJA DB, aby policzyć liczbę raportów dla każdego użytkownika w danym zakresie dat
  const usersWithReportCount = await ConversationReportModel.aggregate([
    {
      $match: dateFilter, // Filtruj raporty po dacie, jeśli podano
    },
    {
      $group: {
        _id: '$createdBy', // Grupujemy po użytkowniku
        reportCount: { $sum: 1 }, // Zliczamy raporty
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id', // Pole, które łączy (ID użytkownika)
        foreignField: '_id', // Pole w kolekcji użytkowników
        as: 'user', // Zapisz połączone dane użytkownika w polu "user"
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: { $toObjectId: '$user._id' }, // Rzutowanie na ObjectId
        name: '$user.name',
        surname: '$user.surname',
        reportCount: 1, // Liczba raportów
      },
    },
    {
      $sort: {
        reportCount: -1, // Malejąco
      },
    },
  ]);

  const allUsers = await UserModel.find();

  // Połącz użytkowników z agregacji z użytkownikami bez raportów
  const usersWithZeroReports = allUsers
    .filter((user) => !usersWithReportCount.some((report) => report._id.toString() === user._id.toString()))
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      reportCount: 0, // Użytkownicy bez raportów mają liczbę raportów 0
    }));

  // 4. Połącz wyniki i posortuj
  return [...usersWithReportCount, ...usersWithZeroReports];
};
