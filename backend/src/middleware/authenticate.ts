import type { Request, Response, NextFunction } from "express";
import AppErrorCode from "@/constants/appErrorCode";
import { FORBIDDEN, UNAUTHORIZED } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { verifyToken } from "@/utils/jwt";
import { UserService } from "@/features/user/user.service";
import catchErrors from "@/utils/catchErrors";
import { clearAuthCookies } from "@/utils/cookies";
import SessionModel from "@/features/session/session.model";

const authenticate = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken as string | undefined;

    appAssert(accessToken, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidAccessToken);

    const { error, payload } = verifyToken(accessToken);

    appAssert(
        payload,
        UNAUTHORIZED,
        error === "jwt expired" ? "Token expired" : "Invalid token",
        AppErrorCode.InvalidAccessToken
    );

    if (payload && typeof payload.userId === "string" && typeof payload.sessionId === "string") {
        req.userId = payload.userId;
        req.sessionId = payload.sessionId;
    }

    const user = await UserService.findOne(payload.userId.toString());

    if (!user) {
        clearAuthCookies(res);
        appAssert(false, UNAUTHORIZED, "User not found, please login", AppErrorCode.InvalidAccessToken);
    }

    const session = await SessionModel.findById(payload.sessionId);
    if (!session) {
        clearAuthCookies(res);
        appAssert(false, FORBIDDEN, "Session invalidated", AppErrorCode.Forbidden);
    }

    req.user = user;
    next();
});

export default authenticate;
