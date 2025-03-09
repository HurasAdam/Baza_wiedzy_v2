import { EHttpCodes } from '../../../../../enums/http.js';
import LoginDto from '../../../../../modules/auth/subModules/login/dto.js';
import login from '../../../../../modules/auth/subModules/login/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import { setAuthCookies } from '../../../utils/cookies.js';
import type { ILoginReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to login user.
 * @returns LoginUser.
 */
export default (): ((req: ILoginReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new LoginDto(req.body, req.headers['user-agent']);

    const { accessToken, refreshToken } = await login(dto);

    setAuthCookies({ res, accessToken, refreshToken });
    res.status(EHttpCodes.OK).json({ message: 'Login usccessful' });
  });
};
