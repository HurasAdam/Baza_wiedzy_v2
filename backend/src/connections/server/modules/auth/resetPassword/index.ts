import { EHttpCodes } from '../../../../../enums/http.js';
import ResetPasswordDto from '../../../../../modules/auth/subModules/resetPassword/dto.js';
import resetPassword from '../../../../../modules/auth/subModules/resetPassword/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import { clearAuthCookies } from '../../../utils/cookies.js';
import type { IResetPasswordReq } from './types.js';
import type express from 'express';

export default (): ((req: IResetPasswordReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new ResetPasswordDto(req.body);

    await resetPassword(dto);

    clearAuthCookies(res);
    res.status(EHttpCodes.OK).json({ message: 'Password reset successful' });
  });
};
