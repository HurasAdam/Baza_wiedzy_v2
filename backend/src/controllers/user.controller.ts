import Log from 'simpl-loggar';
import { EHttpCodes } from '../enums/http.js';
import ArticleModel from '../models/article.model.js';
import ConversationReportModel from '../models/conversationReport.model.js';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');
  return res.status(EHttpCodes.OK).json(user.omitPassword());
});

export const getUsersHandler = catchErrors(async (req, res) => {
  const users = await UserModel.find({}).select([
    '-password',
    '-email',
    '-verified',
    '-createdAt',
    '-updatedAt',
    '-favourites',
  ]);

  return res.status(EHttpCodes.OK).json(users);
});

export const getUsersWithReportCountHandler = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter: Record<string, unknown> = {};

  if (startDate || endDate) {
    dateFilter = { createdAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        dateFilter.createdAt.$gte = start;
        Log.log('User controller', 'Valid start date:', start);
      } else {
        Log.error('User controller', 'Invalid start date:', startDate);
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        dateFilter.createdAt.$lte = end;
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
  const allUsersWithReportCounts = [...usersWithReportCount, ...usersWithZeroReports];

  // 5. Zwróć posortowaną listę użytkowników
  return res.status(EHttpCodes.OK).json(allUsersWithReportCounts);
});

export const getUsersWithArticleCountHandler = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter: Record<string, unknown> = {};

  if (startDate || endDate) {
    dateFilter = { createdAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        dateFilter.createdAt.$gte = start;
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        dateFilter.createdAt.$lte = end;
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

  const allUsersWithArticleCounts = [...usersWithArticleCount, ...usersWithZeroArticles];

  return res.status(EHttpCodes.OK).json(allUsersWithArticleCounts);
});

export const getUsersWithChangeCountHandler = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter: Record<string, unknown> = {};

  if (startDate || endDate) {
    dateFilter = { updatedAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        dateFilter.updatedAt.$gte = start;
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        dateFilter.updatedAt.$lte = end;
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
  const allUsersWithChangeCounts = [...usersWithChangeCount, ...usersWithZeroChanges];

  return res.status(EHttpCodes.OK).json(allUsersWithChangeCounts);
});
