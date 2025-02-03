import Log from 'simpl-loggar';
import { APP_ORIGIN } from '../constants/index.js';
import { EHttpCodes, EVerificationCodeType } from '../enums/index.js';
import verificationCodeModel from '../modules/auth/verificationCode.model.js';
import SessionModel from '../modules/session/model.js';
import UserModel from '../modules/user/model.js';
import { hashValue, refreshTokenSignOptions, signToken, verifyToken } from '../tools/passwords.js';
import appAssert from '../utils/appAssert.js';
import { fiveMinutesAgo, oneDay, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from '../utils/date.js';
import { getPasswordResetTemplate, getVerifyEmailTemplate } from '../utils/emailTemplates.js';
import sendMail from '../utils/sendMail.js';
import type { ICleanUser } from '../modules/user/model.js';
import type { ICreateAccountParams, ILoginParams, IResetPasswordParams } from '../types/account.js';
import type { IAccessTokenPayload, IRefreshTokenPayload } from '../types/tokens.js';

export const createAccount = async (
  data: ICreateAccountParams,
): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  // verify email is not taken
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, EHttpCodes.CONFLICT, 'Email already in use');

  const user = await UserModel.create({
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
  });
  const userId = user._id;
  const verificationCode = await verificationCodeModel.create({
    userId,
    type: EVerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id as string}`;

  // send verification email
  try {
    await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
  } catch (err) {
    if (err) Log.error('Send email', (err as Error).message, (err as Error).stack);
  }

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions,
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
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: ILoginParams): Promise<{ user: ICleanUser; accessToken: string; refreshToken: string }> => {
  const user = await UserModel.findOne({ email });
  appAssert(user, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const isValid = await user.comparePassword(password);
  appAssert(isValid, EHttpCodes.UNAUTHORIZED, 'Invalid email or password');

  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo: IRefreshTokenPayload = {
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
};

export const verifyEmail = async (code: string): Promise<{ user: ICleanUser }> => {
  const validCode = await verificationCodeModel.findOne({
    _id: code,
    type: EVerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, EHttpCodes.NOT_FOUND, 'Invalid or expired verification code');

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      verified: true,
    },
    { new: true },
  );
  appAssert(updatedUser, EHttpCodes.INTERNAL_SERVER_ERROR, 'Failed to verify email');

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

export const refreshUserAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; newRefreshToken: string | undefined }> => {
  const { payload } = verifyToken<IRefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  }) as { payload: IAccessTokenPayload };
  appAssert(payload, EHttpCodes.UNAUTHORIZED, 'Invalid refresh token');

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(session && session.expiresAt.getTime() > now, EHttpCodes.UNAUTHORIZED, 'Session expired');

  // refresh the session if it expires in the next 24hrs
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= oneDay;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions,
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
};

export const sendPasswordResetEmail = async (email: string): Promise<{ url: string; emailId: string } | undefined> => {
  // Catch any errors that were thrown and log them (but always return a success)
  // This will prevent leaking sensitive data back to the client (e.g. user not found, email not sent).
  try {
    const user = await UserModel.findOne({ email });
    appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

    // check for max password reset requests (2 emails in 5min)
    const fiveMinAgo = fiveMinutesAgo();
    const count = await verificationCodeModel.countDocuments({
      userId: user._id,
      type: EVerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    });
    appAssert(count <= 1, EHttpCodes.TOO_MANY_REQUESTS, 'Too many requests, please try again later');

    const expiresAt = oneHourFromNow();
    const verificationCode = await verificationCodeModel.create({
      userId: user._id,
      type: EVerificationCodeType.PasswordReset,
      expiresAt,
    });

    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id as string}&exp=${expiresAt.getTime()}`;

    try {
      await sendMail({
        to: email,
        ...getPasswordResetTemplate(url),
      });
    } catch (_err) {
      // appAssert(data?.id, EHttpCodes.INTERNAL_SERVER_ERROR, `${(err as Error).name} - ${(err as Error).message}`);
    }

    // return {
    //  url,
    //  emailId: data.id,
    // };

    return {
      url,
      emailId: '',
    };
  } catch (err) {
    Log.error('Save password', (err as Error).message);
    return undefined;
  }
};

export const resetPassword = async ({
  verificationCode,
  password,
}: IResetPasswordParams): Promise<{ user: ICleanUser }> => {
  const validCode = await verificationCodeModel.findOne({
    _id: verificationCode,
    type: EVerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, EHttpCodes.NOT_FOUND, 'Invalid or expired verification code');

  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, EHttpCodes.INTERNAL_SERVER_ERROR, 'Failed to reset password');

  await validCode.deleteOne();

  // delete all sessions
  await SessionModel.deleteMany({ userId: validCode.userId });

  return { user: updatedUser.omitPassword() };
};
