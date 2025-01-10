import { NOT_FOUND, OK } from "../constants/http";
import ConversationReportModel from "../models/ConversationReport.model";
import UserModel from "../models/User.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user.omitPassword());
});

export const getUsersHandler = catchErrors(async (req, res) => {
  const users = await UserModel.find({}).select([
    "-password",
    "-email",
    "-verified",
    "-createdAt",
    "-updatedAt",
    "-favourites",
  ]);

  return res.status(OK).json(users);
});

export const getUsersWithReportCountHandler = catchErrors(async (req, res) => {
  // Pobierz daty z zapytania jako string
  const { startDate, endDate } = req.query;

  // Przygotuj zakres dat (jeśli podano), konwertując wartości na Date
  let dateFilter: any = {}; // Typowanie jako "any", ponieważ jest to obiekt z zapytaniem MongoDB

  // Sprawdzamy, czy startDate lub endDate są dostępne
  if (startDate || endDate) {
    dateFilter = { createdAt: {} }; // Filtrujemy po polu createdAt

    // Sprawdzamy, czy startDate jest prawidłowy
    if (startDate) {
      const start = new Date(startDate as string); // Konwertujemy na Date
      if (!isNaN(start.getTime())) {
        // Sprawdzamy, czy data jest prawidłowa
        dateFilter.createdAt.$gte = start; // Data początkowa
      }
    }

    // Sprawdzamy, czy endDate jest prawidłowy
    if (endDate) {
      const end = new Date(endDate as string); // Konwertujemy na Date
      if (!isNaN(end.getTime())) {
        // Sprawdzamy, czy data jest prawidłowa
        dateFilter.createdAt.$lte = end; // Data końcowa
      }
    }
  }
  console.log("dateFilter");
  console.log(dateFilter);
  // 1. Użyj agregacji w MongoDB, aby policzyć liczbę raportów dla każdego użytkownika w danym zakresie dat
  const usersWithReportCount = await ConversationReportModel.aggregate([
    {
      $match: dateFilter, // Filtruj raporty po dacie, jeśli podano
    },
    {
      $group: {
        _id: "$createdBy", // Grupujemy po użytkowniku
        reportCount: { $sum: 1 }, // Zliczamy raporty
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id", // Pole, które łączy (ID użytkownika)
        foreignField: "_id", // Pole w kolekcji użytkowników
        as: "user", // Zapisz połączone dane użytkownika w polu "user"
      },
    },
    {
      $unwind: "$user", // Rozpakowujemy dane użytkownika
    },
    {
      $project: {
        _id: { $toObjectId: "$user._id" }, // Rzutowanie na ObjectId
        name: "$user.name",
        surname: "$user.surname",
        reportCount: 1, // Liczba raportów
      },
    },
    {
      $sort: {
        reportCount: -1, // Malejąco
      },
    },
  ]);

  // 2. Pobierz wszystkich użytkowników z kolekcji `User` (w tym tych bez raportów)
  const allUsers = await UserModel.find();

  // 3. Połącz użytkowników z agregacji z użytkownikami bez raportów
  const usersWithZeroReports = allUsers
    .filter(
      (user) =>
        !usersWithReportCount.some(
          (report) => report._id.toString() === user._id.toString()
        )
    )
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      reportCount: 0, // Użytkownicy bez raportów mają liczbę raportów 0
    }));

  // 4. Połącz wyniki i posortuj
  const allUsersWithReportCounts = [
    ...usersWithReportCount,
    ...usersWithZeroReports,
  ];

  // 5. Zwróć posortowaną listę użytkowników
  return res.status(OK).json(allUsersWithReportCounts);
});
