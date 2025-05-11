import { APP_ORIGIN } from "@/constants/env";
import {
    CONFLICT,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    TOO_MANY_REQUESTS,
    UNAUTHORIZED,
} from "@/constants/http";
import VerificationCodeType from "@/constants/verificationCodeTypes";
import { sendMail } from "@/utils/sendMail";
import SessionModel from "@/features/session/session.model";
import UserModel from "@/features/user/user.model";
import VerificationCodeModel from "@/features/verification-code/verification-code.model";
import appAssert from "@/utils/appAssert";
import { hashValue } from "@/utils/bcrypt";
import { fiveMinutesAgo, lessThanOneDay, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "@/utils/date";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "@/utils/emailTemplates";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "@/utils/jwt";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { EmailDto } from "./dto/email.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

export const AuthService = {
    async register(data: CreateUserDto) {
        // verify email is not taken
        const existingUser = await UserModel.exists({
            email: data.email,
        });
        appAssert(!existingUser, CONFLICT, "Email already in use");

        const user = await UserModel.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password,
        });
        const userId = user._id;
        const verificationCode = await VerificationCodeModel.create({
            userId,
            type: VerificationCodeType.EmailVerification,
            expiresAt: oneYearFromNow(),
        });

        const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

        //send verification email
        const { error } = await sendMail({
            to: user.email,
            ...getVerifyEmailTemplate(url),
        });
        // ignore email errors -- for now
        if (error) console.error(error);

        // create session
        const session = await SessionModel.create({ userId });

        const refreshToken = signToken(
            {
                sessionId: session._id,
            },
            refreshTokenSignOptions
        );
        const accessToken = signToken({
            userId,
            sessionId: session._id,
        });
        return {
            user: user.omitPassword(),
            accessToken,
            refreshToken,
        };
    },

    async login(payload: LoginUserDto) {
        const user = await UserModel.findOne({ email: payload.email });
        appAssert(user, UNAUTHORIZED, "Invalid email or password");

        const isValid = user.comparePassword(payload.password);
        appAssert(isValid, UNAUTHORIZED, "Invalid email or password");
        appAssert(user.isActive, FORBIDDEN, "Account is disabled. Contact support.");
        user.lastLogin = new Date();
        await user.save();

        const userId = user._id;
        const session = await SessionModel.create({ userId });

        const sessionInfo: RefreshTokenPayload = {
            sessionId: session._id,
        };

        const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
        const accessToken = signToken({
            ...sessionInfo,
            userId,
        });
        return {
            user: user.omitPassword(),
            accessToken,
            refreshToken,
        };
    },

    async logout(token: string) {
        const { payload } = verifyToken(token);

        if (payload) {
            await SessionModel.findByIdAndDelete(payload.sessionId);
        }
    },

    async refresh(refreshToken: string) {
        const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
            secret: refreshTokenSignOptions.secret,
        });
        appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

        const session = await SessionModel.findById(payload.sessionId);
        const now = Date.now();
        appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired");

        // refresh the session if it expires in the next 24hrs
        const sessionNeedsRefresh = lessThanOneDay(session.expiresAt);
        if (sessionNeedsRefresh) {
            session.expiresAt = thirtyDaysFromNow();
            await session.save();
        }

        const newRefreshToken = sessionNeedsRefresh
            ? signToken(
                  {
                      sessionId: session._id,
                  },
                  refreshTokenSignOptions
              )
            : undefined;

        const accessToken = signToken({
            userId: session.userId,
            sessionId: session._id,
        });

        return {
            accessToken,
            newRefreshToken,
        };
    },

    async verifyEmail(code: string) {
        const validCode = await VerificationCodeModel.findOne({
            _id: code,
            type: VerificationCodeType.EmailVerification,
            expiresAt: { $gt: new Date() },
        });

        appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

        const updatedUser = await UserModel.findByIdAndUpdate(
            validCode.userId,
            {
                verified: true,
            },
            { new: true }
        );

        appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

        await validCode.deleteOne();
    },

    async sendPasswordReset(payload: EmailDto) {
        const user = await UserModel.findOne({ email: payload.email });
        appAssert(user, NOT_FOUND, "User not found");

        const fiveMinAgo = fiveMinutesAgo();
        const count = await VerificationCodeModel.countDocuments({
            userId: user._id,
            type: VerificationCodeType.PasswordReset,
            createdAt: { $gt: fiveMinAgo },
        });

        appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many requests, please try again later");

        const expiresAt = oneHourFromNow();
        const verificationCode = await VerificationCodeModel.create({
            userId: user._id,
            type: VerificationCodeType.PasswordReset,
            expiresAt,
        });

        const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

        const result = await sendMail({
            to: payload.email,
            ...getPasswordResetTemplate(url),
        });

        appAssert(result?.messageId, INTERNAL_SERVER_ERROR, "Błąd wysyłki e-maila");
    },

    async resetPassword({ verificationCode, password }: ResetPasswordDto) {
        const validCode = await VerificationCodeModel.findOne({
            _id: verificationCode,
            type: VerificationCodeType.PasswordReset,
            expiresAt: { $gt: new Date() },
        });

        appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

        const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
            password: hashValue(password),
        });

        appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

        await validCode.deleteOne();
        await SessionModel.deleteMany({ userId: validCode.userId });
    },
};
