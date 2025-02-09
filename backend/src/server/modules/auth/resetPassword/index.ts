import { EHttpCodes } from '../../../../enums/http.js';
import { resetPasswordSchema } from '../../../../modules/auth/schemas.js';
import resetPassword from '../../../../modules/auth/subModules/resetPassword/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import { clearAuthCookies } from '../../../../utils/cookies.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = resetPasswordSchema.parse(req.body);

    // call service
    await resetPassword(request);

    clearAuthCookies(res);
    res.status(EHttpCodes.OK).json({ message: 'Password reset successful' });
  });
};
