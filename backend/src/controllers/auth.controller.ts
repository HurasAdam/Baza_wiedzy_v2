import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from './auth.schemas.js';
import { EHttpCodes } from '../enums/http.js';
import SessionModel from '../models/session.model.js';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  sendPasswordResetEmail,
  verifyEmail,
} from '../services/auth.service.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from '../utils/cookies.js';
import { verifyToken } from '../utils/jwt.js';
import type { IAccessTokenPayload } from '../types/tokens.js';

export const registerHandler = catchErrors(async (req, res) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });
  const { user, accessToken, refreshToken } = await createAccount(request);
  setAuthCookies({ res, accessToken, refreshToken });
  res.status(EHttpCodes.CREATED).json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  // validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  const { accessToken, refreshToken } = await loginUser(request);

  setAuthCookies({ res, accessToken, refreshToken });
  res.status(EHttpCodes.OK).json({ message: 'Login usccessful' });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken ?? '') as { payload: IAccessTokenPayload };

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
  clearAuthCookies(res);
  res.status(EHttpCodes.OK).json({ message: 'Logout successful' });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, EHttpCodes.UNAUTHORIZED, 'Missing refresh token');

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(EHttpCodes.OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({ message: 'Access token refreshed' });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const { code } = req.params;

  const verificationCode = verificationCodeSchema.parse(code);
  await verifyEmail(verificationCode);
  return res.status(EHttpCodes.OK).json({ message: 'Email was sucessfully verified' });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res.status(EHttpCodes.OK).json({ message: 'Password reset email sent' });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  // call service
  await resetPasswordSchema(request);

  clearAuthCookies(res);
  res.status(EHttpCodes.OK).json({ message: 'Password reset successful' });
});
