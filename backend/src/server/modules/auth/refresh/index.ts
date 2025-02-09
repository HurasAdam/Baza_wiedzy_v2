import { EHttpCodes } from '../../../../enums/http.js';
import { refreshUserAccessToken } from '../../../../services/auth.service.js';
import appAssert from '../../../../utils/appAssert.js';
import catchErrors from '../../../../utils/catchErrors.js';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '../../../../utils/cookies.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
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
};
