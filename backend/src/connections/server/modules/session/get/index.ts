import { EHttpCodes } from '../../../../../enums/http.js';
import GetSessionDto from '../../../../../modules/session/subModules/get/dto.js';
import get from '../../../../../modules/session/subModules/get/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetSessionReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get session.
 */
const getSession = (): ((req: IGetSessionReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetSessionDto({ userId: req.userId, sessionId: req.sessionId });

    const sessions = await get(dto);

    res
      .status(EHttpCodes.OK)
      .json(sessions.map((session) => (session._id === dto.sessionId ? session : { ...session, isCurrent: true })));
  });
};

export default getSession;
