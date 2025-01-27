import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date';
import type { CookieOptions } from 'express';
import type Express from 'express';

const secure = process.env.NODE_ENV !== 'development';
const REFRESH_PATH = '/auth/refresh';

const defaults: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  // path:REFRESH_PATH
});

interface Params {
  res: Express.Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Express.Response) =>
  res.clearCookie('accessToken').clearCookie('refreshToken', { path: REFRESH_PATH });
