import { NOT_FOUND, OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import ArticleHistoryModel from "../models/ArticleHistory.model";
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
      $match: dateFilter, 
    },
    {
      $group: {
        _id: "$createdBy", 
        reportCount: { $sum: 1 }, 
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id", 
        foreignField: "_id", 
        as: "user", 
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: { $toObjectId: "$user._id" }, 
        name: "$user.name",
        surname: "$user.surname",
        reportCount: 1, 
      },
    },
    {
      $sort: {
        reportCount: -1, // Malejąco
      },
    },
  ]);

  const allUsers = await UserModel.find();

  
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
      reportCount: 0, 
    }));


  const allUsersWithReportCounts = [
    ...usersWithReportCount,
    ...usersWithZeroReports,
  ];


  return res.status(OK).json(allUsersWithReportCounts);
});


export const getUserFavouriteArticlesHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const pageSize = 15; // Liczba wyników na stronę
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * pageSize;


  const user = await UserModel.findById(userId).select("favourites");

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }


  const favourites = user.favourites;


  const favouriteArticles = await ArticleModel.find({
    _id: { $in: favourites },
  })
    .select([
      "-clientDescription",
      "-employeeDescription",
      "-createdBy",
      "-verifiedBy",
      "-createdAt",
      "-viewsCounter",
      "-__v",
    ])
    .populate([{ path: "tags", select: ["name"] },{ path: "product", select: ["name","labelColor"] }])
    .skip(skip)
    .limit(pageSize);

  
  const totalFavouriteArticles = await ArticleModel.countDocuments({
    _id: { $in: favourites },
  });

  res.status(200).json({
    data: favouriteArticles,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalFavouriteArticles / pageSize),
  });
});



export const getUsersWithArticleCountHandler = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter: any = {};

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
      $match: dateFilter, 
    },
    {
      $group: {
        _id: "$createdBy", // Grupowanie po użytkowniku
        createdArticleCount: { $sum: 1 }, 
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        surname: "$user.surname",
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
    .filter(
      (user) =>
        !usersWithArticleCount.some(
          (article) => article._id.toString() === user._id.toString()
        )
    )
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      createdArticleCount: 0,
    }));

  const allUsersWithArticleCounts = [
    ...usersWithArticleCount,
    ...usersWithZeroArticles,
  ];

  return res.status(OK).json(allUsersWithArticleCounts);
});


export const getUsersWithChangeCountHandler = catchErrors(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateFilter: any = {};

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
        ...dateFilter, 
        eventType: "updated", 
      },
    },
    {
      $group: {
        _id: "$updatedBy", 
        updatedArticleCount: { $sum: 1 }, 
      },
    },
    {
      $lookup: {
        from: "users", 
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user", 
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        surname: "$user.surname",
        updatedArticleCount: 1,
      },
    },
    {
      $sort: {
        updatedArticleCount: -1, 
      },
    },
  ]);

  
  const allUsers = await UserModel.find();


  const usersWithZeroChanges = allUsers
    .filter(
      (user) =>
        !usersWithChangeCount.some(
          (change) => change._id.toString() === user._id.toString()
        )
    )
    .map((user) => ({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      updatedArticleCount: 0,
    }));

 
  const allUsersWithChangeCounts = [
    ...usersWithChangeCount,
    ...usersWithZeroChanges,
  ];

  return res.status(200).json(allUsersWithChangeCounts);
});
