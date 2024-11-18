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
    // 1. Pobierz wszystkich użytkowników
    const users = await UserModel.find(); // Pobiera wszystkich użytkowników z kolekcji

    // 2. Pobierz liczbę raportów dla każdego użytkownika (jeśli nie ma raportu, ustaw 0)
    const userReportCounts = await Promise.all(
        users.map(async (user) => {
            const reportCount = await ConversationReportModel.countDocuments({ createdBy: user._id });
            return {
                _id: user._id,
                username: user.name, // Zakładamy, że użytkownicy mają pole 'username'
                reportCount: reportCount || 0, // Jeśli brak raportów, ustaw 0
            };
        })
    );

    return res.status(OK).json(userReportCounts);
});