import { EHttpCodes } from '../../../../enums/http.js';
import register from '../../../../modules/auth/subModules/register/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import { setAuthCookies } from '../../../../utils/cookies.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { accessToken, refreshToken, user } = await register(req);

    setAuthCookies({ res, accessToken, refreshToken });
    res.status(EHttpCodes.CREATED).json(user);
  });
};
