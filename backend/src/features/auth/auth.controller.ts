import { CREATED, OK, UNAUTHORIZED } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import appAssert from "@/utils/appAssert";
import { verifyToken } from "@/utils/jwt";
import {
    clearAuthCookies,
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies,
} from "@/utils/cookies";
import {
    createAccount,
    loginUser,
    refreshUserAccessToken,
    resetPassword,
    sendPasswordResetEmail,
    verifyEmail,
} from "./auth.service";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationCodeSchema } from "./auth.schema";
import SessionModel from "@/features/session/session.model";

export const AuthController = () => ({
    register: catchErrors(async (req, res) => {
        //validate request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        });
        const { user, accessToken, refreshToken } = await createAccount(request);
        return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
    }),

    login: catchErrors(async (req, res) => {
        // validate request
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        });

        //service call

        const { accessToken, refreshToken } = await loginUser(request);

        return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({ message: "Login usccessful" });
    }),

    logout: catchErrors(async (req, res) => {
        const accessToken = req.cookies.accessToken as string | undefined;
        const { payload } = verifyToken(accessToken || "");

        if (payload) {
            await SessionModel.findByIdAndDelete(payload.sessionId);
        }
        return clearAuthCookies(res).status(OK).json({ message: "Logout successful" });
    }),

    refresh: catchErrors(async (req, res) => {
        const refreshToken = req.cookies.refreshToken as string | undefined;
        appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

        const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

        if (newRefreshToken) {
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
        }

        return res
            .status(OK)
            .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
            .json({ message: "Access token refreshed" });
    }),

    verifyEmail: catchErrors(async (req, res) => {
        const { code } = req.params;

        const verificationCode = verificationCodeSchema.parse(code);
        await verifyEmail(verificationCode);
        return res.status(OK).json({ message: "Email was sucessfully verified" });
    }),

    sendPasswordReset: catchErrors(async (req, res) => {
        const email = emailSchema.parse(req.body.email);

        await sendPasswordResetEmail(email);

        return res.status(OK).json({ message: "Password reset email sent" });
    }),

    resetPassword: catchErrors(async (req, res) => {
        const request = resetPasswordSchema.parse(req.body);

        // call service
        await resetPassword(request);

        return clearAuthCookies(res).status(OK).json({ message: "Password reset successful" });
    }),
});
