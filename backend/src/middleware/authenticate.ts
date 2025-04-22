import type { Request, Response, NextFunction } from "express";
import AppErrorCode from "@/constants/appErrorCode";
import { UNAUTHORIZED } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { verifyToken } from "@/utils/jwt";
import { UserService } from "@/features/user/user.service";
import catchErrors from "@/utils/catchErrors";

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

    // Upewnij się, że payload jest zgodny z AccessTokenPayload
    if (payload && typeof payload.userId === "string" && typeof payload.sessionId === "string") {
        req.userId = payload.userId; // Teraz TypeScript wie, że to jest string
        req.sessionId = payload.sessionId; // Teraz TypeScript wie, że to jest string
    }

    const user = await UserService.findOne(payload.userId.toString());

    req.user = user;
    next();
});

export default authenticate;
