import { EHttpCodes } from '../../../../../enums/http.js';
import logout from '../../../../../modules/auth/subModules/logout/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import { clearAuthCookies } from '../../../utils/cookies.js';
import type { ILogoutReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to Logout user.
 */
const logoutUser = (): ((req: ILogoutReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string;

    await logout(accessToken);
    clearAuthCookies(res);

    res.status(EHttpCodes.OK).json({ message: 'Logout successful' });
  });
};

export default logoutUser;
