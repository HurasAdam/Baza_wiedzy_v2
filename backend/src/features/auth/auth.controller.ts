import { CREATED, OK, UNAUTHORIZED } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import appAssert from "@/utils/appAssert";
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions, optionsRefreshToken } from "@/utils/cookies";
import { AuthService } from "./auth.service";
import { createUserDto } from "./dto/create-user.dto";
import { loginUserDto } from "./dto/login-user.dto";
import { emailDto } from "./dto/email.dto";
import { resetPasswordDto, verificationCodeSchema } from "./dto/reset-password.dto";

export const AuthController = (authService = AuthService) => ({
    register: catchErrors(async ({ body }, res) => {
        const payload = createUserDto.parse(body);
        const { user, accessToken, refreshToken } = await authService.register(payload);

        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        return res.status(CREATED).json(user);
    }),

    login: catchErrors(async ({ body }, res) => {
        const payload = loginUserDto.parse(body);
        const { user, accessToken, refreshToken } = await authService.login(payload);

        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

        return res.status(OK).json(user);
    }),

    logout: catchErrors(async ({ cookies }, res) => {
        await authService.logout(cookies.accessToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", optionsRefreshToken);

        return res.status(OK).json({ message: "Logout successful" });
    }),

    refresh: catchErrors(async ({ cookies }, res) => {
        const refreshToken = cookies.refreshToken;
        appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

        const { accessToken, newRefreshToken } = await authService.refresh(refreshToken);

        if (newRefreshToken) {
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
        }

        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());

        return res.status(OK).json({ message: "Access token refreshed" });
    }),

    verifyEmail: catchErrors(async ({ params }, res) => {
        const verificationCode = verificationCodeSchema.parse(params.code);
        await authService.verifyEmail(verificationCode);
        return res.status(OK).json({ message: "Email was sucessfully verified" });
    }),

    sendPasswordReset: catchErrors(async ({ body }, res) => {
        const payload = emailDto.parse(body);
        await authService.sendPasswordReset(payload);
        return res.status(OK).json({ message: "Password reset email sent" });
    }),

    resetPassword: catchErrors(async ({ body }, res) => {
        const payload = resetPasswordDto.parse(body);
        await authService.resetPassword(payload);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", optionsRefreshToken);

        return res.status(OK).json({ message: "Password reset successful" });
    }),
});
