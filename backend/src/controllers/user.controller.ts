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
  const { startDate, endDate } = req.query;

  let dateFilter: any = {};

  if (startDate || endDate) {
    dateFilter = { createdAt: {} };

    if (startDate) {
      const start = new Date(startDate.toString());
      if (!isNaN(start.getTime())) {
        dateFilter.createdAt.$gte = start;
        console.log("Valid start date:", start);
      } else {
        console.error("Invalid start date:", startDate);
      }
    }

    if (endDate) {
      const end = new Date(endDate.toString());
      if (!isNaN(end.getTime())) {
        dateFilter.createdAt.$lte = end;
        console.log("Valid end date:", end);
      } else {
        console.error("Invalid end date:", endDate);
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
      $unwind: "$user",
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

  const allUsers = await UserModel.find();

  //Połącz użytkowników z agregacji z użytkownikami bez raportów
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
