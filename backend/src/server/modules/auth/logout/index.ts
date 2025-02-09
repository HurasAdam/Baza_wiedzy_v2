import { EHttpCodes } from '../../../../enums/http.js';
import logout from '../../../../modules/auth/subModules/logout/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import { clearAuthCookies } from '../../../../utils/cookies.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string | undefined;

    await logout(accessToken);
    clearAuthCookies(res);

    res.status(EHttpCodes.OK).json({ message: 'Logout successful' });
  });
};
