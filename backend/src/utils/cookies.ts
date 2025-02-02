import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date.js';
import type { CookieOptions } from 'express';
import type Express from 'express';

const secure = process.env.NODE_ENV !== 'development';
const refreshPath: string = '/auth/refresh';

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

interface IParams {
  res: Express.Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: IParams): void => {
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Express.Response): void => {
  res.clearCookie('accessToken').clearCookie('refreshToken', { path: refreshPath });
};
