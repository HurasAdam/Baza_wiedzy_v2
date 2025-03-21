import { RequestHandler } from "express";
import AppErrorCode from "@/constants/appErrorCode";
import { UNAUTHORIZED } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { verifyToken } from "@/utils/jwt";

const authenticate: RequestHandler = (req, res, next) => {
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

    // console.log("Payload:", payload);
    next();
};

export default authenticate;
