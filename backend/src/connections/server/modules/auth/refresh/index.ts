import { EHttpCodes } from '../../../../../enums/http.js';
import refreshAccessToken from '../../../../../modules/auth/subModules/refresh/index.js';
import appAssert from '../../../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '../../../utils/cookies.js';
import type { IRefreshTokenReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to refresh user token.
 */
const refreshToken = (): ((
  req: IRefreshTokenReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const token = req.cookies.refreshToken as string | undefined;
    appAssert(token, EHttpCodes.UNAUTHORIZED, 'Missing refresh token');

    const { accessToken, newRefreshToken } = await refreshAccessToken(token);

    if (newRefreshToken) {
      res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
    }

    res
      .status(EHttpCodes.OK)
      .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
      .json({ message: 'Access token refreshed' });
  });
};

export default refreshToken;
