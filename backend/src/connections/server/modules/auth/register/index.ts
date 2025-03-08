import { EHttpCodes } from '../../../../../enums/http.js';
import RegisterDto from '../../../../../modules/auth/subModules/register/dto.js';
import register from '../../../../../modules/auth/subModules/register/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import { setAuthCookies } from '../../../utils/cookies.js';
import type { IRegisterReq } from './types.js';
import type express from 'express';

export default (): ((req: IRegisterReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RegisterDto(req.body, req.headers['user-agent']);

    const { accessToken, refreshToken, user } = await register(dto);

    setAuthCookies({ res, accessToken, refreshToken });
    res.status(EHttpCodes.CREATED).json(user);
  });
};
