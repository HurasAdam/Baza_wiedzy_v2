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



  export const getUsersHandler = catchErrors(async(req,res)=>{
    const users = await UserModel.find({}).select(["-password","-email","-verified","-createdAt","-updatedAt","-favourites"])
    
    return res.status(OK).json(users);
  })


  export const getUsersWithReportCountHandler = catchErrors(async (req, res) => {
    // 1. Użyj agregacji w MongoDB, aby policzyć liczbę raportów dla każdego użytkownika
    const usersWithReportCount = await ConversationReportModel.aggregate([
      // Krok 1: Zgrupuj raporty po użytkowniku i policz ich liczbę
      {
        $group: {
          _id: "$createdBy", // Grupujemy po użytkowniku
          reportCount: { $sum: 1 }, // Zliczamy raporty
        },
      },
      // Krok 2: Połącz z danymi użytkownika (populate)
      {
        $lookup: {
          from: "users", // Kolekcja użytkowników
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
          _id: "$user._id",
          name: "$user.name",
          surname: "$user.surname",
          reportCount: 1, // Liczba raportów
        },
      },
      // Krok 3: Posortuj użytkowników po liczbie raportów w malejącej kolejności
      {
        $sort: {
          reportCount: -1, // Malejąco
        },
      },
    ]);
  
    // 2. Pobierz wszystkich użytkowników z kolekcji `User` (w tym tych bez raportów)
    const allUsers = await UserModel.find();
  
    // 3. Połącz użytkowników z agregacji z użytkownikami bez raportów
    const usersWithZeroReports = allUsers.filter(user => 
      !usersWithReportCount.some(report => report._id.toString() === user._id.toString())
    ).map(user => ({
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