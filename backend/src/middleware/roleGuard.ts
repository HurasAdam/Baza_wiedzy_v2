import AppErrorCode from "@/constants/appErrorCode";
import { UNAUTHORIZED } from "@/constants/http";
import UserModel from "@/features/user/user.model";
import appAssert from "@/utils/appAssert";
import { RequestHandler } from "express";

const roleGuard = (requiredPermissions: string[]): RequestHandler => {
    return async (req, res, next) => {
        const userId = req.userId;

        appAssert(userId, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidAccessToken);

        // Pobierz użytkownika z bazy danych
        const user = await UserModel.findById(userId).select("role");
        appAssert(user, UNAUTHORIZED, "User not found", AppErrorCode.UserNotFound);

        // Sprawdź, czy użytkownik ma odpowiednią rolę
        // appAssert(
        //     user.role === requiredRole,
        //     FORBIDDEN,
        //     "You do not have permission to access this resource",
        //     AppErrorCode.Forbidden
        // );

        next();
    };
};

export default roleGuard;
