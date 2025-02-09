import { EHttpCodes } from '../../../../enums/http.js';
import SessionModel from '../../../../modules/session/model.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const sessions = await SessionModel.find(
      {
        userId: req.userId,
        expiresAt: { $gt: Date.now() },
      },
      {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
      },
      {
        sort: { createdAt: -1 },
      },
    );

    return res.status(EHttpCodes.OK).json(
      // mark the current session
      sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === req.sessionId && {
          isCurrent: true,
        }),
      })),
    );
  });
};
