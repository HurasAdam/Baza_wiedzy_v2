import { z } from 'zod';
import { EHttpCodes } from '../../../../enums/http.js';
import SessionModel from '../../../../modules/session/model.js';
import appAssert from '../../../../utils/appAssert.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await SessionModel.findOneAndDelete({
      _id: sessionId,
      userId: req.userId,
    });
    appAssert(deleted, EHttpCodes.NOT_FOUND, 'Session not found');

    res.status(EHttpCodes.OK).json({ message: 'Session removed' });
  });
};
