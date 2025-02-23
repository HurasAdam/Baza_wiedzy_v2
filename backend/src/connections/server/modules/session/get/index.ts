import { EHttpCodes } from '../../../../../enums/http.js';
import GetSessionDto from '../../../../../modules/session/subModules/get/dto.js';
import get from '../../../../../modules/session/subModules/get/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetSessionReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetSessionReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetSessionDto({ userId: req.userId, sessionId: req.sessionId });

    const sessions = await get(dto);

    res.status(EHttpCodes.OK).json(
      // mark the current session
      sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === dto.sessionId && {
          isCurrent: true,
        }),
      })),
    );
  });
};
