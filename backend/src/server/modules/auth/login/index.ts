import { EHttpCodes } from '../../../../enums/http.js';
import { loginSchema } from '../../../../modules/auth/schemas.js';
import login from '../../../../modules/auth/subModules/login/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import { setAuthCookies } from '../../../../utils/cookies.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    // validate request
    const request = loginSchema.parse({
      ...req.body,
      userAgent: req.headers['user-agent'],
    });

    const { accessToken, refreshToken } = await login(request);

    setAuthCookies({ res, accessToken, refreshToken });
    res.status(EHttpCodes.OK).json({ message: 'Login usccessful' });
  });
};
