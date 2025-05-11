import { Response, CookieOptions } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";
const REFRESH_PATH = "/auth/refresh";

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};

export const optionsRefreshToken: CookieOptions = {
    path: REFRESH_PATH,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    ...optionsRefreshToken,
    expires: thirtyDaysFromNow(),
});

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", optionsRefreshToken);

    return res;
};
