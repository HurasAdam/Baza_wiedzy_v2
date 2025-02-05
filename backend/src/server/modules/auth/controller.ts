import { EHttpCodes } from '../../../enums/http.js';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../../../modules/auth/schemas.js';
import SessionModel from '../../../modules/session/model.js';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
} from '../../../services/auth.service.js';
import { verifyToken } from '../../../tools/passwords.js';
import appAssert from '../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from '../../../utils/cookies.js';
import type { IAccessTokenPayload } from '../../../types/tokens.js';

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





export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  // call service
  await resetPassword(request);

  clearAuthCookies(res);
  res.status(EHttpCodes.OK).json({ message: 'Password reset successful' });
});
